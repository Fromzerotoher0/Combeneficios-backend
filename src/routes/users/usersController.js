const connection = require("../../database/db");

//obtener usuario por su id
exports.getUser = async (req, res) => {
  const id = req.body.id;
  connection.query(
    "SELECT * FROM users WHERE id = ?",
    [id],
    (error, results) => {
      res.status(200).json({
        results,
      });
    }
  );
};

//actualizar datos de un usuario
exports.updateUser = async (req, res) => {
  const id = req.body.id;
  const nombres = req.body.nombres;
  const apellidos = req.body.apellidos;
  const telefono = req.body.telefono;
  const email = req.body.email;
  connection.query(
    `UPDATE users SET nombres='${nombres}' , apellidos='${apellidos}',telefono='${telefono}',email='${email}'
    WHERE id=?`,
    [id],
    (error, results) => {
      res.status(200).json({
        msg: "actualizado",
      });
    }
  );
};
//Metodo para cargar los beneficiarios afiliados a un usuario
exports.loadBeneficiaries = async (req, res) => {
  const id = req.body.id;
  connection.query(
    `SELECT * FROM users WHERE titular_id = ?`,
    [id],
    (error, results) => {
      res.status(200).json({
        results,
      });
    }
  );
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
