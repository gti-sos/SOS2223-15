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

app.listen(port, () => {
    console.log(`Server ready in port ${port}`);
});

const BASE_API_URL = "/api/v1";

//-------------------------------------------------Parte Jara--------------------------------------------------------
var jobseekers = [
    { year: 2006, gender: 'Ambos-sexos', territory: 'Almería', type: 'Parados-registrados', primary: 1.062, fp_program: 1.232, general_education: 16.120, total: 27.469 },
    { year: 2006, gender: 'Ambos-sexos', territory: 'Almería', type: 'TEAS', primary: 68, fp_program: 51, general_education: 2.394, total: 5.312 },
    { year: 2006, gender: 'Ambos-sexos', territory: 'Almería', type: 'Otros-DENOs', primary: 40, fp_program: 64, general_education: 723, total: 1.177 },
    { year: 2006, gender: 'Ambos-sexos', territory: 'Almería', type: 'Demandantes-no-ocupados-(DENOs)', primary: 1.170, fp_program: 1.347, general_education: 19.237, total: 33.957 },
    { year: 2006, gender: 'Ambos-sexos', territory: 'Almería', type: 'Demandantes-ocupados', primary: 279, fp_program: 361, general_education: 3784, total: 7.902 },
    { year: 2006, gender: 'Ambos-sexos', territory: 'Almería', type: 'Otros-demandantes-excluidos-del-paro-registrado', primary: 56, fp_program: 120, general_education: 1.942, total: 2.926 },
    { year: 2006, gender: 'Ambos-sexos', territory: 'Almería', type: 'Total-demandantes-de-empleo', primary: 1.505, fp_program: 1.828, general_education: 24.963, total: 44.785 },
    { year: 2006, gender: 'Ambos-sexos', territory: 'Cádiz', type: 'Parados-registrados', primary: 2.644, fp_program: 7.560, general_education: 65.454, total: 99.399 },
    { year: 2006, gender: 'Ambos-sexos', territory: 'Cádiz', type: 'TEAS', primary: 28, fp_program: 242, general_education: 7.316, total: 13.494 },
    { year: 2006, gender: 'Ambos-sexos', territory: 'Cádiz', type: 'Otros-DENOs', primary: 125, fp_program: 188, general_education: 3.164, total: 4.590 }
];



const recurso_url = BASE_API_URL + "/jobseekers-studies";

//GET al recurso
app.get(recurso_url, (request, response) => {
    const from = request.query.from;
    const to = request.query.to;

    //buscar datos del periodo
    if (from && to) {
        const datosPeriodo = jobseekers.filter(x => { return x.year >= from && x.year <= to });
        //GET de datos del periodo
        if (from >= to) {
            response.status(400).json("El rango es erróneo");
        } else {
            response.status(200).json(datosPeriodo);
            console.log(`New GET to /jobseekers-studies?from${from}&to${to}`);
        }
    } else {
        const { year } = request.query;
        //GET de datos de un año
        if (year) {
            const datosAño = jobseekers.filter(x => x.year === parseInt(year));
            response.status(200).json(datosAño);
            console.log(`New GET to /jobseekers-studies from ${year}`);
        } else {
            //GET de datos del recurso entero
            console.log(`New GET to /jobseekers-studies`);
            response.status(200).json(jobseekers);
        }
    }
    response.json(jobseekers);
    console.log("New GET to /jobseekers-studies");
    response.sendStatus(200);
});


//POST al recurso
app.post(recurso_url, (request, response) => {
    var newEntry = request.body;
    var num_param = 8;

    if (Object.keys(newEntry).length !== num_param) {
        //Error 400 si el número de parámetros es incorrecto
        response.status(400).send("Número de parámetros incorrecto");
    } else if (jobseekers.some(x => JSON.stringify(x) === JSON.stringify(newEntry))) {
        //Error 409 si el dato ya existe
        response.status(409).send("El dato ya existe");
    } else {
        console.log(`newEntry = <${JSON.stringify(newEntry, null, 2)}>`);
        console.log("New POST to /jobseekers-studies");
        jobseekers.push(newEntry);
        response.sendStatus(201).send('Nuevo dato creado correctamente');
    }
});

//PUT al recurso
app.put(recurso_url, (request, response) => {
    response.sendStatus(405).send('No se permite hacer un PUT en esta ruta');
});

//DELETE al recurso
app.delete(recurso_url, (request, response) => {
    if (!request.body || Object.keys(request.body).length === 0) {
        jobseekers = [];
        console.log("New DELETE to /jobseekers-studies");
        response.status(200).send("Datos borrados correctamente");
    } else {
        const { year, territory } = request.body;
        const objIndex = jobseekers.findIndex(x => x.year === year && x.territory === territory);
        if (objIndex === -1) {
            response.sendStatus(404).send('El dato no existe');
        } else {
            jobseekers.splice(objIndex, 1);
            response.status(200).send("Dato borrado correctamente");
        }
    }
});

//GET a ruta loadInitialData
var new_data = [];
app.get(recurso_url + "/loadInitialData", (request, response) => {
    if (new_data.length === 0) {
        new_data.push(jobseekers);
        response.json(new_data);
        console.log("Se han creado datos para /jobseekers-studies/loadInitialData");
    } else {
        response.json(new_data);
    }
});

//No se puede hacer POST a loadInitialData
app.post(recurso_url + "/loadInitialData", (request, response) => {
    response.sendStatus(405).send('No se permite hacer un POST en esta ruta');
});

