const createError = require("http-errors");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const { findByEmail, create } = require("../models/auth");
const commonHelper = require("../helper/common");
const jwt = require("jsonwebtoken");
const authHelper = require("../helper/auth");

const register = async (req, res, next) => {
  try {
    const { email, password, name, phone, role } = req.body;
    const { rowCount } = await findByEmail(email);
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);
    // console.log(passwordHash);

    if (rowCount) {
      return next(createError(403, "user sudah terdaftar"));
    }
    const data = {
      id: uuidv4(),
      email,
      password: passwordHash,
      name,
      phone,
      role: role || "user",
    };
    await create(data);
    commonHelper.response(res, null, 201, "data berhasil register");
  } catch (err) {
    console.log(err);
    next(new createError.InternalServerError());
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const {
      rows: [user],
    } = await findByEmail(email);

    if (!user || user.email === "") {
      return commonHelper.response(res, null, 403, "email atau password anda salah");
    }
    const validPassword = bcrypt.compareSync(password, user.pass);
    if (!validPassword) {
      return commonHelper.response(res, null, 403, "email atau password anda salah");
    }
    console.log(user);
    delete user.pass;
    const payload = {
      email: user.email,
      role: user.role,
    };
    // generate token

    user.token = authHelper.generateToken(payload);
    user.refreshToken = authHelper.generateRefreshToken(payload);
    res.cookie("token", user.token, {
      httpOnly: true,
      maxAge: 60 * 1000 * 60 * 12,
      secure: process.env.NODE_ENV !== "Development" ? true : false,
      path: "/",
      sameSite: "strict",
    });
    commonHelper.response(res, user, 201, "anda berhasil login");
  } catch (error) {
    console.log(error);
    next(new createError.InternalServerError());
  }
};

const profile = async (req, res, next) => {
  const email = req.decoded.email;
  const {
    rows: [user],
  } = await findByEmail(email);
  // console.log(user);
  delete user.password;
  commonHelper.response(res, user, 200);
};

const deleteUser = async (req, res, next) => {};

const refreshToken = (req, res, next) => {
  const refreshToken = req.body.refreshToken;
  const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY_JWT);
  const payload = {
    email: decoded.email,
    role: decoded.password,
  };
  const result = {
    token: authHelper.generateToken(payload),
    refreshToken: authHelper.generateRefreshToken(payload),
  };
  commonHelper.response(res, result, 200);
};
module.exports = {
  register,
  login,
  profile,
  deleteUser,
  refreshToken,
};
