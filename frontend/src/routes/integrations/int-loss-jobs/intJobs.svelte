<script>
    // @ts-nocheck

    import { onMount } from "svelte";

    let API = "http://localhost:12345/api/v2/salary-stats";

    let API2 = "https://fitness-api.p.rapidapi.com/fitness";

    const key = "270ff849a5msh00fe775e3c2b3eep145b6cjsn281cd1b694f6";

    let lossJobs = [];
    let province_gender = [];
    let gender = [];
    let low_due_to_placement = [];
    let no_renovation = [];
    let other_reason = [];

    let cards = [];
    let card = [];
    let collectible = [];
    let manaCost = [];
    let min_radius = [];
    let max_radius = [];
    let min_period = [];
    let max_period = [];
    let min_temperature = [];
    let max_temperature = [];
    let min_distance_light_year = [];

    let foods = [];
    let id = [];
    let title = [];
    let difficulty = [];
    let images = [];

    onMount(async () => {
        //getStats();
        //getPlanets();
        getCards();
    });

    async function getStats() {
        console.log("Fetching stats....");
        const res = await fetch(API);
        if (res.ok) {
            const data = await res.json();
            lossJobs = data;
            console.log("Estadísticas recibidas: " + lossJobs.length);
            //inicializamos los arrays para mostrar los datos
            lossJobs.forEach((stat) => {
                console.log(stat);
                province_gender.push(stat.province + "-" + stat.gender);
                low_due_to_placement.push(stat.low_due_to_placement);
                no_renovation.push(stat.no_renovation);
                other_reason.push(stat.other_reason);
            });
            console.log(gender);
            loadGraph();
        } else {
            console.log("Error cargando los datos");
        }
    }

    async function getCards(){
        console.log("Fetching stats....");
        const url = 'https://hearthstone11.p.rapidapi.com/cards?page=1&pageSize=1';
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '270ff849a5msh00fe775e3c2b3eep145b6cjsn281cd1b694f6',
		'X-RapidAPI-Host': 'hearthstone11.p.rapidapi.com'
	}
};

        try {
            const response = await fetch(url, options);
            
            if(response.ok){
                const data = await response.json();
                cards = data;
                console.log("Cartas recibidas: "+cards.length);
                //inicializamos los arrays para mostrar los datos
               // planets.sort((a,b) => a.year-b.year); // Ordena los datos por año (Resta el año a al b, y si es menor, lo pone antes que el mayor) de menor a mayor.
               cards.forEach((card) => {
                        console.log(card);
                        collectible.push(card.collectible);
                        manaCost.push(card.manaCost);
                });
                console.log(collectible);
                //loadGraph();
            }else{
                console.log("Error cargando los datos");
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function loadGraph() {
        Highcharts.chart("container", {
            chart: {
                type: "area",
            },
            title: {
                text: "Estudio de asalariados en Andalucía",
                style: {
                    fontWeight: "bold",
                    fontSize: 30,
                    color: "black",
                },
            },
            subtitle: {
                text: "Biblioteca: HighCharts.js",
                style: {
                    fontWeight: "bold",
                    fontSize: 20,
                },
            },
            xAxis: {
                title: {
                    text: "Provincia-Género-Año",
                    style: {
                        fontWeight: "bold",
                    },
                },
                categories: title,
            },
            yAxis: {
                title: {
                    text: "",
                    style: {
                        fontWeight: "bold",
                    },
                },
            },
            credits: {
                enabled: false,
            },
            series: [
                {
                    name: "Desviación típica",
                    data: collectible,
                },
            ],
        });
    }
</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

<main>
    <div id="chart" />
    <figure class="highcharts-figure">
        <div id="container" />
    </figure>
</main>
