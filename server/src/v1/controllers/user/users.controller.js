const httpStatus = require("http-status");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { CLIENT_SCHEMA } = require("../../models/user.model");
const { emailService, usersService } = require("../../services");
const { ApiError } = require("../../middleware/apiError");
const errors = require("../../config/errors");
const success = require("../../config/success");

module.exports.isAuth = async (req, res, next) => {
  try {
    res.status(httpStatus.OK).json(_.pick(req.user, CLIENT_SCHEMA));
  } catch (err) {
    next(err);
  }
};

module.exports.verifyUserEmail = async (req, res, next) => {
  try {
    const user = req.user;
    const { code } = req.body;

    if (user.verified.email) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.user.emailAlreadyVerified;
      throw new ApiError(statusCode, message);
    }

    if ((!code && code != 0) || code.toString().length !== 4) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.auth.invalidCode;
      throw new ApiError(statusCode, message);
    }

    if (user.emailVerificationCode.code == code) {
      const diff = new Date() - new Date(user.emailVerificationCode.expiresAt);
      const activeCode = diff < 10 * 60 * 1000;
      if (!activeCode) {
        const statusCode = httpStatus.BAD_REQUEST;
        const message = errors.auth.expiredCode;
        throw new ApiError(statusCode, message);
      }

      user.verifyEmail();
      const verifiedUser = await user.save();

      return res
        .status(httpStatus.OK)
        .json(_.pick(verifiedUser, CLIENT_SCHEMA));
    }

    const statusCode = httpStatus.BAD_REQUEST;
    const message = errors.auth.incorrectCode;
    throw new ApiError(statusCode, message);
  } catch (err) {
    next(err);
  }
};

module.exports.verifyUserPhone = async (req, res, next) => {
  try {
    const user = req.user;
    const { code } = req.body;

    if (user.verified.phone) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.user.phoneAlreadyVerified;
      throw new ApiError(statusCode, message);
    }

    if ((!code && code != 0) || code.toString().length !== 4) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.auth.invalidCode;
      throw new ApiError(statusCode, message);
    }

    if (user.phoneVerificationCode.code == code) {
      const diff = new Date() - new Date(user.phoneVerificationCode.expiresAt);
      const activeCode = diff < 10 * 60 * 1000;
      if (!activeCode) {
        const statusCode = httpStatus.BAD_REQUEST;
        const message = errors.auth.expiredCode;
        throw new ApiError(statusCode, message);
      }

      user.verifyPhone();
      const verifiedUser = await user.save();

      return res
        .status(httpStatus.OK)
        .json(_.pick(verifiedUser, CLIENT_SCHEMA));
    }

    const statusCode = httpStatus.BAD_REQUEST;
    const message = errors.auth.incorrectCode;
    throw new ApiError(statusCode, message);
  } catch (err) {
    next(err);
  }
};

module.exports.resendEmailVerificationCode = async (req, res, next) => {
  try {
    const { lang = "ar" } = req.query;
    const user = req.user;

    if (user.verified.email) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.user.emailAlreadyVerified;
      throw new ApiError(statusCode, message);
    }

    user.updateEmailVerificationCode();
    await user.save();

    await emailService.registerEmail(lang, user.email, user);

    res
      .status(httpStatus.OK)
      .json({ ok: true, message: success.auth.emailVerificationCodeSent });
  } catch (err) {
    next(err);
  }
};

module.exports.resendPhoneVerificationCode = async (req, res, next) => {
  try {
    const { lang = "ar" } = req.query;
    const user = req.user;

    if (user.verified.phone) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.user.phoneAlreadyVerified;
      throw new ApiError(statusCode, message);
    }

    user.updatePhoneVerificationCode();
    await user.save();

    // TODO: send phone activation code to user's phone

    res
      .status(httpStatus.OK)
      .json({ ok: true, message: success.auth.emailVerificationCodeSent });
  } catch (err) {
    next(err);
  }
};

module.exports.resetPassword = async (req, res, next) => {
  try {
    const user = req.user;
    const { newPassword } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);
    user.password = hashed;
    await user.save();

    res.status(httpStatus.CREATED).json(_.pick(user, CLIENT_SCHEMA));
  } catch (err) {
    next(err);
  }
};

