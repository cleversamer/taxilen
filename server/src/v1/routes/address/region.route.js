const router = require("express").Router();
const { regionsController } = require("../../controllers");
const { regionValidator } = require("../../middleware/validation");
const auth = require("../../middleware/auth");

router.get(
  "/:cityId",
  regionValidator.validateGetCityRegions,
  regionsController.getCityRegions
);

router
  .route("/")
  .post(
    auth("createAny", "region"),
    regionValidator.validateCreateRegion,
    regionsController.createRegion
  )
  .patch(
    auth("updateAny", "region"),
    regionValidator.validateUpdateRegion,
    regionsController.updateRegion
  )
  .delete(
    auth("deleteAny", "region"),
    regionValidator.validateDeleteRegion,
    regionsController.deleteRegion
  );

module.exports = router;
