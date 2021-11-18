const router = require("express").Router();
const admin = require("./admin/admin.routes");
const auth = require("./auth/auth.routes");
const beneficiaries = require("./beneficiaries/beneficiaries.routes");
const doctors = require("./doctors/doctors.routes");
const mail = require("./mail/mail.routes");
const users = require("./users/users.routes");
const notifications = require("../helpers/notifications");
let pushSubscription;

router.use("/admin", admin);
router.use("/auth", auth);
router.use("/beneficiaries", beneficiaries);
router.use("/doctors", doctors);
router.use("/mail", mail);
router.use("/users", users);
// router.post("/subscription", async (req, res) => {
//   pushSubscription = req.body;
//   res.status(200).json();
// });
// router.post("/new-message", async (req, res) => {
//   const { message } = req.body;
//   console.log(req.body);
//   const payload = JSON.stringify({
//     title: "Combeneficios",
//     message: `${message}`,
//   });

//   try {
//     await notifications.sendNotification(pushSubscription, payload);
//   } catch (error) {
//     console.log(error);
//   }
// });
module.exports = router;
