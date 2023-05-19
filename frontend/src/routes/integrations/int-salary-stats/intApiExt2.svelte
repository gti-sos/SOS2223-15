<svelte:head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/5.16.0/d3.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/c3/0.7.20/c3.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/c3/0.7.20/c3.min.css"/>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.4.0/Chart.min.js"></script>
</svelte:head>

<script>
    // @ts-nocheck

    import {onMount} from "svelte";

    onMount(async () =>{
        getData();
    });

    //let API = "https://sos2223-15.ew.r.appspot.com/api/v2/salary-stats";
    let API = "http://localhost:12345/api/v2/salary-stats"; 


    let stats = [];
    let province = [];
    let province_gender_year =[]
    let salaried = ["Asalariados"];
    let average_salary = [];
    let standard_deviation = []; 


    let precio = ["precio"];
    let titulo = ["título"];
    let usuarios = ["usuarios"];
    let stats2 = [];



    const options = {
	    method: 'GET',
	    headers: {
		    'X-RapidAPI-Host': 'gamerpower.p.rapidapi.com',
		    'X-RapidAPI-Key': 'eca9d9dcb9mshdd4d65d4646bc18p192490jsn55ba9c868f8c'
	    }
    };

    async function getData() {
        console.log("Fetching salary-stats....");
        const res = await fetch(API);
        console.log("Fetching Games stats....");
        //const res2 = await fetch('https://sos2223-15.appspot.com/games', options);
        const res2 = await fetch('https://gamerpower.p.rapidapi.com/api/giveaways?platform=ps4', options);
        if (res.ok && res2.ok) {
            const data = await res.json();
            stats = data;
                console.log("Entradas recibidas de api: " + stats.length);
                //con la siguiente funcion ordeno los datos por años de menor a mayor
                stats.sort((a,b) => a.year-b.year); // Ordena los datos por año (Resta el año a al b, y si es menor, lo pone antes que el mayor) de menor a mayor.
                console.log("Ordenadas correctamente");
                stats.forEach((stat) => {
                    province.push(stat.province);
                    province_gender_year.push(stat.province+"-"+stat.gender+"-"+stat.year);
                    salaried.push(stat.salaried);
                    average_salary.push((stat.average_salary/(12*30)));
                    standard_deviation.push(stat.standard_deviation);
                    precio.push("-");
                    titulo.push("-");
                    usuarios.push("-");
                });
        } else {
            console.log("Error, can`t charge data");
        }
        // api externa
        if (res2.ok) {
            const data2 = await res2.json();
            stats2 = data2;
            console.log("Entradas recibidas de api externa: " + stats2.length);                
            console.log(stats2);            

                stats2.forEach((stat) => {
                    province_gender_year.push(stat.title);
                    if(stat.worth=="N/A"){
                            precio.push(0);
                    }else{
                        precio.push(stat.worth.split("$",2)[1]);
                    }
                        usuarios.push(stat.users); 
                       
            });
        } else {
            console.log("Error, can`t charge data");
        }
        console.log(titulo);
        loadGraph();
    }


    async function loadGraph() {
        var chart = c3.generate({
            title: {
                text: 'Estadísticas de asalariados y precios de videojuegos de ps4',
            },
            data: {
                columns: [
                    salaried,
                    usuarios
                ],
                type: "spline",
            },
            bar: {
                width: {
                    ratio: 0.5, // this makes bar width 50% of length between ticks
                },
                // or
                //width: 100 // this makes bar width 100px
            },axis: {
                x: {
                    type: "category",
                    categories: province_gender_year,
                },
            },legend: {
                position: 'right', // posición de la leyenda en la parte superior del gráfico
            },
        });
    }
</script>

<main>
    <div id="chart"/>
</main>