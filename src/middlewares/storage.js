const multer = require("multer");

//middleware para almacenar imagenes en el servidor
const storage = multer.diskStorage({
  destination: function (request, file, cb) {
    console.log(JSON.parse(JSON.stringify(request.body)));
    if (request.body.directorio == "menu") {
      cb(null, "./storage/menu");
    } else if (request.body.directorio == "certificados") {
      cb(null, "./storage/certificados");
    } else {
      cb(null, "./storage/users");
    }
  },
  filename: function (request, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ".jpg");
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
