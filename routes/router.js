const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const mailController = require("../controllers/mailController");
const usersController = require("../controllers/usersController");
const beneficiariesController = require("../controllers/beneficiaresController");
const upload = require("../middlewares/storage");

//metodo para iniciar sesion
router.post("/login", authController.login);
//metodo para registro , uso de middleware para obtener datos de un form data
router.post("/register", upload.single("image"), authController.register);
//metodo para cargar los municipios de un departamento
router.post("/ciudades", authController.ciudades);
//metodo para obtener los departamentos de colombia
router.get("/departamentos", authController.departamentos);
//metodo para enviar un mail de contacto a la app
router.post("/mail", mailController.emailCorrecto);
//metodo para obtener los datos de un usuario
router.post("/user", usersController.getUser);
//metodo para actualizar los datos de un usuario/beneficiario
router.put("/user", usersController.updateUser);
//metodo para obtener los beneficiarios afiliados a un usuario
router.post("/beneficiaries", usersController.loadBeneficiaries);
//metodo para registrar un beneficiario
router.post(
  "/beneficiaries/register",
  upload.single("image"),
  beneficiariesController.register
);
//metodo para obtener los medicos registrados
router.get("/medicos", authController.medicos);

//exportacion de rutas
module.exports = router;
