const { Router } = require("express");
const upload = require("../../middlewares/storage");
const {
  registerController,
  addProductController,
  createOrderController,
  orderDetailsController,
  acceptOrderController,
  rejectOrderController,
} = require("./restaurants.controller");
const router = Router();
//metodo para hacer una solicitud para registrar un restaurante
router.post("/register", registerController);
//metodo para agregar un producto al menu de un restaurante
router.post("/add", upload.single("image"), addProductController);
//metodo para crear una orden
router.post("/order", createOrderController);
//metodo para aceptar una orden
router.post("/accept", acceptOrderController);
//metodo para rechazar una orden
router.post("/reject", rejectOrderController);
//metodo para añadir detalles a una orden
router.post("/details", orderDetailsController);
module.exports = router;
