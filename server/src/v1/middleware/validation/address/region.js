const { check } = require("express-validator");
const errors = require("../../../config/errors");
const commonMiddleware = require("../common");

const validateGetCityRegions = [commonMiddleware.checkMongoIdParam];

const validateCreateRegion = [
  check("cityId").isMongoId().withMessage(errors.city.invalidId),
  commonMiddleware.checkAddressName("enName", "region", "en"),
  commonMiddleware.checkAddressName("arName", "region", "ar"),
  commonMiddleware.next,
];

const validateUpdateRegion = [
  check("regionId").isMongoId().withMessage(errors.region.invalidId),

  commonMiddleware.conditionalCheck(
    "cityId",
    check("cityId").isMongoId().withMessage(errors.city.invalidId)
  ),

  commonMiddleware.conditionalCheck(
    "enName",
    commonMiddleware.checkAddressName("enName", "region", "en")
  ),

  commonMiddleware.conditionalCheck(
    "arName",
    commonMiddleware.checkAddressName("arName", "region", "ar")
  ),

  commonMiddleware.next,
];

const validateDeleteRegion = [
  check("regionId").isMongoId().withMessage(errors.region.invalidId),
  commonMiddleware.next,
];

module.exports = {
  validateGetCityRegions,
  validateCreateRegion,
  validateUpdateRegion,
  validateDeleteRegion,
};
