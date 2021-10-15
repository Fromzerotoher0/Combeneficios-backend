const connection = require("../../database/db");
const {
  postCita,
  getMunicipios,
  getDepartamentos,
  getBeneficiarios,
  updateUser,
  getUserById,
} = require("./ops");

module.exports = {
  //obtener usuario por su id
  async getUserController(req, res, next) {
    try {
      const id = req.body.id;
      const result = await getUserById(id);
      res.status(200).json({
        error: false,
        result,
      });
    } catch (error) {
      next(error);
    }
  },

  //actualizar datos de un usuario
  async updateUserController(req, res, next) {
    try {
      const id = req.body.id;
      const nombres = req.body.nombres;
      const apellidos = req.body.apellidos;
      const telefono = req.body.telefono;
      const email = req.body.email;
      let hora = new Date().getHours();
      let minuto = new Date().getMinutes();
      let segundo = new Date().getSeconds();
      let fecha = hora + ":" + minuto + ":" + segundo;
      let date = new Date().toISOString().split("T")[0];
      let fechaYHora = date + " " + fecha;

      const result = await updateUser(
        id,
        nombres,
        apellidos,
        telefono,
        email,
        fechaYHora
      );
      res.status(200).json({
        error: false,
        msg: "datos actualizados",
        result,
      });
    } catch (error) {
      next(error);
    }
  },

  //Metodo para cargar los beneficiarios afiliados a un usuario
  async getBeneficiariesController(req, res, next) {
    try {
      const id = req.body.id;
      const result = await getBeneficiarios(id);
      res.status(200).json({
        error: false,
        result,
      });
    } catch (error) {
      next(error);
    }
  },
  //obtener listado de departamentos
  async getDepartamentosController(req, res, next) {
    try {
      const result = await getDepartamentos();
      res.status(200).json({
        error: false,
        result,
      });
    } catch (error) {
      next(error);
    }
  },
  //obtener listado de ciudades
  async getCiudadesController(req, res, next) {
    try {
      const departamento = req.body.departamento;
      const result = await getMunicipios(departamento);
      res.status(200).json({
        error: false,
        result,
      });
    } catch (error) {
      next(error);
    }
  },

  //agendar una cita
  async citaController(req, res, next) {
    const beneficiario = req.body.id;
    const agenda_id = req.body.agenda_id;
    try {
      const beneficiario = req.body.id;
      const agenda_id = req.body.agenda_id;
      const result = await postCita(beneficiario, agenda_id);
      res.status(200).json({
        error: false,
        msg: "cita agendada",
        result,
      });
    } catch (error) {
      next(error);
    }
  },
};
