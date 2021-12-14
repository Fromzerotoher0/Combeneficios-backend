const connection = require("../../database/db");

module.exports = {
  register(titular_id, nombre, especialidad, direccion, ciudad) {
    return new Promise(async (resolve, reject) => {
      connection.query(
        "select * from solicitud_restaurante where titular_id = ?",
        [titular_id],
        async (error, results) => {
          if (results.length > 0) {
            reject(new Error("solo se puede tener una solicitud a la vez"));
          } else {
            connection.query(
              "insert into solicitud_restaurante set ?",

              {
                titular_id: titular_id,
                nombre: nombre,
                especialidad: especialidad,
                direccion: direccion,
                ciudad: ciudad,
                estado: "proceso",
              }
            );
            resolve("solicitud enviada");
          }
        }
      );
    });
  },

  addProduct(
    restaurante_id,
    articulo,
    descripcion,
    valor,
    imgUrl,
    categoria_id,
    fecha
  ) {
    return new Promise(async (resolve, reject) => {
      console.log(categoria_id);
      connection.query(
        "insert into menu set ?",
        {
          restaurante_id: restaurante_id,
          articulo: articulo,
          descripcion: descripcion,
          valor: valor,
          imgUrl: imgUrl,
          categoria_id: categoria_id,
          created_at: fecha,
          updated_at: fecha,
          estado: "activo",
        },
        async (error, results) => {
          if (error == null) {
            resolve("articulo añadido al menu");
          } else {
            reject(error);
          }
        }
      );
    });
  },
};
