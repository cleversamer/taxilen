const { authService, emailService } = require("../../services");
const httpStatus = require("http-status");
const { CLIENT_SCHEMA } = require("../../models/user.model");
const _ = require("lodash");

module.exports.register = async (req, res, next) => {
  try {
    const { lang = "ar", name, email, phone, address, password } = req.body;

    const user = await authService.register(
      email,
      password,
      name,
      phone,
      address
    );

    await emailService.registerEmail(lang, email, user);

    // TODO: send phone activation code to user's phone.

    const body = {
      user: _.pick(user, CLIENT_SCHEMA),
      token: user.genAuthToken(),
    };

    res.status(httpStatus.CREATED).json(body);
  } catch (err) {
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
