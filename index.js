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


//ruta JXVP
app.get("/samples/JXVP", (request, response) => {
    var data = [
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
    
    //Calculo de la media de personas de Almería con estudios de primer ciclo  
    const demandantesAlmeria = data.filter((dat) => dat.teritory === 'Almería');
    var sumaPrimerCiclo = 0;
    demandantesAlmeria.forEach(element => {
        sumaPrimerCiclo += element.first_cicle
    });
    
    var media = sumaPrimerCiclo / demandantesAlmeria.length;
    
    response.send(`Media de los demandantes de empleo con estudios de primer ciclo en Almería: ${media}`);
    console.log("New request");
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