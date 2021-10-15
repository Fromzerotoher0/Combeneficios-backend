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

  updateUser(id, nombres, apellidos, telefono, email) {
    return new Promise(async (resolve, reject) => {
      connection.query(
        "select * from users where id = ?",
        [id],
        (error, results) => {
          if (results.lenght > 0) {
            connection.query(
              `UPDATE users SET nombres='${nombres}' , apellidos='${apellidos}',telefono='${telefono}',email='${email}'
                WHERE id=?`,
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
};
