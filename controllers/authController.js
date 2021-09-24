const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const connection = require("../database/db");
const { promisify } = require("util");

//metodo para registrar un usuario
exports.register = async (req, res) => {
  try {
    //parametros obtenidos del body de la peticion
    const tipo = req.body.tipo_id;
    const documento = req.body.nro_documento;
    const nombres = req.body.nombres;
    const apellidos = req.body.apellidos;
    const correo = req.body.correo;
    const contrasena = req.body.contrasena;
    const sexo = req.body.sexo;
    const fecha_nac = req.body.fecha_nacimiento;
    const departamento = req.body.departamento;
    const ciudad = req.body.ciudad;
    let titular_id = 0;
    let departamento_string = "";
    let hora = new Date().getHours();
    let minuto = new Date().getMinutes();
    let segundo = new Date().getSeconds();
    let fecha = hora + ":" + minuto + ":" + segundo;
    let date = new Date().toISOString().split("T")[0];
    fechaYHora = date + " " + fecha;
    //metodo para encriptar la contraseña
    let passHash = await bcrypt.hash(contrasena, 8);

    //expresion regular para validar la contraseña
    let regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){6,15}$/;

    console.log(fechaYHora);
    if (regex.test(contrasena) == false) {
      console.log(regex.test(contrasena));
      res.status(400).json({
        error: "true",
        msg: "la contraseña debe tener mas de 5  y menos de 16 caracteres , al menos una letra mayúscula ,al menos una letra minucula , al menos un dígito , sin espacios en blanco , al menos 1 caracter especial",
      });
    } else {
      connection.query(
        //consulta para obtener el id del ultimo titular registrado y asignarselo
        "SELECT AUTO_INCREMENT FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'combeneficios' AND TABLE_NAME = 'users'",
        async (error, results) => {
          titular_id = results[0].AUTO_INCREMENT;
          console.log(titular_id);
        }
      );

      connection.query(
        //consulta para obtener el nombre del departamento por medio de su id
        "SELECT departamento from departamentos d where id_departamento = ?",
        [departamento],
        async (error, results) => {
          departamento_string = results[0].departamento;
          console.log(departamento_string);
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
                paretesco_id: 1,
                tipo_usuario: 1,
                titular_id: titular_id,
                created_at: fechaYHora,
                updated_at: fechaYHora,
                estado: "activo",
              },
              (error, results) => {
                if (error) {
                  console.log(error);
                } else {
                  console.log(departamento_string);
                  res.status(200).json({
                    error: "false",
                    msg: "usuario creado",
                  });
                }
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
    const contrasena = req.body.contrasena;

    connection.query(
      //buscar al usuario en la bd por su documento
      "SELECT * FROM users where nro_documento = ?",
      [user],
      async (error, results) => {
        //comparar la contraseña ingresada con la de la bd
        console.log(
          !(await bcrypt.compareSync(contrasena, results[0].contrasena))
        );
        if (
          results.length == 0 ||
          !(await bcrypt.compareSync(contrasena, results[0].contrasena))
        ) {
          res.status(400).json({
            error: true,
            msg: "usuario/contraseña incorrecto/s",
          });
        }
        //verificar que el usuario este activo en la plataforma
        else if (results.estado === "inactivo") {
          res.status(401).json({
            error: true,
            msg: "usuario inactivo",
          });
        }
        //inicio de sesion exitoso
        else {
          const userName = results[0].nombres;
          const lastName = results[0].apellidos;
          const id = results[0].id;
          //generacion del JWT
          const token = jwt.sign({ id: id }, process.env.SECRET_KEY, {
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
            error: false,
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

//validar JWT
exports.isAuthenticated = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decodificar = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.SECRET_KEY
      );
      connection.query(
        "SELECT * FROM user WHERE id = ?",
        [decodificar.id],
        (error, results) => {
          if (!results) {
            return next();
          }
          req.user = results[0];
          return next();
        }
      );
    } catch (error) {
      res.status(400).json({
        error: error.message,
        msg: "token invalido",
      });
    }
  } else {
    res.status(401).json({
      msg: "token inexsistente",
    });
  }
};

//obtener listado de departamentos
exports.departamentos = async (req, res) => {
  connection.query(
    "SELECT * from departamentos",
    function (error, results, fields) {
      if (error) throw error;
      res.status(200).json({
        results,
      });
    }
  );
};
//obtener listado de ciudades
exports.ciudades = async (req, res) => {
  const departamento = req.body.departamento;
  connection.query(
    "SELECT * FROM municipios WHERE departamento_id = ?",
    [departamento],
    function (error, results, fields) {
      if (error) throw error;
      res.status(200).json({
        results,
      });
    }
  );
};
