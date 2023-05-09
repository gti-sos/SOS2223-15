<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/series-label.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

<script>
    //@ts-nocheck
    import { onMount } from "svelte";
    import {dev} from "$app/environment"
    import {Navbar, Nav, NavItem, NavLink, NavbarBrand, Dropdown, DropdownToggle, DropdownMenu, DropdownItem,Button} from 'sveltestrap';
    const delay = ms =>new Promise(res=>setTimeout(res,ms));

    let API = "/api/v2/loss-jobs"
    if (dev) API = "http://localhost:12345" + API;


    let loss_jobs=[];
    let province=[];
    let year=[];
    let gender = [];
    let low_due_to_placement=[];
    let no_renovation=[];
    let other_reason=[];
    let datosOrdenados=[];
    async function getData(){
        console.log("Fetching loss jobs....");
        const res = await fetch("/api/v2/loss-jobs");
        if(res.ok){
            const data = await res.json();          
            loss_jobs = data;
            if (loss_jobs.length == 0) {
                const res = await fetch("/api/v2/loss-jobs/loadInitialData");
                console.log("Entradas recibidas: "+loss_jobs.length);
            //con la siguiente funcion ordeno los datos por años de menor a mayor
            datosOrdenados = loss_jobs.sort(function (a, b){
            return (a.year - b.year)
            });
            console.log("Ordenadas correctamente");
            datosOrdenados.forEach(loss_job => {
                year.push(loss_job.year);
                province.push(loss_job.province+"-"+ loss_job.year);
                low_due_to_placement.push(loss_job.low_due_to_placement);
                no_renovation.push(loss_job.no_renovation);
                other_reason.push(loss_job.other_reason);          
            });
            location.reload();
            }
            else{
               console.log("Entradas recibidas: "+loss_jobs.length);
            //con la siguiente funcion ordeno los datos por años de menor a mayor
            datosOrdenados = loss_jobs.sort(function (a, b){
            return (a.year - b.year)
            });
            console.log("Ordenadas correctamente");
            datosOrdenados.forEach(loss_job => {
                year.push(loss_job.year);
                province.push(loss_job.province+"-"+loss_job.year);
                low_due_to_placement.push(loss_job.low_due_to_placement);
                no_renovation.push(loss_job.no_renovation);
                other_reason.push(loss_job.other_reason);            
            }); 
            }
            
        }else{
            console.log("Error, can`t charge data");
        }
    }
    
    async function loadGraph() {
        Highcharts.chart("container", {
            chart: {
                type: "column",
            },
            title: {
                text: "Muertes por neumonia",
            },
            subtitle: {
                text: "Source: https://ourworldindata.org/loss_job",
            },
            xAxis: {
                categories: province,
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: "Muertes por neumonia",
                },
            },
            tooltip: {
                headerFormat:
                    '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat:
                    '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y} muertes</b></td></tr>',
                footerFormat: "</table>",
                shared: true,
                useHTML: true,
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0,
                },
            },
            series: [
                {
                name: 'Mayores de 70 años',
                data: other_reason
                },
                {
                name: 'De 50 a 70 años',
                data: no_renovation
                },
                {
                name: 'Menores de 50 años',
                data: low_due_to_placement
                
                }
                
            ]
        });
    }
    onMount(async()=>{
        getData();
        loadGraph();
    })
</script>





<main>
    
    <figure class="highcharts-figure">
        <div id="container" />
        <p class="highcharts-description">
            Este gráfico compara los valores de muertes por neumonia en distintas edades
    </figure>
</main>