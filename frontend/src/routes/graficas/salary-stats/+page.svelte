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
    //import {Navbar, Nav, NavItem, NavLink, NavbarBrand, Dropdown, DropdownToggle, DropdownMenu, DropdownItem,Button} from 'sveltestrap';
    

    onMount(async () => {
        getStats();
    });

    let API = "/api/v2/salary-stats";

    if (dev)
        API = "http://localhost:12345" + API;

    let stats = [];
    let province_gender_year =[]
    let salaried = [];
    let average_salary = [];
    let standard_deviation = []; 

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
          loadGraph();
      }else{
          console.log("Error cargando los datos");
      }
    }

    async function loadGraph(){
        Highcharts.chart('container', {
  chart: {
    type: 'scatter'
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
            categories: province_gender_year,
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
          name: 'Número de asalariados',
          data: salaried
        },{
          name: 'Salario medio',
          data: average_salary
        },{
          name: 'Desviación típica',
          data: standard_deviation
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

