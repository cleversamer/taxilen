const { Schema, model, Types } = require("mongoose");

const CLIENT_SCHEMA = ["_id", "cityId", "name"];

const regionSchema = new Schema({
  cityId: {
    type: Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
});

const Region = model("Region", regionSchema);

module.exports = {
  Region,
  CLIENT_SCHEMA,
};
