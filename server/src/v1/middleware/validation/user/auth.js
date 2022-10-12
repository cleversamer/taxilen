const { check } = require("express-validator");
const errors = require("../../../config/errors");
const commonMiddleware = require("../common");

const loginValidator = [
  check("emailOrPhone")
    .trim()
    .isLength({ min: 8, max: 256 })
    .withMessage(errors.auth.invalidEmailOrPhone)
    .bail(),

  check("password")
    .trim()
    .isLength({ min: 8, max: 32 })
    .withMessage(errors.auth.invalidPassword),

  commonMiddleware.next,
];

const registerValidator = [
  check("name")
    .trim()
    .isLength({ min: 8, max: 64 })
    .withMessage(errors.auth.invalidName),

  check("email").trim().isEmail().withMessage(errors.auth.invalidEmail).bail(),

  commonMiddleware.checkPhone,

  check("password")
    .trim()
    .isLength({ min: 8, max: 32 })
    .withMessage(errors.auth.invalidPassword),

  commonMiddleware.next,
];

const resetPasswordValidator = [
  check("newPassword")
    .trim()
    .isLength({ min: 8, max: 32 })
    .withMessage(errors.auth.invalidPassword),

  commonMiddleware.next,
];

const forgotPasswordValidator = [
  check("emailOrPhone")
    .trim()
    .isLength({ min: 8, max: 256 })
    .withMessage(errors.auth.invalidEmailOrPhone)
    .bail(),

  check("newPassword")
    .trim()
    .isLength({ min: 8, max: 32 })
    .withMessage(errors.auth.invalidPassword),

  commonMiddleware.next,
];

const getForgotPasswordCode = [
  (req, res, next) => {
    req.body.emailOrPhone = req.query.emailOrPhone;

    next();
  },

  check("emailOrPhone")
    .trim()
    .isLength({ min: 8, max: 256 })
    .withMessage(errors.auth.invalidEmailOrPhone)
    .bail(),
];

const emailValidator = [
  check("email").trim().isEmail().withMessage(errors.auth.invalidEmail).bail(),

  commonMiddleware.next,
];

module.exports = {
  loginValidator,
  registerValidator,
  resetPasswordValidator,
  forgotPasswordValidator,
  emailValidator,
  getForgotPasswordCode,
};
