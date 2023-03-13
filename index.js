var express = require("express");
var cool = require("cool-ascii-faces");
var bodyParser = require("body-parser");

var app = express();
var port = process.env.PORT || 12345;

app.use(bodyParser.json());

app.get("/cool", (request, response) => {
    response.send(cool());
    console.log("New request");
});

app.listen(port, ()=>{
    console.log(`Server ready in port ${port}`);
});

const BASE_API_URL = "/api/v1";

//-------------------------------------------------Parte Jara--------------------------------------------------------
var jobseekers = [
    {year:2006 , gender:"Ambos sexos" , teritory:"Almería" , illiterate_and_uneducated:5.943 , primary:1.062 , fp_program:1.232 , general_education:16.120 , senior_professional_technicians:1.001 , first_cicle:1.077 , second_and_third_cicle:1.025 , other:9 , total:27.469},
    {year:2006 , gender:"Ambos sexos" , teritory:"Almería" , illiterate_and_uneducated:2.767 , primary:68 , fp_program:51 , general_education:2.394 , senior_professional_technicians:21 , first_cicle:9 , second_and_third_cicle:2 , other:"-" , total:5.312},
    {year:2006 , gender:"Ambos sexos" , teritory:"Almería" , illiterate_and_uneducated:186 , primary:40 , fp_program:64 , general_education:723 , senior_professional_technicians:49 , first_cicle:59 , second_and_third_cicle:56 , other:"-" , total:1.177},
    {year:2006 , gender:"Ambos sexos" , teritory:"Almería" , illiterate_and_uneducated:8.896 , primary:1.170 , fp_program:1.347 , general_education:19.237 , senior_professional_technicians:1.070 , first_cicle:1.145 , second_and_third_cicle:1.084, other:9 , total:33.957},
    {year:2006 , gender:"Ambos sexos" , teritory:"Almería" , illiterate_and_uneducated:1.905 , primary:279 , fp_program:361 , general_education:3.784 , senior_professional_technicians:381 , first_cicle:641 , second_and_third_cicle:548 , other:5 , total:7.902},
    {year:2006 , gender:"Ambos sexos" , teritory:"Cádiz" , illiterate_and_uneducated:589 , primary:56 , fp_program:120 , general_education:1.942 , senior_professional_technicians:98 , first_cicle:61 , second_and_third_cicle:60 , other:1 , total:2.926},
    {year:2006 , gender:"Ambos sexos" , teritory:"Cádiz" , illiterate_and_uneducated:11.389 , primary:1.505 , fp_program:1.828 , general_education:24.963 , senior_professional_technicians:1.548 , first_cicle:1.846	, second_and_third_cicle:1.692 ,  other:14 , total:44.785},
    {year:2006 , gender:"Ambos sexos" , teritory:"Cádiz" , illiterate_and_uneducated:13.140 , primary:2.644 , fp_program:7.560 ,general_education:65.454 , senior_professional_technicians:4.778 , first_cicle:3.274 , second_and_third_cicle:2.531 , other:17 , total:99.399},
    {year:2006 , gender:"Ambos sexos" , teritory:"Cádiz" , illiterate_and_uneducated:5.803 , primary:28 , fp_program:242 , general_education:7.316 , senior_professional_technicians:90 , first_cicle:12 , second_and_third_cicle:4 , other:"-" , total:13.494},
    {year:2006 , gender:"Ambos sexos" , teritory:"Cádiz" , illiterate_and_uneducated:480 ,  primary:125	, fp_program:188 , general_education:3.164 , senior_professional_technicians:225 , first_cicle:230 , second_and_third_cicle:176	, other:1 ,	total:4.590}

];

const recurso_url = BASE_API_URL+"/jobseekers-studies";

//GET al recurso
app.get(recurso_url, (request, response) => {
    response.json(jobseekers);
    console.log("New GET to /jobseekers-studies");
    response.sendStatus(200);
});

