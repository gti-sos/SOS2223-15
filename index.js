var express = require("express");
var cool = require("cool-ascii-faces");
var bodyParser = require("body-parser");
var mudulo_jara = require("./Modulos/api_jara");
var modulo_mario = require("./Modulos/api_mario.js");
var modulo_angel = require("./Modulos/api_angel.js");
const Datastore = require('nedb');

db_api_mario = new Datastore();

var app = express();
var port = process.env.PORT || 12345;

// Modularización--------------------

app.use(bodyParser.json()); //Importante colocar esto antes de los modulo_fff(app) para que funcione bien.

mudulo_jara(app);
modulo_mario.register(app, db_api_mario);
modulo_angel(app);

// ----------------------------------

app.listen(port, () => {
    console.log(`Server ready in port ${port}`);
});

