const { Region, CLIENT_SCHEMA } = require("../../models/address/region.model");
const citiesService = require("./cities.service");
const httpStatus = require("http-status");
const errors = require("../../config/errors");
const { ApiError } = require("../../middleware/apiError");
const _ = require("lodash");

module.exports.createRegion = async (cityId, enName, arName) => {
  try {
    // Check if city exists
    const city = await citiesService.findCityById(cityId);
    if (!city) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.region.notFound;
      throw new ApiError(statusCode, message);
    }

    const region = new Region({ cityId, name: { en: enName, ar: arName } });
    return await region.save();
  } catch (err) {
    if (err.code === errors.codes.duplicateIndexKey) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.region.alreadyRegistered;
      err = new ApiError(statusCode, message);
    }

    throw err;
  }
};

module.exports.getCityRegions = async (cityId, withError) => {
  try {
    const regions = await Region.find({ cityId });

    if (withError && !regions.length) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.region.noRegions;
      throw new ApiError(statusCode, message);
    }

    return regions.map((region) => _.pick(region, CLIENT_SCHEMA));
  } catch (err) {
    throw err;
  }
};

module.exports.updateRegion = async (regionId, cityId, enName, arName) => {
  try {
    // Check if region exists
    const region = await Region.findById(regionId);
    if (!region) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.region.notFound;
      throw new ApiError(statusCode, message);
    }

    // To detect changes
    let regionChanged = false;

    // Update city if there's city
    if (cityId && region.cityId.toString() !== cityId) {
      // Check if city exists
      const city = await citiesService.findCityById(cityId);

      if (city) {
        region.cityId = city._id;
        regionChanged = true;
      }
    }

    // Update english name if there's `enName`
    if (enName && region.name.en !== enName) {
      region.name.en = enName;
      regionChanged = true;
    }

    // Update arabic name if there's `arName`
    if (arName && region.name.ar !== arName) {
      region.name.ar = arName;
      regionChanged = true;
    }

    return regionChanged ? await region.save() : region;
  } catch (err) {
    throw err;
  }
};

module.exports.deleteRegion = async (regionId) => {
  try {
    const region = await Region.findByIdAndDelete(regionId);

    // Check if region is already deleted
    if (!region) {
      const statusCode = httpStatus.OK;
      const message = errors.region.notFound;
      throw new ApiError(statusCode, message);
    }

    return _.pick(region, CLIENT_SCHEMA);
  } catch (err) {
    throw err;
  }
};
