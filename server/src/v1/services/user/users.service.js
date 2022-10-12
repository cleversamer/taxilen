const { User } = require("../../models/user.model");
const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");
const emailService = require("./email.service");
const localStorage = require("../storage/localStorage.service");
const { ApiError } = require("../../middleware/apiError");
const errors = require("../../config/errors");
const bcrypt = require("bcrypt");

module.exports.findUserByEmailOrPhone = async (
  emailOrPhone,
  role = "",
  withError = false
) => {
  try {
    console.log(emailOrPhone, role, withError);

    const user = await User.findOne({
      $or: [{ email: { $eq: emailOrPhone } }, { phone: { $eq: emailOrPhone } }],
    });

    if (withError && !user) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.user.notFound;
      throw new ApiError(statusCode, message);
    }

    if (withError && user && role && user.role !== role) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.user.foundWithInvalidRole;
      throw new ApiError(statusCode, message);
    }

    return user;
  } catch (err) {
    throw err;
  }
};

module.exports.findUserById = async (userId) => {
  try {
    return await User.findById(userId);
  } catch (err) {
    throw err;
  }
};

module.exports.validateToken = (token) => {
  try {
    return jwt.verify(token, process.env["JWT_PRIVATE_KEY"]);
  } catch (err) {
    throw err;
  }
};

module.exports.updateProfile = async (
  user,
  name,
  email,
  password,
  phone,
  avatar
) => {
  try {
    let userChanged = false;

    if (name && user.name !== name) {
      user.name = name;
      userChanged = true;
    }

    if (avatar && user.avatar !== avatar) {
      const file = await localStorage.storeFile(avatar);
      user.avatarURL = file.path;
      userChanged = true;
    }

    if (password && user.password !== password) {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);
      user.password = hashed;
      userChanged = true;
    }

    if (email && user.email !== email) {
      const emailUsed = await this.findUserByEmailOrPhone(email);
      if (emailUsed) {
        const statusCode = httpStatus.FORBIDDEN;
        const message = errors.auth.emailUsed;
        throw new ApiError(statusCode, message);
      }

      user.email = email;
      user.verified.email = false;
      userChanged = true;
      user.updateEmailVerificationCode();
      await emailService.registerEmail(email, user);
    }

    if (phone && user.phone !== phone) {
      const phoneUsed = await this.findUserByEmailOrPhone(phone);
      if (phoneUsed) {
        const statusCode = httpStatus.FORBIDDEN;
        const message = errors.auth.phoneUsed;
        throw new ApiError(statusCode, message);
      }

      user.phone = phone;
      user.verified.phone = false;
      userChanged = true;
      user.updatePhoneVerificationCode();
      // TODO: send phone verification code to user's email.
    }

    return userChanged ? await user.save() : user;
  } catch (err) {
    throw err;
  }
};

///////////////////////////// ADMIN /////////////////////////////
module.exports.changeUserRole = async (emailOrPhone, role) => {
  try {
    const user = await this.findUserByEmailOrPhone(emailOrPhone);

    if (!user) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.user.notFound;
      throw new ApiError(statusCode, message);
    }

    user.role = role;
    return await user.save();
  } catch (err) {
    throw err;
  }
};

module.exports.verifyUser = async (emailOrPhone) => {
  try {
    const user = await this.findUserByEmailOrPhone(emailOrPhone);

    if (!user) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.user.notFound;
      throw new ApiError(statusCode, message);
    }

    if (user.verified.email && user.verified.phone) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.user.alreadyVerified;
      throw new ApiError(statusCode, message);
    }

    user.verified.email = true;
    user.verified.phone = true;
    return await user.save();
  } catch (err) {
    throw err;
  }
};

module.exports.updateUserProfile = async (
  emailOrPhone,
  name,
  email,
  password,
  avatar
) => {
  try {
    let userChanged = false;

    const user = await this.findUserByEmailOrPhone(emailOrPhone);
    if (!user) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.user.notFound;
      throw new ApiError(statusCode, message);
    }

    if (name && user.name !== name) {
      user.name = name;
      userChanged = true;
    }

    if (avatar && user.avatar !== avatar) {
      const file = await localStorage.storeFile(avatar);
      user.avatarURL = file.path;
      userChanged = true;
    }

    if (password && user.password !== password) {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);
      user.password = hashed;
      userChanged = true;
    }

    if (email && user.email !== email) {
      const emailUsed = await this.findUserByEmailOrPhone(email);
      if (emailUsed) {
        const statusCode = httpStatus.NOT_FOUND;
        const message = errors.auth.emailOrPhoneUsed;
        throw new ApiError(statusCode, message);
      }

      user.email = email;
      user.verified.email = false;
      userChanged = true;
      user.updateEmailVerificationCode();
      await emailService.registerEmail(email, user);
    }

    return userChanged ? await user.save() : user;
  } catch (err) {
    throw err;
  }
};
