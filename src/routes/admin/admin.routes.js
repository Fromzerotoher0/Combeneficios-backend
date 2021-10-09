const { Router } = require("express");
const { aceptar, rechazar, solicitudes } = require("./adminController");
const { adminRole } = require("../../middlewares/jwtValidator");
const router = Router();

//listado de solicitudes para ser medico
router.get("/solicitud", adminRole, solicitudes);
//rechazar solicitud
router.post("/rechazar", adminRole, rechazar);
//aprobar solicitud
router.post("/aprobar", adminRole, aceptar);

module.exports = router;
