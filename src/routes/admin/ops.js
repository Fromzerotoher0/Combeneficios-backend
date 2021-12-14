const connection = require("../../database/db");
const nodemailer = require("nodemailer");
const { sendEmail } = require("../../helpers/sendEmail");

module.exports = {
  getSolicitudes() {
    return new Promise(async (resolve, reject) => {
      connection.query(
        "SELECT * from solicitud where estado = 'proceso'",
        function (error, results) {
          if (error == null) {
            resolve(results);
          } else {
            reject(error);
          }
        }
      );
    });
  },

  aprobarSolicitud(
    id,
    modalidad,
    especializacion,
    direccion,
    to,
    fechaYHora,
    universidad,
    departamento,
    ciudad
  ) {
    return new Promise(async (resolve, reject) => {
      console.log(universidad);
      let medico_id = 1;
      let nombres = "";
      let apellidos = "";
      let documento = "";
      let imgUrl = "";
      connection.query(
        //insert del usuario en la base de datos
        "select * from medico where users_id = ?",
        [id],
        async (error, results) => {
          console.log(to);
          if (results.length > 0) {
            reject(new Error("este usuario ya es medico"));
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
                    departamento: departamento,
                    ciudad: ciudad,
                    especializaciones_id: especializacion,
                    created_at: fechaYHora,
                    updated_at: fechaYHora,
                    estado: "activo",
                  },
                  (error, results) => {
                    if (error) {
                      reject(error);
                    }
                  }
                );

                connection.query(
                  `UPDATE solicitud SET estado='aprobada'
                  WHERE users_id=?`,
                  [id],
                  (error, results) => {
                    if (error) {
                      reject(error);
                    }
                  }
                );
                ///
                connection.query(
                  //consulta para obtener el id del ultimo titular registrado y asignarselo
                  "SELECT MAX(id) AS id FROM medico",
                  async (error, results) => {
                    if (results[0].id === null) {
                      medico_id = 1;
                      connection.query(
                        //insertar solicitud en la base de datos
                        "INSERT INTO estudios SET ?",
                        {
                          medico_id: 1,
                          titulo: "medicina",
                          tipo_estudio: 1,
                          universidad: universidad,
                          created_at: fechaYHora,
                          updated_at: fechaYHora,
                        },
                        (error, results) => {
                          if (error) {
                            reject(error);
                          } else {
                            resolve(results);
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
                          universidad: universidad,
                          fecha_obtencion: fechaYHora,
                          created_at: fechaYHora,
                          updated_at: fechaYHora,
                          estado: "activo",
                        },
                        (error, results) => {
                          if (error) {
                            reject(error);
                          } else {
                            connection.query(
                              //insert del usuario en la base de datos
                              "INSERT INTO agenda SET ?",
                              {
                                fecha: "0000-00-00",
                                hora: "12:30 AM",
                                especialidad: 1,
                                medico_id: medico_id,
                                tarifa: 12345,
                                created_at: fechaYHora,
                                updated_at: fechaYHora,
                                estado: "completada",
                              },
                              async (error, results) => {
                                connection.query(
                                  //insert del usuario en la base de datos
                                  "SELECT MAX(a.id) as agenda_id , MAX(m.id) AS medico_id FROM agenda a , medico m",
                                  async (error, results) => {
                                    connection.query(
                                      //insert del usuario en la base de datos
                                      "INSERT INTO cita SET ?",
                                      {
                                        agenda_id: results[0].agenda_id,
                                        beneficiario_id: 1,
                                        medico_id: results[0].medico_id,
                                        calificacion: "",
                                        created_at: fechaYHora,
                                        updated_at: fechaYHora,
                                        estado: "completada",
                                      },
                                      async (error, results) => {}
                                    );
                                  }
                                );
                              }
                            );

                            connection.query(
                              `UPDATE users SET tipo_usuario = 4
                              WHERE id=?`,
                              [id],
                              (error, results) => {
                                if (error) {
                                  reject(error);
                                }
                              }
                            );
                            resolve(results);
                          }
                        }
                      );
                    }
                  }
                );
              }
            );
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
              from: "forgot Your password",
              to: `${to}`,
              subject: "solicitud aprobada",

              html: `
                          <p style='font-size:20px'>felicidades su solicitud  ha sido <strong>Aprobada</strong></p>
  
                          `,
            };

            transporter.sendMail(MailOptions, (error, info) => {
              if (error) {
                reject(error);
              } else {
                console.log("email enviado");
              }
            });
          }
        }
      );
    });
  },

  rechazarSolicitud(id, to) {
    return new Promise(async (resolve, reject) => {
      connection.query(
        `UPDATE solicitud SET estado='rechazada'
            WHERE users_id=?`,
        [id],
        (error, results) => {
          resolve(results);
        }
      );
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
        from: "forgot Your password",
        to: `${to}`,
        subject: "solicitud rechazada",

        html: `
                    <p style='font-size:20px'>lo sentimos pero su solicitud ha sido <strong>rechazada</strong></p>
        
                    `,
      };

      transporter.sendMail(MailOptions, (error, info) => {
        if (error) {
          reject(error);
        } else {
          console.log("email enviado");
        }
      });
    });
  },

  SolicitudesEspecializacion() {
    return new Promise(async (resolve, reject) => {
      connection.query(
        "SELECT * from solicitud_estudio inner join especializaciones e on e.id=solicitud_estudio.especializaciones_id where solicitud_estudio.estado = 'proceso'",
        function (error, results) {
          if (error == null) {
            resolve(results);
          } else {
            reject(error);
          }
        }
      );
    });
  },
  aceptarEspecializacion(
    titulo,
    users_id,
    universidad,
    tipo_estudio,
    medico_id,
    fecha_obtencion,
    fechaYHora,
    especializacion
  ) {
    return new Promise(async (resolve, reject) => {
      let to = "";
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
                  [medico_id]
                );

                connection.query(
                  `UPDATE medico SET especializaciones_id=${especializacion} WHERE id=${medico_id}`,
                  (error, results) => {
                    if (error == null) {
                      resolve(results);
                    } else {
                      reject(error);
                    }
                  }
                );

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
                  from: "forgot Your password",
                  to: `${to}`,
                  subject: "solicitud aprobada",

                  html: `
                                <p style='font-size:20px'>felicidades su solicitud de especializacion ha sido <strong>Aprobada</strong></p>
        
                                `,
                };

                transporter.sendMail(MailOptions, (error, info) => {
                  if (error) {
                    reject(error);
                  } else {
                    console.log("email enviado");
                    res.status(200).json(req.body);
                  }
                });
              } else {
                reject(error);
              }
            }
          );
        }
      );
    });
  },
  rechazarEspecializacion(medico_id, users_id) {
    return new Promise(async (resolve, reject) => {
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
              resolve(results);
            }
          );
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
            from: "forgot Your password",
            to: `${to}`,
            subject: "solicitud aprobada",

            html: `
                          <p style='font-size:20px'>lo sentimos su solicitud de especializacion ha sido <strong>Rechazada</strong></p>
        
                          `,
          };

          transporter.sendMail(MailOptions, (error, info) => {
            if (error) {
              reject(error);
            } else {
              console.log("email enviado");
            }
          });
        }
      );
    });
  },

  //restaurantes

  getSolicitudesRestaurantes() {
    return new Promise(async (resolve, reject) => {
      connection.query(
        "SELECT * from solicitud_restaurante where estado = 'proceso'",
        function (error, results) {
          if (error == null) {
            resolve(results);
          } else {
            reject(error);
          }
        }
      );
    });
  },
  aprobarSolicitudRestaurante(
    id,
    titular_id,
    nombre,
    especialidad,
    direccion,
    ciudad,
    fecha
  ) {
    return new Promise(async (resolve, reject) => {
      let to;
      connection.query(
        "select email from users where id = ?",
        [titular_id],
        async (error, results) => {
          to = results[0].email;
          connection.query(
            "insert into Restaurante set ?",
            {
              titular_id: titular_id,
              nombre: nombre,
              especialidad: especialidad,
              direccion: direccion,
              ciudad: ciudad,
              created_at: fecha,
              updated_at: fecha,
              estado: "activo",
            },
            async (error, results) => {
              connection.query(
                "UPDATE solicitud_restaurante SET estado='aprobada' WHERE id=?",
                [id],
                async (error, results) => {
                  if (error == null) {
                    resolve("solicitud aprobada");
                    sendEmail(
                      to,
                      "solicitud aprobada",
                      `
                    <h1>Solicitud aprobada</h1>
                    <h2>su restaurante ha quedado registro en combeneficios</h2>
                    <h2>gracias por confiar en nosotros</h2>
                    `
                    );
                  } else {
                    reject(error);
                  }
                }
              );
            }
          );
        }
      );
    });
  },
  rechazarSolicitudRestaurante(id, titular_id) {
    return new Promise(async (resolve, reject) => {
      connection.query(
        "select email from users where id = ?",
        [titular_id],
        async (error, results) => {
          let to = results[0].email;
          connection.query(
            "UPDATE solicitud_restaurante SET estado='rechazada' WHERE id = ? ",
            [id],
            async (error, results) => {
              sendEmail(
                to,
                "solicitud rechazada",
                `
              <h1>Solicitud rechazada</h1>
              <h2>lo sentimos pero su solicitud ha sido <strong>rechazada</strong></h2>
              `
              );
              resolve("solicitud rechazada");
            }
          );
        }
      );
    });
  },
};
