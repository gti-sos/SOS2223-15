import express from "express";
//var cool = require("cool-ascii-faces");
//var bodyParser = require("body-parser"); //En express han añadido bodyparser
var mudulo_jara = require("./backend/api_jara");
//var modulo_mario = require("./backend/api_mario");
import { loadBackendMMS } from "./backend/api_mario.js"; //FRONTEND
var modulo_angel = require("./backend/api_angel");
import Datastore from 'nedb';
import { handler } from "./frontend/build/handler.js";


var app = express();
var port = process.env.PORT || 12345;

// Modularización--------------------

app.use(express.json()); //Importante colocar esto antes de los modulo_fff(app) para que funcione bien.
app.use("/", express.static("./public")); // HTML que se mostrará por defecto en la ruta /

mudulo_jara(app);
loadBackendMMS(app);
modulo_angel(app);

app.use(handler);

// ----------------------------------

app.listen(port, () => {
    console.log(`Server ready in port ${port}`);
});

const BASE_API_URL = "/api/v1";


