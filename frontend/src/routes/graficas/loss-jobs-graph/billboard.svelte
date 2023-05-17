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
    let low_due_to_placement = [];
    let no_renovation = [];
    let other_reason = [];
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
                text: 'Gráfica de estadísticas de asalariados: https://ourworldindata.org/cancer#deaths-from-cancer',
                
            },
            data: {
                columns: [
                    low_due_to_placement,
                    no_renovation,
                    other_reason,
                ],
                
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
        <br>
        <h1 align="center">Causas de perdida de trabajo</h1>
        <br>
        <div id="barChart" align="center"></div>
        <br><br>
    </main>