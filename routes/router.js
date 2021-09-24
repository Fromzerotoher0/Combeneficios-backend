const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
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
module.exports = router;
