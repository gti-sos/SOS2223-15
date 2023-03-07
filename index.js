var express = require("express");
var cool = require("cool-ascii-faces");

var app = express();
var port = process.env.PORT || 12345;


app.get("/cool", (request, response) => {
    response.send(cool());
    console.log("New request");
});

app.listen(port, ()=>{
    console.log(`Server ready in port ${port}`);
});

const BASE_API_URL = "/api/v1";

//Parte Jara
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

app.get(BASE_API_URL+"/jobseekers-according-to-level-of-studies-completed-stats", (request, response) => {
    response.json(jobseekers);
    console.log("New GET to /jobseekers-according-to-level-of-studies-completed-stats");
});

app.post(BASE_API_URL+"/jobseekers-according-to-level-of-studies-completed-stats", (request, response) => {
    var newEntry = request.body;
    console.log(`newEntry = <${JSON.stringify(newEntry,null,2)}>`);
    console.log("New POST to /jobseekers-according-to-level-of-studies-completed-stats");
});

//ruta MMS
app.get("/samples/MMS", (req, res)=> {

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




//ruta AMR

app.get("/samples/AMR", (request, response)=> {
    const lista_datos = [["Almería", "male", 2021, 162.525, 21.311, 12.172], ["Almería", "female", 2021, 133.150, 20.786, 10.696], ["Cádiz",
    "male", 2021, 237.225, 25.200, 14.633], ["Cádiz", "female", 2021, 197.100, 22.189, 10.835],["Córdoba", "male", 2021, 159.800,
    23.220, 12.819], ["Córdoba", "female", 2021, 138.800, 21.573, 10.790], ["Granada", "male", 2021, 177.625, 24.186, 13.778], 
    ["Granada", "female", 2021, 161.125, 22.691, 11.540], ["Huelva", "male", 2021, 124.500, 22.875, 12.677], ["Huelva", "female", 
    2021, 126.975, 19.305, 8.513],["Almería", "male", 2020, 156.725, 21.163, 11.718], ["Almería", "female", 2020, 128.225, 20.535,
    10.149]];


    var filtro = lista_datos.filter(function(arr) {
        return arr[0].match("Almería");
    });

    var resultado = filtro.reduce((acc, curr) => {return acc + curr[4];}, 0)/filtro.length;

    response.send(`La media del salario medio entre ambos géneros en la provincia de ${filtro[0][0]} es ${resultado}`);
    console.log(resultado);
});
