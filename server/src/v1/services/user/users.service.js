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
  lang,
  user,
  name,
  email,
  password,
  phone,
  avatar,
  address
) => {
  try {
    // To update the used in case of it has been updated
    let userChanged = false;

    // Updating name when there's new name
    if (name && user.name !== name) {
      user.name = name;
      userChanged = true;
    }

    // Updating avarar when there's new avatar
    if (avatar && user.avatar !== avatar) {
      const file = await localStorage.storeFile(avatar);
      await localStorage.deleteFile(user.avatarURL);
      user.avatarURL = file.path;
      userChanged = true;
    }

    // Updating password when there's new password
    if (password && user.password !== password) {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);
      user.password = hashed;
      userChanged = true;
    }

    // Updating address when there's new address
    if (address) {
      user.address = address;
      userChanged = true;
    }

    // Updating email when there's new email
    // And sending email verification code to the new email
    if (email && user.email !== email) {
      // Checking if email used
      const emailUsed = await this.findUserByEmailOrPhone(email);
      if (emailUsed) {
        const statusCode = httpStatus.FORBIDDEN;
        const message = errors.auth.emailUsed;
        throw new ApiError(statusCode, message);
      }

      // Updating email, setting email as not verified,
      // update email verification code, and sending
      // email verification code to user's email
      user.email = email;
      user.verified.email = false;
      userChanged = true;
      user.updateEmailVerificationCode();
      await emailService.changeEmail(lang, email, user);
    }

    // Updating phone when there's new phone
    // And sending phone verification code to the new phone
    if (phone && user.phone !== phone) {
      // Checking if phone used
      const phoneUsed = await this.findUserByEmailOrPhone(phone);
      if (phoneUsed) {
        const statusCode = httpStatus.FORBIDDEN;
        const message = errors.auth.phoneUsed;
        throw new ApiError(statusCode, message);
      }

      // Updating phone, setting phone as not verified,
      // update phone verification code, and sending
      // phone verification code to user's phone
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
    // Checking if user exists
    const user = await this.findUserByEmailOrPhone(emailOrPhone);
    if (!user) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.user.notFound;
      throw new ApiError(statusCode, message);
    }

    // Update user's role
    user.role = role;
    return await user.save();
  } catch (err) {
    throw err;
  }
};

module.exports.verifyUser = async (emailOrPhone) => {
  try {
    // Checking if used exists
    const user = await this.findUserByEmailOrPhone(emailOrPhone);
    if (!user) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.user.notFound;
      throw new ApiError(statusCode, message);
    }

    // Checking if user's email and phone are already verified
    if (user.verified.email && user.verified.phone) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.user.alreadyVerified;
      throw new ApiError(statusCode, message);
    }

    // Verifiy user's email and phone
    user.verified.email = true;
    user.verified.phone = true;
    return await user.save();
  } catch (err) {
    throw err;
  }
};

module.exports.updateUserProfile = async (
  lang,
  emailOrPhone,
  name,
  email,
  password,
  phone,
  avatar,
  address
) => {
  try {
    // To update the used in case of it has been updated
    let userChanged = false;

    // Checking if user exists
    const user = await this.findUserByEmailOrPhone(emailOrPhone);
    if (!user) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.user.notFound;
      throw new ApiError(statusCode, message);
    }

    // Updating name when there's new name
    if (name && user.name !== name) {
      user.name = name;
      userChanged = true;
    }

    // Updating address when there's new address
    if (address) {
      user.address = address;
      userChanged = true;
    }

    // Updating avatar when there's new avatar
    if (avatar && user.avatar !== avatar) {
      const file = await localStorage.storeFile(avatar);
      await localStorage.deleteFile(user.avatarURL);
      user.avatarURL = file.path;
      userChanged = true;
    }

    // Updating password when there's new password
    if (password && user.password !== password) {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);
      user.password = hashed;
      userChanged = true;
    }

    // Updating email, setting email as not verified,
    // update email verification code, and sending
    // email verification code to user's email
    if (email && user.email !== email) {
      // Checking if email used
      const emailUsed = await this.findUserByEmailOrPhone(email);
      if (emailUsed) {
        const statusCode = httpStatus.NOT_FOUND;
        const message = errors.auth.emailOrPhoneUsed;
        throw new ApiError(statusCode, message);
      }

      // Updating email, setting email as not verified,
      // update email verification code, and sending
      // email verification code to user's email
      user.email = email;
      user.verified.email = false;
      userChanged = true;
      user.updateEmailVerificationCode();
      await emailService.changeEmail(lang, email, user);
    }

    // Updating phone, setting phone as not verified,
    // update phone verification code, and sending
    // phone verification code to user's phone
    if (phone && user.phone !== phone) {
      // Checking if phone used
      const phoneUsed = await this.findUserByEmailOrPhone(phone);
      if (phoneUsed) {
        const statusCode = httpStatus.NOT_FOUND;
        const message = errors.auth.emailOrPhoneUsed;
        throw new ApiError(statusCode, message);
      }

      // Updating email, setting email as not verified,
      // update email verification code, and sending
      // email verification code to user's email
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
