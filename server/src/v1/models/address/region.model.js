const { Schema, model, Types } = require("mongoose");

const CLIENT_SCHEMA = ["_id", "name"];

const regionSchema = new Schema(
  {
    cityId: {
      type: Types.ObjectId,
      ref: "City",
      required: true,
    },
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

regionSchema.methods.isBelongToCity = function (cityId) {
  return cityId.toString() === this.cityId.toString();
};

const Region = model("Region", regionSchema);

module.exports = {
  Region,
  CLIENT_SCHEMA,
};
