const express = require('express');
const router = express.Router();
const controller = require('../controllers/candidats.controller');
const upload = require("../middlewares/upload.middleware");

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', upload.single("cv"), controller.create);
//router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);


module.exports = router;
