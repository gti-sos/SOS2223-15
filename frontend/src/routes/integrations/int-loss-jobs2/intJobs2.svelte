<svelte:head>
    <script src="https://naver.github.io/billboard.js/release/latest/dist/billboard.min.js"></script>
    <link rel="stylesheet" href="https://naver.github.io/billboard.js/release/latest/dist/billboard.min.css">   
</svelte:head>

<script>
    // @ts-nocheck

    import {onMount} from "svelte";
    import bb, {bar, donut, line} from "billboard.js";

    onMount(async () =>{
        getData();
    });

    let API = "http://localhost:12345/api/v2/loss-jobs";


    let stats = [];
    let province_gender =[]
    let low_due_to_placement = ["Bajas debido a puesto"];
    let no_renovation = ["Sin renovacion"];
    let other_reason = ["Otras razones"]; 


    let id = ["Numero aviones"];
    let stats2 = [];
    let city = ["city"];



    const options = {
	    method: 'GET',
	    headers: {
            'X-RapidAPI-Key': '270ff849a5msh00fe775e3c2b3eep145b6cjsn281cd1b694f6',
            'X-RapidAPI-Host': 'flight-radar1.p.rapidapi.com'
	    }
    };

    async function getData() {
        const res = await fetch(API);
        const res2 = await fetch('https://flight-radar1.p.rapidapi.com/airports/list', options);
        if (res.ok) {
            const data = await res.json();
            stats = data;
                console.log("Entradas recibidas: " + stats.length);
                //con la siguiente funcion ordeno los datos por años de menor a mayor
                stats.sort((a,b) => a.year-b.year); // Ordena los datos por año (Resta el año a al b, y si es menor, lo pone antes que el mayor) de menor a mayor.
                console.log("Ordenadas correctamente");
                stats.forEach((stat) => {
                    province_gender.push(stat.province+"-"+stat.gender);
                    low_due_to_placement.push(stat.low_due_to_placement);
                    no_renovation.push(stat.no_renovation);
                    other_reason.push(stat.other_reason);
                    id.push("-");
                    city.push("-");
                });
        } else {
            console.log("Error, can`t charge data");
        }
        // api externa
        if (res2.ok) {
            const data2 = await res2.json();
            stats2 = data2.rows;
            console.log(stats2);            
                console.log("Entradas recibidas: " + stats2.length);                

                stats2.forEach((stat) => {
                    province_gender.push(stat.province);
                    low_due_to_placement.push("-");
                    no_renovation.push("-");
                    other_reason.push("-");
                    id.push(stat.id);
                    city.push(stat.city);
                });
            province_gender.pop();
        } else {
            console.log("Error, can`t charge data");
        }
        loadGraph();
    }

    async function loadGraph(){
        var chart = bb.generate({
            title: {
                text: 'Grafica de razones de personas que perdieron sus trabajos y los vuelos de aviones',
                
            },
            data: {
                columns: [
                    other_reason,
                    low_due_to_placement,
                    no_renovation,
                    id,
                ],
                type: donut()
            },
            bar: {
                width: {
                    ratio: 0.6 // this makes bar width 50% of length between ticks
                }
            },
            axis: {
                x: {
                    type: 'category',
                    categories: province_gender
                }
            },
            bindto: "#pieChart"
        });
    }
</script>

<main>
    <p style="text-align:center ;"></p>
    <div style="margin-left: 12%;max-width: 75%;">
        <div id="pieChart"></div>
    </div>
</main>