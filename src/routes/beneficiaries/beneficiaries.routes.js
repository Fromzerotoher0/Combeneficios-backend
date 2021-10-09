const { Router } = require("express");
const { register } = require("./beneficiaresController");
const upload = require("../../middlewares/storage");
const router = Router();

router.post("/beneficiaries/register", upload.single("image"), register);
module.exports = router;
