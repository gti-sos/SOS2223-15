<svelte:head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/5.16.0/d3.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/c3/0.7.20/c3.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/c3/0.7.20/c3.min.css"/>
</svelte:head>

<script>
    //@ts-nocheck
    import {onMount} from 'svelte';
    import {dev} from '$app/environment';
    //import {Navbar, Nav, NavItem, NavLink, NavbarBrand, Dropdown, DropdownToggle, DropdownMenu, DropdownItem,Button} from 'sveltestrap';
    

    onMount(async () => {
        getStats();
    });

    let API = "/api/v2/salary-stats";

    if (dev)
        API = "http://localhost:12345" + API;

    let stats = [];
    let province_gender_year =[]
    let salaried = ["Asalariados"];
    let average_salary = ["Salario medio"];
    let standard_deviation = ["Desviación típica"]; 

    async function getStats(){
      console.log("Fetching stats....");
      const res = await fetch(API);
      if(res.ok){
          const data = await res.json();
          stats = data;
          console.log("Estadísticas recibidas: "+stats.length);
          //inicializamos los arrays para mostrar los datos
          stats.sort((a,b) => a.year-b.year); // Ordena los datos por año (Resta el año a al b, y si es menor, lo pone antes que el mayor) de menor a mayor.
          stats.forEach((stat) => {
                console.log(stat);
                province_gender_year.push(stat.province+"-"+stat.gender+"-"+stat.year);
                salaried.push(stat.salaried);
                average_salary.push(stat.average_salary);
                standard_deviation.push(stat.standard_deviation);
          });
          console.log(salaried);
          loadGraph();
      }else{
          console.log("Error cargando los datos");
      }
    }

    async function loadGraph(){
        var chart = c3.generate({
            title: {
                text: 'Gráfica de estadísticas de asalariados: https://ourworldindata.org/cancer#deaths-from-cancer',
                
            },
            data: {
                columns: [
                    salaried,
                    average_salary,
                    standard_deviation,
                ],
                names: {
                    156725: 'Asalariados', // Usamos esto para cambiar el nombre de las columnas que aparecen dibujadas de colores, pues por defecto cogen el primer elemento de salaried en columns, de average_salary y de standard_deviation respectivamente para cada una de las columnas
                    21163: 'Salario medio',
                    11718: 'Desviación típica',

                },
                type: 'bar'
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
                    categories: province_gender_year
                }
            }
        });
    }
    
</script>

<main>
    <div id='chart'></div>
</main>

