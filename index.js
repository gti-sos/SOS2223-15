//var cool = require("cool-ascii-faces");
//var bodyParser = require("body-parser"); express ya tiene un bodyparser incluido en su nueva actualización.
import express from "express";
import cors from "cors";
import { loadBackend_jara } from "./backend/api_jara.js";
import { loadBackend_mario } from "./backend/api_mario.js";
import { loadBackend_angel } from "./backend/api_angel.js";

import { handler } from "./frontend/build/handler.js";

//const Datastore = require('nedb');


var app = express();

app.use(cors());

var port = process.env.PORT || 12345;

// Modularización--------------------

app.use(express.json());
//app.use("/", express.static("./public")); // HTML que se mostrará por defecto en la ruta /

loadBackend_jara(app);
loadBackend_mario(app);
loadBackend_angel(app);


app.use(handler); // esto tiene que ir despues de la api


// ----------------------------------

app.listen(port, () => {
    console.log(`Server ready in port ${port}`);
});

const BASE_API_URL = "/api/v1";


