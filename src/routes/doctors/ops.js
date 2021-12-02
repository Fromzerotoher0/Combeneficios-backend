const connection = require("../../database/db");
const { sendEmail } = require("../../helpers/sendEmail");

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
        SELECT count(a.medico_id) as consultas,m.*, descripcion , avg(NULLIF(c.calificacion ,0)) as calificacion
        from agenda a 
        inner join medico m on m.id = a.medico_id
        inner join especializaciones e on e.id=m.especializaciones_id
        inner join cita c on c.medico_id = m.id and a.id = c.agenda_id
        where c.estado = 'completada'  and a.estado = 'completada'
        group by m.nombres
        `,
        function (error, results) {
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
        SELECT count(a.medico_id) as consultas,m.*, descripcion , avg(NULLIF(c.calificacion ,0)) as calificacion
        from agenda a 
        inner join medico m on m.id = ?
        inner join especializaciones e on e.id=m.especializaciones_id
        inner join cita c on c.medico_id = m.id and a.id = c.agenda_id
        where a.estado = 'completada' and c.estado = 'completada'
        group by m.nombres
        `,
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
        "select *  from medico where users_id = ?",
        [id],
        function (error, results) {
          connection.query(
            "SELECT * from estudios where medico_id = ?",
            [results[0].id],
            function (error, results) {
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

  getModalidad(id) {
    return new Promise(async (resolve, reject) => {
      connection.query(
        "select modalidad_cita  from medico where users_id = ?",
        [id],
        function (error, results) {
          if (error == null) {
            if (results[0].modalidad_cita == "presencial/virtual") {
              modalidad = ["presencial", "virtual"];
              resolve(modalidad);
            } else {
              modalidad = [`${results[0].modalidad_cita}`];
              resolve(modalidad);
            }
          } else {
            reject(error);
          }
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

  getEspecs() {
    return new Promise(async (resolve, reject) => {
      connection.query(
        "SELECT DISTINCT e.descripcion FROM especializaciones e inner join medico m on m.especializaciones_id = e.id",
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

  agenda(
    fecha_cita,
    hora_cita,
    medico_id,
    tarifa,
    especialidad,
    modalidad,
    fechaYHora
  ) {
    return new Promise(async (resolve, reject) => {
      console.log(modalidad);
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
                modalidad: modalidad,
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
                modalidad: modalidad,
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
  agendarCita(agenda, beneficiario, fecha, medico_id, modalidad) {
    return new Promise(async (resolve, reject) => {
      const MeetUrl = Math.floor(Math.random() * 10000000000) + 1;

      if (modalidad == "virtual") {
        connection.query(
          "insert into cita set ?",
          {
            agenda_id: agenda,
            beneficiario_id: beneficiario,
            medico_id: medico_id,
            urlCita: `https://meet.jit.si/combeneficios${MeetUrl}`,
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
                        console.log(modalidad);
                        sendEmail(
                          to,
                          "cita agendada",
                          `
                        <h1>su cita ha sido agendada correctamente</h1>
                        <h2>Para el dia : ${results[0].fecha}</h2>
                        <h2>a la hora : ${results[0].hora}</h2>
                        <h2>debe entrar a este link a la fecha y hora de la cita para ser atendindo</h2>
                        <a href=https://meet.jit.si/${MeetUrl}>https://meet.jit.si/combeneficios${MeetUrl}</a>
                        `
                        );
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
      } else {
        connection.query(
          "insert into cita set ?",
          {
            agenda_id: agenda,
            beneficiario_id: beneficiario,
            medico_id: medico_id,
            urlCita: null,
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
                        console.log(modalidad);
                        sendEmail(
                          to,
                          "cita agendada",
                          `
                        <h1>su cita ha sido agendada correctamente</h1>
                        <h2>Para el dia : ${results[0].fecha}</h2>
                        <h2>a la hora : ${results[0].hora}</h2>
                        `
                        );
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
      }
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
            "SELECT a.fecha , a.hora ,a.estado, a.especialidad , c.beneficiario_id ,c.agenda_id, u.nombres , u.apellidos , u.email  FROM agenda a inner join cita c on c.agenda_id = a.id inner join users u on u.id = c.beneficiario_id where a.fecha > ? and c.medico_id = ? and a.estado = 'agendada' ORDER by a.fecha",
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

  //obtener las citas pendientes de un usuario
  getCitasUser(user) {
    return new Promise(async (resolve, reject) => {
      connection.query(
        "select a.* , m.nombres , m.apellidos , c.urlCita from agenda a inner join cita c on a.id = c.agenda_id inner join medico m on m.id = c.medico_id where c.beneficiario_id = ? and a.estado = 'agendada'",
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

  //obtener el historial de citas completadas de un usuario
  getUserHistorial(user) {
    return new Promise(async (resolve, reject) => {
      connection.query(
        `
        select c.id , a.fecha , a.hora, a.especialidad,m.nombres,m.apellidos , c.calificacion , c.asistio from agenda a 
        inner join cita c on c.agenda_id = a.id
        inner join medico m on m.id = a.medico_id
        where c.beneficiario_id = ? and c.estado = 'completada' and a.fecha != 0000-00-00
        ORDER by a.fecha
        `,
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
        `UPDATE cita SET estado='cancelada'
            WHERE agenda_id=?`,
        [id],
        (error, results) => {
          if (error) {
            reject(error);
          }
        }
      );

      connection.query(
        `UPDATE agenda SET estado='cancelada'
            WHERE id=?`,
        [id],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            sendEmail(
              email,
              "cita Cancelada",
              `
            <h1>Lo sentimos su cita ha sido cancelada</h1>
            `
            );
            resolve(results);
          }
        }
      );
    });
  },

  completarCita(id) {
    return new Promise(async (resolve, reject) => {
      connection.query(
        `UPDATE cita SET estado='completada'
            WHERE agenda_id=?`,
        [id],
        (error, results) => {
          connection.query(
            "SELECT beneficiario_id from cita where agenda_id = ?",
            [id],
            function (error, results, fields) {
              if (error == null) {
                connection.query(
                  "SELECT email from users where id = ?",
                  [results[0].beneficiario_id],
                  function (error, results, fields) {
                    if (error == null) {
                      sendEmail(
                        results[0].email,
                        "cita completada",
                        `
                      <h1>cita finalizada , muchas gracias por usar nuestros servicios</h1>
                      <h2>lo invitamos a calificar y confirmar su asistencia en el siguiente link</h2>
                      <h2>http://45.63.109.10:4200/medicos/historial</h2>
                      `
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
        }
      );

      connection.query(
        `UPDATE agenda SET estado='completada'
            WHERE id=?`,
        [id],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        }
      );
    });
  },

  //calificar
  calificar(id, calificacion) {
    return new Promise(async (resolve, result) => {
      connection.query(
        `
        update cita set calificacion = ?
        where id = ?
        `,
        [calificacion, id],
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
  //asistencia
  asistencia(id, asistencia) {
    console.log(id);
    console.log(asistencia);
    return new Promise(async (resolve, result) => {
      connection.query(
        `
        UPDATE cita
        SET asistio = ?
        WHERE id = ?;
        `,
        [asistencia, id],
        function (error, results, fields) {
          console.log(results);
          if (error == null) {
            resolve(results.message);
          } else {
            reject(error);
          }
        }
      );
    });
  },

  cancelarCitaUser(id, cita) {
    return new Promise(async (resolve, reject) => {
      connection.query(
        "SELECT m.id , u.email FROM medico m inner join users u on m.users_id = u.id where m.id = ?",
        [id],
        (error, results) => {
          email = results[0].email;
          connection.query(
            `UPDATE cita SET estado='cancelada'
                WHERE agenda_id=?`,
            [cita],
            (error, results) => {
              if (error) {
                reject(error);
              }
            }
          );

          connection.query(
            `UPDATE agenda SET estado='activo'
                WHERE id=?`,
            [cita],
            (error, results) => {
              if (error) {
                reject(error);
              } else {
                sendEmail(
                  email,
                  "cita Cancelada",
                  `
                <h1>Lo sentimos el usuario ha decidido cancelar la cita ,
                se ha vuelto a añadir a su lista de citas disponibles
                </h1>
                `
                );
                resolve(results);
              }
            }
          );
        }
      );
    });
  },
};
