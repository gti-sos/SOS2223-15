const lista = [["Almería", "male", 2021, 162.525, 21.311, 12.172], ["Almería", "female", 2021, 133.150, 20.786, 10.696], ["Cádiz",
"male", 2021, 237.225, 25.200, 14.633], ["Cádiz", "female", 2021, 197.100, 22.189, 10.835],["Córdoba", "male", 2021, 159.800,
 23.220, 12.819], ["Córdoba", "female", 2021, 138.800, 21.573, 10.790], ["Granada", "male", 2021, 177.625, 24.186, 13.778], 
 ["Granada", "female", 2021, 161.125, 22.691, 11.540], ["Huelva", "male", 2021, 124.500, 22.875, 12.677], ["Huelva", "female", 
 2021, 126.975, 19.305, 8.513],["Almería", "male", 2020, 156.725, 21.163, 11.718], ["Almería", "female", 2020, 128.225, 20.535,
 10.149]];


var filtro = lista.filter(function(arr) {
    return arr[0].match("Almería");
});

var sum = filtro.reduce((acc, curr) => {
    return acc + curr[4];
  }, 0)/filtro.length;

console.log(sum);