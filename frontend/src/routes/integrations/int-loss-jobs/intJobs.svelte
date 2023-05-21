<svelte:head>
    <script src="https://naver.github.io/billboard.js/release/latest/dist/billboard.min.js"></script>
    <link rel="stylesheet" href="https://naver.github.io/billboard.js/release/latest/dist/billboard.min.css">
</svelte:head>

<script>
    // @ts-nocheck

    import {onMount} from "svelte";
    import bb, {bar, donut, line} from "billboard.js";
    import { dev } from '$app/environment';

    onMount(async () =>{
        getData();
    });

    let API = "https://sos2223-15.appspot.com/api/v2/loss-jobs";
    let API_EXT = "https://sos2223-15.appspot.com/nba";


    let stats = [];
    let province_gender =[];
    let low_due_to_placement = [];
    let no_renovation = [];
    let other_reason = ["Otras razones"];


    let id = ["id"];
    let stats2 = [];
    let first_name=[];

    const options = {
	    method: 'GET',
	    headers: {
        "X-RapidAPI-Host": "free-nba.p.rapidapi.com",
        "X-RapidAPI-Key": "c39120aa81msh087d47ca1543c02p1d12abjsnfb5f66461395"
	    }
    };

    async function getData() {
        const res = await fetch(API);
        const res2 = await fetch(`${API2}`, options); //'https://free-nba.p.rapidapi.com/players?page=0&per_page=25'
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
                });
        } else {
            console.log("Error, can`t charge data");
        }
        // api externa
        if (res2.ok) {
            const data2 = await res2.json();
            stats2 = data2.data;
            console.log(stats2);            
                console.log("Entradas recibidas: " + stats2.length);                

                stats2.forEach((stat) => {
                    console.log(stat);
                    province_gender.push(stat.first_name);
                    low_due_to_placement.push("-");
                    no_renovation.push("-");
                    other_reason.push("-");
                    id.push(stat.id);
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
                text: 'Grafica de personas que perdieron sus trabajos por otras razones e IDs de jugadores de baloncesto',
                
            },
            data: {
                columns: [
                    other_reason,
                    id,
                ],
                type: line()
            },
            bar: {
                width: {
                    ratio: 0.6 // this makes bar width 50% of length between ticks
                }
                // or
                //width: 100 // this makes bar width 100px
            },
            axis: {
                x: {
                    type: 'category',
                    categories: province_gender
                }
            },
            legend: {
                position: 'right', // posición de la leyenda en la parte superior del gráfico
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