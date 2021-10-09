const { Router } = require("express");
const { login, register } = require("./authController");
const upload = require("../../middlewares/storage");
const router = Router();

router.post("/login", login);
router.post("/register", upload.single("image"), register);

module.exports = router;
