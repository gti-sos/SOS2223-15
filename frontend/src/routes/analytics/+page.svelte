<script>
    // @ts-nocheck
    import {onMount} from "svelte";
    //import { dev } from "$app/environment"; 
    
    let API = "https://sos2223-15.appspot.com/api/v1/jobseekers-studies";
    let API2 = "https://sos2223-15.appspot.com/api/v2/salary-stats";
    let API3 = "https://sos2223-15.appspot.com/api/v2/loss-jobs";


    let provincia_año = [];

    let jobseeker = [];
    let primario = [];
    let fp = [];
    let general = [];
    let total = [];

    let salary = [];
    let salaried = [];
    let average_salary = [];
    let standard_deviation = []; 

    let lossJobs = [];
    let low_due_to_placement = [];
    let no_renovation = [];
    let other_reason = [];

    let result = "";
    let resultStatus = "";
    let result2 = "";
    let resultStatus2 = "";
    let result3 = "";
    let resultStatus3 = "";

    onMount(async () =>{
        getGraph()
    });
    async function getGraph(){
        resultStatus = result = "";
        const res = await fetch(API, {
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
                    
                    salaried.push(0);
                    average_salary.push(0);
                    standard_deviation.push(0);

                    low_due_to_placement.push(0);
                    no_renovation.push(0);
                    other_reason.push(0);
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
        const res2 = await fetch(API2, {
            method: "GET"
        });
        
        if(res2.ok){
            try{
                const data2 = await res2.json();
                result2 = JSON.stringify(data2, null, 2);
                
                salary = data2;
                salary.sort((a, b) => (a.year > b.year) ? 1 : ((b.year > a.year) ? -1 : 0));
                salary.forEach(stat =>{
                    console.log(stat);
                    provincia_año.push(stat.province+"-"+stat.year);
                    salaried.push(stat.salaried);
                    average_salary.push(stat.average_salary);
                    standard_deviation.push(stat.standard_deviation);
                        
                    primario.push(0); 
                    fp.push(0); 
                    general.push(0); 
                    total.push(0);

                    low_due_to_placement.push(0);
                    no_renovation.push(0);
                    other_reason.push(0);
                    
                });
                
            }catch(error){
                console.log(`Error devolviendo la gráfica: ${error}`);
            }
            const status2 = await res2.status;
            resultStatus2 = status2;
            
        }else{
            console.log("Error al cargar la gráfica");
        }

        resultStatus3 = result3 = "";
        const res3 = await fetch(API3, {
            method: "GET"
        });
        if(res3.ok){
            try{
                const data3 = await res3.json();
                result3 = JSON.stringify(data3, null, 2);
                
                lossJobs = data3;
                lossJobs.sort((a, b) => (a.year > b.year) ? 1 : ((b.year > a.year) ? -1 : 0));
                lossJobs.forEach(stat =>{
                    console.log(stat);
                    provincia_año.push(stat.province+"-"+stat.year);
                    low_due_to_placement.push(stat.low_due_to_placement);
                    no_renovation.push(stat.no_renovation);
                    other_reason.push(stat.other_reason);
                        
                    primario.push(0); 
                    fp.push(0); 
                    general.push(0); 
                    total.push(0);
                    
                    salaried.push(0);
                    average_salary.push(0);
                    standard_deviation.push(0);
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
        Highcharts.chart('container', {
            chart: {
                type: 'bar'
            },
            title: {
                text: 'Gráfica Estudio demandantes de empleo, Estadísticas de asalariados y Causas de pérdidas de trabajo',
                align: 'center',
                style: {
                    fontWeight: 'bold',
                    fontSize: 30,
                },
            },
            subtitle: {
                text: 'Gráfica con HighCharts',
                align: 'center',
                style:{
                    fontWeight: 'bold',
                    fontSize: 20,
                }
            },
            xAxis: {
                categories: provincia_año,
                title: {
                    text: null
                },
                gridLineWidth: 1,
                lineWidth: 0
            },
            yAxis: {
                title: {
                    text: 'Valores',
                },
                labels: {
                    overflow: 'justify'
                },
                gridLineWidth: 0
            },
            plotOptions: {
                bar: {
                    borderRadius: '50%',
                    groupPadding: 5
                }
            },
            series: [{
                name: 'Total',
                data: total
            },{
                name: 'Educacion General',
                data: general
            },{
                name: 'Programa FP',
                data: fp
            },{
                name: 'Educacion Primaria',
                data: primario
            },{
                name: 'Número de asalariados',
                data: salaried
            },{
                name: 'Salario medio',
                data: average_salary
            },{
                name: 'Desviación típica',
                data: standard_deviation
            },{
                name: 'Bajas debido a puesto',
                data: low_due_to_placement
            }, {
                name: 'Sin renovación',
                data: no_renovation
            },{
                name: 'Por otras razones',
                data: other_reason
            
            }]
        });
    }
</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>

    <script src="https://cdn.jsdelivr.net/npm/chart.js@3.6.2"></script>
    <title>SOS2223-15</title>
</svelte:head>

<main>
    <br><div style="text-align:center;">
        <strong >Número de datos: {jobseeker.length+salary.length+lossJobs.length}</strong>
    </div>
    <br>
    <figure class="highcharts-figure" style="margin-left: 25px; margin-right:25px">
        <div id="container"></div>
    </figure>
</main>
    