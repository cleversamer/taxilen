const { regionsService } = require("../../services");
const { CLIENT_SCHEMA } = require("../../models/address/region.model");
const httpStatus = require("http-status");
const _ = require("lodash");

module.exports.createRegion = async (req, res, next) => {
  try {
    const { cityId, enName, arName } = req.body;
    const region = await regionsService.createRegion(cityId, enName, arName);
    res.status(httpStatus.CREATED).json(_.pick(region, CLIENT_SCHEMA));
  } catch (err) {
    next(err);
  }
};

module.exports.getCityRegions = async (req, res, next) => {
  try {
    const { cityId } = req.params;
    const regions = await regionsService.getCityRegions(cityId, true);
    res.status(httpStatus.OK).json(regions);
  } catch (err) {
    next(err);
  }
};

module.exports.updateRegion = async (req, res, next) => {
  try {
    const { regionId, cityId, enName, arName } = req.body;

    const region = await regionsService.updateRegion(
      regionId,
      cityId,
      enName,
      arName
    );

    res.status(httpStatus.OK).json(_.pick(region, CLIENT_SCHEMA));
  } catch (err) {
    next(err);
  }
};

module.exports.deleteRegion = async (req, res, next) => {
  try {
    const { regionId } = req.body;
    const region = await regionsService.deleteRegion(regionId);
    res.status(httpStatus.OK).json(region);
  } catch (err) {
    next(err);
  }
};
