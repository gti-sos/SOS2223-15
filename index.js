var express = require("express");
var cool = require("cool-ascii-faces");
var bodyParser = require("body-parser");
const mudulo_jara = require("./Modulos/api_jara");
const modulo_mario = require("./Modulos/api_mario.js");
const Datastore = require('nedb');

db_api_mario = new Datastore();

var app = express();
var port = process.env.PORT || 12345;

app.use(bodyParser.json());

mudulo_jara(app);
modulo_mario.register(app, db_api_mario);

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
{province:"Almería", gender:"male", year:2021, salaried:162525, average_salary:21311, standard_deviation:12172},
{province:"Almería", gender:"female", year:2021, salaried:133150, average_salary:20786, standard_deviation:10696},
{province:"Cádiz",gender:"male",year: 2021, salaried:237225, average_salary:25200, standard_deviation:14633},
{province:"Cádiz", gender:"female", year:2021, salaried:197100, average_salary:22189, standard_deviation:10835},
{province:"Córdoba", gender:"male", year:2021, salaried:159800,average_salary:23220, standard_deviation:12819},
{province:"Córdoba", gender:"female", year:2021, salaried:138800, average_salary:21573, standard_deviation:10790},
{province:"Granada", gender:"male", year:2021, salaried:177625, average_salary:24186, standard_deviation:13778}, 
{province:"Granada", gender:"female", year:2021, salaried:161125, average_salary:22691, standard_deviation:11540},
{province:"Huelva", gender:"male", year:2021, salaried:124500, average_salary:22875, standard_deviation:12677},
{province:"Huelva", gender:"female", year:2021, salaried:126975, average_salary:19305, standard_deviation:8513},
{province:"Almería", gender:"male", year:2020, salaried:156725, average_salary:21163, standard_deviation:11718},
{province:"Almería", gender:"female", year:2020, salaried:128225, average_salary:20535, standard_deviation:10149}];


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


// GETs al recurso de varias formas. Teniendo en cuenta querys y sin tenerlas en cuenta. No están por separado porque puede funcionar
// mal (a veces se ejecuta un get antes que otro y no devuelve el resultado esperado, será por el orden de ejecución de JS)

app.get(recurso_amr, (request, response) => {
    const from = request.query.from; //Con el .query, cogemos todos los datos de la query de la url, es decir, lo que viene en la url tras la ? (url?year=2021)
    const to = request.query.to;

    //GET con rango de fechas si se especifica uno
    if (from && to) {
        const datosRango = salario_medio.filter(x => { return x.year >= from && x.year <= to });
        //GET de datos del periodo
        if (from >= to) {
            response.status(400).json("El rango es erróneo");
        } else {
            response.status(200).json(datosRango);
            console.log(`New GET to /andalusian-population-salary-stats?from${from}&to${to}`);
        }
    } else {
        const  year  = request.query.year;
        //GET de datos de un año dado en la query (con la ?year=algo en la url)
        if (year) {
            const datosAño = salario_medio.filter(x => x.year === parseInt(year));
            response.status(200).json(datosAño);
            console.log(`New GET to /andalusian-population-salary-stats from ${year}`);
        } else {
            //GET de datos del recurso entero
            console.log(`New GET to /andalusian-population-salary-stats`);
            response.status(200).json(salario_medio);
        }
    }
});



//GET a un recurso concreto usando filtro de año con parámetros en la url.

app.get(recurso_amr+"/:year", (request, response) => {
    const year = request.params.year.slice([5]); // Con esto, obtenemos el valor de la clave "year" de la url, si es que se le pasa dicho parámetro al realizar la petición (en realidad devuelve "year=año", por eso se hace el slicing)
    if(year != undefined){
        response.json(salario_medio.filter( m => m.year == year));
        console.log(`New Get to /andalusian-population-salary-stats filtering by year (${year})`);
        response.sendStatus(200);
    }
    else{
        response.json(salario_medio);
        console.log("New GET to /andalusian-population-salary-stats", year);
        response.sendStatus(200);
    }
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

//PUT a un recurso (un dato concreto)

app.put(recurso_amr + "/:province/:gender/:year", (request, response) => {
    const { province, gender, year } = request.params;
    var body = request.body;
    var updated = false;

    if ( body.province === province && body.gender === gender && body.year === parseInt(year)) { // verifica si los valores de año coinciden
        people = people.map(x => {
            if (x.province === province && x.gender === gender && x.year === parseInt(year)) {
                x.salaried = body.salaried;
                x.average_salary = body.average_salary;
                x.standard_deviation = body.standard_deviation;
                updated = true;
            }
            return x;
        });

        if (updated) {
            console.log(`New PUT a /andalusian-population-salary-stats/${province}/${gender}/${year}`);
            response.status(200).send("Actualizado");
        } else {
            console.log("No se ha encontrado el dato");
            response.status(400).send("No se ha encontrado el dato");
        }
    } else {
        console.log("Los datos de la URL no coinciden con los datos de la solicitud");
        response.status(400).send(`Los datos de la URL no coinciden con los datos de la solicitudddd ${province} ${year} ${body.year} ${body.province}`); //Esto se mostrará en Postman cuando se haga una petición.
    }
});



//PUTs ----------------------------------------------

//PUT a la colección está prohibido.
app.put(recurso_amr, (request, response) => {
    response.sendStatus(405).send('No se permite hacer un PUT en esta ruta');
});

app.put(recurso_amr, (request, response) => {
    
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





/*
//GET a todas las estadísticas de Almeria
app.get(recurso_amr + "/Almeria", (request, response) => {
    console.log(response.json(salario_medio.filter(dato => dato === 'Almería')));
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
*/
