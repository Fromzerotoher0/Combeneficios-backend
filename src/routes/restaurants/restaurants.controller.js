const { register, addProduct } = require("./restaurants.ops");

module.exports = {
  async registerController(request, response, next) {
    try {
      const titular_id = request.body.titular_id;
      const nombre = request.body.nombre;
      const especialidad = request.body.especialidad;
      const direccion = request.body.direccion;
      const ciudad = request.body.ciudad;
      const result = await register(
        titular_id,
        nombre,
        especialidad,
        direccion,
        ciudad
      );
      response.status(200).json({
        error: false,
        msg: "solicitud enviada",
        result,
      });
    } catch (error) {
      next(error);
    }
  },

  async addProductController(request, response, next) {
    try {
      console.log("add controller");
      const restaurante_id = request.body.restaurante_id;
      const articulo = request.body.articulo;
      const descripcion = request.body.descripcion;
      const valor = request.body.valor;
      const categoria = request.body.categoria_id;
      const imgUrl = `https://localhost:7000/public/menu/${request.file.filename}`;
      let hora = new Date().getHours();
      let minuto = new Date().getMinutes();
      let segundo = new Date().getSeconds();
      let fecha = hora + ":" + minuto + ":" + segundo;
      let date = new Date().toISOString().split("T")[0];
      const fechaYHora = date + " " + fecha;
      const result = await addProduct(
        restaurante_id,
        articulo,
        descripcion,
        valor,
        imgUrl,
        categoria,
        fechaYHora
      );
      response.status(200).json({
        error: false,
        msg: "solicitud enviada",
        result,
      });
    } catch (error) {
      next(error);
    }
  },
};
