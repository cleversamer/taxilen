const { check } = require("express-validator");
const errors = require("../../../config/errors");
const commonMiddleware = require("../common");

const validateUpdateProfile = [
  commonMiddleware.checkLanguage,
  commonMiddleware.conditionalCheck("name", commonMiddleware.checkName),
  commonMiddleware.checkFile("avatar", ["png", "jpg", "jpeg"], false),
  commonMiddleware.conditionalCheck("email", commonMiddleware.checkEmail),
  commonMiddleware.conditionalCheck("phone", commonMiddleware.checkPhone),
  commonMiddleware.conditionalCheck("password", commonMiddleware.checkPassword),
  commonMiddleware.next,
];

const validateUpdateUserProfile = [
  commonMiddleware.checkEmailOrPhone,
  ...validateUpdateProfile,
];

const validateUpdateUserRole = [
  commonMiddleware.checkEmailOrPhone,

  commonMiddleware.checkRole(false),

  commonMiddleware.next,
];

const validateVerifyUser = [
  commonMiddleware.checkEmailOrPhone,
  commonMiddleware.next,
];

const validateFindUserByEmailOrPhone = [
  (req, res, next) => {
    req.body.emailOrPhone = req.params.id;
    req.body.role = req.params.role;

    next();
  },

  commonMiddleware.checkEmailOrPhone,

  commonMiddleware.checkRole(true),

  commonMiddleware.next,
];

const validateAddAddress = [
  commonMiddleware.checkAddress,
  commonMiddleware.next,
];

const validateDeleteAddress = [
  check("addressId").isMongoId().withMessage(errors.user.invalidAddressId),
  commonMiddleware.next,
];

module.exports = {
  validateUpdateProfile,
  validateUpdateUserProfile,
  validateUpdateUserRole,
  validateVerifyUser,
  validateFindUserByEmailOrPhone,
  validateAddAddress,
  validateDeleteAddress,
};
