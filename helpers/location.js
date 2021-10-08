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
