const nodemailer = require("nodemailer");

module.exports = {
  sendEmail(correo, asunto, mensaje) {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "combeneficios@gmail.com",
        pass: "imxfozzavjyusbpb",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    let MailOptions = {
      from: "Combeneficios",
      to: `${correo}`,
      subject: asunto,

      html: `
    ${mensaje}
            `,
    };

    transporter.sendMail(MailOptions, (error, info) => {
      if (error) {
        console.log(error.message);
      } else {
        console.log("email enviado");
      }
    });
  },
};
