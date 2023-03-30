//var cool = require("cool-ascii-faces");
//var bodyParser = require("body-parser");
import express from "express";
import { loadBackend_jara } from "./backend/api_jara";
var modulo_mario = require("./backend/api_mario");
var modulo_angel = require("./backend/api_angel");
const Datastore = require('nedb');


var app = express();
var port = process.env.PORT || 12345;

// Modularización--------------------

app.use(bodyParser.json()); //Importante colocar esto antes de los modulo_fff(app) para que funcione bien.
app.use("/", express.static("./public")); // HTML que se mostrará por defecto en la ruta /

loadBackend_jara(app);
modulo_mario(app);
modulo_angel(app);

// ----------------------------------

app.listen(port, () => {
    console.log(`Server ready in port ${port}`);
});

const BASE_API_URL = "/api/v1";


