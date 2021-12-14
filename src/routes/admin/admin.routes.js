const { Router } = require("express");
const {
  aceptar,
  rechazar,
  solicitudes,
  solicitudesEstudio,
  aceptarEstudio,
  rechazarEstudio,
  solicitudesRestaurante,
  aprobarRestaurante,
  rechazarRestaurante,
} = require("./adminController");
const { adminRole } = require("../../middlewares/jwtValidator");
const router = Router();

//listado de solicitudes para ser medico
router.get("/solicitud", adminRole, solicitudes);
//rechazar solicitud
router.post("/rechazar", rechazar);
//aprobar solicitud
router.post("/aprobar", adminRole, aceptar);
//lista de solicitudes de especializacion
router.get("/solicitudEstudio", adminRole, solicitudesEstudio);
//aceptar solicitud de especializacion
router.post("/aceptarEstudio", aceptarEstudio);
//rechazar solicitud de especializacion
router.post("/rechazarEstudio", rechazarEstudio);
//listado de solicitudes para restaurantes
router.get("/restaurantes", solicitudesRestaurante);
//aprobar solicitud de restaurante
router.post("/aprobarRestaurante", aprobarRestaurante);
//rechazar solicitud de restaurante
router.post("/rechazarRestaurante", rechazarRestaurante);

module.exports = router;
