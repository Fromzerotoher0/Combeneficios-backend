const connection = require("../../database/db");
const nodemailer = require("nodemailer");

module.exports = {
  register(
    asunto,
    modalidad,
    direccion,
    users_id,
    fechaYHora,
    universidad,
    departamento,
    ciudad
  ) {
    return new Promise(async (resolve, reject) => {
      let nombres = "";
      let apellidos = "";
      let documento = "";
      let correo = "";
      let departamento_string = "";

      connection.query(
        "select * from medico where users_id = ?",
        [users_id],
        async (error, results) => {
          if (results.length > 0) {
            reject(
              new Error("un medico no puede hacer este tipo de solicitud")
            );
          } else {
            connection.query(
              //consulta para obtener el nombre del departamento por medio de su id
              "SELECT departamento from departamentos d where id_departamento = ?",
              [departamento],
              async (error, results) => {
                departamento_string = results[0].departamento;
              }
            );
            connection.query(
              "SELECT * FROM solicitud where users_id = ? and estado ='proceso'",
              [users_id],
              async (error, results) => {
                if (results.length > 0) {
                  reject(
                    new Error("solo puede tener una solicitud en proceso")
                  );
                } else {
                  connection.query(
                    "SELECT * FROM users where id = ?",
                    [users_id],
                    async (error, results) => {
                      if (results.length > 0) {
                        nombres = results[0].nombres;
                        apellidos = results[0].apellidos;
                        documento = results[0].nro_documento;
                        correo = results[0].email;
                        connection.query(
                          //insertar solicitud en la base de datos
                          "INSERT INTO solicitud SET ?",
                          {
                            nombres: nombres,
                            apellidos: apellidos,
                            documento: documento,
                            asunto: asunto,
                            modalidad: modalidad,
                            direccion: direccion,
                            users_id: users_id,
                            universidad: universidad,
                            departamento: departamento_string,
                            ciudad: ciudad,
                            especializaciones_id: 1,
                            correo: correo,
                            created_at: fechaYHora,
                            updated_at: fechaYHora,
                            estado: "proceso",
                          },
                          (error, results) => {
                            if (error) {
                              reject(error);
                            } else {
                              resolve("solicitud creada");
                            }
                          }
                        );
                      } else {
                        reject(new Error("este usuario no existe"));
                      }
                    }
                  );
                }
              }
            );
          }
        }
      );
    });
  },

  getMedicos() {
    return new Promise(async (resolve, result) => {
      connection.query(
        `
        SELECT count(a.medico_id) as consultas,m.*, descripcion ,AVG(c.calificacion) as calificacion 
        from agenda a 
        LEFT join Calificacion c on c.medico_id = a.medico_id 
        right join medico m on m.id = a.medico_id 
        inner join especializaciones e on e.id=m.especializaciones_id 
        where a.estado = 'completada' or a.estado is null
        GROUP by m.nombres
        `,
        function (error, results, fields) {
          console.log(results);
          if (error == null) {
            resolve(results);
          } else {
            reject(error);
          }
        }
      );
    });
  },

  getMedicoById(id) {
    console.log(id);
    return new Promise(async (resolve, reject) => {
      connection.query(
        `
        SELECT count(a.medico_id) as consultas,m.*, descripcion ,AVG(c.calificacion) as calificacion 
        from agenda a 
        LEFT join Calificacion c on c.medico_id = ?
        right join medico m on m.id = ?
        inner join especializaciones e on e.id=m.especializaciones_id 
        where a.estado = 'completada' and a.medico_id = ?
        `,
        [id, id, id],
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

  getMedicoByCiudad(ciudad) {
    let date = new Date().toISOString().split("T")[0];
    return new Promise(async (resolve, reject) => {
      connection.query(
        "SELECT  medico.id , medico.imgUrl , medico.nombres , medico.apellidos , descripcion from medico inner join especializaciones e on e.id=medico.especializaciones_id where ciudad = ?",
        [ciudad],
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

  getMedicosStudies(id) {
    return new Promise(async (resolve, reject) => {
      connection.query(
        "select * from medico where users_id = ?",
        [id],
        function (error, results) {
          connection.query(
            "SELECT * from estudios where medico_id = ?",
            [results[0].id],
            function (error, results, fields) {
              if (error == null) {
                resolve(results);
              } else {
                reject(error);
              }
            }
          );
        }
      );
    });
  },

  getMedicosPregrade(id) {
    return new Promise(async (resolve, reject) => {
      connection.query(
        "SELECT * from estudios where medico_id = ? and tipo_estudio = 1",
        [id],
        function (error, results, fields) {
          if (error == null) {
            resolve(results);
          } else {
            reject(error);
          }
        }
      );
    });
  },

  getMedicosEspecialization(id) {
    console.log(id);
    return new Promise(async (resolve, reject) => {
      connection.query(
        "SELECT * from estudios where medico_id = ? and tipo_estudio = 2",
        [id],
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

  getEspecializations() {
    return new Promise(async (resolve, reject) => {
      connection.query(
        "SELECT * from especializaciones",
        function (error, results, fields) {
          if (error == null) {
            resolve(results);
          } else {
            reject(error);
          }
        }
      );
    });
  },

  solicitudEstudio(
    universidad,
    medico_id,
    fecha_obtencion,
    especializaciones_id,
    imgUrl,
    fechaYHora
  ) {
    let nombres = "";
    let apellidos = "";
    let documentos = "";
    return new Promise(async (resolve, reject) => {
      connection.query(
        "select id from medico where users_id = ?",
        [medico_id],
        async (error, results) => {
          console.log(results[0].id);
          connection.query(
            "select * from solicitud_estudio where medico_id = ?",
            [results[0].id],
            async (error, results) => {
              console.log(results);
              console.log(results.length);
              if (results.length < 1) {
                connection.query(
                  "SELECT medico.id , medico.nombres , medico.apellidos,medico.documento FROM medico INNER JOIN users ON medico.users_id = ?",
                  [medico_id],
                  async (error, results) => {
                    id = results[0].id;
                    nombres = results[0].nombres;
                    apellidos = results[0].apellidos;
                    documento = results[0].documento;
                    console.log(id);
                    connection.query(
                      "INSERT INTO solicitud_estudio set ?",
                      {
                        users_id: medico_id,
                        nombres: nombres,
                        apellidos: apellidos,
                        documento: documento,
                        medico_id: id,
                        especializaciones_id: especializaciones_id,
                        imgUrl: imgUrl,
                        universidad: universidad,
                        fecha_obtencion: fecha_obtencion,
                        created_at: fechaYHora,
                        updated_at: fechaYHora,
                        estado: "proceso",
                      },
                      (error, results) => {
                        if (error == null) {
                          resolve("solicitud enviada");
                        } else {
                          reject(error);
                        }
                      }
                    );
                  }
                );
              } else {
                reject(
                  new Error(
                    "solo se puede hacer una solicitud de especializacion a la vez"
                  )
                );
              }
            }
          );
        }
      );
    });
  },

  getUniversidades() {
    return new Promise(async (resolve, reject) => {
      connection.query(
        "SELECT * from universidades",
        function (error, results, fields) {
          if (error == null) {
            resolve(results);
          } else {
            reject(error);
          }
        }
      );
    });
  },

  agenda(fecha_cita, hora_cita, medico_id, tarifa, especialidad, fechaYHora) {
    return new Promise(async (resolve, reject) => {
      connection.query(
        "SELECT medico.id FROM medico where medico.users_id = ? ",
        [medico_id],
        (error, result) => {
          if (especialidad === "medicina") {
            especialidad = "medicina general";
            medico_id = result[0].id;
            connection.query(
              "insert into agenda set ?",
              {
                fecha: fecha_cita,
                hora: hora_cita,
                especialidad: especialidad,
                medico_id: medico_id,
                tarifa: tarifa,
                created_at: fechaYHora,
                updated_at: fechaYHora,
                estado: "activo",
              },
              (error, results) => {
                if (error == null) {
                  resolve("agregado a la agenda");
                } else {
                  reject(error);
                }
              }
            );
          } else {
            medico_id = result[0].id;
            connection.query(
              "insert into agenda set ?",
              {
                fecha: fecha_cita,
                hora: hora_cita,
                especialidad: especialidad,
                medico_id: medico_id,
                tarifa: tarifa,
                created_at: fechaYHora,
                updated_at: fechaYHora,
                estado: "activo",
              },
              (error, results) => {
                if (error == null) {
                  resolve("agregado a la agenda");
                } else {
                  reject(error);
                }
              }
            );
          }
        }
      );
    });
  },

  getAgenda() {
    return new Promise(async (resolve, reject) => {
      connection.query("SELECT * from agenda", function (error, results) {
        if (error == null) {
          console.log(results);
          resolve(results);
        } else {
          reject(error);
        }
      });
    });
  },
  //Lasst
  getAgendaMedico(medico_id) {
    let date = new Date().toISOString().split("T")[0];
    console.log(date);
    return new Promise(async (resolve, reject) => {
      connection.query(
        "SELECT * from agenda where agenda.estado ='activo' and medico_id = ?",
        [medico_id],
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
  agendarCita(agenda, beneficiario, fecha, medico_id) {
    return new Promise(async (resolve, reject) => {
      connection.query(
        "insert into cita set ?",
        {
          agenda_id: agenda,
          beneficiario_id: beneficiario,
          medico_id: medico_id,
          created_at: fecha,
          updated_at: fecha,
          estado: "activo",
        },
        async (error, result) => {
          if (error == null) {
            connection.query(
              "UPDATE agenda SET estado = 'agendada' WHERE id = ?",
              [agenda],
              async (error, result) => {
                resolve("cita agendada");
              }
            );
            connection.query(
              "SELECT email from users where id = ?",
              [beneficiario],
              function (error, results) {
                to = results[0].email;
                if (error == null) {
                  connection.query(
                    "SELECT * from agenda where id = ?",
                    [agenda],
                    function (error, results) {
                      const transporter = nodemailer.createTransport({
                        host: "smtp.gmail.com",
                        port: 465,
                        secure: true,
                        auth: {
                          user: "ander.er985@gmail.com",
                          pass: "hhmtxqbnxucaxptx",
                        },
                        tls: {
                          rejectUnauthorized: false,
                        },
                      });
                      let MailOptions = {
                        from: "forgot Your password",
                        to: `${to}`,
                        subject: "Cita Agendada",

                        html: `
                                    <p style='font-size:20px'>Cita Agendada</p>
                                    <p style='font-size:20px'>fecha : ${results[0].fecha}</p>
                                    <p style='font-size:20px'>fecha : ${results[0].hora}</p>

                                  
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
                    }
                  );
                } else {
                  reject(error);
                }
              }
            );
          } else {
            reject(error);
          }
        }
      );
    });
  },

  //obtener la agenda de citas de un medico
  getCitasMedico(user) {
    return new Promise(async (resolve, reject) => {
      let date = new Date().toISOString().split("T")[0];
      connection.query(
        "select * from medico where users_id = ?",
        [user],
        async (error, result) => {
          connection.query(
            "SELECT a.fecha , a.hora , a.especialidad , c.beneficiario_id ,c.agenda_id, u.nombres , u.apellidos , u.email  FROM agenda a inner join cita c on c.agenda_id = a.id inner join users u on u.id = c.beneficiario_id where a.fecha > ? and c.medico_id = ? and a.estado = 'agendada' ORDER by a.fecha",
            [date, result[0].id],
            function (error, result) {
              if (error == null) {
                console.log(result);
                resolve(result);
              } else {
                reject(error);
              }
            }
          );
        }
      );
    });
  },

  //obtener las citas de un usuario
  getCitasUser(user) {
    return new Promise(async (resolve, reject) => {
      connection.query(
        "select a.* , m.nombres , m.apellidos from agenda a inner join cita c on a.id = c.agenda_id inner join medico m on m.id = c.medico_id where c.beneficiario_id = ? and a.estado = 'agendada'",
        [user],
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

  getCiudadMedicos() {
    return new Promise(async (resolve, result) => {
      connection.query(
        "SELECT DISTINCT ciudad FROM medico",
        function (error, results, fields) {
          console.log(results);
          if (error == null) {
            resolve(results);
          } else {
            reject(error);
          }
        }
      );
    });
  },

  cancelarCita(id, email) {
    console.log(id);
    return new Promise(async (resolve, reject) => {
      connection.query(
        `UPDATE agenda SET estado='cancelada'
            WHERE id=?`,
        [id],
        (error, results) => {
          resolve(results);
          const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
              user: "ander.er985@gmail.com",
              pass: "hhmtxqbnxucaxptx",
            },
            tls: {
              rejectUnauthorized: false,
            },
          });
          let MailOptions = {
            from: "forgot Your password",
            to: `${email}`,
            subject: "cita cancelada",

            html: `
                        <p style='font-size:20px'>lo sentimos pero su cita ha sido cancelada</p>
            
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

  completarCita(id) {
    return new Promise(async (resolve, reject) => {
      connection.query(
        `UPDATE agenda SET estado='completada'
            WHERE id=?`,
        [id],
        (error, results) => {
          resolve(results);
        }
      );
    });
  },
};
