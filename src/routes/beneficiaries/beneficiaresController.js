//metodo para registrar a un beneficiario
const { addBeneficiary } = require("./ops");
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
    const fecha_nac = req.body.fecha_nacimiento;
    const departamento = req.body.departamento;
    const ciudad = req.body.ciudad;
    const imgUrl = `http://localhost:7000/public/${req.file.filename}`;
    let titular_id = req.body.titular_id;
    const parentesco_id = req.body.parentesco;
    let hora = new Date().getHours();
    let minuto = new Date().getMinutes();
    let segundo = new Date().getSeconds();
    let fecha = hora + ":" + minuto + ":" + segundo;
    let date = new Date().toISOString().split("T")[0];
    let fechaYHora = date + " " + fecha;

    const result = await addBeneficiary(
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
    );
    res.status(200).json({
      error: false,
      msg: "beneficiario añadido",
    });
  } catch (error) {
    next(error);
  }
};
