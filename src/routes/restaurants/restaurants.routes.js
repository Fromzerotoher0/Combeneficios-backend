const { Router } = require("express");
const upload = require("../../middlewares/storage");
const {
  registerController,
  addProductController,
} = require("./restaurants.controller");
const router = Router();
//metodo para hacer una solicitud para registrar un restaurante
router.post("/register", registerController);
//metodo para agregar un producto al menu de un restaurante
router.post("/add", upload.single("image"), addProductController);
module.exports = router;
