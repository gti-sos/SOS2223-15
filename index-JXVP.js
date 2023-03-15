var data = [
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

//Calculo de la media de personas de Almería con estudios de primer ciclo  
let demandantesAlmeria = data.filter((dat) => dat.teritory === 'Almería');
var sumaPrimerCiclo = 0;
demandantesAlmeria.forEach(element => {
    sumaPrimerCiclo += element.first_cicle
});

var media = sumaPrimerCiclo / demandantesAlmeria.length;

console.log(`Media de los demandantes de empleo con estudios de primer ciclo en Almería: ${media}`);











