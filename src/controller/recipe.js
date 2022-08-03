require("dotenv").config();
const { getRecipe, insertRecipe, deleteRecipe, updateRecipe, detailRecipe, countRecipe } = require("../models/recipe");
// const cloudinary = require("../middlewares/cloudinary");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const recipeControl = {
  insertRecipe: async (req, res) => {
    try {
      const { title, ingre } = req.body;
      const dataimage = req.files.img[0].path;
      console.log("liat data path", dataimage);
      const result = await cloudinary.uploader.upload(req.files.img[0].path, { folder: "FoodRecipe/foto" });
      const video = await cloudinary.uploader.upload(req.files.vid[0].path, { folder: "FoodRecipe/video", resource_type: "video" });
      console.log(result);
      const data = { title, ingre, img: result.secure_url, vid: video.secure_url };
      await insertRecipe(data);
      console.log(data);
      res.status(200).json({
        data,
        message: `Create recipe success`,
      });
    } catch (error) {
      console.log(error);
    }
  },
  getRecipe: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
      const offset = (page - 1) * limit;
      const sortBy = req.query.sortBy || "idrecipe";
      const sort = req.query.sort || "desc";
      const search = req.query.search || "";
      const {
        rows: [count],
      } = await countRecipe();
      const totalData = parseInt(count.total);
      const totalPage = Math.ceil(totalData / limit);
      const { rows: result } = await getRecipe({ offset, limit, sortBy, sort, search });
      res.status(200).json({
        pagination: {
          currentPage: page,
          limit,
          totalData,
          totalPage,
          sortBy,
          sort,
          search,
        },
        data: result,
      });
    } catch (error) {
      console.log(error);
    }
  },
  deleteRecipe: async (req, res) => {
    try {
      const id = req.params.id;
      console.log(id);
      await deleteRecipe(id);
      res.json({
        message: "recipe berhasil di hapus",
      });
    } catch (error) {
      console.log(error);
    }
  },
  updateRecipe: async (req, res) => {
    try {
      const id = req.params.id;
      console.log(id);
      console.log("dari files", req.files);
      const { title, ingre } = req.body;
      const foto = req.files?.img;
      const fideo = req.files?.vid;
      console.log(foto, fideo);
      let result;
      let video;
      if (foto) {
        result = await cloudinary.uploader.upload(req.files?.img[0].path, { folder: "FoodRecipe/foto" });
      }
      if (fideo) {
        video = await cloudinary.uploader.upload(req.files?.vid[0].path, { folder: "FoodRecipe/video", resource_type: "video" });
      }
      const data = { id, title, ingre, img: result?.url || null, vid: video?.url || null };
      await updateRecipe(data);
      console.log(data);
      res.status(200).json({
        data,
        message: `Update recipe success`,
      });
    } catch (error) {
      console.log(error);
    }
  },
  detailRecipe: async (req, res) => {
    try {
      const id = req.params.id;
      const {
        rows: [result],
      } = await detailRecipe(id);
      console.log(result);
      res.status(200).json({
        result,
      });
    } catch (error) {
      console.log(error);
    }
  },
};
module.exports = recipeControl;