//PUT a loadInitialData
app.put(recurso_url, (request, response) => {
    if (!request.body) {
        response.status(400).send("No hay datos");
    } else {
        new_data = request.body;
        response.status(200).send("Datos actualizados correctamente");
    }
});

//DELETE a loadInitialData
app.delete(recurso_url, (request, response) => {
    new_data = [];
    response.status(200).send("Datos actualizados correctamente");
});

//GET a los recursos de una ciudad
app.get(recurso_url + "/:territory", (request, response) => {
    const territory = request.params.territory;
    const from = request.query.from;
    const to = request.query.to;

    if (from && to) {
        const datosPeriodo = jobseekers.filter(x => x.territory === territory && x.year >= from && x.year <= to);
        //GET de datos del periodo
        if (from >= to) {
            response.status(400).json("El rango es erróneo");
        } else {
            response.status(200).json(datosPeriodo);
            console.log(`New GET to /jobseekers-studies/${territory}?from${from}&to${to}`);
        }
    } else {
        const datosTerrytory = jobseekers.filter(x => x.territory === territory);
        //GET de datos de una ciudad
        if (datosTerrytory.length === 0) {
            response.status(404).send("Ruta no existente");
        } else {
            response.status(200).json(datosTerrytory);
            console.log(`New GET to /jobseekers-studies`);
        }
    }
});

//GET a un dato concreto
app.get(recurso_url + "/:year/:gender/:territory/:type", (request, response) => {
    const { year, gender, territory, type } = request.params;

    const dato = jobseekers.find(x => x.year === parseInt(year) && x.gender === gender && x.territory === territory && x.type === type);
    if (dato) {
        response.status(200).json(dato);
        console.log(`New GET to /jobseekers-studies/${year}/${gender}/${territory}/${type}`);
    } else {
        response.status(404).send("Ruta no existente");
    }
});

//PUT a un dato concreto
app.put(recurso_url + "/:year/:gender/:territory/:type", (request, response) => {
    const { year, gender, territory, type } = request.params;
    const yearbody = request.body.year;
    const genderbody = request.body.gender;
    const territorybody = request.body.territory;
    const typebody = request.body.type;

    const dato = jobseekers.find(x => x.year === parseInt(year) && x.gender === gender && x.territory === territory && x.type === type);
    if (!dato || yearbody!==year || genderbody!==gender || territorybody!==territory || typebody!==type) {
        response.status(400).send("Dato erróneo");
    } else {
        dato.primary = request.body.primary || dato.primary;
        dato.fp_program = request.body.fp_program || dato.fp_program;
        dato.general_education = request.body.general_education || dato.general_education;
        dato.total = request.body.total || dato.total;
        response.status(200).send("Datos actualizados correctamente");
    }
});


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
const rutaMMS = BASE_API_URL + '/loss-jobs';

//GET a ruta loadInitialData (crea datos si no los hay ya creados).
var crea_datos = [];
app.get(rutaMMS + "/loadInitialData", (request, response) => {
    if (crea_datos.length === 0) {
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
    console.log(`newEntry = ${JSON.stringify(newEntry_amr, null, 2)}`);
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


const salario_medio = [{ "province": "Almería", "gender": "male", "year": 2021, "salaried": 162.525, "average_salary": 21.311, "standard_deviation": 12.172 },
{ "province": "Almería", "gender": "female", "year": 2021, "salaried": 133.150, "average_salary": 20.786, "standard_deviation": 10.696 },
{ "province": "Cádiz", "gender": "male", "year": 2021, "salaried": 237.225, "average_salary": 25.200, "standard_deviation": 14.633 },
{ "province": "Cádiz", "gender": "female", "year": 2021, "salaried": 197.100, "average_salary": 22.189, "standard_deviation": 10.835 },
{ "province": "Córdoba", "gender": "male", "year": 2021, "salaried": 159.800, "average_salary": 23.220, "standard_deviation": 12.819 },
{ "province": "Córdoba", "gender": "female", "year": 2021, "salaried": 138.800, "average_salary": 21.573, "standard_deviation": 10.790 },
{ "province": "Granada", "gender": "male", "year": 2021, "salaried": 177.625, "average_salary": 24.186, "standard_deviation": 13.778 },
{ "province": "Granada", "gender": "female", "year": 2021, "salaried": 161.125, "average_salary": 22.691, "standard_deviation": 11.540 },
{ "province": "Huelva", "gender": "male", "year": 2021, "salaried": 124.500, "average_salary": 22.875, "standard_deviation": 12.677 },
{ "province": "Huelva", "gender": "female", "year": 2021, "salaried": 126.975, "average_salary": 19.305, "standard_deviation": 8.513 },
{ "province": "Almería", "gender": "male", "year": 2020, "salaried": 156.725, "average_salary": 21.163, "standard_deviation": 11.718 },
{ "province": "Almería", "gender": "female", "year": 2020, "salaried": 128.225, "average_salary": 20.535, "standard_deviation": 10.149 }];


const recurso_amr = BASE_API_URL + "/andalusian-population-salary-stats";


//GET a ruta loadInitialData (crea datos si no los hay ya creados).
var crea_datos = [];
app.get(recurso_amr + "/loadInitialData", (request, response) => {
    if (crea_datos.length === 0) {
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
    console.log(`newEntry = ${JSON.stringify(newEntry_amr, null, 2)}`);
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
