const connection = require("../../database/db");

//registrar un medico
exports.register = async (req, res) => {
  try {
    //parametros obtenidos del body de la peticion
    const asunto = req.body.asunto;
    const modalidad = req.body.modalidad;
    const direccion = req.body.direccion;
    const users_id = req.body.id;

    let nombres = "";
    let apellidos = "";
    let documento = "";
    let correo = "";

    let hora = new Date().getHours();
    let minuto = new Date().getMinutes();
    let segundo = new Date().getSeconds();
    let fecha = hora + ":" + minuto + ":" + segundo;
    let date = new Date().toISOString().split("T")[0];
    fechaYHora = date + " " + fecha;

    connection.query(
      "select * from medico where users_id = ?",
      [users_id],
      async (error, results) => {
        if (results.length > 0) {
          res.status(400).json({
            error: "true",
            msg: "un medico no puede hacer este tipo de solicitud",
          });
        } else {
          connection.query(
            "SELECT * FROM solicitud where users_id = ? and estado ='proceso'",
            [users_id],
            async (error, results) => {
              if (results.length > 0) {
                res.status(400).json({
                  error: "true",
                  msg: "solo puede tener una solicitud en proceso",
                });
              } else {
                connection.query(
                  "SELECT * FROM users where id = ?",
                  [users_id],
                  async (error, results) => {
                    nombres = results[0].nombres;
                    apellidos = results[0].apellidos;
                    documento = results[0].nro_documento;
                    correo = results[0].email;
                    if (results.length > 0) {
                      connection.query(
                        //insertar solicitud en la base de datos
                        "INSERT INTO solicitud SET ?",
                        {
                          nombres: nombres,
                          apellidos: apellidos,
                          documento: documento,
                          asunto: asunto,
                          modalidad: modalidad,
                          direccion: direccion,
                          users_id: users_id,
                          especializaciones_id: 1,
                          correo: correo,
                          created_at: fechaYHora,
                          updated_at: fechaYHora,
                          estado: "proceso",
                        },
                        (error, results) => {
                          if (error) {
                            res.status(400).json({
                              error: "true",
                              msg: error.message,
                            });
                          } else {
                            res.status(200).json({
                              error: "false",
                              msg: "solicitud creada",
                            });
                          }
                        }
                      );
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};
//obtener listado de medicos
exports.medicos = async (req, res) => {
  connection.query("SELECT * from medico", function (error, results, fields) {
    if (error) throw error;
    res.status(200).json({
      results,
    });
  });
};
//obtener un medico por su id
exports.medicosById = async (req, res) => {
  const id = req.body.id;
  connection.query(
    "SELECT * from medico where id = ?",
    [id],
    function (error, results, fields) {
      if (error) throw error;
      res.status(200).json({
        results,
      });
    }
  );
};
//obtener los estudios de un medico
exports.medicosPregrade = async (req, res) => {
  const id = req.body.id;
  connection.query(
    "SELECT * from estudios where medico_id = ? and tipo_estudio = 1",
    [id],
    function (error, results, fields) {
      if (error) throw error;
      res.status(200).json({
        results,
      });
    }
  );
};
//obtener las especializaciones de un medico
exports.medicosEspecialization = async (req, res) => {
  const id = req.body.id;
  connection.query(
    "SELECT * from estudios where medico_id = ? and tipo_estudio = 2",
    [id],
    function (error, results, fields) {
      if (error) throw error;
      res.status(200).json({
        results,
      });
    }
  );
};
//obtener todas las especializaciones disponibles
exports.especializaciones = async (req, res) => {
  connection.query(
    "SELECT * from especializaciones",
    function (error, results, fields) {
      if (error) throw error;
      res.status(200).json({
        results,
      });
    }
  );
};
//solicitud para añadir especializacion
exports.solicitudEstudio = async (req, res) => {
  let nombres = "";
  let apellidos = "";
  let documentos = "";
  const medico_id = req.body.medico_id;
  const especializaciones_id = req.body.especializaciones_id;
  const imgUrl = `http://localhost:7000/public/${req.file.filename}`;
  let hora = new Date().getHours();
  let minuto = new Date().getMinutes();
  let segundo = new Date().getSeconds();
  let fecha = hora + ":" + minuto + ":" + segundo;
  let date = new Date().toISOString().split("T")[0];
  let fechaYHora = date + " " + fecha;

  connection.query(
    "SELECT medico.id , medico.nombres , medico.apellidos,medico.documento FROM medico INNER JOIN users ON medico.users_id = ?",
    [medico_id],
    async (error, results) => {
      id = results[0].id;
      nombres = results[0].nombres;
      apellidos = results[0].apellidos;
      documento = results[0].documento;
      console.log(id);
      connection.query(
        "INSERT INTO solicitud_estudio set ?",
        {
          nombres: nombres,
          apellidos: apellidos,
          documento: documento,
          medico_id: id,
          especializaciones_id: especializaciones_id,
          imgUrl: imgUrl,
          created_at: fechaYHora,
          updated_at: fechaYHora,
          estado: "proceso",
        },
        (error, results) => {
          console.log("solicitud enviada");
        }
      );
    }
  );
};
//añadir cita a agenda
exports.agenda = async (req, res) => {};
