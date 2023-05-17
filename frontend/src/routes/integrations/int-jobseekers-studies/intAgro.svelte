
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
    let API = "http://localhost:12345/agro"; 
    
    let API2 = "http://localhost:12345/api/v1/jobseekers-studies";

    let agro = [];
    let jobseeker = [];

    let temp_max = [];
    let temp_min = [];
    let temp_med = [];
    
    let provincia_año = [];

    let primaria = [];
    let fp = [];
    let educ = [];
    let tot = [];

    let result = "";
    let resultStatus = "";
    let result2 = "";
    let resultStatus2 = "";
    onMount(async () =>{
        getGraphOtro()
    });
    async function getGraphOtro(){
        resultStatus2 = result2 = "";
            const res2 = await fetch(API2, {
            method: "GET"
                
            });
            
            if(res2.ok){
                try{
                    const valores2 = await res2.json();
                    result2 = JSON.stringify(valores2, null, 2);
                    jobseeker = valores2;
                    jobseeker.sort((a, b) => (a.year > b.year) ? 1 : ((b.year > a.year) ? -1 : 0));
                    jobseeker.forEach(stat =>{
                        console.log(stat);
                        provincia_año.push(stat.territory+"-"+stat.year); 
                        primaria.push(stat["primary"]); 
                        fp.push(stat["fp_program"]); 
                        educ.push(stat["general_education"]); 
                        tot.push(stat["total"]); 
                        
                        temp_max.push(0);
                        temp_min.push(0);
                        temp_med.push(0);
                                       
                    });
                    
                }catch(error){
                    console.log(`Error devolviendo la gráfica: ${error}`);
                }
                const status2 = await res2.status;
                resultStatus2 = status2;
            }else{
                console.log("Error al cargar la gráfica"); 
            }
        
        resultStatus = result = "";
            const res = await fetch(API, {
                method: "GET"
            });
            
            if(res.ok){
                try{
                    const valores = await res.json();
                    result = JSON.stringify(valores, null, 2);
                    
                    agro = valores;
                    agro.sort((a, b) => (a.year > b.year) ? 1 : ((b.year > a.year) ? -1 : 0));
                    agro.forEach(stat =>{
                        console.log(stat);
                        
                        temp_max.push(stat["maximun_temperature"]);
                        temp_min.push(stat["minimun_temperature"]);
                        temp_med.push(stat["medium_temperature"]);
                        provincia_año.push(stat.province+"-"+stat.year);
                         
                        primaria.push(0); 
                        fp.push(0); 
                        educ.push(0); 
                        tot.push(0);
                        
                    });
                    
                }catch(error){
                    console.log(`Error devolviendo la gráfica: ${error}`);
                }
                const status = await res.status;
                resultStatus = status;
                
            }else{
                console.log("Error al cargar la gráfica");
            }
            
            loadChartOtro();
    }
    async function loadChartOtro(){  
        
        Highcharts.chart('container2', {
        title: {
            text: 'Estadísticas Agroclimáticas y Solicitantes de Trabajo',
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
            name: 'Primaria',
            data: primaria
        }, {
            name: 'FP',
            data: fp
        }, {
            name: 'Educación',
            data: educ
        }, {
            name: 'Total',
            data: tot
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
        <p class="highcharts-description" style="text-align:center">
            Gráfico sobre Solicitantes de Trabajo y Estadísticas Agroclimáticas.
        </p>
    </figure>
    <hr style="text-align: right; margin-left: 100px; margin-right: 100px;">
   
</main>
