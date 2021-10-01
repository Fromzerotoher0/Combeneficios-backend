const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "bt60wa8k2nl1ejk6irrq-mysql.services.clever-cloud.com",
  user: "uinurarhxfnhmzm4",
  password: "4JPKi61m7nFtTIBh8shx",
  database: "bt60wa8k2nl1ejk6irrq",
});

connection.connect((error) => {
  if (error) {
    console.log("error de conexion : " + error);
    return;
  }
  console.log("conexion exitosa");
});

module.exports = connection;
