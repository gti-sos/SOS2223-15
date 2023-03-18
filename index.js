var express = require("express");
var cool = require("cool-ascii-faces");
var bodyParser = require("body-parser");
const mudulo_jara = require("./Modulos/api_jara");
const modulo_mario = require("./Modulos/api_mario.js");

var app = express();
var port = process.env.PORT || 12345;

app.use(bodyParser.json());

mudulo_jara(app);
modulo_mario(app);

app.listen(port, () => {
    console.log(`Server ready in port ${port}`);
});

const BASE_API_URL = "/api/v1";

//-------------------------------------------------Parte Mario--------------------------------------------------------
app.get("/samples/MMS", (req, res) => {

    const lista = [[2022, "Ambos sexos", "Almería", 110379, 60831, 22827],
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
    [2022, "Hombres", "Sevilla", 195063, 70369, 13977],];



    const provincia = "Córdoba";
    const género = "Hombres";
    const indiceGeografica = 2; // índice del campo que contiene la información geográfica
    const indicePoblación = 3; // índice del campo que contiene la población total
    const indiceGénero = 4; // índice del campo que contiene la población masculina

    // Filtramos los datos que pertenecen a la provincia y al género especificados
    const datosFiltrados = lista.filter(
        (fila) => fila[indiceGeografica] === provincia && fila[1] === género
    );

    // Obtenemos la media de la población masculina
    const suma = datosFiltrados.reduce((acc, fila) => acc + fila[indiceGénero], 0);
    const media = suma / datosFiltrados.length;

    res.send(`La media de población masculina en ${provincia} es ${media}`);
    console.log("New request");
});

//-------------------------------------------------Parte Angel--------------------------------------------------------


var salario_medio = [
{province:"Almería", gender:"male", year:2021, salaried:162.525, average_salary:21.311, standard_deviation:12.172},
{province:"Almería", gender:"female", year:2021, salaried:133.150, average_salary:20.786, standard_deviation:10.696},
{province:"Cádiz",gender:"male",year: 2021, salaried:237.225, average_salary:25.200, standard_deviation:14.633},
{province:"Cádiz", gender:"female", year:2021, salaried:197.100, average_salary:22.189, standard_deviation:10.835},
{province:"Córdoba", gender:"male", year:2021, salaried:159.800,average_salary:23.220, standard_deviation:12.819},
{province:"Córdoba", gender:"female", year:2021, salaried:138.800, average_salary:21.573, standard_deviation:10.790},
{province:"Granada", gender:"male", year:2021, salaried:177.625, average_salary:24.186, standard_deviation:13.778}, 
{province:"Granada", gender:"female", year:2021, salaried:161.125, average_salary:22.691, standard_deviation:11.540},
{province:"Huelva", gender:"male", year:2021, salaried:124.500, average_salary:22.875, standard_deviation:12.677},
{province:"Huelva", gender:"female", year:2021, salaried:126.975, average_salary:19.305, standard_deviation:8.513},
{province:"Almería", gender:"male", year:2020, salaried:156.725, average_salary:21.163, standard_deviation:11.718},
{province:"Almería", gender:"female", year:2020, salaried:128.225, average_salary:20.535, standard_deviation:10.149}];


const recurso_amr = BASE_API_URL + "/andalusian-population-salary-stats";

// GETs ------------------------------


//GET a ruta loadInitialData (crea datos si no los hay ya creados).
var crea_datos = [];
app.get(recurso_amr + "/loadInitialData/", (request, response) => {
if(crea_datos.length === 0){
    response.json(salario_medio.slice(",")); //No mostramos crea_datos.push(salario_medio.slice()) porque lo estaría metiendo todo dentro de una lista.
    crea_datos.push(salario_medio.slice(","));
    console.log("Se han creado datos para /andalusian-population-salary-stats/loadInitialData");
} else {
    response.send(`Esta ruta ya contiene datos: ${JSON.stringify(salario_medio.slice(","))}`);
    console.log('Esta ruta ya contiene datos'); //Mensaje por consola.
}
});



// GET al recurso andalusian-population-salary-stats

app.get(recurso_amr, (request, response) => {
    response.json(salario_medio);
    console.log("New GET to /andalusian-population-salary-stats");
    response.sendStatus(200);
});

//GET a un recurso concreto usando filtro de año.

app.get(recurso_amr+"/:year", (request, response) => {
    const year = request.params.year.slice([5]); // Con esto, obtenemos el valor de la clave "year" de la url, si es que se le pasa dicho parámetro al realizar la petición (en realidad devuelve "year=año", por eso se hace el slicing)
    if(year != undefined){
        response.json(salario_medio.filter( m => m.year == year));
        console.log(`New Get to /andalusian-population-salary-stats filtering by year (${year})`);
        //response.sendStatus(200);
    }
    else{
        response.json(salario_medio);
        console.log("New GET to /andalusian-population-salary-stats", year);
        //response.sendStatus(200);
    }
});


// GET con rango de fecha

app.get(recurso_amr + '/andalusian-population-salary-stats', (req, res) => {
    const { from, to } = req.query;
    let filteredCampings = salario_medio;
    if (from && to) {
      filteredCampings = salario_medio.filter(camping => {
        const year = salario_medio.year;
        return year >= from && year <= to;
      });
    }
    if (filteredCampings.length === 0) {
      return res.status(404).json({ error: 'No campings found.' });
    }
    res.json(filteredCampings);
  });



//POSTs --------------------------------------------

//POST al recurso
app.post(recurso_amr, (request, response) => {
    var newEntry_amr = request.body;
    console.log(`newEntry = ${JSON.stringify(newEntry_amr, null, 2)}`);
    console.log("New POST to /andalusian-population-salary-stats");
    salario_medio.push(newEntry_amr);
    response.sendStatus(201).send('Nuevo dato creado correctamente');
});


//PUTs ----------------------------------------------

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
    console.log(response.json(salario_medio.filter(dato => dato === 'Almería')));
    console.log("New GET to /andalusian-population-salary-stats/Almeria");
    response.sendStatus(200);
});



/*
var filtro = salario_medio.filter(function(arr) {
    return arr[0].match("Almería");
});

var resultado = filtro.reduce((acc, curr) => {return acc + curr[4];}, 0)/filtro.length;

app.get("/samples/AMR", (request, response)=> {
    response.send(`La media del salario medio entre ambos géneros en la provincia de ${filtro[0][0]} es ${resultado}`);
    console.log(resultado);
});
*/
