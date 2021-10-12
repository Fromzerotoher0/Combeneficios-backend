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
  let medico_id = 1;
  let nombres = "";
  let apellidos = "";
  let documento = "";
  let imgUrl = "";
  let hora = new Date().getHours();
  let minuto = new Date().getMinutes();
  let segundo = new Date().getSeconds();
  let fecha = hora + ":" + minuto + ":" + segundo;
  let date = new Date().toISOString().split("T")[0];
  let fechaYHora = date + " " + fecha;

  connection.query(
    //insert del usuario en la base de datos
    "select * from medico where users_id = ?",
    [id],
    async (error, results) => {
      if (results.length > 0) {
        res.status(400).json({
          error: "true",
          msg: "este usuario ya es medico",
        });
      } else {
        connection.query(
          //insert del usuario en la base de datos
          "select nombres , apellidos ,imgUrl,nro_documento from users where id = ?",
          [id],
          async (error, results) => {
            nombres = results[0].nombres;
            apellidos = results[0].apellidos;
            imgUrl = results[0].imgUrl;
            documento = results[0].nro_documento;
            connection.query(
              //insert del usuario en la base de datos
              "INSERT INTO medico SET ?",
              {
                users_id: id,
                nombres: nombres,
                apellidos: apellidos,
                documento: documento,
                direccion: direccion,
                modalidad_cita: modalidad,
                imgUrl: imgUrl,
                especializaciones_id: especializacion,
                created_at: fechaYHora,
                updated_at: fechaYHora,
                estado: "activo",
              },
              (error, results) => {}
            );

            connection.query(
              `UPDATE solicitud SET estado='aprobada'
              WHERE users_id=?`,
              [id],
              (error, results) => {
                console.log("aprobado");
              }
            );

            ///xd
            connection.query(
              `UPDATE solicitud SET estado='aprobada'
              WHERE users_id=?`,
              [id],
              (error, results) => {
                console.log("aprobado");
              }
            );
            ///
            connection.query(
              //consulta para obtener el id del ultimo titular registrado y asignarselo
              "SELECT MAX(id) AS id FROM medico",
              async (error, results) => {
                console.log(results);
                if (results[0].id === null) {
                  medico_id = 1;
                  connection.query(
                    //insertar solicitud en la base de datos
                    "INSERT INTO estudios SET ?",
                    {
                      medico_id: 1,
                      titulo: "medicina",
                      tipo_estudio: 1,
                      created_at: fechaYHora,
                      updated_at: fechaYHora,
                    },
                    (error, results) => {
                      if (error) {
                        res.status(400).json({
                          error: "true",
                          msg: error.message,
                        });
                      } else {
                        res.status(200).json({
                          error: "false",
                          msg: "solicitud creada",
                        });
                      }
                    }
                  );
                } else {
                  medico_id = results[0].id;
                  console.log(medico_id);
                  connection.query(
                    //insertar solicitud en la base de datos
                    "INSERT INTO estudios SET ?",
                    {
                      medico_id: medico_id,
                      titulo: "medicina",
                      tipo_estudio: 1,
                      fecha_obtencion: fechaYHora,
                      created_at: fechaYHora,
                      updated_at: fechaYHora,
                      estado: "activo",
                    },
                    (error, results) => {
                      if (error) {
                        res.status(400).json({
                          error: "true",
                          msg: error.message,
                        });
                      } else {
                        connection.query(
                          `UPDATE users SET tipo_usuario = 4
                          WHERE id=?`,
                          [id],
                          (error, results) => {
                            console.log("aprobado");
                          }
                        );
                        res.status(200).json({
                          error: "false",
                          msg: "solicitud creada",
                        });
                      }
                    }
                  );
                }
              }
            );
          }
        );
      }
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
