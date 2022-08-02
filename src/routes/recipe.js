const express = require("express");
const recipeControl = require("../controller/recipe");
const router = express.Router();
const { protect, isAdmin } = require("../middlewares/auth");
const { upload } = require("../middlewares/multer");
const cpUpload = upload.fields([{ name: "img" }, { name: "vid" }]);

router
  .post(
    "/",

    upload.fields([
      { name: "img", maxCount: 1 },
      { name: "vid", maxCount: 1 },
    ]),
    recipeControl.insertRecipe
  )
  .get("/", recipeControl.getRecipe)
  .get("/:id", recipeControl.detailRecipe)
  .delete("/:id", recipeControl.deleteRecipe)
  .put(
    "/:id",
    upload.fields([
      { name: "img", maxCount: 1 },
      { name: "vid", maxCount: 1 },
    ]),
    recipeControl.updateRecipe
  );

module.exports = router;
