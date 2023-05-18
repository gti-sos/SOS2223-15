<script>
    //@ts-nocheck
    import { onMount } from "svelte";

    let API = "https://sos2223-13.appspot.com/api/v2/employment";

    let employ = [];

    let provincia_año = [];
    let empleada = [];
    let inactiva = [];
    let desempleada = [];

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
            try {
                const data = await res.json();
                result = JSON.stringify(data, null, 2);
                employ = data;
                employ.sort((a, b) =>
                    a.year > b.year ? 1 : b.year > a.year ? -1 : 0
                );
                employ.forEach((stat) => {
                    console.log(stat);
                    provincia_año.push(stat.region + "-" + stat.year);
                    empleada.push(stat["employed_person"]);
                    inactiva.push(stat["inactive_person"]);
                    desempleada.push(stat["unemployed_person"]);
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
        Highcharts.chart("container", {
            chart: {
                type: "area",
            },
            title: {
                text: "Estadística Situación laboral de los andaluces entre 2017 y 2020",
                style: {
                    fontWeight: "bold",
                    fontSize: 25,
                },
            },
            subtitle: {
            text: 'Gráfica con HighCharts',
            style:{
                fontWeight: 'bold',
                fontSize: 20,
            },
        },
            xAxis: {
                categories: provincia_año,
                crosshair: true,
            },
            yAxis: {
                title: {
                    text: "Personas",
                },
            },
            tooltip: {
                headerFormat:
                    '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat:
                    '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y: 2f}</b></td></tr>',
                footerFormat: "</table>",
                shared: true,
                useHTML: true,
            },
            plotOptions: {
                area: {
                    marker: {
                        enabled: false,
                        symbol: "circle",
                        radius: 2,
                        states: {
                            hover: {
                                enabled: true,
                            },
                        },
                    },
                },
            },
            series: [
                {
                    name: "Persona empleada",
                    data: empleada,
                },
                {
                    name: "Persona inactiva",
                    data: inactiva,
                },
                {
                    name: "Persona desempleada",
                    data: desempleada,
                },
            ],
        });
    }
</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

<main>
    <br><div style="text-align:center;">
        <strong >Número de datos: {employ.length}</strong>
    </div>
    <br>
    <figure class="highcharts-figure">
        <div id="container" />
    </figure>
    <hr style="text-align: right; margin-left: 100px; margin-right: 100px;">
</main>
