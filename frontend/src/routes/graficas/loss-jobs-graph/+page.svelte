<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>


<script>
    //@ts-nocheck
    import { onMount } from "svelte";
    import { dev } from "$app/environment";
    //import {Navbar, Nav, NavItem, NavLink, NavbarBrand, Dropdown, DropdownToggle, DropdownMenu, DropdownItem,Button} from 'sveltestrap';

    let API = "/api/v2/loss-jobs";

    if (dev) API = "http://localhost:12345" + API;

    let lossJobs = [];
    let province_gender = [];
    let gender = [];
    let low_due_to_placement = [];
    let no_renovation = [];
    let other_reason = [];

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

    async function loadGraph() {
        Highcharts.chart("container", {
            chart: {
                type: "column",
            },
            title: {
                text: "Causas de pérdida de trabajo",
            },
            subtitle: {
                text: "Source: https://ourworldindata.org/jobs",
            },
            xAxis: {
                categories: province_gender,
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: "Causas de pérdida de trabajo",
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
                name: 'Bajas debido a puesto',
                data: low_due_to_placement
                },
                {
                name: 'Sin renovación',
                data: no_renovation
                },
                {
                name: 'Por otras razones',
                data: other_reason
                
                }
                
            ]
        });
    }

    onMount(async () => {
        getStats();
    });
</script>

<main>
    <div id="chart" />
    <figure class="highcharts-figure">
        <div id="container" />
    </figure>
</main>
