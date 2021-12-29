const { Router } = require("express");
const upload = require("../../middlewares/storage");
const {
  register,
  especializaciones,
  medicosById,
  medicos,
  solicitudEstudio,
  universidades,
  agenda,
  agendaDisponible,
  agendaMedico,
  getCitasMedico,
  medicosCiudad,
  medicosByCiudad,
  cancelarCita,
  completarCita,
  especializacionesDisponibles,
  modalidad,
  estudios,
  pregrado,
  posgrado,
  tarifas,
} = require("./doctorsController");
const router = Router();

router.post("/solicitud", register);
//metodo para obtener los medicos registrados
router.get("/medicos", medicos);
//metodo para obtener los ciudades donde hay medicos
router.get("/medicosCiudad", medicosCiudad);
//metodo obtener los medicos por su ciudad
router.post("/medicosByCiudad", medicosByCiudad);
//obtener los datos de un medico por su id
router.post("/medico", medicosById);
//obtener los estudios realizados por un medico
router.post("/medico/especializaciones", estudios);
//obtener pregrado de un medico
router.post("/medico/estudios", pregrado);
//obtener las especializaciones de un medico
router.post("/medico/posgrado", posgrado);
//obtener todas las especializaciones disponibles
router.get("/especializacionDisponible", especializacionesDisponibles);
//obtener todas las especializaciones
router.get("/especializaciones", especializaciones);
//obtener las modalidades de un medico
router.post("/modalidad", modalidad);
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
//agenda de citas de un medicos
router.post("/citas", getCitasMedico);
//cancelar cita - medico
router.post("/cancelarCita", cancelarCita);
//completar cita - medico
router.post("/completarCita", completarCita);
//obtener el valor de las tarifas
router.post("/tarifas", tarifas);
