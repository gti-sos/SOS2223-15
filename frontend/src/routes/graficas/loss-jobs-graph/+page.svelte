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
    
    let API = "/api/v2/loss-jobs";

    if (dev)
        API = "http://localhost:12345" + API;

    let lossJobs = [];
    let province_year =[]
    let gender = [];
    let low_due_to_placement = []; 
    let no_renovation = [];
    let other_reason = [];

    async function getStats(){
      console.log("Fetching stats....");
      const res = await fetch(API);
      if(res.ok){
          const data = await res.json();
          lossJobs = data;
          console.log("Estadísticas recibidas: "+lossJobs.length);
          //inicializamos los arrays para mostrar los datos
          lossJobs.forEach((stat) => {
                console.log(stat);
                province_year.push(stat.province+"-"+stat.year);
                gender.push(stat.gender);
                low_due_to_placement.push(stat.low_due_to_placement);
                no_renovation.push(stat.no_renovation);
                other_reason.push(stat.other_reason);           
          });
          console.log(gender);
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
        text: 'Causas de pérdida de trabajo',
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
            categories: province_year,
  },
  yAxis: {
    title: {
                text: 'Número de bajas',
                style: {
                    fontWeight: 'bold'
                }
            }
  },
  credits: {
    enabled: false
  },
  series: [{
          name: 'Otras razones',
          data: other_reason
    },{
          name: 'Sin renovación',
          data: no_renovation
        },{
          name: 'Bajas debido a puesto',
          data: low_due_to_placement
        }]
});
    }

    onMount(async () => {
        getStats();
    });
    
</script>

<main>
    <div id='chart'></div>
    <figure class="highcharts-figure">
        <div id="container"></div>
      </figure>
</main>

