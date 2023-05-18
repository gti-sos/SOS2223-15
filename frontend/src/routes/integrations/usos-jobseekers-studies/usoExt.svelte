<script>
    //@ts-nocheck
    import { onMount } from "svelte";

    let stream = [];

    let anyo = [];
    let imdb = [];

    let result = "";
    let resultStatus = "";



    onMount(async () => {
        getGraph();
    });

    const url = 'https://streaming-availability.p.rapidapi.com/v2/search/title?title=batman&country=us&show_type=movie&output_language=en';
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '45b40d1419msh6a3660ec6f75d0fp1d142fjsn170e12d29087',
            'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com'
        }
    };

    async function getGraph() {
        resultStatus = result = "";
        const res = await fetch(url, options);
        if (res.ok) {
            try {
                const data = await res.json();
                result = JSON.stringify(data, null, 2);
                stream = data.result;
                stream.sort((a, b) =>
                    a.year > b.year ? 1 : b.year > a.year ? -1 : 0
                );
                stream.forEach((stat) => {
                    console.log(stat);
                    anyo.push(stat['year']);
                    imdb.push(stat["imdbRating"]);
                });
                loadChart();
            } catch (error) {
                console.log(`Error parseando el resultado: ${error}`);
            }
            const status = await res.status;
            resultStatus = status;
        } else {
            console.log("Se ha producido un error en los datos");
        }
    }

    async function loadChart() {
        var options = {
          series: [{
          name: 'Puntuación IMDB',
          data: imdb
        }],
          chart: {
          height: 350,
          type: 'bar',
        },
        plotOptions: {
          bar: {
            borderRadius: 10,
            dataLabels: {
              position: 'top', // top, center, bottom
            },
          }
        },
        dataLabels: {
          offsetY: -20,
          style: {
            fontSize: '12px',
            colors: ["#304758"]
          }
        },
        
        xaxis: {
          categories: anyo,
          position: 'top',
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false
          },
          crosshairs: {
            fill: {
              type: 'gradient',
              gradient: {
                colorFrom: '#D8E3F0',
                colorTo: '#BED1E6',
                stops: [0, 100],
                opacityFrom: 0.4,
                opacityTo: 0.5,
              }
            }
          },
          tooltip: {
            enabled: true,
          }
        },
        yaxis: {
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false,
          },
        
        },
        title: {
            text: "Estadística de transmisiones disponibles",
            align: "center",
            style: {
                fontWeight: "bold",
                fontSize: "30px",
            },
        },
        subtitle: {
            text: "Gráfica con ApexCharts.js",
            align: "center",
            style: {
            fontSize: "20px",
            },
        }
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
    <br><div style="text-align:center;">
        <strong >Número de datos: {stream.length}</strong>
    </div>
    <br>
    <figure class="highcharts-figure" style="margin-right:25px">
        <div id="chart" />
      </figure>
</main>