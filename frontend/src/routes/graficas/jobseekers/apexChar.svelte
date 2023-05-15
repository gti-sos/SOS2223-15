<script>
  // @ts-nocheck
  import { onMount } from "svelte";
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  import { dev } from "$app/environment";

  let API = "/api/v1/jobseekers-studies";

  if (dev) API = "http://localhost:12345" + API;

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
      const data = await res.json();
      jobseekers = data;
      console.log("Estadísticas recibidas: " + jobseekers.length);
      //inicializamos los arrays para mostrar los datos
      jobseekers.forEach((stat) => {
        console.log(stat);
        territorio_año.push(stat.territory + "-" + stat.year);
        primario.push(stat.primary);
        fp.push(stat.fp_program);
        general.push(stat.general_education);
        total.push(stat.total);
      });
      console.log(primario);
      loadGraph();
    } else {
      console.log("Error cargando los datos");
    }
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
  <figure
    class="highcharts-figure"
    style="margin-left: 25px; margin-right:25px"
  >
    <div id="chart" />
  </figure>
</main>
<div id="chartContainer" style="height: 370px; width: 100%;" />
