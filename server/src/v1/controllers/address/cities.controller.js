const { citiesService } = require("../../services");
const { CLIENT_SCHEMA } = require("../../models/address/city.model");
const httpStatus = require("http-status");
const _ = require("lodash");

module.exports.createCity = async (req, res, next) => {
  try {
    const { enName, arName } = req.body;
    const city = await citiesService.createCity(enName, arName);
    res.status(httpStatus.CREATED).json(_.pick(city, CLIENT_SCHEMA));
  } catch (err) {
    next(err);
  }
};

module.exports.getAllCitites = async (req, res, next) => {
  try {
    // Fetch all cities from DB
    const cities = await citiesService.getAllCitites(true);
    res.status(httpStatus.OK).json(cities);
  } catch (err) {
    next(err);
  }
};

module.exports.updateCity = async (req, res, next) => {
  try {
    const { cityId, enName, arName } = req.body;
    const city = await citiesService.updateCity(cityId, enName, arName);
    res.status(httpStatus.OK).json(_.pick(city, CLIENT_SCHEMA));
  } catch (err) {
    next(err);
  }
};

module.exports.deleteCity = async (req, res, next) => {
  try {
    const { cityId } = req.body;
    const city = await citiesService.deleteCity(cityId);
    res.status(httpStatus.OK).json(city);
  } catch (err) {
    next(err);
  }
};
