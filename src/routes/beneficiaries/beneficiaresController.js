//metodo para registrar a un beneficiario
const {
  addBeneficiary,
  cancelarCita,
  asistencia,
  calificar,
  getHistorial,
  getCitas,
  agendarCita,
  getCita,
} = require("./ops");

//controlador para registrar un nuevo beneficiario
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
    const imgUrl = `https://api.combeneficios.co:7000/public/users/${req.file.filename}`;
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

//controlador para buscar una cita
exports.cita = async (req, res, next) => {
  try {
    const id = req.body.id;
    const result = await getCita(id);
    res.status(200).json({
      result,
    });
  } catch (error) {
    res.status(500).json({
      msg: error,
    });
  }
};

//controlador para agendar una cita
exports.agendarCita = async (req, res) => {
  const beneficiario = req.body.beneficiario_id;
  const agenda = req.body.agenda_id;
  const medico_id = req.body.medico_id;
  const modalidad = req.body.modalidad;
  let hora = new Date().getHours();
  let minuto = new Date().getMinutes();
  let segundo = new Date().getSeconds();
  let fecha = hora + ":" + minuto + ":" + segundo;
  let date = new Date().toISOString().split("T")[0];
  let fechaYHora = date + " " + fecha;

  const result = await agendarCita(
    agenda,
    beneficiario,
    fechaYHora,
    medico_id,
    modalidad
  );
  res.json({
    result,
  });
};

//controlador para que un usuario pueda cancelar una cita
exports.cancelarCita = async (req, res) => {
  const id = req.body.id;
  const cita = req.body.cita;
  const result = await cancelarCita(id, cita);
  res.json({
    result,
  });
};

//controlador para que un usuario confirme su asistencia a una cita
exports.asistencia = async (req, res) => {
  const id = req.body.id;
  const asistio = req.body.asistencia;
  const result = await asistencia(id, asistio);
  res.json({
    result,
  });
};

//controlador para que un usuario califique una cita
exports.calificar = async (req, res) => {
  const id = req.body.id;
  const calificacion = req.body.calificacion;
  const result = await calificar(id, calificacion);
  res.json({
    result,
  });
};

//controlador para obtener el historial de citas de un usuario
exports.historial = async (req, res) => {
  const id = req.body.id;
  const result = await getHistorial(id);
  res.json({
    result,
  });
};

//controlador para obtener las citas pendientes de un usuario

exports.getCitas = async (req, res) => {
  const user = req.body.id;
  const result = await getCitas(user);
  res.json({
    result,
  });
};
