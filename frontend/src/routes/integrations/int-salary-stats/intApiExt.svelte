<svelte:head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/5.16.0/d3.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/c3/0.7.20/c3.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/c3/0.7.20/c3.min.css"/>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.4.0/Chart.min.js"></script>
</svelte:head>

<script>
    // @ts-nocheck

    import {onMount} from "svelte";
    import { dev } from '$app/environment';


    onMount(async () =>{
        getData();
    });

    //let API = "https://sos2223-15.ew.r.appspot.com/api/v2/salary-stats";
    //let API = "http://localhost:12345/api/v2/salary-stats"; 

    let API = "/api/v2/covd";
        
    if(dev)
        API = 'http://localhost:12345'+API


    let stats = [];
    let province_gender_year =[];
    let salaried = [];
    let average_salary = [];
    let standard_deviation = []; 


    let deaths = [];
    let confirmed = [];
    let stats2 = [];



    const options = {
	    method: 'GET',
	    headers: {
		    'X-RapidAPI-Host': 'covid-19-coronavirus-statistics.p.rapidapi.com',
		    'X-RapidAPI-Key': 'eca9d9dcb9mshdd4d65d4646bc18p192490jsn55ba9c868f8c'
	    }
    };

    async function getData() {
        console.log("Fetching salary-stats....");
        const res = await fetch(API);
        console.log("Fetching virus stats....");
        const res2 = await fetch(`${API}`, options);
        if (res.ok) {
            const data = await res.json();
            stats = data;
                console.log("Entradas recibidas: " + stats.length);
                //con la siguiente funcion ordeno los datos por años de menor a mayor
                stats.sort((a,b) => a.year-b.year); // Ordena los datos por año (Resta el año a al b, y si es menor, lo pone antes que el mayor) de menor a mayor.
                console.log("Ordenadas correctamente");
                stats.forEach((stat) => {
                    province_gender_year.push(stat.province+"-"+stat.gender+"-"+stat.year);
                    salaried.push(stat.salaried);
                    average_salary.push(stat.average_salary);
                    standard_deviation.push(stat.standard_deviation);
                    deaths.push("-");
                    confirmed.push("-");
                });
        } else {
            console.log("Error, can`t charge data");
        }
        // api externa
        if (res2.ok) {
            const data2 = await res2.json();
            stats2 = data2.data.covid19Stats;
            console.log(stats2);            
                console.log("Entradas recibidas: " + stats2.length);                

                stats2.forEach((stat) => {
                    province_gender_year.push(stat.province);
                    salaried.push("-");
                    average_salary.push("-");
                    standard_deviation.push("-");
                    deaths.push(stat.deaths);
                    confirmed.push(stat.confirmed);
                });
            province_gender_year.pop();
        } else {
            console.log("Error, can`t charge data");
        }
        loadGraph();
    }

    async function loadGraph() {
        var ctx = document.getElementById("myChart").getContext("2d");
        var trace_consumption = new Chart(ctx, {
            
            type: "bar",
            data: {
                labels: province_gender_year,
                datasets: [
                    {
                        label: "Asalariados",
                        borderColor: "rgba(255, 99, 132, 0.2)",
                        backgroundColor: "rgba(255, 99, 132, 1)",
                        data: salaried,
                    },
                    {
                        label: "Salario medio",
                        backgroundColor: "#bc98f3",
                        borderColor: "#bc98f3",
                        data: average_salary,
                    },
                    {
                        label: "Desviación típica",
                        backgroundColor: "#bdecb6",
                        borderColor: "#bdecb6",
                        data: standard_deviation,
                    },{
                        label: "Infectados",
                        backgroundColor: "#0049FF",
                        borderColor: "#0049FF",
                        data: confirmed,
                    },{
                        label: "Muertos",
                        backgroundColor: "#FF9E00",
                        borderColor: "#FF9E00",
                        data: deaths,
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                }
            },
        });
    }
</script>

<main>
    <p style="text-align:center ;">Grafica de número de asalariados y contagios por covid</p>
    <div style="margin-left: 12%;max-width: 75%;">
        <canvas id="myChart" ></canvas>
    </div>
</main>