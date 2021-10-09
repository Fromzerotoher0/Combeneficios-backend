const { Router } = require("express");
const { emailCorrecto } = require("./mailController");
const router = Router();

//metodo para enviar un mail de contacto a la app
router.post("/", emailCorrecto);

module.exports = router;
