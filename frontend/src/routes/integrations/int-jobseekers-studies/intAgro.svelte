
<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>

    <script src="https://cdn.jsdelivr.net/npm/chart.js@3.6.2"></script>
</svelte:head>
<script>
    // @ts-nocheck
    import {onMount} from "svelte";
    //import { dev } from "$app/environment"; 
    let API = "https://sos2223-15.appspot.com/agro"; 
    
    let API2 = "https://sos2223-15.appspot.com/api/v1/jobseekers-studies";

    let agro = [];
    let jobseeker = [];

    let temp_max = [];
    let temp_min = [];
    let temp_med = [];
    
    let provincia_año = [];

    let primario = [];
    let fp = [];
    let general = [];
    let total = [];

    let result = "";
    let resultStatus = "";
    let result2 = "";
    let resultStatus2 = "";
    onMount(async () =>{
        getGraph()
    });
    async function getGraph(){
        resultStatus = result = "";
            const res = await fetch(API2, {
            method: "GET"
                
            });
            
            if(res.ok){
                try{
                    const data = await res.json();
                    result = JSON.stringify(data, null, 2);
                    jobseeker = data;
                    jobseeker.sort((a, b) => (a.year > b.year) ? 1 : ((b.year > a.year) ? -1 : 0));
                    jobseeker.forEach(stat =>{
                        console.log(stat);
                        provincia_año.push(stat.territory+"-"+stat.year); 
                        primario.push(stat["primary"]); 
                        fp.push(stat["fp_program"]); 
                        general.push(stat["general_education"]); 
                        total.push(stat["total"]); 
                        
                        temp_max.push(0);
                        temp_min.push(0);
                        temp_med.push(0);
                                       
                    });
                    
                }catch(error){
                    console.log(`Error devolviendo la gráfica: ${error}`);
                }
                const status = await res.status;
                resultStatus = status;
            }else{
                console.log("Error al cargar la gráfica"); 
            }
        
        resultStatus2 = result2 = "";
            const res2 = await fetch(API, {
                method: "GET"
            });
            
            if(res2.ok){
                try{
                    const data2 = await res2.json();
                    result2 = JSON.stringify(data2, null, 2);
                    
                    agro = data2;
                    agro.sort((a, b) => (a.year > b.year) ? 1 : ((b.year > a.year) ? -1 : 0));
                    agro.forEach(stat =>{
                        console.log(stat);
                        
                        temp_max.push(stat["maximun_temperature"]);
                        temp_min.push(stat["minimun_temperature"]);
                        temp_med.push(stat["medium_temperature"]);
                        provincia_año.push(stat.province+"-"+stat.year);
                         
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
    async function loadGraph(){  
        
        Highcharts.chart('container2', {
        title: {
            text: 'Estadísticas Agroclimáticas y Demandantes de empleo',
            style: {
                fontWeight: 'bold',
                fontSize: 40,
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
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Valor',
                style: {
                    fontWeight: 'bold'
                }
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y: 2f}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
            pointPadding: 0.2,
            borderWidth: 2,
            borderColor: "#000"
            }
        },
        series: [{
            name: 'Temperatura Máxima',
            data: temp_max 
        }, {
            name: 'Temperatura Mínima',
            data: temp_min 
        }, {
            name: 'Temperatura Media',
            data: temp_med 
        },{
            name: 'primario',
            data: primario
        }, {
            name: 'FP',
            data: fp
        }, {
            name: 'Educación General',
            data: general
        }, {
            name: 'Total',
            data: total
        }],
        responsive: {
                rules: [{
                    condition: {
                        maxWidth: 1000
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom'
                        }
                    }
                }]
            }
        });
    }

</script>


<main>
    <br><div style="text-align:center;">
        <strong >Número de datos: {agro.length+jobseeker.length}</strong>
    </div>
    <br>
    <figure class="highcharts-figure" style="margin-left: 25px; margin-right:25px">
        <div id="container2"></div>
    </figure>
    <hr style="text-align: right; margin-left: 100px; margin-right: 100px;">
   
</main>
