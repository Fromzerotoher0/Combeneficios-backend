const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "mysql-combeneficios.alwaysdata.net",
  user: "244398_anderson",
  password: "16aa3240e",
  database: "combeneficios_test",
});

connection.connect((error) => {
  if (error) {
    console.log("error de conexion : " + error);
    return;
  }
  console.log("conexion exitosa");
});

module.exports = connection;
