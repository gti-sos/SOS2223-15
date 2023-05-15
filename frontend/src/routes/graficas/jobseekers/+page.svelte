<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
<script src="https://code.highcharts.com/modules/exporting.js"></script>
<script src="https://code.highcharts.com/modules/export-data.js"></script>
<script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

<script>
    //@ts-nocheck
    import {onMount} from 'svelte';
    import {dev} from '$app/environment';
    
    let API = "/api/v1/jobseekers-studies";

    if (dev)
        API = "http://localhost:12345" + API;

    let jobseekers = [];
    let territorio_año =[]
    let primario = [];
    let fp = [];
    let general = []; 
    let total = [];

    async function getStats(){
      console.log("Fetching stats....");
      const res = await fetch(API);
      if(res.ok){
          const data = await res.json();
          jobseekers = data;
          console.log("Estadísticas recibidas: "+jobseekers.length);
          //inicializamos los arrays para mostrar los datos
      jobseekers.sort((a, b) => (a.year > b.year) ? 1 : ((b.year > a.year) ? -1 : 0));
          jobseekers.forEach((stat) => {
                console.log(stat);
                territorio_año.push(stat.territory+"-"+stat.year);
                primario.push(stat["primary"]);
                fp.push(stat["fp_program"]);
                general.push(stat["general_education"]);
                total.push(stat["total"]);           
          });
          console.log(primario);
          loadGraph();
      }else{
          console.log("Error cargando los datos");
      }
    }

    async function loadGraph(){
        Highcharts.chart('container', {
  chart: {
    type: 'area'
  },
  title: {
        text: 'Estudio de demandantes de empleo',
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
                text: "Provincia-Año",
                style: {
                    fontWeight: 'bold'
                }
            },
            categories: territorio_año,
  },
  yAxis: {
    title: {
                text: 'Nivel de estudios',
                style: {
                    fontWeight: 'bold'
                }
            }
  },
  credits: {
    enabled: false
  },
  series: [{
          name: 'Total',
          data: total
    },{
          name: 'Educacion General',
          data: general
        },{
          name: 'Programa FP',
          data: fp
        },{
          name: 'Educacion Primaria',
          data: primario
        }]
});
    }

    onMount(async () => {
        getStats();
    });
    
</script>

<main>
    <div id='chart'></div>
    <figure class="highcharts-figure" style="margin-left: 25px; margin-right:25px">
        <div id="container"></div>
      </figure>
</main>

