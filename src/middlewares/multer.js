const multer = require("multer");
const createError = require("http-errors");

exports.upload = multer({
  storage: multer.diskStorage({}),
  limits: {
    fileSize: 200 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    // console.log(file.fi)
    const filetypes = /jpg|png|jpeg|mp4/;
    // console.log(filetypes)
    const extname = filetypes.test(file.originalname);
    // console.log(extname)
    const mimetype = filetypes.test(file.mimetype);
    // console.log(file.mimetype)

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(createError("data harus jpg atau png atau video"));
    }
  },
});
