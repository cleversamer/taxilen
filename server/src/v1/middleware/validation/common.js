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

const checkAddressName =
  (key, type = "city", lang) =>
  (req, res, next) => {
    const name = req.body[key];

    // Check `name` type
    if (typeof name !== "string") {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors[type].invalidName;
      throw new ApiError(statusCode, message);
    }

    // Check `name` length
    if (name.length < 3 || name.length > 128) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors[type].invalidName;
      throw new ApiError(statusCode, message);
    }

    // Check if `name` is in english
    const detectedLang = detectLanguage(name);
    if (detectedLang !== lang) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message =
        lang === "en"
          ? errors[type].invalidEnglishName
          : errors[type].invalidArabicName;
      throw new ApiError(statusCode, message);
    }

    next();
  };

function detectLanguage(text) {
  // split into words
  const langs = text
    .trim()
    .split(/\s+/)
    .map((word) => {
      return detect(word);
    });

  // pick the lang with the most occurances
  return (langs || []).reduce(
    (acc, el) => {
      acc.k[el] = acc.k[el] ? acc.k[el] + 1 : 1;
      acc.max = acc.max ? (acc.max < acc.k[el] ? el : acc.max) : el;
      return acc;
    },
    { k: {} }
  ).max;

  function detect(text) {
    const scores = {};

    const regexes = {
      en: /[\u0000-\u007F]/gi,
      ar: /[\u0621-\u064A\u0660-\u0669]/gi,
    };

    for (const [lang, regex] of Object.entries(regexes)) {
      // detect occurances of lang in a word
      let matches = text.match(regex) || [];
      let score = matches.length / text.length;

      if (score) {
        // high percentage, return result
        if (score > 0.85) {
          return lang;
        }
        scores[lang] = score;
      }
    }

    // not detected
    if (Object.keys(scores).length == 0) return null;

    // pick lang with highest percentage
    return Object.keys(scores).reduce((a, b) =>
      scores[a] > scores[b] ? a : b
    );
  }
}

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

  // Check address title
  if (!address.title || typeof address.title !== "string") {
    const statusCode = httpStatus.BAD_REQUEST;
    const message = errors.auth.invalidAddressTitle;
    const err = new ApiError(statusCode, message);
    return next(err);
  }

  if (address.line2.length < 5 || address.line2.length > 128) {
    const statusCode = httpStatus.BAD_REQUEST;
    const message = errors.auth.invalidLine2;
    const err = new ApiError(statusCode, message);
    return next(err);
  }

  // Check city
  if (!mongoose.isValidObjectId(address.city)) {
    const statusCode = httpStatus.BAD_REQUEST;
    const message = errors.auth.invalidCity;
    const err = new ApiError(statusCode, message);
    return next(err);
  }

  // Check region
  if (!mongoose.isValidObjectId(address.region)) {
    const statusCode = httpStatus.BAD_REQUEST;
    const message = errors.auth.invalidRegion;
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
  checkAddressName,
};
