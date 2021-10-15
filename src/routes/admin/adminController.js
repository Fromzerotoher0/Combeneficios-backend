const connection = require("../../database/db");
const nodemailer = require("nodemailer");

//lista de solicitudes para ser medico
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
//aceptar solicitud para ser medico
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
//rechazar solicitud para ser medico
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
//lista de solicitudes para agregar especializacion a un medico
exports.solicitudesEstudio = async (req, res) => {
  connection.query(
    "SELECT * from solicitud_estudio inner join especializaciones e on e.id=solicitud_estudio.especializaciones_id where solicitud_estudio.estado = 'proceso'",
    function (error, results, fields) {
      if (error) throw error;
      res.status(200).json({
        results,
      });
    }
  );
};
//aceptar solicitud de estudio
exports.aceptarEstudio = async (req, res) => {
  const titulo = req.body.titulo;
  const users_id = req.body.users_id;
  const universidad = req.body.universidad;
  const tipo_estudio = 2;
  const medico_id = req.body.medico_id;
  const fecha_obtencion = req.body.fecha_obtencion;
  let to = "";
  let hora = new Date().getHours();
  let minuto = new Date().getMinutes();
  let segundo = new Date().getSeconds();
  let fecha = hora + ":" + minuto + ":" + segundo;
  let date = new Date().toISOString().split("T")[0];
  let fechaYHora = date + " " + fecha;

  connection.query(
    "select email from users inner join solicitud_estudio e on users.id = ?",
    [users_id],
    (error, results) => {
      to = results[0].email;
      connection.query(
        "insert into estudios set ?",
        {
          titulo: titulo,
          fecha_obtencion: fecha_obtencion,
          universidad: universidad,
          tipo_estudio: tipo_estudio,
          medico_id: medico_id,
          created_at: fechaYHora,
          updated_at: fechaYHora,
          estado: "activo",
        },
        (error, results) => {
          if (error === null) {
            connection.query(
              `UPDATE solicitud_estudio SET estado='aprobada'
                WHERE medico_id=?`,
              [medico_id],
              (error, results) => {
                console.log("aprobado");
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
                        <p style='font-size:20px'>felicidades su solicitud de especializacion ha sido <strong>Aprobada</strong></p>

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

            res.status(200).json({
              error: "false",
              msg: "solicitud aprobada",
            });
          } else {
            console.log(error);
          }
        }
      );
    }
  );
};
//rechazar solicitud de estudio
exports.rechazarEstudio = async (req, res) => {
  const medico_id = req.body.medico_id;
  const users_id = req.body.users_id;
  console.log(medico_id, users_id);

  connection.query(
    "select email from users inner join solicitud_estudio e on users.id = ?",
    [users_id],
    (error, results) => {
      to = results[0].email;
      connection.query(
        `UPDATE solicitud_estudio SET estado='rechazada'
          WHERE medico_id=?`,
        [medico_id],
        (error, results) => {
          console.log("rechazado");
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
                  <p style='font-size:20px'>lo sentimos su solicitud de especializacion ha sido <strong>Rechazada</strong></p>

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
    }
  );
};
