const { check } = require("express-validator");
const errors = require("../../../config/errors");
const commonMiddleware = require("../common");

const validateCreateCity = [
  commonMiddleware.checkAddressName("enName", "en"),
  commonMiddleware.checkAddressName("arName", "ar"),
  commonMiddleware.next,
];

const validateUpdateCity = [
  commonMiddleware.conditionalCheck(
    "enName",
    commonMiddleware.checkAddressName("enName", "en")
  ),

  commonMiddleware.conditionalCheck(
    "arName",
    commonMiddleware.checkAddressName("arName", "ar")
  ),

  commonMiddleware.next,
];

const validateDeleteCity = [
  check("cityId").isMongoId().withMessage(errors.system.invalidMongoId),
  commonMiddleware.next,
];

module.exports = {
  validateCreateCity,
  validateUpdateCity,
  validateDeleteCity,
};
