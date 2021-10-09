const connection = require("../../database/db");
const nodemailer = require("nodemailer");

exports.solicitudes = async (req, res) => {
  connection.query(
    "SELECT * from solicitud where estado = 'proceso'",
    function (error, results, fields) {
      if (error) throw error;
      res.status(200).json({
        results,
      });
    }
  );
};

exports.aceptar = async (req, res) => {
  const id = req.body.id;
  const modalidad = req.body.modalidad;
  const especializacion = req.body.especializaciones_id;
  const direccion = req.body.direccion;
  const to = req.body.correo;
  let hora = new Date().getHours();
  let minuto = new Date().getMinutes();
  let segundo = new Date().getSeconds();
  let fecha = hora + ":" + minuto + ":" + segundo;
  let date = new Date().toISOString().split("T")[0];
  let fechaYHora = date + " " + fecha;
  connection.query(
    `UPDATE solicitud SET estado='aprobada'
    WHERE users_id=?`,
    [id],
    (error, results) => {
      console.log("aprobado");
    }
  );

  connection.query(
    `UPDATE users SET tipo_usuario = 4
    WHERE id=?`,
    [id],
    (error, results) => {
      console.log("aprobado");
    }
  );

  connection.query(
    //insert del usuario en la base de datos
    "INSERT INTO medico SET ?",
    {
      users_id: id,
      direccion: direccion,
      modalidad_cita: modalidad,
      especializaciones_id: especializacion,
      created_at: fechaYHora,
      updated_at: fechaYHora,
      estado: "activo",
    },
    (error, results) => {}
  );

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "ander.er985@gmail.com",
      pass: "yfwlkdblonawxuap",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  let MailOptions = {
    from: "forgot Your password",
    to: `${to}`,
    subject: "solicitud aprobada",

    html: `
            <p style='font-size:20px'>felicidades su solicitud ha sido <strong>Aprobada</strong></p>

            `,
  };

  transporter.sendMail(MailOptions, (error, info) => {
    if (error) {
      res.status(500).send(error.message);
    } else {
      console.log("email enviado");
      res.status(200).json(req.body);
    }
  });
};
//rechazar solicitud
exports.rechazar = async (req, res) => {
  const id = req.body.id;
  const to = req.body.correo;
  connection.query(
    `UPDATE solicitud SET estado='rechazada'
    WHERE users_id=?`,
    [id],
    (error, results) => {
      res.status(200).json({
        msg: "actualizado",
      });
    }
  );
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "ander.er985@gmail.com",
      pass: "yfwlkdblonawxuap",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  let MailOptions = {
    from: "forgot Your password",
    to: `${to}`,
    subject: "solicitud rechazada",

    html: `
            <p style='font-size:20px'>lo sentimos pero su solicitud ha sido <strong>rechazada</strong></p>

            `,
  };

  transporter.sendMail(MailOptions, (error, info) => {
    if (error) {
      res.status(500).send(error.message);
    } else {
      console.log("email enviado");
      res.status(200).json(req.body);
    }
  });
};
