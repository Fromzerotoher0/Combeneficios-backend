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
  medicosstudies,
  agendarCita,
  getCitasMedico,
  getCitasUser,
  medicosCiudad,
  medicosByCiudad,
  cancelarCita,
  completarCita,
  userHistorial,
  calificar,
  asistencia,
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
//obtener pregrado de un medico
router.post("/medico/especializaciones", medicosstudies);
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
//agendar cita
router.post("/agendaCita", agendarCita);
//agenda de citas de un medicos getCitas
router.post("/citas", getCitasMedico);
//agenda de citas de un usuario
router.post("/citasUsuario", getCitasUser);
//cancelar cita - medico
router.post("/cancelarCita", cancelarCita);
//completar cita - medico
router.post("/completarCita", completarCita);
//obtener historial de citas de un usuario
router.post("/historial", userHistorial);
//calificar una cita
router.post("/calificar", calificar);
//verificar asistencia
router.post("/asistencia", asistencia);
