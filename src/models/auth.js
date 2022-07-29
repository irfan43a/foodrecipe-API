const pool = require("../config/pg");

const findByEmail = (email) => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM users WHERE email = $1", [email], (error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    });
  });
};

const create = ({ id, email, password, name, phone, role }) => {
  return new Promise((resolve, reject) => {
    pool.query("INSERT INTO users(iduser, email, pass, name,phone,role)VALUES($1, $2, $3, $4,$5,$6)", [id, email, password, name, phone, role], (error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    });
  });
};
module.exports = {
  findByEmail,
  create,
};
