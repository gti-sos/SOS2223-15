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
    import { Button, Table } from "sveltestrap";
    const delay = ms => new Promise(res => setTimeout(res, ms));
    //import { dev } from "$app/environment"; 
    let API = "https://sos2223-12.appspot.com/api/v2/agroclimatic";
    let API2 = "https://sos2223-15.appspot.com/api/v1/jobseekers-studies";
    let grafica = [];
    let grafica2 = [];
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
                    grafica2 = valores2;
                    grafica2.sort((a, b) => (a.territory > b.territory) ? 1 : ((b.territory > a.territory) ? -1 : 0));
                    grafica2.sort((a, b) => (a.year > b.year) ? 1 : ((b.year > a.year) ? -1 : 0));
                    grafica2.forEach(grafica2 =>{
                        console.log(grafica2);
                        provincia_año.push(grafica2.territory+"-"+grafica2.year+'-'+grafica2.gender+'-'+grafica2.type); 
                        primaria.push(grafica2["primary"]); 
                        fp.push(grafica2["fp_program"]); 
                        educ.push(grafica2["general_education"]); 
                        tot.push(grafica2["total"]); 
                        
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
                    
                    grafica = valores;
                    grafica.sort((a, b) => (a.province > b.province) ? 1 : ((b.province > a.province) ? -1 : 0));
                    grafica.sort((a, b) => (a.year > b.year) ? 1 : ((b.year > a.year) ? -1 : 0));
                    grafica.forEach(grafica =>{
                        console.log(grafica);
                        
                        temp_max.push(grafica["maximun_temperature"]);
                        temp_min.push(grafica["minimun_temperature"]);
                        temp_med.push(grafica["medium_temperature"]);
                        provincia_año.push(grafica.province+"-"+grafica.year);
                         
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
            
            await delay(500);
            //loadChartOtro();
            //loadChart2();
    }
    /*async function loadChartOtro(){  
        
        Highcharts.chart('container2', {
        chart: {
            type: 'area'
        },
        title: {
            text: 'Estadísticas Agroclimáticas y Solicitantes de Trabajo',
            style: {
                fontWeight: 'bold',
                fontFamily: 'Times New Roman',
                fontSize: 40,
            },
        },
        
        subtitle: {
            text: 'Gráfica con HighCharts',
            style:{
                fontFamily: 'Times New Roman',
                fontWeight: 'bold',
                fontSize: 12,
                color: 'black'
            },
        },
        xAxis: {
            title:{
                text: "Provincia-Año-Género-Tipo | Provincia-Año",
                style: {
                    fontWeight: 'bold'
                }
            },
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
    }*/
    /*async function loadChart2() {
        const ctx = document.getElementById('myChart2').getContext('2d');
        const myChart2 = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: provincia_año,
                datasets: [{
                    label: 'Temperatura Máxima',
                    data: temp_max,
                    borderColor: '#000',
                    backgroundColor: ['red'],
                    //borderWidth: 3,
                     
                    
                }, {
                    label: 'Temperatura Mínima',
                    data: temp_min,
                    borderColor: '#000',
                    backgroundColor: ['blue'],
                    //borderWidth: 3,
                    
                    
                }, {
                    label: 'Temperatura Media', 
                    data: temp_med,
                    borderColor: '#000',
                    backgroundColor: ['green'],
                    //borderWidth: 3,
                    
                }, {
                    label: 'Primaria', 
                    data: primaria,
                    borderColor: '#000',
                    backgroundColor: ['yellow'],
                    //borderWidth: 3,
                    
                }, {
                    label: 'FP', 
                    data: fp,
                    borderColor: '#000',
                    backgroundColor: ['orange'],
                    //borderWidth: 3,
                    
                }, {
                    label: 'Educación', 
                    data: educ,
                    borderColor: '#000',
                    backgroundColor: ['pink'],
                    //borderWidth: 3,
                    
                }, {
                    label: 'Total', 
                    data: tot,
                    borderColor: '#000',
                    backgroundColor: ['purple'],
                    //borderWidth: 3,
                    
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend:{
                        position: 'top',
                        labels: {
                            font: {
                                weight: 'bold'
                            }
                        }
                    },
                    title:{
                        text: "Estadísticas Agroclimáticas y Solicitantes de Trabajo",
                        display: true,
                        color: 'black',
                        font:{
                            family: 'Times New Roman',
                            size: 40,
                            weight: 'bold',
                        },
                        padding: {
                            bottom: 10
                        }
                    },
                    subtitle: {
                        display: true,
                        text: 'Gráfica con Chart.js',
                        color: 'black',
                        font: {
                            size: 15,
                            family: 'Times New Roman',
                            weight: 'bold',
                        },
                        padding: {
                            bottom: 20
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.parsed.y.toFixed(2);
                            }
                        }
                    }
                },
                scales: {
                        y: {
                            beginAtZero: true,
                            display: true,
                            title:{
                                display: true,
                                text: "Valor",
                                font: {
                                    weight: 'bold',
                                }, 
                            },
                        },
                        x: {   
                            display: true,
                            title:{
                                display: true,
                                text: "Provincia-Año-Género-Tipo | Provincia-Año" ,
                                font: {
                                    weight: 'bold',
                                },
                            }
                        }
                },
                layout: {
                    padding: {
                        top: 50, 
                        left: 200,
                        right: 200,
                        
                    }
                },
            }
        });
    }*/
</script>


<main>
    <h1 style="text-align: center; font-family:'Times New Roman', Times, serif; font-size: 45px; text-decoration:underline">Datos: Estudio de Solicitantes de Trabajo.</h1>

    <!--<br><div style="text-align:center;">
        <strong >Número de datos: {grafica.length+grafica2.length}</strong>
    </div>
    <br>
    <figure class="highcharts-figure" style="margin-left: 25px; margin-right:25px">
        <div id="container2"></div>
        <p class="highcharts-description" style="text-align:center">
            Gráfico de Área sobre las Estadísticas Agroclimáticas y Solicitantes de Trabajo.
        </p>
    </figure>-->

    <br><div style="text-align:center;">
        <strong >Número de datos: {grafica2.length}</strong>
    </div>
    <br>
    <Table striped hover style="text-align: center;">
        <thead>
          <tr style="font-weight: bold; text-decoration:underline">
            <th>Provincia</th>
            <th>Año</th>
            <th>Género</th>
            <th>Tipo</th>
            <th>Primaria</th>
            <th>FP</th>
            <th>Educación general</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
           

        {#each grafica2 as d}
          <tr>
            <td>{d["territory"]}</td>
            <td>{d["year"]}</td>
            <td>{d["gender"]}</td>
            <td>{d["type"]}</td>
            <td>{d["primary"]}</td>
            <td>{d["fp_program"]}</td>
            <td>{d["general_education"]}</td>
            <td>{d["total"]}</td>
          </tr>
        {/each}
          
        </tbody>
    </Table>

    <p style="text-align:center">
        Estadísticas de Solicitantes de Trabajo.
    </p>
    <!--<canvas id="myChart2" style="width: 20vw; height: 20vh;"></canvas>
    <p style="text-align:center">
        Gráfico de Columnas sobre las Estadísticas Agroclimáticas y Solicitantes de Trabajo.
    </p>-->

    <br>
    <hr style="text-align: right; margin-left: 100px; margin-right: 100px;">
    <div style="text-align:center">
        <Button color="primary" href="/">Volver a Inicio</Button>
    </div>
</main>
