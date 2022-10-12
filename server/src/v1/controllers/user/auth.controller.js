const { authService } = require("../../services");
const httpStatus = require("http-status");
const { ApiError } = require("../../middleware/apiError");
const { CLIENT_SCHEMA } = require("../../models/user.model");
const errors = require("../../config/errors");
const _ = require("lodash");

module.exports.register = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;
    const user = await authService.register(email, password, name, phone);

    // TODO: send phone activation code to user's phone.

    const body = {
      user: _.pick(user, CLIENT_SCHEMA),
      token: user.genAuthToken(),
    };

    res.status(httpStatus.CREATED).json(body);
  } catch (err) {
    if (err.code === errors.codes.duplicateIndexKey) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.auth.emailOrPhoneUsed;
      err = new ApiError(statusCode, message);
    }

    next(err);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { emailOrPhone, password } = req.body;
    const user = await authService.login(emailOrPhone, password);

    const body = {
      user: _.pick(user, CLIENT_SCHEMA),
      token: user.genAuthToken(),
    };

    res.status(httpStatus.OK).json(body);
  } catch (err) {
    next(err);
  }
};
