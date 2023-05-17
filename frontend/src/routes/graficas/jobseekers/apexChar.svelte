<script>
  // @ts-nocheck
  import { onMount } from "svelte";

  let API = "https://sos2223-15.appspot.com/api/v1/jobseekers-studies";

  let jobseekers = [];
  let territorio_año = [];
  let primario = [];
  let fp = [];
  let general = [];
  let total = [];

  let result = "";
  let resultStatus = "";

  onMount(async () => {
    getGraph();
  });


  async function getGraph() {
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

  function loadGraph() {
    var options = {
      series: [
        {
          name: "Educacion Primaria",
          data: primario,
        },
        {
          name: "Programa FP",
          data: fp,
        },
        {
          name: "Educacion General",
          data: general,
        },
        {
          name: "Total",
          data: total,
        },
      ],
      chart: {
        type: "area",
        height: 350,
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "straight",
      },

      title: {
        text: "Estudio de demandantes de empleo",
        align: "center",
        style: {
          fontSize: "30px",
        },
      },
      subtitle: {
        text: "Biblioteca: ApexCharts.js",
        align: "center",
        style: {
          fontSize: "20px",
        },
      },

      xaxis: {
        title: {
          text: "Provincia-Año",
          style: {
            fontWeight: "bold",
          },
        },
        categories: territorio_año,
      },
      yaxis: {
        title: {
          text: "Nivel de estudios",
          style: {
            fontWeight: "bold",
          },
        },
      },
    };

    var chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();
  }
</script>

<svelte:head>
  <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
  <script
    type="text/javascript"
    src="https://cdn.jsdelivr.net/npm/chart.js@3.7.1/dist/chart.min.js"
  ></script>
</svelte:head>

<main>
  <figure class="highcharts-figure" style="margin-right:25px">
    <div id="chart" />
  </figure>
  <hr style="text-align: right; margin-left: 100px; margin-right: 100px;">
</main>
