const { Router } = require("express");
const {
  register,
  cancelarCita,
  asistencia,
  calificar,
  historial,
  getCitas,
  agendarCita,
} = require("./beneficiaresController");
const upload = require("../../middlewares/storage");
const router = Router();

//ruta para agregar un nuevo beneficiario
router.post("/register", upload.single("image"), register);
//ruta para agendar una cita
router.post("/agendar", agendarCita);
//ruta para cancelar una cita
router.post("/cancelarCita", cancelarCita);
//ruta para confirmar la asistencia a una cita
router.post("/asistencia", asistencia);
//ruta para calificar una cita
router.post("/calificar", calificar);
//ruta para obtener el historial de citas de un usuario
router.post("/historial", historial);
//ruta para obtener las citas pendientes de un usuario
router.post("/citas", getCitas);
module.exports = router;
