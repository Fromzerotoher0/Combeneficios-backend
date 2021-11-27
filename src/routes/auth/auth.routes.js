const { Router } = require("express");
const { login, register, forgot } = require("./authController");
const upload = require("../../middlewares/storage");
const router = Router();

router.post("/login", login);
router.post("/register", upload.single("image"), register);
router.post("/forgot", forgot);

module.exports = router;
