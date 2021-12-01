const { login, register, forgot } = require("./ops");

//metodo para registrar un usuario
exports.register = async (req, res, next) => {
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
    let fecha_nac = req.body.fecha_nacimiento;
    const departamento = req.body.departamento;
    const ciudad = req.body.ciudad;
    const imgUrl = `https://45.63.109.10:7000/public/${req.file.filename}`;

    function formatDate(date) {
      var d = new Date(date),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;

      return [year, month, day].join("-");
    }

    fecha_nac = formatDate(fecha_nac);

    let hora = new Date().getHours();
    let minuto = new Date().getMinutes();
    let segundo = new Date().getSeconds();
    let fecha = hora + ":" + minuto + ":" + segundo;
    let date = new Date().toISOString().split("T")[0];
    let fechaYHora = date + " " + fecha;
    const result = await register(
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
    );
    res.status(200).json({
      error: false,
      msg: "usuario creado",
      result,
    });
  } catch (error) {
    next(error);
  }
};

//metodo de autenticacion
exports.login = async (req, res, next) => {
  try {
    //parametros del body
    const user = req.body.identificacion;
    const contrasena = req.body.contrasena;
    const result = await login(user, contrasena);
    res.status(200).json({
      error: false,
      msg: "inicio de sesión exitoso",
      id: result.id,
      usuario: result.userName + " " + result.lastName,
      token: result.token,
    });
  } catch (error) {
    next(error);
  }
};

exports.forgot = async (req, res, next) => {
  try {
    const email = req.body.email;
    result = await forgot(email);
    res.status(200).json({
      result,
    });
  } catch (error) {
    next(error);
  }
};
