const { Router } = require("express");
const {
  register,
  especializaciones,
  medicosById,
  medicosEspecialization,
  medicosPregrade,
  medicos,
} = require("./doctorsController");
const router = Router();

router.post("/solicitud", register);
//metodo para obtener los medicos registrados
router.get("/medicos", medicos);
//obtener los datos de un medico por su id
router.post("/medico", medicosById);
//obtener pregrado de un medico
router.post("/medico/estudios", medicosPregrade);
//obtener especializaciones de un medico
router.post("/medico/especializacion", medicosEspecialization);
//rutas de solicitudes
router.get("/especializaciones", especializaciones);

module.exports = router;
