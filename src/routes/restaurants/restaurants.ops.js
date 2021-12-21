const connection = require("../../database/db");

module.exports = {
  //solicitud para registrar un restaurante
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
  //añadir un producto a un restaurante
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
  //crear una orden de compra
  createOrder(userId, restaurante, date, time) {
    return new Promise(async (resolve, reject) => {
      connection.query(
        "insert into orden set ?",
        {
          users_id: userId,
          restaurante_id: restaurante,
          fecha: date,
          hora: time,
          estado: "pendiente",
        },
        async (error, results) => {
          if (error == null) {
            resolve(results);
          } else {
            reject(error);
          }
        }
      );
    });
  },
  //aceptar una orden
  acceptOrder(id) {
    return new Promise(async (resolve, reject) => {
      connection.query(
        "update orden set estado = 'aceptada' where id = ?",
        [id],
        async (error, results) => {
          if (error == null) {
            resolve("orden aceptada");
          } else {
            reject(error);
          }
        }
      );
    });
  },
  //rechazar una orden
  rejectOrder(id) {
    return new Promise(async (resolve, reject) => {
      connection.query(
        "update orden set estado = 'rechazada' where id = ?",
        [id],
        async (error, results) => {
          if (error == null) {
            resolve("orden rechazada");
          } else {
            reject(error);
          }
        }
      );
    });
  },
  //completar una orden
  completeOrder(id) {
    return new Promise(async (resolve, reject) => {
      connection.query(
        "update orden set estado = 'completada' where id = ?",
        [id],
        async (error, results) => {
          if (error == null) {
            resolve("orden completada");
          } else {
            reject(error);
          }
        }
      );
    });
  },
  //agregar los detalles a una orden
  addDetails(orderId, details) {
    return new Promise(async (resolve, reject) => {
      for (let i = 0; i < details.length; i++) {
        connection.query(
          "insert into detalle_orden set ?",
          {
            ordenes_id: orderId,
            menu_id: details[i].menu_id,
            valor: details[i].valor,
            cantidad: details[i].cantidad,
            estado: "ordenada",
          },
          async (error, results) => {
            if (error == null) {
              resolve("orden creada");
            } else {
              reject(error);
            }
          }
        );
      }
    });
    console.log(orderId);
    console.log(details);
  },
};
