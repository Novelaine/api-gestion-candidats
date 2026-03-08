const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb){
    cb(null, "uploads/");
  },
  filename: function (req, file, cb){
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + ext;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  if(file.mimetype === "application/pdf"){
    cb(null, true);
  }else{
    cb(new Error("Seuls les PDF sont autorisés"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { 
    fileSize: 5 * 1024 * 1024 // 5MB max
  }
});

module.exports = upload;
