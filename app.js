const express = require("express");
const dotEnv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

//motor de plantillas
app.use(cors());
app.set("view engine", "ejs");

//carpeta public para archivos estaticos
app.use(express.static("public"));

//procesar datos enviados desde forms
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//variables de entorno
dotEnv.config({ path: "./env/.env" });

//uso de cookies
app.use(cookieParser());

//llamar al router
app.use("/", require("./routes/router"));

app.listen(3000, () => {
  console.log("Server Up running in http://localhost:3000");
});
