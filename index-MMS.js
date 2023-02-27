
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
  
  console.log(`La media de población masculina en ${provincia} es ${media}`);