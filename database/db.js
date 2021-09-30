const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "bvs8i361eaofhxibhd6c-mysql.services.clever-cloud.com",
  user: "u8grgfyqcbmexerl",
  password: "pgFHfdbsOezr8BAh4Tgj",
  database: "bvs8i361eaofhxibhd6c",
});

connection.connect((error) => {
  if (error) {
    console.log("error de conexion : " + error);
    return;
  }
  console.log("conexion exitosa");
});

module.exports = connection;
