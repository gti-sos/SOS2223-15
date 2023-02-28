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
let demandantesAlmeria = data.filter((dat) => dat.teritory === 'Almería');
var sumaPrimerCiclo = 0;
demandantesAlmeria.forEach(element => {
    sumaPrimerCiclo += element.first_cicle
});

var media = sumaPrimerCiclo / demandantesAlmeria.length;

console.log(`Media de los demandantes de empleo con estudios de primer ciclo en Almería: ${media}`);











