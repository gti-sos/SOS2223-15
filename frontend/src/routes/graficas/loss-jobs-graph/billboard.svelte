<script>
    //@ts-nocheck
    import { onMount } from "svelte";
    import { dev } from "$app/environment";
    import bb, {bar, line} from "billboard.js";

    //import {Navbar, Nav, NavItem, NavLink, NavbarBrand, Dropdown, DropdownToggle, DropdownMenu, DropdownItem,Button} from 'sveltestrap';

    let API = "/api/v2/loss-jobs";

    if (dev) API = "http://localhost:12345" + API;

    let lossJobs = [];
    let province_gender = [];
    let gender = [];
    let low_due_to_placement = ["Bajas debido a puesto"];
    let no_renovation = ["Sin renovación"];
    let other_reason = ["Otras razones"];
    let dicc = {};

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

    async function loadGraph(){
        bb.generate({
            title: {
                text: 'Gráfica de Billboard sobre perdida de puestos de trabajo',
                
            },
            data: {
                columns: [
                    low_due_to_placement,
                    no_renovation,
                    other_reason,
                ],
                names: {
                    156725: 'Asalariados', // Usamos esto para cambiar el nombre de las columnas que aparecen dibujadas de colores, pues por defecto cogen el primer elemento de salaried en columns, de average_salary y de standard_deviation respectivamente para cada una de las columnas
                    21163: 'Salario medio',
                    11718: 'Desviación típica',

                },
                type: bar()
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
            }
        });
    }
    onMount(getStats);
    
    </script>
    <svelte:head>

            <script src="https://naver.github.io/billboard.js/release/latest/dist/billboard.min.js"></script>
            <link rel="stylesheet" href="https://naver.github.io/billboard.js/release/latest/dist/billboard.min.css">

    </svelte:head>

    
    
    <main>
        
        <div id="barChart" align="center"></div>
        <br><br>
    </main>