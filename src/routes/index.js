const express = require("express");
const router = express.Router();
const recipe = require("./recipe");
const usersRoute = require("./auth");

router.use("/recipe", recipe).use("/auth", usersRoute);
module.exports = router;
