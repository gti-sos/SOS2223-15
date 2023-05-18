<script>
    //@ts-nocheck
    import { onMount } from "svelte";

    let API = "https://sos2223-15.appspot.com/api/v1/jobseekers-studies";

    let result = "";
    let resultStatus= "";
    
    let apiExt = [];
    let ids = [];
    let tvseries = [];
    let movs = [];

    let territorio_año = [];

    let jobseekers = [];
    let primario = [];
    let fp = [];
    let general = [];
    let total = [];

    let result2 = "";
    let resultStatus2 = "";

    onMount(async () => {
        getGraph();
    });

    const url = 'https://unogsng.p.rapidapi.com/countries';
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '45b40d1419msh6a3660ec6f75d0fp1d142fjsn170e12d29087',
        'X-RapidAPI-Host': 'unogsng.p.rapidapi.com'
      }
    };


    async function getGraph(){
        resultStatus = result = "";
        const res = await fetch(API, {
            method: "GET"
        });

        if(res.ok){   
            try{
                const data = await res.json();
                result = JSON.stringify(data, null, 2);
                jobseekers = data;
                jobseekers.sort((a, b) => (a.year > b.year) ? 1 : ((b.year > a.year) ? -1 : 0));
                jobseekers.forEach(stat =>{
                    console.log(stat);
                    territorio_año.push(stat.territory+"-"+stat.year); 
                    primario.push(stat["primary"]); 
                    fp.push(stat["fp_program"]); 
                    general.push(stat["general_education"]); 
                    total.push(stat["total"]); 
                    
                    ids.push(0);
                    tvseries.push(0);
                    movs.push(0);
                });
            }catch(error){
                console.log(`Error parseando el resultado: ${error}`);
            }
            const status = await res.status;
            resultStatus = status;
        }else{
            console.log("Error al devolver la gráfica");
        } 

        resultStatus2 = result2 = "";
        const res2 = await fetch(url, options);
        if(res2.ok){
            try{
                const data2 = await res2.json();
                result2 = JSON.stringify(data2, null, 2);
                apiExt = data2.results;
                apiExt.forEach(stat =>{
                  console.log(stat);
                  territorio_año.push(stat.country + '-' + stat.countrycode);
                  ids.push(stat["tvids"]);
                  tvseries.push(stat["tseries"]);
                  movs.push(stat["tmovs"]);

                  primario.push(0); 
                  fp.push(0); 
                  general.push(0); 
                  total.push(0);
                });
                
            }catch(error){
                console.log(`Error devolviendo la gráfica: ${error}`);
            }
            const status2 = await res2.status;
            resultStatus2 = status2;
            
        }else{
            console.log("Error al cargar la gráfica");
        }
       
            
        loadGraph();
    }

    async function loadGraph() {
        var options = {
            series: [{
                name: 'Ids TV',
                data: ids 
            },{
                name: 'Series TV',
                data: tvseries 
            },{
                name: 'Pelis TV',
                data: movs 
            },{
                name: 'Primaria',
                data: primario
            }, {
                name: 'FP',
                data: fp
            }, {
                name: 'Educación',
                data: general
            }, {
                name: 'Total',
                data: total
            }],
          chart: {
          type: 'bar',
          height: 350
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded'
          },
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },
        xaxis: {
            title: {
          style: {
            fontWeight: "bold",
          },
        },
        categories: territorio_año,
        },
        yaxis: {
          title: {
            text: 'Valor'
          }
        },
        fill: {
          opacity: 1
        },
        title: {
            text: "Estadísticas unogsNG API y Demandantes de empleo",
            align: "center",
            style: {
            fontSize: "30px",
            },
        },
        subtitle: {
            text: "Gráfica con ApexCharts.js",
            align: "center",
            style: {
            fontSize: "20px",
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
  <br><div style="text-align:center;">
    <strong >Número de datos: {apiExt.length+jobseekers.length}</strong>
</div>
<br>
  <figure class="highcharts-figure" style="margin-left: 25px; margin-right:25px">
    <div id="chart" />
  </figure>
</main>