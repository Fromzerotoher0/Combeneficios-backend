const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const connection = require("../database/db");

//metodo para registrar un usuario
exports.register = async (req, res) => {
  try {
    //parametros obtenidos del body de la peticion
    const tipo = req.body.select_registro;
    const documento = req.body.documento;
    const nombres = req.body.name;
    const apellidos = req.body.lastName;
    const contrasena = req.body.contrasena;
    const sexo = req.body.sexo;
    const fecha_nac = req.body.fecha;
    const departamento = req.body.departamento;
    const ciudad = req.body.ciudad;
    //metodo para encriptar la contraseña
    let passHash = await bcrypt.hash(contrasena, 8);

    //expresion regular para validar la contraseña
    let regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){6,15}$/;

    if (regex.test(contrasena) == false) {
      console.log(regex.test(contrasena));
      res.status(400).json({
        error: "true",
        msg: "la contraseña debe tener mas de 5  y menos de 16 caracteres , al menos una letra mayúscula ,al menos una letra minucula , al menos un dígito , sin espacios en blanco , al menos 1 caracter especial",
      });
    } else {
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
                fecha_nacimiento: fecha_nac,
                departamento: departamento,
                ciudad: ciudad,
                contrasena: passHash,
              },
              (error, results) => {
                if (error) {
                  console.log(error);
                }
                res.status(200).json({
                  error: "false",
                  msg: "usuario creado",
                });
              }
            );
          } else {
            res.status(400).json({
              error: "true",
              msg: "el usuario ya existe en la base de datos",
            });
          }
        }
      );
    }
  } catch (error) {
    console.log(error);
  }
};

//metodo de autenticacion
exports.login = async (req, res) => {
  try {
    //parametros del body
    const user = req.body.identificacion;
    const password = req.body.password;

    connection.query(
      //buscar al usuario en la bd por su documento
      "SELECT * FROM users where nro_documento = ?",
      [user],
      async (error, results) => {
        //comparar la contraseña ingresada con la de la bd
        if (
          results.length == 0 ||
          !(await bcrypt.compareSync(password, results[0].contrasena))
        ) {
          console.log("usuario/contraseña incorrecto/s");
        } else {
          const userName = results[0].nombres;
          const lastName = results[0].apellidos;
          const id = results[0].id;
          //generacion del JWT
          const token = JWT.sign({ id: id }, process.env.SECRET_KEY, {
            expiresIn: process.env.JWT_EXPIRE,
          });
          //generacion de las cookies
          const cookiesOptions = {
            expires: new Date(
              Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
            ),
          };
          res.cookie("jwt", token, cookiesOptions);
          res.cookie("id", id, cookiesOptions);

          res.status(200).json({
            error: "false",
            msg: "inicio de sesión exitoso",
            id: id,
            usuario: userName + " " + lastName,
            token,
          });
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};
