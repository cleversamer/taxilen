const { Schema, model, Types } = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const CLIENT_SCHEMA = [
  "_id",
  "avatarURL",
  "name",
  "email",
  "phone",
  "address",
  "role",
  "verified",
  "createdAt",
  "lastLogin",
];

const SUPPORTED_ROLES = ["user", "admin"];

const userSchema = new Schema(
  {
    avatarURL: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    address: [
      {
        title: {
          type: String,
          required: true,
        },
        city: {
          name: {
            en: {
              type: String,
              required: true,
              trim: true,
            },
            ar: {
              type: String,
              required: true,
              trim: true,
            },
          },
          ref: {
            type: Types.ObjectId,
            ref: "City",
            required: true,
          },
        },

        region: {
          name: {
            en: {
              type: String,
              required: true,
              trim: true,
            },
            ar: {
              type: String,
              required: true,
              trim: true,
            },
          },
          ref: {
            type: Types.ObjectId,
            ref: "Region",
            required: true,
          },
        },
        street: {
          type: String,
          required: true,
        },
      },
    ],
    password: {
      type: String,
      trim: true,
      default: "",
    },
    role: {
      type: String,
      enum: SUPPORTED_ROLES,
      default: "user",
    },
    verified: {
      email: {
        type: Boolean,
        default: false,
      },
      phone: {
        type: Boolean,
        default: false,
      },
    },
    lastLogin: {
      type: String,
      default: new Date(),
    },
    emailVerificationCode: {
      code: {
        type: String,
        default: "",
      },
      expiresAt: {
        type: String,
        default: "",
      },
    },
    phoneVerificationCode: {
      code: {
        type: String,
        default: "",
      },
      expiresAt: {
        type: String,
        default: "",
      },
    },
    resetPasswordCode: {
      code: {
        type: String,
        default: "",
      },
      expiresAt: {
        type: String,
        default: "",
      },
    },
  },
  {
    minimize: false,
    timestamps: true,
  }
);

userSchema.methods.updateEmailVerificationCode = function () {
  const code = Math.floor(1000 + Math.random() * 9000);
  const expiresAt = new Date() + 10 * 60 * 1000;
  this.emailVerificationCode = { code, expiresAt };
};

userSchema.methods.updatePhoneVerificationCode = function () {
  const code = Math.floor(1000 + Math.random() * 9000);
  const expiresAt = new Date() + 10 * 60 * 1000;
  this.phoneVerificationCode = { code, expiresAt };
};

userSchema.methods.generatePasswordResetCode = function () {
  const code = Math.floor(1000 + Math.random() * 9000);
  const expiresAt = new Date() + 10 * 60 * 1000;
  this.resetPasswordCode = { code, expiresAt };
};

userSchema.methods.verifyEmail = function () {
  this.verified.email = true;
};

userSchema.methods.isEmailVerified = function () {
  return this.verified.email;
};

userSchema.methods.verifyPhone = function () {
  this.verified.phone = true;
};

userSchema.methods.isPhoneVerified = function () {
  return this.verified.phone;
};

userSchema.methods.genAuthToken = function () {
  const body = {
    sub: this._id.toHexString(),
    password: this.password,
  };

  return jwt.sign(body, process.env["JWT_PRIVATE_KEY"]);
};

userSchema.methods.comparePassword = async function (candidate) {
  return await bcrypt.compare(candidate, this.password);
};

userSchema.methods.updatePassword = async function (newPassword) {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(newPassword, salt);
  this.password = hashed;
};

userSchema.methods.isMatchingCode = function (key, code) {
  try {
    return this[key].code == code;
  } catch (err) {
    return false;
  }
};

userSchema.methods.isValidCode = function (key) {
  try {
    const diff = new Date() - new Date(this[key].expiresAt);
    return diff <= 10 * 60 * 1000;
  } catch (err) {
    return false;
  }
};

userSchema.methods.isAddressExist = function (address) {
  for (let item of this.address) {
    const { title, city, region, street } = item;

    const addressMatch =
      address.title === title &&
      address.cityId.toString() === city.ref.toString() &&
      address.regionId.toString() === region.ref.toString() &&
      address.street === street;

    if (addressMatch) return true;
  }

  return false;
};

userSchema.methods.addAddress = function (title, city, region, street) {
  this.address.push({
    title,
    street,
    city: {
      name: city.name,
      ref: city._id,
    },
    region: {
      name: region.name,
      ref: region._id,
    },
  });
};

userSchema.methods.getAddress = function (addressId) {
  return (
    this.address.findIndex(
      (address) => address._id.toString() === addressId.toString()
    ) !== -1
  );
};

userSchema.methods.deleteAddress = function (addressId) {
  const index = this.address.findIndex(
    (address) => address._id.toString() === addressId.toString()
  );

  if (index !== -1) {
    this.address.splice(index, 1);
  }
};

userSchema.methods.updateLastLogin = function () {
  this.lastLogin = new Date();
};

const User = model("User", userSchema);

module.exports = {
  User,
  CLIENT_SCHEMA,
  SUPPORTED_ROLES,
};
