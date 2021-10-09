const { Router } = require("express");
const { aceptar, rechazar, solicitudes } = require("./adminController");
const router = Router();

//listado de solicitudes para ser medico
router.get("/solicitud", solicitudes);
//rechazar solicitud
router.post("/rechazar", rechazar);
//aprobar solicitud
router.post("/aprobar", aceptar);

module.exports = router;
