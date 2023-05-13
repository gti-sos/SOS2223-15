<svelte:head>

    <script src="https://code.highcharts.com/highcharts.js"on:load="{fillChart}"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"on:load="{fillChart}"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"on:load="{fillChart}"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"on:load="{fillChart}"></script>


</svelte:head>

<script>
    
    //@ts-nocheck
    import { onMount } from 'svelte';
    import {Navbar, Nav, NavItem, NavLink, NavbarBrand, Dropdown, DropdownToggle, DropdownMenu, DropdownItem,Button} from 'sveltestrap';
    import { dev } from "$app/environment"; // Esta variable de entorno nos indica si se está ejecutando en modo desarrollo (npm run dev --) o en modo de producción (npm start)

    let API = "/api/v2/salary-stats";
    
    if (dev)
        // Si accedemos en modo normal, accedemos en local a la API y si no, accedemos al servidor de Svelte
        API = "http://localhost:12345" + API;


    const delay = ms => new Promise(res => setTimeout(res, ms));
    let province = [];
    let gender = [];
    let year = [];
    let salaried = [];
    let average_salary = [];
    let standard_deviation = [];
    let datos = []; 
    let datosOrdenados = [];   

    //creo 2 let datos para poder ordenado los datos por año
    async function getData(){
        console.log("Fetching cancerdeaths....");
        const res = await fetch(API, { //Obtenemos los datos de la API
                method: 'GET'
            });
        if(res.ok){
            const data = await res.json();          
            datos = data;
            //si no tenemos ningun dato cargado, cargamos los datos iniciales, si tiene datos los obtiene sin cargar los iniciales
            if (datos.length == 0) {
                const res = await fetch("/api/v2/salary-stats/loadInitialData");
                console.log("Entradas recibidas: "+datos.length);
            //con la siguiente funcion ordeno los datos por años de menor a mayor
            datosOrdenados = datos.sort(function (a, b){
                return (a.year - b.year)
            });
            console.log("Ordenadas correctamente");
            datosOrdenados.forEach(dato => {
                year.push(dato.year);
                province.push(dato.province+"-"+dato.year);
                gender.push(dato.gender);
                salaried.push(dato.salaried);
                average_salary.push(dato.average_salary);
                standard_deviation.push(dato.standard_deviation);           
            });
            location.reload();
            }
            else{
               console.log("Entradas recibidas: "+datos.length);
            //con la siguiente funcion ordeno los datos por años de menor a mayor
            datosOrdenados = datos.sort(function (a, b){
            return (a.year - b.year)
            });
            console.log("Ordenadas correctamente");
            datosOrdenados.forEach(dato => {
                year.push(dato.year);
                province.push(dato.province+"-"+dato.year);
                gender.push(dato.gender);
                salaried.push(dato.salaried);
                average_salary.push(dato.average_salary);
                standard_deviation.push(dato.standard_deviation);            
            }); 
            }
            
        }else{
            console.log("Error, can`t charge data");
		}
    }
    async function fillChart(){
        Highcharts.chart('container', {
            chart: {
                type: 'area'
            },
            title: {
                text: 'Grafica de número de asalariados'
            },
            subtitle: {
                text: 'Source: https://ourworldindata.org/cancer#deaths-from-cancer'
            },
            xAxis: {
                categories: province,
                tickmarkPlacement: 'on',
                title: {
                    enabled: false
                }
            },
            yAxis: {
                
                title: {
                    text: 'Asalariados'
                },
                
            },
            tooltip: {
                split: true,
                valueSuffix: 'asalariados'
            },
            plotOptions: {
                
                area: {
                    stacking: 'normal',
                    lineColor: '#666666',
                    lineWidth: 1,
                    marker: {
                        lineWidth: 1,
                        lineColor: '#666666'
                    }
                }
            },
            
            series: [
                {
                name: 'Mayores de 70 años',
                data: ages_seventy
                },
                {
                name: 'Entre 50 y 70 años',
                data: ages_fifty_seventy
                },
                {
                name: 'Menores de 50 años',
                data: ages_zero_fifty
                }
            ]
        });
    }   
    onMount(getData);
    
</script>


<main>
    <!--barra de navegacion-->
	<Navbar style="background-color: #6EAA8D; color:white;" light expand="lg" >
		<NavbarBrand href="#/info">INICIO</NavbarBrand>
		<Nav navbar>
			<Dropdown >
				<DropdownToggle nav caret> Ángel </DropdownToggle>
				<DropdownMenu end>
					<DropdownItem ><h7>FRONT-END</h7></DropdownItem>
					<DropdownItem divider/>
					<DropdownItem href="./#/Cancerdeaths-stats">Cancerdeaths FRONT-END</DropdownItem>
					<DropdownItem divider style="border-color:black;"/>
					<DropdownItem ><h7>API</h7></DropdownItem>
					<DropdownItem divider/>
					<DropdownItem href="./api/v1/cancerdeaths-stats">Cancerdeaths-Stats-API</DropdownItem>
					<DropdownItem divider/>
					<DropdownItem href="./api/v2/cancerdeaths-stats">Cancerdeaths-Stats-V2-API</DropdownItem>
				  <DropdownItem divider style="border-color:black;"/>
				  <DropdownItem ><h7>Graficas</h7></DropdownItem>
					<DropdownItem divider/>
				  <DropdownItem href="./#/cancerdeaths-graph">Cancerdeaths-Stats</DropdownItem>
				  <DropdownItem divider/>
				  <DropdownItem href="./#/cancerdeaths-graph-C3">Cancerdeaths-Stats-C3</DropdownItem>
				  <DropdownItem divider/>
				  <DropdownItem href="./#/cancerdeaths-graph-SOS1">Cancerdeaths-Stats-SOS1</DropdownItem>
				  <DropdownItem divider/>
				  <DropdownItem href="./#/cancerdeaths-graph-SOS2">Cancerdeaths-Stats-SOS2</DropdownItem>
				  <DropdownItem divider/>
				  <DropdownItem href="./#/cancerdeaths-graph-EXT1">Cancerdeaths-Stats-EXT1</DropdownItem>
				  <DropdownItem divider/>
				  <DropdownItem href="./#/cancerdeaths-graph-EXT2">Cancerdeaths-Stats-EXT2</DropdownItem>
				  <DropdownItem divider/>
				  <DropdownItem href="./#/cancerdeaths-graph-EXT3">Cancerdeaths-Stats-EXT3</DropdownItem>
				</DropdownMenu>
			  </Dropdown>
		</Nav>
	</Navbar>
	<!---->
    <br>
    <figure class="highcharts-figure">
        <div id="container"></div>
        <p class="highcharts-description">
            <!--A demo showing a stacked area chart, also sometimes referred to as a
            mountain chart. In a stacked chart, the data series values are added
            together to make up a total.-->
        </p>
    </figure>

</main>