const { Router } = require("express");
const {
  aceptar,
  rechazar,
  solicitudes,
  solicitudesEstudio,
  aceptarEstudio,
} = require("./adminController");
const { adminRole } = require("../../middlewares/jwtValidator");
const upload = require("../../middlewares/storage");
const router = Router();

//listado de solicitudes para ser medico
router.get("/solicitud", adminRole, solicitudes);
//rechazar solicitud
router.post("/rechazar", adminRole, rechazar);
//aprobar solicitud
router.post("/aprobar", adminRole, aceptar);
//lista de solicitudes de especializacion
router.get("/solicitudEstudio", adminRole, solicitudesEstudio);
//aceptar solicitud de especializacion
router.post("/aceptarEstudio", adminRole, aceptarEstudio);

module.exports = router;
