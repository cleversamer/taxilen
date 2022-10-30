const { Schema, model } = require("mongoose");

const CLIENT_SCHEMA = ["_id", "name"];

const citySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
});

const City = model("City", citySchema);

module.exports = {
  City,
  CLIENT_SCHEMA,
};
