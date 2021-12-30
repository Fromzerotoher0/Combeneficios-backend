const connection = require("../../database/db");
const CryptoJS = require("crypto-js");
const { sendEmail } = require("../../helpers/sendEmail");
const mercadopago = require("mercadopago");

module.exports = {
  //interaccion con la base de datos para registrar un nuevo beneficiario
  addBeneficiary(
    tipo,
    documento,
    nombres,
    apellidos,
    correo,
    contrasena,
    telefono,
    sexo,
    fecha_nac,
    departamento,
    ciudad,
    imgUrl,
    titular_id,
    parentesco_id,
    fechaYHora
  ) {
    return new Promise(async (resolve, reject) => {
      let departamento_string = "";
      fecha_nac = Date.parse(fecha_nac);
      fecha = new Date(fecha_nac);
      console.log(fecha.toISOString().substring(0, 10));
      //metodo para encriptar la contraseña
      let passHash = CryptoJS.AES.encrypt(contrasena, "siacsas").toString();

      //expresion regular para validar la contraseña
      let regex_pass = /^[a-z0-9_-]{4,30}$/;
      //expresion regular para validar el email
      let regex_email =
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

      //validacion de la contraseña con la expresion regular
      if (regex_pass.test(contrasena) == false) {
        reject(new Error("la contraseña debe tener mas de 3 caracteres"));
        //validacion del correo electronico con la expresion regular
      } else if (regex_email.test(correo) == false) {
        reject(new Error("correo electronico no valido"));
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
          //consulta para verificar que el usuario no exista en la base de datos
          "SELECT * FROM users where nro_documento = ?",
          [documento],
          async (error, results) => {
            if (results.length == 0) {
              connection.query(
                //insert del usuario en la base de datos
                "INSERT INTO users SET ?",
                {
                  tipo_id: tipo,
                  nro_documento: documento,
                  nombres: nombres,
                  apellidos: apellidos,
                  sexo: sexo,
                  email: correo,
                  fecha_nacimiento: fecha,
                  departamento: departamento_string,
                  ciudad: ciudad,
                  contrasena: passHash,
                  telefono: telefono,
                  imgUrl: imgUrl,
                  parentesco_id: parentesco_id,
                  tipo_usuario: 3,
                  titular_id: titular_id,
                  created_at: fechaYHora,
                  updated_at: fechaYHora,
                  estado: "activo",
                },
                (error) => {
                  if (error) {
                    reject(error);
                  } else {
                    resolve("usuario creado");
                  }
                }
              );
            } else {
              reject(
                new Error(
                  `el documento ${documento} ya esta registrado en la base de datos`
                )
              );
            }
          }
        );
      }
    });
  },
  //interaccion con la base de datos para obtener una cita por su id
  getCita(id) {
    return new Promise(async (resolve, reject) => {
      connection.query(
        `select a.* , m.nombres , m.apellidos from agenda a
        inner join medico m on m.id = a.medico_id
        where a.id = ?`,
        [id],
        async (error, results) => {
          if (error == null) {
            resolve(results);
          } else {
            reject(error);
          }
        }
      );
    });
  },
  //interaccion con la base de datos para agendar una cita
  agendarCita(agenda, beneficiario, fecha, medico_id, modalidad) {
    return new Promise(async (resolve, reject) => {
      function formatDate(date) {
        var d = new Date(date),
          month = "" + (d.getMonth() + 1),
          day = "" + d.getDate(),
          year = d.getFullYear();

        if (month.length < 2) month = "0" + month;
        if (day.length < 2) day = "0" + day;

        return [year, month, day].join("-");
      }

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
            estado: "proceso",
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
                      `select  email from users u
                      inner join medico m on m.users_id = u.id
                      WHERE m.id = ?
                      `,
                      [medico_id],
                      function (error, results) {
                        to = results[0].email;
                        sendEmail(
                          to,
                          "cita agendada",
                          `
                          <h1>buen dia</h1>
                            <h2>se ha asignado una cita para : </h2>
                            <h2>por favor entre en la plataforma para mas informacion</h2>
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
            estado: "proceso",
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
                        <h2>Para el dia : ${formatDate(results[0].fecha)}</h2>
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
              connection.query(
                `select  email from users u
              inner join medico m on m.users_id = u.id
              WHERE m.id = ?
              `,
                [medico_id],
                function (error, results) {
                  to = results[0].email;
                  sendEmail(
                    to,
                    "cita agendada",
                    `
                  <h1>buen dia</h1>
                    <h2>se ha asignado una cita para : </h2>
                  <h2>Para el dia : ${formatDate(results[0].fecha)}</h2>
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
      }
    });
  },
  //interaccion con la base de datos para que un usuario cancele una cita
  cancelarCita(id, cita) {
    return new Promise(async (resolve, reject) => {
      connection.query(
        "SELECT m.id , u.email FROM medico m inner join users u on m.users_id = u.id where m.id = ?",
        [id],
        (error, results) => {
          email = results[0].email;
          connection.query(
            `Delete from cita 
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
  //interaccion con la base de datos para que un usuario confirme su asistencia a una cita
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
        function (error, results) {
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
  //interaccion con la base de datos para calificar una cita
  calificar(id, calificacion) {
    return new Promise(async (resolve, result) => {
      connection.query(
        ` update cita set calificacion = ?
          where id = ?
          `,
        [calificacion, id],
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
  //interaccion con la base de datos para obtener el historial de citas de un usuario
  getHistorial(user) {
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
  //interaccion con la base de datos para obtener las citas pendientes de un usuario
  getCitas(user) {
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
};