//POST al recurso
app.post(recurso_url, (request, response) => {
    var newEntry = request.body;
    console.log(`newEntry = <${JSON.stringify(newEntry,null,2)}>`);
    console.log("New POST to /jobseekers-studies");
    jobseekers.push(newEntry);
    response.sendStatus(201).send('Nuevo dato creado correctamente');
});

//PUT al recurso
app.put(recurso_url, (request, response) => {
    response.sendStatus(405).send('No se permite hacer un PUT en esta ruta');
});

//DELETE al recurso
app.delete(recurso_url, (request, response) => {
    jobseekers = [];
    console.log("New DELETE to /jobseekers-studies");
    response.sendStatus(200);
});

//GET a ruta loadInitialData
var new_data = [];
app.get(recurso_url + "/loadInitialData", (request, response) => {
    if(new_data.length === 0){
        new_data.push(jobseekers);
        response.json(new_data);
        console.log("Se han creado datos para /jobseekers-studies/loadInitialData");
    } else {
        response.send('Esta ruta ya contiene datos');
        console.log('Esta ruta ya contiene datos');
    }
});

//No se puede hacer POST a loadInitialData
app.post(recurso_url + "/loadInitialData", (request, response) => {
    response.sendStatus(405).send('No se permite hacer un POST en esta ruta');
});


//GET a todas las estadísticas de Almeria
app.get(recurso_url + "/Almeria", (request, response) => {
    response.json(jobseekers.filter(dat => dat.teritory === 'Almería'));
    console.log("New GET to /jobseekers-studies/Almeria");
    response.sendStatus(200);
});


//-------------------------------------------------Parte Mario--------------------------------------------------------
//Codigo para el F05

//APARTADO CREAR 10 O MÁS DATOS RANDOM

const población_media = [
        [2022, "Ambos sexos", "Almería", 110379, 60831, 22827],
        [2022, "Ambos sexos", "Cadíz", 246181, 124697, 26756],
        [2022, "Ambos sexos", "Sevilla", 403262, 172309, 27654],
        [2022, "Hombres", "Almería", 51771, 27381, 11507],
        [2022, "Mujeres", "Córdoba", 90524, 40810, 8721],
        [2022, "Mujeres", "Almería", 58608, 33450, 11320],
        [2022, "Mujeres", "Córdoba", 90524, 40810, 8721],
        [2022, "Mujeres", "Sevilla", 200597, 101940, 13677],
        [2022, "Mujeres", "Jaén", 79768, 33345, 10257],
        [2022, "Mujeres", "Huelva", 80325, 30317, 9049],
        [2022, "Hombres", "Cadíz", 124802, 51697, 14619],
        [2022, "Hombres", "Córdoba", 88957, 27166, 11413],
        [2022, "Hombres", "Granada", 83366, 35666, 9755],
        [2022, "Hombres", "Huelva", 68019, 21665, 7518],
        [2022, "Hombres", "Sevilla", 195063, 70369, 13977]];

//TABLA AZUL
const rutaMMS = BASE_API_URL + "/loss-jobs";

//GET a ruta loadInitialData (crea datos si no los hay ya creados).
var crea_datos = [];
app.get(rutaMMS + "/loadInitialData", (request, response) => {
if(crea_datos.length === 0){
    crea_datos.push(población_media);
    response.json(crea_datos);
    console.log("Se han creado datos para /loss-jobs");
} else {
    response.send('Esta ruta ya contiene datos');
    console.log('Esta ruta ya contiene datos');
}
});

// GET al recurso loss-jobs

app.get(rutaMMS, (request, response) => {
  response.json(población_media);
  console.log("New GET to /loss-jobs");
  response.sendStatus(200);
});

//POST al recurso
app.post(rutaMMS, (request, response) => {
  var newEntry_mms = request.body;
  console.log(`newEntry = ${JSON.stringify(newEntry_amr,null,2)}`);
  console.log("New POST to /loss-jobs");
  población_media.push(newEntry_mms);
  response.sendStatus(201).send('Nuevo dato creado correctamente');
});


//PUT al recurso
app.put(rutaMMS, (request, response) => {
  response.sendStatus(405).send('No se permite hacer un PUT en esta ruta');
});

