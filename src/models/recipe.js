const pool = require("../config/pg");

const recipeModel = {
  insertRecipe: (data) => {
    return pool.query("INSERT INTO recipe(title,ingre,img)VALUES($1,$2,$3)", [data.title, data.ingre, data.image]);
  },
  getRecipe: ({ sortBy, sort, limit, offset, search }) => {
    return pool.query(`SELECT idrecipe,title,ingre,img,vid FROM recipe WHERE LOWER(title) LIKE LOWER('%${search}%') ORDER BY ${sortBy} ${sort} LIMIT ${limit} OFFSET ${offset}`);
  },
  countRecipe: () => {
    return pool.query("SELECT COUNT (*) AS total FROM recipe");
  },
  deleteRecipe: (id) => {
    return pool.query("DELETE FROM recipe WHERE idrecipe = $1", [id]);
  },
  updateRecipe: (data) => {
    return pool.query("UPDATE recipe SET title = $1, ingre = $2, img = $3 WHERE idrecipe = $4", [data.title, data.ingre, data.image, data.id]);
  },
  detailRecipe: (id) => {
    return pool.query("SELECT * FROM recipe where idrecipe = $1", [id]);
  },
};
module.exports = recipeModel;
