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
  getCitasUser,
  getCitasMedico,
  getCiudadMedicos,
  getMedicoByCiudad,
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
      ciudad
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
//obtener un medico por su id
exports.medicosByCiudad = async (req, res) => {
  const ciudad = req.body.ciudad;
  console.log(ciudad);
  const result = await getMedicoByCiudad(ciudad);
  res.json({
    result,
  });
};
//obtener los estudios de un medico
exports.medicosstudies = async (req, res) => {
  const id = req.body.id;
  console.log(id);
  const result = await getMedicosStudies(id);
  res.json({
    result,
  });
};

//obtener los estudios de pregrado de un medico
exports.medicosPregrade = async (req, res) => {
  const id = req.body.id;
  const result = await getMedicosPregrade(id);
  res.json({
    result,
  });
};
//obtener las especializaciones de un medico
exports.medicosEspecialization = async (req, res) => {
  const id = req.body.id;
  const result = await getMedicosEspecialization(id);
  res.json({
    result,
  });
};
//obtener todas las especializaciones disponibles
exports.especializaciones = async (req, res) => {
  const result = await getEspecializations();
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
    const imgUrl = `https://45.63.109.10:7000/public/${req.file.filename}`;
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
  let hora = new Date().getHours();
  let minuto = new Date().getMinutes();
  let segundo = new Date().getSeconds();
  let fecha = hora + ":" + minuto + ":" + segundo;
  let date = new Date().toISOString().split("T")[0];
  let fechaYHora = date + " " + fecha;
  console.log(`beneficiario ${beneficiario} - agenda ${agenda}`);
  const result = await agendarCita(agenda, beneficiario, fechaYHora, medico_id);
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

//listado de citas agendadas de un usuarui
exports.getCitasUser = async (req, res) => {
  const user = req.body.id;
  const result = await getCitasUser(user);
  res.json({
    result,
  });
};
