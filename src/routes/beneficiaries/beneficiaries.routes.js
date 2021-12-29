const { Router } = require("express");
const mercadopago = require("mercadopago");
const {
  register,
  cancelarCita,
  asistencia,
  calificar,
  historial,
  getCitas,
  agendarCita,
  cita,
} = require("./beneficiaresController");
const upload = require("../../middlewares/storage");
const router = Router();

//ruta para agregar un nuevo beneficiario
router.post("/register", upload.single("image"), register);
//ruta para obtener una cita por su id
router.post("/cita", cita);
//ruta para agendar una cita
router.post("/agendar", agendarCita);
//ruta para cancelar una cita
router.post("/cancelarCita", cancelarCita);
//ruta para confirmar la asistencia a una cita
router.post("/asistencia", asistencia);
//ruta para calificar una cita
router.post("/calificar", calificar);
//ruta para obtener el historial de citas de un usuario
router.post("/historial", historial);
//ruta para obtener las citas pendientes de un usuario
router.post("/citas", getCitas);
//mercadopago
router.post("/mercadopago", async (request, response) => {
  try {
    // Agrega credenciales
    mercadopago.configure({
      access_token:
        "TEST-6661206719455423-120915-5f6bfd42cb0d681dbdaf2f5b78d0d309-759574360",
    });

    let preference = {
      items: [
        {
          id: "agenda123",
          title: "agendamiento de cita",
          currency_id: "COP",
          unit_price: 3000,
          quantity: 1,
        },
      ],
      back_urls: {
        success: "http://45.63.109.10:4200/beneficiarios/notifications",
        failure: "http://45.63.109.10:4200/beneficiarios/notifications",
        pending: "http://45.63.109.10:4200/beneficiarios/notifications",
      },
      payment_methods: {
        excludex_payment_methods: [
          {
            id: "master",
          },
        ],
      },
      // notification_url: "https://45.63.109.10:7000/api/beneficiaries/mercadopago",
    };
    const response2 = await mercadopago.preferences.create(preference);
    const preferenceId = response2.body.id;
    response.send({ preferenceId });
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
