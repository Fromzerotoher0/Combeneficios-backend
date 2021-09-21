const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
//rutas de las vistas
router.get("/", (req, res) => {
  res.render("login");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

//metodos del controlador
router.post("/register", authController.register);
router.post("/login", authController.login);
module.exports = router;
