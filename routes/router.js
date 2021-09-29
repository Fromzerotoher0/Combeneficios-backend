const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const mailController = require("../controllers/mailController");
const usersController = require("../controllers/usersController");
//rutas de las vistas
router.get("/home", authController.isAuthenticated, (req, res) => {
  res.render("index");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

//metodos del controlador
router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/ciudades", authController.ciudades);
router.get("/departamentos", authController.departamentos);
router.post("/mail", mailController.emailCorrecto);
router.post("/user", usersController.getUser);
router.put("/user", usersController.updateUser);
router.post("/beneficiaries", usersController.loadBeneficiaries);
module.exports = router;
