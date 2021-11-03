const connection = require("../../database/db");

module.exports = {
  register(asunto, modalidad, direccion, users_id, fechaYHora, universidad) {
    return new Promise(async (resolve, reject) => {
      let nombres = "";
      let apellidos = "";
      let documento = "";
      let correo = "";

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
        "SELECT  medico.id , medico.imgUrl , medico.nombres , medico.apellidos , descripcion from medico inner join especializaciones e on e.id=medico.especializaciones_id",
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
    return new Promise(async (resolve, reject) => {
      connection.query(
        "SELECT * from medico inner join especializaciones e on e.id=medico.especializaciones_id where medico.id = ?",
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
        "select * from solicitud_estudio where medico_id = ?",
        [medico_id],
        async (error, results) => {
          if (results.length < 0) {
            connection.query(
              "SELECT medico.id , medico.nombres , medico.apellidos,medico.documento FROM medico INNER JOIN users ON medico.users_id = ?",
              [medico_id],
              async (error, results) => {
                console.log(results.length, "a");
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
      connection.query(
        "SELECT * from agenda where estado = 'activo'",
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
  //Lasst
  getAgendaMedico(medico_id) {
    return new Promise(async (resolve, reject) => {
      connection.query(
        "SELECT * from agenda where medico_id = ? and estado = 'activo'",
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
          } else {
            reject(error);
          }
        }
      );
    });
  },

  //obtener la agenda de citas de un medico
  getCitas(user) {
    return new Promise(async (resolve, reject) => {
      connection.query(
        "select * from medico where users_id = ?",
        [user],
        async (error, result) => {
          connection.query(
            "SELECT * from cita where medico_id = ? and estado = 'activo'",
            [result[0].id],
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
};
