const connection = require("../database/db");
const bcrypt = require("bcryptjs");

//metodo para registrar a un beneficiario
exports.register = async (req, res) => {
  try {
    //parametros obtenidos del body de la peticion
    const tipo = req.body.tipo_id;
    const documento = req.body.nro_documento;
    const nombres = req.body.nombres;
    const apellidos = req.body.apellidos;
    const correo = req.body.correo;
    const contrasena = req.body.contrasena;
    const telefono = req.body.telefono;
    const sexo = req.body.sexo;
    const fecha_nac = req.body.fecha_nacimiento;
    const departamento = req.body.departamento;
    const ciudad = req.body.ciudad;
    const imgUrl = `http://45.63.109.10:7000/public/${req.file.filename}`;
    let titular_id = req.body.titular_id;
    const parentesco_id = req.body.parentesco;

    let departamento_string = "";
    let hora = new Date().getHours();
    let minuto = new Date().getMinutes();
    let segundo = new Date().getSeconds();
    let fecha = hora + ":" + minuto + ":" + segundo;
    let date = new Date().toISOString().split("T")[0];
    fechaYHora = date + " " + fecha;
    //metodo para encriptar la contraseña

    const salt = await bcrypt.genSalt(8);
    let passHash = await bcrypt.hash(contrasena, salt);

    //expresion regular para validar la contraseña
    let regex_pass =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){6,15}$/;

    let regex_email =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    if (regex_pass.test(contrasena) == false) {
      res.status(400).json({
        error: "true",
        msg: "la contraseña debe tener mas de 5  y menos de 16 caracteres , al menos una letra mayúscula ,al menos una letra minucula , al menos un dígito , sin espacios en blanco , al menos 1 caracter especial",
      });
    } else if (regex_email.test(correo) == false) {
      res.status(400).json({
        error: "true",
        msg: "correo electronico no valido",
      });
    } else {
      connection.query(
        //consulta para verificar que el correo no este ocupado
        "SELECT * from users where email = ?",
        [correo],
        async (error, results) => {
          if (results.length > 0) {
            res.status(400).json({
              error: "true",
              msg: "correo electronico en uso",
            });
          }
        }
      );
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
                tipo_usuario: 2,
                titular_id: titular_id,
                created_at: fechaYHora,
                updated_at: fechaYHora,
                estado: "activo",
              },
              (error, results) => {
                if (error) {
                  res.status(400).json({
                    error: "true",
                    msg: error.message,
                  });
                } else {
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
