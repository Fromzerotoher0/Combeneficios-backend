const connection = require("../database/db");

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
