require("dotenv").config();
const express = require("express");
const createError = require("http-errors");
const bodyParser = require("body-parser");
const app = express();
const morgan = require("morgan");
const port = process.env.PORT || 2000;
const versioning = require("./src/routes");

app.use(morgan("dev"));
app.use(express());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/v1", versioning);

//error handling
app.all("*", (req, res, next) => {
  next(new createError[404]());
});

app.use((err, req, res, next) => {
  const messError = err.message;
  const statusError = err.status;
  res.status(statusError).json({
    message: messError,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
