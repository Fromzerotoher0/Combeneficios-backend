const connection = require("../../database/db");

module.exports = {
  getUserById(id) {
    return new Promise(async (resolve, reject) => {
      connection.query(
        "SELECT * FROM users WHERE id = ?",
        [id],
        (error, results) => {
          if (error == null) {
            resolve(results);
          } else {
            reject(error);
          }
        }
      );
    });
  },

  updateUser(id, nombres, apellidos, telefono, email, fechaYHora) {
    return new Promise(async (resolve, reject) => {
      connection.query(
        "select * from users where id = ?",
        [id],
        (error, results) => {
          if (results.length > 0) {
            connection.query(
              `UPDATE users SET nombres='${nombres}' , apellidos='${apellidos}',telefono='${telefono}',email='${email}',updated_at='${fechaYHora}'
                WHERE id=?`,
              [id],
              (error, results) => {
                if (error == null) {
                  connection.query(
                    `update medico set nombres = '${nombres}' , apellidos='${apellidos}' where medico.users_id = ?`,
                    [id],
                    (error, results) => {
                      if (error == null) {
                        resolve(results);
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
            reject(new Error("el usuario no existe en la base de datos"));
          }
        }
      );
    });
  },

  getBeneficiarios(titular_id) {
    return new Promise(async (resolve, reject) => {
      connection.query(
        `SELECT * FROM users WHERE titular_id = ?`,
        [titular_id],
        (error, results) => {
          if (error == null) {
            resolve(results);
          } else {
            reject(error);
          }
        }
      );
    });
  },

  getDepartamentos() {
    return new Promise(async (resolve, reject) => {
      connection.query(
        "SELECT * from departamentos",
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

  getMunicipios(departamento) {
    return new Promise(async (resolve, reject) => {
      connection.query(
        "SELECT * FROM municipios WHERE departamento_id = ?",
        [departamento],
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

  postCita(user_id, agenda_id) {
    return new Promise(async (resolve, reject) => {
      connection.query(
        "insert into cita set ?",
        {
          beneficiario_id: user_id,
          agenda_id: agenda_id,
        },
        (error, results) => {
          if (error == null) {
            resolve(results);
          } else {
            reject(error);
          }
        }
      );
    });
  },

  updatePhoto(url, id) {
    console.log(url, id);
    return new Promise(async (resolve, reject) => {
      connection.query(
        "UPDATE users SET imgUrl = ? WHERE id = ?",
        [url, id],
        (error, results) => {
          if (error == null) {
            connection.query(
              "UPDATE medico SET imgUrl = ? WHERE users_id = ?",
              [url, id],
              (error, results) => {
                if (error == null) {
                  resolve("foto actualizada");
                } else {
                  reject(error);
                }
              }
            );
            resolve("foto actualizada");
          } else {
            reject(error);
          }
        }
      );
    });
  },
};
