const { promisify } = require("util");
const jwt = require("jsonwebtoken");

exports.isAuthenticated = async (req, res, next) => {
  let token = req.headers["authorization"];
  if (token) {
    token = token.split(" ")[1];
    try {
      const decodificar = await promisify(jwt.verify)(
        token,
        process.env.SECRET_KEY
      );
      next();
    } catch (error) {
      res.status(400).json({
        error: error.message,
        msg: "token invalido",
      });
    }
  } else {
    res.status(401).json({
      msg: "token inexsistente",
    });
  }
};

exports.adminRole = async (req, res, next) => {
  let token = req.headers["authorization"];
  if (token) {
    token = token.split(" ")[1];
    try {
      const decodificar = await promisify(jwt.verify)(
        token,
        process.env.SECRET_KEY
      );

      if (decodificar.tipo_usuario == 1) {
        console.log("usuario permitido");
        next();
      } else {
        res.status(401).json({
          error: "unauthorized user",
          msg: "usuario no autorizado",
        });
      }
    } catch (error) {
      res.status(400).json({
        error: error.message,
        msg: "token invalido",
      });
    }
  } else {
    res.status(401).json({
      msg: "token inexsistente",
    });
  }
};
