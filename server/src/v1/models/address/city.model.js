const { Schema, model } = require("mongoose");

const CLIENT_SCHEMA = ["_id", "name"];

const citySchema = new Schema(
  {
    name: {
      en: {
        type: String,
        required: true,
        trim: true,
        unique: true,
      },
      ar: {
        type: String,
        required: true,
        trim: true,
        unique: true,
      },
    },
  },
  {
    minimize: false,
    timestamps: true,
  }
);

const City = model("City", citySchema);

module.exports = {
  City,
  CLIENT_SCHEMA,
};
