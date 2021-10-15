const { Router } = require("express");
const upload = require("../../middlewares/storage");
const {
  register,
  especializaciones,
  medicosById,
  medicosEspecialization,
  medicosPregrade,
  medicos,
  solicitudEstudio,
  universidades,
  agenda,
  agendaDisponible,
  agendaMedico,
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
//obtener todas las especializaciones
router.get("/especializaciones", especializaciones);
//solicitud para añadir una especializacion a un medico
router.post(
  "/medico/agregarEspecializacion",
  upload.single("image"),
  solicitudEstudio
);
//lista de universidades
router.get("/universidades", universidades);
//añadir una cita a la agenda
router.post("/agenda", agenda);
module.exports = router;
//listado de citas disponibles
router.get("/agenda", agendaDisponible);
//Listado de citas de un medico
router.post("/agendaMedico", agendaMedico);
