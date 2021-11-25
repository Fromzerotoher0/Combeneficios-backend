const nodemailer = require("nodemailer");

exports.emailCorrecto = (req, res) => {
  let params = req.body;
  let to = req.body.correo;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "ander.er985@gmail.com",
      pass: "binwfeantflolezf",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  let MailOptions = {
    from: "forgot Your password",
    to: `${to}`,
    subject: params.asunto,

    html: `
            <p style='font-size:20px'><strong>Solicitud:</strong> ${params.asunto}</p>
            <p style='font-size:20px' ><strong>Nombre:</strong> ${params.nombre}</p>
            <p style='font-size:20px'><strong>Correo:</strong> ${params.correo}</p>
            <p style='font-size:20px'><strong>Telefono:</strong> ${params.telefono}</p>
            <p style='font-size:20px'><strong>Mensaje:</strong>  ${params.mensaje}</p>
            `,
  };

  transporter.sendMail(MailOptions, (error, info) => {
    if (error) {
      console.log(error.message);
      res.status(500).send(error.message);
    } else {
      console.log("email enviado");
      res.status(200).json(req.body);
    }
  });
};