//DELETE al recurso
app.delete(rutaMMS, (request, response) => {
  población_media = [];
  console.log("New DELETE to /loss-jobs");
  response.sendStatus(200);
});


//No se puede hacer POST a loadInitialData
app.post(rutaMMS + "/loadInitialData", (request, response) => {
  response.sendStatus(405).send('No se permite hacer un POST en esta ruta');
});


//GET a todas las estadísticas de Cordoba
app.get(rutaMMS + "/Cordoba", (request, response) => {
  console.log(response.json(población_media.filter(dato => dato[0] === 'Córdoba')));
  console.log("New GET to /loss-jobs/Cordoba");
  response.sendStatus(200);
});

//-------------------------------------------------Parte Angel--------------------------------------------------------


const salario_medio = [["Almería", "male", 2021, 162.525, 21.311, 12.172], ["Almería", "female", 2021, 133.150, 20.786, 10.696], ["Cádiz",
    "male", 2021, 237.225, 25.200, 14.633], ["Cádiz", "female", 2021, 197.100, 22.189, 10.835],["Córdoba", "male", 2021, 159.800,
    23.220, 12.819], ["Córdoba", "female", 2021, 138.800, 21.573, 10.790], ["Granada", "male", 2021, 177.625, 24.186, 13.778], 
    ["Granada", "female", 2021, 161.125, 22.691, 11.540], ["Huelva", "male", 2021, 124.500, 22.875, 12.677], ["Huelva", "female", 
    2021, 126.975, 19.305, 8.513],["Almería", "male", 2020, 156.725, 21.163, 11.718], ["Almería", "female", 2020, 128.225, 20.535,
    10.149]];


const recurso_amr = BASE_API_URL+"/andalusian-population-salary-stats";


//GET a ruta loadInitialData (crea datos si no los hay ya creados).
var crea_datos = [];
app.get(recurso_url + "/loadInitialData", (request, response) => {
if(crea_datos.length === 0){
    crea_datos.push(salario_medio);
    response.json(crea_datos);
    console.log("Se han creado datos para /andalusian-population-salary-stats/loadInitialData");
} else {
    response.send('Esta ruta ya contiene datos');
    console.log('Esta ruta ya contiene datos');
}
});



// GET al recurso andalusian-population-salary-stats

app.get(recurso_amr, (request, response) => {
    response.json(salario_medio);
    console.log("New GET to /andalusian-population-salary-stats");
    response.sendStatus(200);
});



//POST al recurso
app.post(recurso_amr, (request, response) => {
    var newEntry_amr = request.body;
    console.log(`newEntry = ${JSON.stringify(newEntry_amr,null,2)}`);
    console.log("New POST to /andalusian-population-salary-stats");
    salario_medio.push(newEntry_amr);
    response.sendStatus(201).send('Nuevo dato creado correctamente');
});


//PUT al recurso
app.put(recurso_amr, (request, response) => {
    response.sendStatus(405).send('No se permite hacer un PUT en esta ruta');
});

//DELETE al recurso
app.delete(recurso_amr, (request, response) => {
    salario_medio = [];
    console.log("New DELETE to /andalusian-population-salary-stats");
    response.sendStatus(200);
});


//No se puede hacer POST a loadInitialData
app.post(recurso_amr + "/loadInitialData", (request, response) => {
    response.sendStatus(405).send('No se permite hacer un POST en esta ruta');
});


//GET a todas las estadísticas de Almeria
app.get(recurso_amr + "/Almeria", (request, response) => {
    console.log(response.json(salario_medio.filter(dato => dato[0] === 'Almería')));
    console.log("New GET to /andalusian-population-salary-stats/Almeria");
    response.sendStatus(200);
});




var filtro = salario_medio.filter(function(arr) {
    return arr[0].match("Almería");
});

var resultado = filtro.reduce((acc, curr) => {return acc + curr[4];}, 0)/filtro.length;

app.get("/samples/AMR", (request, response)=> {
    response.send(`La media del salario medio entre ambos géneros en la provincia de ${filtro[0][0]} es ${resultado}`);
    console.log(resultado);
});
