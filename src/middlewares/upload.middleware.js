const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + ".pdf");
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
    fileSize: 2 * 1024 * 1024 // 2MB max
  }
});

module.exports = upload;
