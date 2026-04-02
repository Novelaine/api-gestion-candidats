const express = require('express');
const router = express.Router();
const controller = require('../controllers/candidats.controller');
const upload = require("../middlewares/upload.middleware");

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
//router.post('/', upload.single("cv"), controller.create);
//router.post('/', controller.create);
router.post("/", (req, res) => {

  upload.single("cv")(req, res, function (err) {

    if (err) {

      // erreur Multer
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ message: "Fichier trop volumineux (max 2MB)" });
      }

      if (err.message === "Seuls les PDF sont autorisés") {
        return res.status(400).json({ message: err.message });
      }

      return res.status(500).json({ message: "Erreur upload fichier" });
    }

    // si pas d'erreur → controller
    controller.create(req, res);

  });

});
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);


module.exports = router;
