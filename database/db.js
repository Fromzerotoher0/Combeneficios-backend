const mysql = require("mysql");

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: "root",
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
});

connection.connect((error) => {
  if (error) {
    console.log("error de conexion : " + error);
    return;
  }
  console.log("conexion exitosa");
});

module.exports = connection;
