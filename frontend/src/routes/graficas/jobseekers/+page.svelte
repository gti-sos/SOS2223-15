
<script>
  //@ts-nocheck
  import {onMount} from 'svelte';
  
  let API = "https://sos2223-15.appspot.com/api/v1/jobseekers-studies";

  let jobseekers = [];
  let territorio_año =[]
  let primario = [];
  let fp = [];
  let general = []; 
  let total = [];

  let result = "";
  let resultStatus = "";

  onMount(async () => {
    getGraph();
  });

  async function getGraph(){
      resultStatus = result = "";
      const res = await fetch(API, {
      method: "GET",
      });
      if (res.ok) {
      try{
          const data = await res.json();
          jobseekers = data;
          jobseekers.sort((a, b) => (a.year > b.year) ? 1 : ((b.year > a.year) ? -1 : 0));
          jobseekers.forEach((stat) => {
          console.log(stat);
          territorio_año.push(stat.territory + "-" + stat.year);
          primario.push(stat["primary"]);
          fp.push(stat["fp_program"]);
          general.push(stat["general_education"]);
          total.push(stat["total"]);
          });
                      
      }catch(error){
          console.log(`Error devolviendo la gráfica: ${error}`);
      }
      const status = await res.status;
      resultStatus = status;
      } else {
      console.log("Error cargando los datos");
      }
      loadGraph();
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
  
</script>

<svelte:head>
  <script src="https://code.highcharts.com/highcharts.js"></script>
  <script src="https://code.highcharts.com/modules/exporting.js"></script>
  <script src="https://code.highcharts.com/modules/export-data.js"></script>
  <script src="https://code.highcharts.com/modules/accessibility.js"></script>

  <title>SOS2223-15 Graficas-Demandantes-Empleo</title>
</svelte:head>

<main>
  <figure class="highcharts-figure" style=" margin-right:25px">
      <div id="container"></div>
  </figure>
</main>

