//var cool = require("cool-ascii-faces");
//var bodyParser = require("body-parser"); //express ya tiene un bodyparser incluido en su nueva actualización.
import express from "express";
import cors from "cors";
import request from "request";
import { loadBackend_jara } from "./backend/api_jara.js";
import { loadBackend_mario } from "./backend/api_mario.js";
import { loadBackend_angel } from "./backend/api_angel.js";
import { loadBackend_angel_2 } from "./backend/v2/api_angel_2.js";
import { loadBackend_mario_2 } from "./backend/v2/api_mario_2.js";


import { handler } from "./frontend/build/handler.js";

//const Datastore = require('nedb');


var app = express();

app.use(cors());

var port = process.env.PORT || 12345;



// Modularización--------------------

app.use(express.json());
//app.use("/", express.static("./public")); // HTML que se mostrará por defecto en la ruta /



//////// PROXY JARA ////////
var paths = "/agro";
var apiServerHost = "https://sos2223-12.appspot.com/api/v2/agroclimatic";

app.use(paths, function(req, res) {
    var url = apiServerHost + req.url;
    req.pipe(request(url)).pipe(res);
});

//////// PROXY JARA ////////

//////// PROXY ANGEL ////////

/*
var paths2 = "/games";
var apiServerHost = "https://gamerpower.p.rapidapi.com/api/giveaways?platform=ps4";
app.use(paths2, function(req, res) {
    var url = apiServerHost + req.url;
    req.pipe(request(url)).pipe(res);
});
*/

/*var paths = "/games";
var apiServerHost = "https://gamerpower.p.rapidapi.com/api/giveaways?platform=ps4";
app.use(paths2, function(req, res) {
    var url = apiServerHost + req.url;
    req.pipe(request(url)).pipe(res);
});
*/
/*
app.use(`${BASE_API_GAMES}`, function(req, res){
    var url = "https://gamerpower.p.rapidapi.com/api/giveaways?platform=ps4";
    var head = {
        'X-RapidAPI-Host': 'gamerpower.p.rapidapi.com',
        'X-RapidAPI-Key': 'eca9d9dcb9mshdd4d65d4646bc18p192490jsn55ba9c868f8c'
    }
    req.pipe(request({ url: url, headers: head })).pipe(res);
});
*/
//////// PROXY ANGEL ////////

//////// PROXY MARIO ////////

// var paths3 = "/nba";
// var apiServerHost = "https://free-nba.p.rapidapi.com/players?page=0&per_page=25";
// app.use(paths3, function(req, res) {
//     var url = apiServerHost + req.url;
//     req.pipe(request(url)).pipe(res);
// });

//////// PROXY MARIO ////////


loadBackend_jara(app);
loadBackend_mario(app);
loadBackend_angel(app);
loadBackend_angel_2(app);
loadBackend_mario_2(app);


app.use(handler); // esto tiene que ir despues de la api


// ----------------------------------

app.listen(port, () => {
    console.log(`Server ready in port ${port}`);
});

const BASE_API_URL = "/api/v1";


