const { SUPPORTED_ROLES } = require("../../../models/user.model");
const { check } = require("express-validator");
const errors = require("../../../config/errors");
const commonMiddleware = require("../common");

const validateUpdateProfile = [
  commonMiddleware.conditionalCheck(
    "name",
    check("name")
      .trim()
      .isLength({ min: 8, max: 64 })
      .withMessage(errors.auth.invalidName)
  ),

  commonMiddleware.checkFile("avatar", ["png", "jpg", "jpeg"], false),

  commonMiddleware.conditionalCheck(
    "email",
    check("email").trim().isEmail().withMessage(errors.auth.invalidEmail).bail()
  ),

  commonMiddleware.conditionalCheck("phone", commonMiddleware.checkPhone),

  commonMiddleware.conditionalCheck("address", commonMiddleware.checkAddress),

  commonMiddleware.conditionalCheck(
    "password",
    check("password")
      .trim()
      .isLength({ min: 8, max: 32 })
      .withMessage(errors.auth.invalidPassword)
  ),

  commonMiddleware.next,
];

const validateUpdateUserProfile = [
  check("emailOrPhone")
    .trim()
    .isLength({ min: 8, max: 256 })
    .withMessage(errors.auth.invalidEmailOrPhone)
    .bail(),

  ...validateUpdateProfile,
];

const validateUpdateUserRole = [
  check("emailOrPhone")
    .trim()
    .isLength({ min: 8, max: 256 })
    .withMessage(errors.auth.invalidEmailOrPhone)
    .bail(),

  check("role").isIn(SUPPORTED_ROLES).withMessage(errors.user.invalidRole),

  commonMiddleware.next,
];

const validateVerifyUser = [
  check("emailOrPhone")
    .trim()
    .isLength({ min: 8, max: 256 })
    .withMessage(errors.auth.invalidEmailOrPhone)
    .bail(),

  commonMiddleware.next,
];

const validateFindUserByEmailOrPhone = [
  (req, res, next) => {
    req.body.emailOrPhone = req.params.id;
    req.body.role = req.params.role;

    next();
  },

  check("emailOrPhone")
    .trim()
    .isLength({ min: 8, max: 256 })
    .withMessage(errors.auth.invalidEmailOrPhone)
    .bail(),

  check("role")
    .isIn(SUPPORTED_ROLES.filter((role) => role !== "admin"))
    .withMessage(errors.user.invalidRole),

  commonMiddleware.next,
];

module.exports = {
  validateUpdateProfile,
  validateUpdateUserProfile,
  validateUpdateUserRole,
  validateVerifyUser,
  validateFindUserByEmailOrPhone,
};
