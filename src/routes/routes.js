const router = require("express").Router();
const admin = require("./admin/admin.routes");
const auth = require("./auth/auth.routes");
const beneficiaries = require("./beneficiaries/beneficiaries.routes");
const doctors = require("./doctors/doctors.routes");
const mail = require("./mail/mail.routes");
const users = require("./users/users.routes");

router.use("/admin", admin);
router.use("/auth", auth);
router.use("/beneficiaries", beneficiaries);
router.use("/doctors", doctors);
router.use("/mail", mail);
router.use("/users", users);

module.exports = router;
