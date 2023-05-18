<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>
<script>
    // @ts-nocheck
    
    import {onMount} from "svelte";
    //import { CLAVE_COMIDAS } from "config.js";
    //import { dev } from "$app/environment";
    let API = "http://localhost:12345/api/v2/salary-stats";
    
    let API2 = "https://planets-by-api-ninjas.p.rapidapi.com/v1/planets?name=Mars";

    //const key = CLAVE_COMIDAS; comentario
    
    let stats = [];
    let province_gender_year =[]
    let salaried = [];
    let average_salary = [];
    let standard_deviation = []; 

    let planets = [];
    let name = [];
    let min_mass = [];
    let max_mass = [];
    let min_radius = [];
    let max_radius = [];
    let min_period = [];
    let max_period = [];
    let min_temperature = [];
    let max_temperature = [];
    let min_distance_light_year = [];

    let foods=[];
    let id = [];
    let title = [];
    let difficulty = [];
    let images = [];




    onMount(async () =>{
        //getStats();
        //getPlanets();
        getMexican();
    });

    async function getStats(){
      console.log("Fetching stats....");
      const res = await fetch(API);
      if(res.ok){
          const data = await res.json();
          stats = data;
          console.log("Estadísticas recibidas: "+stats.length);
          //inicializamos los arrays para mostrar los datos
          stats.sort((a,b) => a.year-b.year); // Ordena los datos por año (Resta el año a al b, y si es menor, lo pone antes que el mayor) de menor a mayor.
          stats.forEach((stat) => {
                console.log(stat);
                province_gender_year.push(stat.province+"-"+stat.gender+"-"+stat.year);
                salaried.push(stat.salaried);
                average_salary.push(stat.average_salary);
                standard_deviation.push(stat.standard_deviation);
          });
          console.log(salaried);
          //loadGraph();
      }else{
          console.log("Error cargando los datos");
      }
    }


    async function getPlanets(){
        console.log("Fetching stats....");
        const url = 'https://planets-by-api-ninjas.p.rapidapi.com/v1/planets?name=Mars';
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': key,
		        'X-RapidAPI-Host': 'the-mexican-food-db.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            
            if(response.ok){
                const data = await response.json();
                planets = data;
                console.log("Planetas recibidos: "+planets.length);
                //inicializamos los arrays para mostrar los datos
               // planets.sort((a,b) => a.year-b.year); // Ordena los datos por año (Resta el año a al b, y si es menor, lo pone antes que el mayor) de menor a mayor.
                planets.forEach((planet) => {
                        console.log(planet);
                        min_mass.push(planet.min_mass);
                        max_mass.push(planet.max_mass);
                        min_radius.push(planet.min_radius);
                        max_radius.push(planet.max_radius);
                });
                console.log(min_mass);
                //loadGraph();
            }else{
                console.log("Error cargando los datos");
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function getMexican(){
        console.log("Fetching stats....");
        const url = 'https://the-mexican-food-db.p.rapidapi.com/';
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'b72bf7a6a9mshc58f9ea15845135p17ac66jsne782008c78e3',
		        'X-RapidAPI-Host': 'the-mexican-food-db.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            
            if(response.ok){
                const data = await response.json();
                foods = data;
                console.log("Recetas recibidas: "+foods.length);
                //inicializamos los arrays para mostrar los datos
               // planets.sort((a,b) => a.year-b.year); // Ordena los datos por año (Resta el año a al b, y si es menor, lo pone antes que el mayor) de menor a mayor.
                foods.slice(0,5).forEach((food) => {
                        console.log(food);
                        id.push(parseInt(food.id));
                        title.push(food.title);
                        difficulty.push(food.difficulty);
                        images.push(food.images);
                });
                console.log(id);
                loadGraph();
            }else{
                console.log("Error cargando los datos");
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function loadGraph(){
        Highcharts.chart('container', {
        chart: {
            type: 'area'
        },
        title: {
                text: 'Estudio de asalariados en Andalucía',
                style: {
                        fontWeight: 'bold',
                        fontSize: 30,
                        color: 'black'
                    },
            },
            subtitle: {
                text: 'Biblioteca: HighCharts.js',
                    style:{
                        fontWeight: 'bold',
                        fontSize: 20,
                    },
            },
        xAxis: {
            title:{
                        text: "Provincia-Género-Año",
                        style: {
                            fontWeight: 'bold'
                        }
                    },
                    categories: title,
        },
        yAxis: {
            title: {
                        text: '',
                        style: {
                            fontWeight: 'bold'
                        }
                    }
        },
        credits: {
            enabled: false
        },
        series: [{
                name: 'Desviación típica',
                data: id
                }]
        });
    }

</script>


<main>
    <div id='chart'></div>
    <figure class="highcharts-figure">
        <div id="container"></div>
    </figure>
</main>