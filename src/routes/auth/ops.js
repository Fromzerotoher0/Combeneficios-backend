const connection = require("../../database/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const CryptoJS = require("crypto-js");
const { sendEmail } = require("../../helpers/sendEmail");

module.exports = {
  login(user, contrasena) {
    return new Promise(async (resolve, reject) => {
      connection.query(
        //buscar al usuario en la bd por su documento
        "SELECT * FROM users where nro_documento = ?",
        [user],
        async (error, results) => {
          if (results[0] == undefined) {
            reject(new Error("usuario y/o contraseña incorrectos"));
          } else {
            decryptPassword = CryptoJS.AES.decrypt(
              results[0].contrasena,
              "siacsas"
            );
            utf8 = decryptPassword.toString(CryptoJS.enc.Utf8);
            //comparar la contraseña ingresada con la de la bd
            if (results.length == 0 || contrasena !== utf8) {
              reject(new Error("usuario y/o contraseña incorrectos"));
            }
            //verificar que el usuario este activo en la plataforma
            else if (results.estado === "inactivo") {
              reject(new Error("usuario inactivo"));
            }
            //inicio de sesion exitoso
            else {
              const userName = results[0].nombres;
              const lastName = results[0].apellidos;
              const id = results[0].id;
              const tipo_usuario = results[0].tipo_usuario;
              const ciudad = results[0].ciudad;
              //generacion del JWT
              const token = jwt.sign(
                { id: id, ciudad: ciudad, tipo_usuario: tipo_usuario },
                process.env.SECRET_KEY,
                {
                  expiresIn: process.env.JWT_EXPIRE,
                }
              );
              resolve({ id, token, userName, lastName });
            }
          } //alv
        }
      );
    });
  },

  register(
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
    fechaYHora
  ) {
    return new Promise(async (resolve, reject) => {
      console.log(fechaYHora);
      let titular_id = 0;
      let departamento_string = "";
      //metodo para encriptar la contraseña
      let passHash = CryptoJS.AES.encrypt(contrasena, "siacsas").toString();
      //expresiones regulares para validar email y contraseña
      let regex_pass = /^[a-z0-9_-]{4,30}$/;

      let regex_email =
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

      //condicion para validar contraseña
      if (regex_pass.test(contrasena) == false) {
        reject(new Error("la contraseña debe tener Mínimo 4 caracteres"));
        //condicion para validar correo
      } else if (regex_email.test(correo) == false) {
        reject(new Error("correo electronico invalido"));
      } else {
        connection.query(
          //consulta para obtener el id del ultimo titular registrado y asignarselo
          "SELECT MAX(id) AS id FROM users",
          async (error, results) => {
            if (results[0].id === null) {
              titular_id = 1;
            } else {
              titular_id = results[0].id + 1;
            }
          }
        );
        connection.query(
          //consulta para verificar que el correo no este ocupado
          "SELECT * from users where email = ?",
          [correo],
          async (error, results) => {
            if (results.length > 0) {
              reject(new Error("correo electronico en uso"));
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
                        fecha_nacimiento: fecha_nac,
                        departamento: departamento_string,
                        ciudad: ciudad,
                        contrasena: passHash,
                        telefono: telefono,
                        imgUrl: imgUrl,
                        parentesco_id: 1,
                        tipo_usuario: 2,
                        titular_id: titular_id,
                        created_at: fechaYHora,
                        updated_at: fechaYHora,
                        estado: "activo",
                      },
                      (error, results) => {
                        if (error) {
                          reject(new Error(error));
                        } else {
                          resolve(results);
                        }
                      }
                    );
                  } else {
                    reject(new Error("este usuario ya esta registrado"));
                  }
                }
              );
            }
          }
        );
      }
    });
  },

  forgot(email) {
    return new Promise(async (resolve, reject) => {
      connection.query(
        "select contrasena from users where email = ?",
        [email],
        (error, results) => {
          if (results.length < 1) {
            reject(new Error("el correo ingresado no esta registrado"));
          } else {
            decryptPassword = CryptoJS.AES.decrypt(
              results[0].contrasena,
              "siacsas"
            );
            utf8 = decryptPassword.toString(CryptoJS.enc.Utf8);
            console.log(utf8);

            sendEmail(
              email,
              "recuperacion de contraseña",
              `
            <h1>Su Contraseña es :</h1>
            <h2>${utf8}</h2>
            `
            );
          }
        }
      );
    });
  },
};
