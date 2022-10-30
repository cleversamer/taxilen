const { City, CLIENT_SCHEMA } = require("../../models/address/city.model");
const httpStatus = require("http-status");
const errors = require("../../config/errors");
const { ApiError } = require("../../middleware/apiError");
const _ = require("lodash");

module.exports.findCityById = async (cityId) => {
  try {
    return await City.findById(cityId);
  } catch (err) {
    throw err;
  }
};

module.exports.createCity = async (enName, arName) => {
  try {
    const city = new City({ name: { en: enName, ar: arName } });
    return await city.save();
  } catch (err) {
    if (err.code === errors.codes.duplicateIndexKey) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.city.alreadyRegistered;
      err = new ApiError(statusCode, message);
    }

    throw err;
  }
};

module.exports.getAllCitites = async (withError = false) => {
  try {
    const cities = await City.find({});

    if (withError && !cities.length) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.city.noCities;
      throw new ApiError(statusCode, message);
    }

    return cities.map((city) => _.pick(city, CLIENT_SCHEMA));
  } catch (err) {
    throw err;
  }
};

module.exports.updateCity = async (cityId, enName, arName) => {
  try {
    // Check if city exists
    const city = await City.findById(cityId);
    if (!city) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.city.notFound;
      throw new ApiError(statusCode, message);
    }

    // To detect city changes
    let cityChanged = false;

    // Update english name if exists
    if (enName && city.name.en !== enName) {
      city.name.en = enName;
      cityChanged = true;
    }

    // Update arabic name if exists
    if (arName && city.name.ar !== arName) {
      city.name.ar = arName;
      cityChanged = true;
    }

    return cityChanged ? await city.save() : city;
  } catch (err) {
    throw err;
  }
};

module.exports.deleteCity = async (cityId) => {
  try {
    const city = await City.findByIdAndDelete(cityId);

    // Check if city is already deleted
    if (!city) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.city.notFound;
      throw new ApiError(statusCode, message);
    }

    return _.pick(city, CLIENT_SCHEMA);
  } catch (err) {
    throw err;
  }
};
