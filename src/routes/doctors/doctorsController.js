const {
  register,
  getMedicos,
  getMedicoById,
  getMedicosPregrade,
  getMedicosEspecialization,
  getEspecializations,
  getAgendaMedico,
  getAgenda,
  agenda,
  getUniversidades,
  solicitudEstudio,
  getMedicosStudies,
  agendarCita,
  getCitasMedico,
  getCiudadMedicos,
  getMedicoByCiudad,
  cancelarCita,
  completarCita,
  getEspecs,
  getModalidad,
  getTarifa,
} = require("./ops");

//registrar un medico
exports.register = async (req, res, next) => {
  try {
    //parametros obtenidos del body de la peticion
    const asunto = req.body.asunto;
    const modalidad = req.body.modalidad;
    const direccion = req.body.direccion;
    const users_id = req.body.id;
    const universidad = req.body.universidad;
    const departamento = req.body.departamento;
    const ciudad = req.body.ciudad;
    const tarifa = req.body.tarifa;

    let hora = new Date().getHours();
    let minuto = new Date().getMinutes();
    let segundo = new Date().getSeconds();
    let fecha = hora + ":" + minuto + ":" + segundo;
    let date = new Date().toISOString().split("T")[0];
    let fechaYHora = date + " " + fecha;
    const result = await register(
      asunto,
      modalidad,
      direccion,
      users_id,
      fechaYHora,
      universidad,
      departamento,
      ciudad,
      tarifa
    );
    res.status(200).json({
      error: false,
      msg: result,
    });
  } catch (error) {
    next(error);
  }
};
//obtener listado de medicos

exports.medicos = async (req, res) => {
  const result = await getMedicos();
  res.json({
    result,
  });
};
//obtener un listado de ciudades en las que hay medicos disponibles
exports.medicosCiudad = async (req, res) => {
  const result = await getCiudadMedicos();
  res.json({
    result,
  });
};
//obtener un medico por su id
exports.medicosById = async (req, res) => {
  const id = req.body.id;
  const result = await getMedicoById(id);
  res.json({
    result,
  });
};
//obtener un medico por su ciudad
exports.medicosByCiudad = async (req, res) => {
  const ciudad = req.body.ciudad;
  console.log(ciudad);
  const result = await getMedicoByCiudad(ciudad);
  res.json({
    result,
  });
};
//obtener los estudios de un medico
exports.estudios = async (req, res) => {
  const id = req.body.id;
  console.log(id);
  const result = await getMedicosStudies(id);
  res.json({
    result,
  });
};
//obtener las modalidades de un medico
exports.modalidad = async (req, res) => {
  const id = req.body.id;
  const result = await getModalidad(id);
  res.json({
    result,
  });
};

//obtener los estudios de pregrado de un medico
exports.pregrado = async (req, res) => {
  const id = req.body.id;
  const result = await getMedicosPregrade(id);
  res.json({
    result,
  });
};

exports.especializaciones = async (req, res) => {
  const result = await getEspecializations();
  res.json({
    result,
  });
};

//obtener las especializaciones de un medico
exports.posgrado = async (req, res) => {
  const id = req.body.id;
  const result = await getMedicosEspecialization(id);
  res.status(200).json({
    result,
  });
};

//obtener las especializaciones de los medicos disponibles

exports.especializacionesDisponibles = async (req, res) => {
  const result = await getEspecs();
  res.json({
    result,
  });
};

//solicitud para añadir especializacion
exports.solicitudEstudio = async (req, res, next) => {
  try {
    const universidad = req.body.universidad;
    const medico_id = req.body.medico_id;
    const fecha_obtencion = req.body.fecha_obtencion;
    const especializaciones_id = req.body.especializaciones_id;
    const ciudad = req.body.ciudad;
    const imgUrl = `https://localhost:7000/public/certificados/${req.file.filename}`;
    let hora = new Date().getHours();
    let minuto = new Date().getMinutes();
    let segundo = new Date().getSeconds();
    let fecha = hora + ":" + minuto + ":" + segundo;
    let date = new Date().toISOString().split("T")[0];
    let fechaYHora = date + " " + fecha;

    const result = await solicitudEstudio(
      universidad,
      medico_id,
      fecha_obtencion,
      especializaciones_id,
      imgUrl,
      fechaYHora
    );
  } catch (error) {
    next(error);
  }
};
//lista de universidades
exports.universidades = async (req, res) => {
  const result = await getUniversidades();
  res.json({
    result,
  });
};
//añadir cita a agenda
exports.agenda = async (req, res) => {
  const fecha_cita = req.body.fecha;
  const hora_cita = req.body.hora;
  const medico_id = req.body.medico_id;
  const tarifa = req.body.tarifa;
  const especialidad = req.body.especialidad;
  const modalidad = req.body.modalidad;
  let hora = new Date().getHours();
  let minuto = new Date().getMinutes();
  let segundo = new Date().getSeconds();
  let fecha = hora + ":" + minuto + ":" + segundo;
  let date = new Date().toISOString().split("T")[0];
  let fechaYHora = date + " " + fecha;
  const result = await agenda(
    fecha_cita,
    hora_cita,
    medico_id,
    tarifa,
    especialidad,
    modalidad,
    fechaYHora
  );
  res.json({
    result,
  });
};
//listado de citas disponibles
exports.agendaDisponible = async (req, res) => {
  const result = await getAgenda();
  res.json({
    result,
  });
};
//listado de citas disponibles de un medico
exports.agendaMedico = async (req, res) => {
  const medico_id = req.body.medico_id;
  const result = await getAgendaMedico(medico_id);
  res.json({
    result,
  });
};

//agendar cita a un beneficiario
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
  console.log(`beneficiario ${beneficiario} - agenda ${agenda}`);
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

//listado de citas agendadas de un medico
exports.getCitasMedico = async (req, res) => {
  const user = req.body.medico_id;
  const result = await getCitasMedico(user);
  res.json({
    result,
  });
};

//cancelar cita - medico
exports.cancelarCita = async (req, res) => {
  const id = req.body.id;
  const email = req.body.email;
  console.log(email, id);
  const result = await cancelarCita(id, email);
  res.json({
    result,
  });
};
//marcar cita como completada
exports.completarCita = async (req, res) => {
  const id = req.body.id;
  const result = await completarCita(id);
  res.json({
    result,
  });
};

//obtener el valor de la tarifa de una cita
exports.tarifas = async (req, res) => {
  const id = req.body.id;
  const titulo = req.body.titulo;
  const result = await getTarifa(id, titulo);
  res.json({ result });
};
