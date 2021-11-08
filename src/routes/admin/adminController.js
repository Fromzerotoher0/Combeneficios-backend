const {
  getSolicitudes,
  aprobarSolicitud,
  rechazarSolicitud,
  SolicitudesEspecializacion,
  aceptarEspecializacion,
  rechazarEspecializacion,
} = require("./ops");

//lista de solicitudes para ser medico
exports.solicitudes = async (req, res, next) => {
  const result = await getSolicitudes();
  res.json({
    result,
  });
};
//aceptar solicitud para ser medico
exports.aceptar = async (req, res, next) => {
  try {
    const id = req.body.id;
    const modalidad = req.body.modalidad;
    const especializacion = req.body.especializaciones_id;
    const direccion = req.body.direccion;
    const to = req.body.correo;
    const universidad = req.body.universidad;
    const departamento = req.body.departamento;
    const ciudad = req.body.ciudad;
    let hora = new Date().getHours();
    let minuto = new Date().getMinutes();
    let segundo = new Date().getSeconds();
    let fecha = hora + ":" + minuto + ":" + segundo;
    let date = new Date().toISOString().split("T")[0];
    let fechaYHora = date + " " + fecha;

    const result = await aprobarSolicitud(
      id,
      modalidad,
      especializacion,
      direccion,
      to,
      fechaYHora,
      universidad,
      departamento,
      ciudad
    );
    res.status(200).json({
      error: false,
      msg: "solicitud aprobada",
    });
  } catch (error) {
    next(error);
  }
};
//rechazar solicitud para ser medico
exports.rechazar = async (req, res, next) => {
  const id = req.body.id;
  const to = req.body.correo;
  const result = await rechazarSolicitud(id, to);
  res.status(200).json({
    error: false,
    msg: "solicitud rechazada",
  });
};
//lista de solicitudes para agregar especializacion a un medico
exports.solicitudesEstudio = async (req, res, next) => {
  const result = await SolicitudesEspecializacion();
  res.json({ result });
};
//aceptar solicitud de estudio
exports.aceptarEstudio = async (req, res, next) => {
  const titulo = req.body.titulo;
  const users_id = req.body.users_id;
  const universidad = req.body.universidad;
  const tipo_estudio = 2;
  const medico_id = req.body.medico_id;
  const fecha_obtencion = req.body.fecha_obtencion;
  const especializacion = req.body.especializacion;

  let hora = new Date().getHours();
  let minuto = new Date().getMinutes();
  let segundo = new Date().getSeconds();
  let fecha = hora + ":" + minuto + ":" + segundo;
  let date = new Date().toISOString().split("T")[0];
  let fechaYHora = date + " " + fecha;

  result = await aceptarEspecializacion(
    titulo,
    users_id,
    universidad,
    tipo_estudio,
    medico_id,
    fecha_obtencion,
    fechaYHora,
    especializacion
  );
  res.status(200).json({
    error: false,
    msg: "solicitud aceptada",
    result,
  });
};
//rechazar solicitud de estudio
exports.rechazarEstudio = async (req, res, next) => {
  const medico_id = req.body.medico_id;
  const users_id = req.body.users_id;
  const result = await rechazarEspecializacion(medico_id, users_id);
  res.status(200).json({
    error: false,
    msg: "solicitud rechazada",
    result,
  });
};
