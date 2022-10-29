const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const httpStatus = require("http-status");
const { ApiError } = require("../apiError");
const errors = require("../../config/errors");

const next = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const statusCode = httpStatus.BAD_REQUEST;
    const message = errors.array()[0].msg;
    const err = new ApiError(statusCode, message);
    return next(err);
  }

  next();
};

const checkAddress = (req, res, next) => {
  const { address } = req.body;

  // Check address type
  if (typeof address !== "object") {
    const statusCode = httpStatus.BAD_REQUEST;
    const message = errors.auth.invalidAddress;
    const err = new ApiError(statusCode, message);
    return next(err);
  }

  // Trim all strings inside address obj
  for (let key in address) {
    if (typeof address[key] === "string") {
      address[key] = address[key].trim();
    }
  }

  // Check city
  if (!address.city || typeof address.city !== "string") {
    const statusCode = httpStatus.BAD_REQUEST;
    const message = errors.auth.invalidCity;
    const err = new ApiError(statusCode, message);
    return next(err);
  }

  if (address.city.length < 3 || address.city.length > 32) {
    const statusCode = httpStatus.BAD_REQUEST;
    const message = errors.auth.invalidCity;
    const err = new ApiError(statusCode, message);
    return next(err);
  }

  // Check line1
  if (!address.line1 || typeof address.line1 !== "string") {
    const statusCode = httpStatus.BAD_REQUEST;
    const message = errors.auth.invalidLine1;
    const err = new ApiError(statusCode, message);
    return next(err);
  }

  if (address.line1.length < 5 || address.line1.length > 128) {
    const statusCode = httpStatus.BAD_REQUEST;
    const message = errors.auth.invalidLine1;
    const err = new ApiError(statusCode, message);
    return next(err);
  }

  // Check line2
  if (!address.line2 || typeof address.line2 !== "string") {
    const statusCode = httpStatus.BAD_REQUEST;
    const message = errors.auth.invalidLine2;
    const err = new ApiError(statusCode, message);
    return next(err);
  }

  if (address.line2.length < 5 || address.line2.length > 128) {
    const statusCode = httpStatus.BAD_REQUEST;
    const message = errors.auth.invalidLine2;
    const err = new ApiError(statusCode, message);
    return next(err);
  }

  // Check street
  if (!address.street || typeof address.street !== "string") {
    const statusCode = httpStatus.BAD_REQUEST;
    const message = errors.auth.invalidStreet;
    const err = new ApiError(statusCode, message);
    return next(err);
  }

  if (address.street.length < 5 || address.street.length > 128) {
    const statusCode = httpStatus.BAD_REQUEST;
    const message = errors.auth.invalidStreet;
    const err = new ApiError(statusCode, message);
    return next(err);
  }

  next();
};

const checkPhone = (req, res, next) => {
  let { phone } = req.body;

  // Convert phone to string if it's not a string.
  if (typeof phone !== "string") {
    phone = String(phone);
  }

  // Check phone length (should = 10).
  if (phone.length !== 10) {
    const statusCode = httpStatus.BAD_REQUEST;
    const message = errors.auth.invalidPhone;
    const err = new ApiError(statusCode, message);
    return next(err);
  }

  // Check if it starts with 059 or 056
  if (!phone.startsWith("059") && !phone.startsWith("056")) {
    const statusCode = httpStatus.BAD_REQUEST;
    const message = errors.auth.invalidPhone;
    const err = new ApiError(statusCode, message);
    return next(err);
  }

  next();
};

const checkMongoIdQueryParam = (req, res, next) => {
  const emptyQueryParams = !Object.keys(req.query).length;
  if (emptyQueryParams) {
    const statusCode = httpStatus.BAD_REQUEST;
    const message = errors.data.noMongoId;
    const err = new ApiError(statusCode, message);
    return next(err);
  }

  for (let item in req.query) {
    if (!mongoose.isValidObjectId(req.query[item])) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.data.invalidMongoId;
      const err = new ApiError(statusCode, message);
      return next(err);
    }
  }

  next();
};

const checkMongoIdParam = (req, res, next) => {
  const emptyParams = !Object.keys(req.params).length;
  if (emptyParams) {
    const statusCode = httpStatus.BAD_REQUEST;
    const message = errors.data.noMongoId;
    const err = new ApiError(statusCode, message);
    return next(err);
  }

  for (let item in req.params) {
    if (!mongoose.isValidObjectId(req.params[item])) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.data.invalidMongoId;
      const err = new ApiError(statusCode, message);
      return next(err);
    }
  }

  next();
};

const conditionalCheck = (key, checker) => (req, res, next) => {
  return req.body[key] ? checker(req, res, next) : next();
};

const checkFile =
  (key, supportedTypes, compulsory = true) =>
  (req, res, next) => {
    if (!compulsory && (!req.files || !req.files[key])) {
      return next();
    }

    if (compulsory && (!req.files || !req.files[key])) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.system.noPhoto;
      const err = new ApiError(statusCode, message);
      return next(err);
    }

    const fileType = req.files[key].name.split(".")[1];
    if (!supportedTypes.includes(fileType)) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.system.invalidExtension;
      const err = new ApiError(statusCode, message);
      return next(err);
    }

    next();
  };

module.exports = {
  next,
  checkAddress,
  checkPhone,
  checkMongoIdQueryParam,
  conditionalCheck,
  checkFile,
  checkMongoIdParam,
};
