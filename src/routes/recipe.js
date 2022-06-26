const express = require("express");
const recipeControl = require("../controller/recipe");
const router = express.Router();
const { upload } = require("../middlewares/multer");

router.post("/", upload.single("img"), recipeControl.insertRecipe).get("/", recipeControl.getRecipe).get("/:id", recipeControl.detailRecipe).delete("/:id", recipeControl.deleteRecipe).put("/:id", recipeControl.updateRecipe);

module.exports = router;
