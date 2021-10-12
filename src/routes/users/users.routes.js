const { Router } = require("express");
const {
  getUser,
  loadBeneficiaries,
  updateUser,
  ciudades,
  departamentos,
} = require("./usersController");
const router = Router();

//metodo para obtener los datos de un usuario
router.post("/user", getUser);
//metodo para actualizar los datos de un usuario/beneficiario
router.put("/user", updateUser);
//metodo para obtener los beneficiarios afiliados a un usuario
router.post("/beneficiaries", loadBeneficiaries);
//obtener listado de ciudades
router.post("/ciudades", ciudades);
//obtener listado de departamentos
router.get("/departamentos", departamentos);

module.exports = router;
