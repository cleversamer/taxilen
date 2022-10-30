const AccessControl = require("accesscontrol");

const allRights = {
  "create:any": ["*"],
  "read:any": ["*"],
  "update:any": ["*"],
  "delete:any": ["*"],
};

let grantsObject = {
  admin: {
    user: allRights,
    emailVerificationCode: allRights,
    phoneVerificationCode: allRights,
    password: allRights,
    city: allRights,
  },
  office: {
    user: {
      "read:own": ["*"],
      "update:own": ["*"],
    },
    emailVerificationCode: {
      "read:own": ["*"],
      "update:own": ["*"],
    },
    phoneVerificationCode: {
      "read:own": ["*"],
      "update:own": ["*"],
    },
    password: {
      "update:own": ["*"],
    },
    city: {
      "read:any": ["*"],
    },
  },
  user: {
    user: {
      "read:own": ["*"],
      "update:own": ["*"],
    },
    emailVerificationCode: {
      "read:own": ["*"],
      "update:own": ["*"],
    },
    phoneVerificationCode: {
      "read:own": ["*"],
      "update:own": ["*"],
    },
    password: {
      "update:own": ["*"],
    },
    city: {
      "read:any": ["*"],
    },
  },
};

const roles = new AccessControl(grantsObject);

module.exports = roles;
