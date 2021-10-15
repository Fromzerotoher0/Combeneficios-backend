const { Router } = require("express");
const {
  getBeneficiariesController,
  updateUserController,
  getCiudadesController,
  getDepartamentosController,
  citaController,
  getUserController,
} = require("./usersController");

const router = Router();

//metodo para obtener los datos de un usuario
router.post("/user", getUserController);
//metodo para actualizar los datos de un usuario/beneficiario
router.put("/user", updateUserController);
//metodo para obtener los beneficiarios afiliados a un usuario
router.post("/beneficiaries", getBeneficiariesController);
//obtener listado de ciudades
router.post("/ciudades", getCiudadesController);
//obtener listado de departamentos
router.get("/departamentos", getDepartamentosController);
//agendar una cita
router.post("/cita", citaController);

module.exports = router;
