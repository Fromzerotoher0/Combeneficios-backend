const express = require("express");
const dotEnv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const router = require("./src/routes/routes");
const appError = require("./src/helpers/appError");
const morgan = require("morgan");
const { errorHandler } = require("./src/middlewares/errorHandler");

const app = express();

//morgan
app.use(morgan("dev"));

//motor de plantillas
app.use(cors());
app.set("view engine", "ejs");

//carpeta public para archivos estaticos
app.use("/public", express.static(`${__dirname}/storage`));
// app.use("/public", express.static(`${process.cwd()}}/storage`));

//procesar datos enviados desde forms
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//variables de entorno
dotEnv.config({ path: "./src/env/.env" });

//uso de cookies
app.use(cookieParser());

//llamar al router
app.get("/", (req, res) => {
  res.sendFile(`${process.cwd()}/storage/code.png`);
});
app.use("/api", router);
app.all("*", (req, res, next) => {
  next(
    new appError(`no se encuentra la ruta ${req.originalUrl} en el servidor`)
  );
});

app.use(errorHandler);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server Up running in http://localhost:${process.env.PORT}`);
});
