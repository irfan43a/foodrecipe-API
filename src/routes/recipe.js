const express = require("express");
const recipeControl = require("../controller/recipe");
const router = express.Router();
const { protect, isAdmin } = require("../middlewares/auth");
const { upload } = require("../middlewares/multer");
const cpUpload = upload.fields([{ name: "img" }, { name: "vid" }]);

router
  .post("/", protect, upload.single("img"), recipeControl.insertRecipe)
  .get("/", recipeControl.getRecipe)
  .get("/:id", recipeControl.detailRecipe)
  .delete("/:id", protect, recipeControl.deleteRecipe)
  .put("/:id", upload.single("img"), recipeControl.updateRecipe);

module.exports = router;
