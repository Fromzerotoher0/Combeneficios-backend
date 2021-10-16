const connection = require("../../database/db");
const bcrypt = require("bcryptjs");

module.exports = {
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

      //metodo para encriptar la contraseña
      const salt = await bcrypt.genSalt(8);
      let passHash = await bcrypt.hash(contrasena, salt);

      //expresion regular para validar la contraseña
      let regex_pass =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){6,15}$/;

      let regex_email =
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

      if (regex_pass.test(contrasena) == false) {
        reject(
          new Error(
            "la contraseña debe tener mas de 5  y menos de 16 caracteres , al menos una letra mayúscula ,al menos una letra minucula , al menos un dígito , sin espacios en blanco , al menos 1 caracter especial"
          )
        );
      } else if (regex_email.test(correo) == false) {
        reject(new Error("correo electronico no valido"));
      } else {
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
                        parentesco_id: parentesco_id,
                        tipo_usuario: 3,
                        titular_id: titular_id,
                        created_at: fechaYHora,
                        updated_at: fechaYHora,
                        estado: "activo",
                      },
                      (error, results) => {
                        if (error) {
                          reject(error);
                        } else {
                          resolve(new Error("usuario creado"));
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
          }
        );
      }
    });
  },
};
