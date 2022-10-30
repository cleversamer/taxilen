const router = require("express").Router();
const { citiesController } = require("../../controllers");
const { cityValidator } = require("../../middleware/validation");
const auth = require("../../middleware/auth");

router
  .route("/")
  .get(citiesController.getAllCitites)
  .post(
    auth("createAny", "city"),
    cityValidator.validateCreateCity,
    citiesController.createCity
  )
  .patch(
    auth("updateAny", "city"),
    cityValidator.validateUpdateCity,
    citiesController.updateCity
  )
  .delete(
    auth("deleteAny", "city"),
    cityValidator.validateDeleteCity,
    citiesController.deleteCity
  );

module.exports = router;
