const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const mailController = require("../controllers/mailController");
const usersController = require("../controllers/usersController");
const beneficiariesController = require("../controllers/beneficiaresController");
const doctorsController = require("../controllers/doctorsController");
const upload = require("../middlewares/storage");
const { isAuthenticated, adminRole } = require("../middlewares/jwtValidator");
const { ciudades, departamentos } = require("../helpers/location");
const {
  solicitudes,
  rechazar,
  aceptar,
} = require("../controllers/adminController");

//metodo para iniciar sesion
router.post("/login", authController.login);
//metodo para registro , uso de middleware para obtener datos de un form data
router.post("/register", upload.single("image"), authController.register);
//metodo para cargar los municipios de un departamento
router.post("/ciudades", ciudades);
//metodo para obtener los departamentos de colombia
router.get("/departamentos", departamentos);
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

//metodo para solicitar ser medico
router.post("/solicitud", doctorsController.register);
//metodo para obtener los medicos registrados
router.get("/medicos", doctorsController.medicos);
//obtener los datos de un medico por su id
router.post("/medico", doctorsController.medicosById);
//obtener pregrado de un medico
router.post("/medico/estudios", doctorsController.medicosPregrade);
//obtener especializaciones de un medico
router.post(
  "/medico/especializacion",
  doctorsController.medicosEspecialization
);

//rutas de admin

//listado de solicitudes para ser medico
router.get("/solicitud", solicitudes);
//rechazar solicitud
router.post("/rechazar", rechazar);
//aprobar solicitud
router.post("/aprobar", aceptar);

//rutas de solicitudes
router.get("/especializaciones", doctorsController.especializaciones);

//exportacion de rutas
module.exports = router;
