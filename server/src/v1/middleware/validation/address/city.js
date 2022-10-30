const { check } = require("express-validator");
const errors = require("../../../config/errors");
const commonMiddleware = require("../common");

const validateCreateCity = [
  commonMiddleware.checkAddressName("enName", "city", "en"),
  commonMiddleware.checkAddressName("arName", "city", "ar"),
  commonMiddleware.next,
];

const validateUpdateCity = [
  commonMiddleware.conditionalCheck(
    "enName",
    commonMiddleware.checkAddressName("enName", "city", "en")
  ),

  commonMiddleware.conditionalCheck(
    "arName",
    commonMiddleware.checkAddressName("arName", "city", "ar")
  ),

  commonMiddleware.next,
];

const validateDeleteCity = [
  check("cityId").isMongoId().withMessage(errors.city.invalidId),
  commonMiddleware.next,
];

module.exports = {
  validateCreateCity,
  validateUpdateCity,
  validateDeleteCity,
};