module.exports.sendForgotPasswordCode = async (req, res, next) => {
  try {
    const { emailOrPhone, sendTo, lang = "ar" } = req.query;
    const user = await usersService.findUserByEmailOrPhone(emailOrPhone);

    if (!user) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.auth.emailNotUsed;
      throw new ApiError(statusCode, message);
    }

    user.generatePasswordResetCode();
    const updatedUser = await user.save();

    if (sendTo === "phone") {
      // TODO: send forgot password code to user's phone.
    } else {
      await emailService.forgotPasswordEmail(lang, user.email, updatedUser);
    }

    const body = {
      ok: true,
      message:
        sendTo === "phone"
          ? success.auth.passwordResetCodeSentToPhone
          : success.auth.passwordResetCodeSentToEmail,
    };

    res.status(httpStatus.OK).json(body);
  } catch (err) {
    next(err);
  }
};

module.exports.handleForgotPassword = async (req, res, next) => {
  try {
    const { emailOrPhone, code, newPassword } = req.body;
    const user = await usersService.findUserByEmailOrPhone(emailOrPhone);

    if (!user) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.auth.emailNotUsed;
      throw new ApiError(statusCode, message);
    }

    if ((!code && code != 0) || code.toString().length !== 4) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.auth.invalidCode;
      throw new ApiError(statusCode, message);
    }

    if (user.resetPasswordCode.code == code) {
      const diff = new Date() - new Date(user.resetPasswordCode.expiresAt);
      const condition = diff < 10 * 60 * 1000;
      if (!condition) {
        const statusCode = httpStatus.BAD_REQUEST;
        const message = errors.auth.expiredCode;
        throw new ApiError(statusCode, message);
      }

      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(newPassword, salt);
      user.password = hashed;
      await user.save();

      return res.status(httpStatus.OK).json(_.pick(user, CLIENT_SCHEMA));
    }

    const statusCode = httpStatus.BAD_REQUEST;
    const message = errors.auth.incorrectCode;
    throw new ApiError(statusCode, message);
  } catch (err) {
    next(err);
  }
};

module.exports.updateProfile = async (req, res, next) => {
  try {
    const user = req.user;
    const { name, email, phone, address, password, lang = "ar" } = req.body;
    const avatar = req?.files?.avatar || null;

    const newUser = await usersService.updateProfile(
      lang,
      user,
      name,
      email,
      password,
      phone,
      avatar,
      address
    );

    const body = {
      user: _.pick(newUser, CLIENT_SCHEMA),
      token: newUser.genAuthToken(),
    };

    res.status(httpStatus.CREATED).json(body);
  } catch (err) {
    next(err);
  }
};

///////////////////////////// ADMIN /////////////////////////////
module.exports.updateUserProfile = async (req, res, next) => {
  try {
    const {
      lang = "ar",
      emailOrPhone,
      name,
      email,
      address,
      password,
    } = req.body;
    const avatar = req?.files?.avatar || null;

    const updatedUser = await usersService.updateUserProfile(
      lang,
      emailOrPhone,
      name,
      email,
      password,
      avatar,
      address
    );

    res.status(httpStatus.CREATED).json(_.pick(updatedUser, CLIENT_SCHEMA));
  } catch (err) {
    next(err);
  }
};

module.exports.verifyUser = async (req, res, next) => {
  try {
    const { emailOrPhone } = req.body;

    const updatedUser = await usersService.verifyUser(emailOrPhone);

    res.status(httpStatus.CREATED).json(_.pick(updatedUser, CLIENT_SCHEMA));
  } catch (err) {
    next(err);
  }
};

module.exports.changeUserRole = async (req, res, next) => {
  try {
    const { emailOrPhone, role } = req.body;

    const updatedUser = await usersService.changeUserRole(emailOrPhone, role);

    res.status(httpStatus.CREATED).json(_.pick(updatedUser, CLIENT_SCHEMA));
  } catch (err) {
    next(err);
  }
};

module.exports.findUserByEmailOrPhone = async (req, res, next) => {
  try {
    const { role, id: emailOrPhone } = req.params;

    const user = await usersService.findUserByEmailOrPhone(
      emailOrPhone,
      role,
      true
    );

    res.status(httpStatus.OK).json(_.pick(user, CLIENT_SCHEMA));
  } catch (err) {
    next(err);
  }
};
