<script>
    // @ts-nocheck
    import { onMount } from "svelte";
    import { dev } from "$app/environment"; // Esta variable de entorno nos indica si se está ejecutando en modo desarrollo (npm run dev --) o en modo de producción (npm start)
    import { Button, Table, Container, Row, Col, Accordion, AccordionItem} from "sveltestrap";
    import { Alert } from "sveltestrap";
    onMount(async () => {
        // Esto carga el getSalary_stats nada mas iniciar la aplicación.
        getSalaryStats();
    });
    let API = "/api/v2/salary-stats";
    
    if (dev)
        // Si accedemos en modo normal, accedemos en local a la API y si no, accedemos al servidor de Svelte
        API = "http://localhost:12345" + API;
    let salary_stats = [];
    //let salary_stats2 = []; // Salary_stats auxiliar para paginación.
    let newProvince = "provincia";
    let newGender = "género";
    let newYear = "año";
    let newSalaried = "asalariados";
    let newAverage_salary = "salario_medio";
    let newStandard_deviation = "desviación_típica";
    //PAGINACIÓN
    let offset = 0;
    let limit = 10;
    let pagina = 0;
    //BÚSQUEDA CON FROM Y TO (CAMPO YEAR)
    let from = "";
    let to = "";
    //BÚSQUEDA POR PROVINCIA
    let province = "";
    //BÚSQUEDA POR GÉNERO
    let gender = "";
    //BÚSQUEDA POR AÑO
    let year = "";
    //BÚSQUEDA POR ASALARIADOS
    let salaried_behind = "";
    //BÚSQUEDA POR SALARIO MEDIO
    let average_salary_behind = "";
    //BÚSQUEDA POR DESVIACIÓN TÍPICA
    let standard_deviation_over = "";
    let result = "";
    //let result2 = ""; // Result auxiliar para usarlo en la paginación.
    let resultStatus = "";
    //let resultStatus2 = "";
    let message = "";
    async function getSalaryStats() {
        resultStatus = result = "";
        let ruta = `?offset=${offset}&limit=${limit}`; //Definimos una ruta por defecto.
        let parametros = [];
        if(to =="" || from == ""){
            if (province != "") parametros.push(`province=${province}`);
            if (gender != "") parametros.push(`gender=${gender}`);
            if (year != "") parametros.push(`year=${year}`);
            if (salaried_behind != "") parametros.push(`salaried_behind=${salaried_behind}`);
            if (average_salary_behind != "") parametros.push(`average_salary_behind=${average_salary_behind}`);
            if (standard_deviation_over != "") parametros.push(`standard_deviation_over=${standard_deviation_over}`);
        } else{
            if (province != "") parametros.push(`province=${province}`);
            if (gender != "") parametros.push(`gender=${gender}`);
            if (to != "") parametros.push(`to=${to}`);
            if (from != "") parametros.push(`from=${from}`);
            if (salaried_behind != "") parametros.push(`salaried_behind=${salaried_behind}`);
            if (average_salary_behind != "") parametros.push(`average_salary_behind=${average_salary_behind}`);
            if (standard_deviation_over != "") parametros.push(`standard_deviation_over=${standard_deviation_over}`);
        }

        ruta = `${ruta}&${parametros.join('&')}`;
        console.log(` la url es ${API}${ruta}`);
       
        const res = await fetch(API + ruta, {
            // fetch (url)
            method: "GET",
        });
        try {
            const data = await res.json();
            result = JSON.stringify(data, null, 2);
            salary_stats = data;
        } catch (error) {
            console.log(`Error parsing result: ${error}`);
        }
        const status = await res.status;
        resultStatus = status;
        if (status == 200) {
            message = `Obtenidos todos los recursos correctamente.`;
            //console.log(`GET correctly done. There is ${salary_stats.length} resources in page ${pagina}, with an offset of ${offset}`);
        } else if (status == 404) {
            message = `No hay recursos en la base de datos.`;
            console.log(`There is no data to show with GET method.`);
            if(res == "Not Found"){ // Mensaje para el delete a todo.
                message = `Se han borrado correctamente los datos de la base de datos.`;
            } if(province || gender || year || salaried_behind || average_salary_behind || standard_deviation_over){ //Mensaje para fallo al buscar por provincia.
                message = `No existen recursos con los datos introduidos en la búsqueda. provincia:${newProvince}, género: ${newGender}, año: ${newYear},
             número de asalariados: ${newSalaried}, salario medio: ${newAverage_salary}, desviación típica: ${newStandard_deviation}.`
                console.log(`There is no resource with such filtering parameters. provincia:${newProvince}, género: ${newGender}, año: ${newYear},
             número de asalariados: ${newSalaried}, salario medio: ${newAverage_salary}, desviación típica: ${newStandard_deviation}.`);
            }
            
        }
        console.log(` Número de datos devueltos: ${salary_stats.length}`);
    }

    async function getPgSig() {
        if (offset * 10 < salary_stats.length && salary_stats.length>(limit-1)) {
            //console.log(`salary_stats.length ${salary_stats.length}`);
            offset = offset + 10;
            getSalaryStats();
        }
    }
    async function getPgAnt() {
        if (offset >= 10) {
            offset = offset - 10;
            getSalaryStats();
        }
    }
    async function createSalary() {
        resultStatus = result = "";
        const res = await fetch(API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                province: newProvince,
                gender: newGender,
                year: parseInt(newYear),
                salaried: parseInt(newSalaried),
                average_salary: parseInt(newAverage_salary),
                standard_deviation: parseInt(newStandard_deviation),
            }),
        });
        const status = await res.status;
        resultStatus = status;
        if (status == 201) {
            getSalaryStats();
            message = `Se ha creado el recurso correctamente. provincia:${newProvince}, género: ${newGender}, año: ${newYear},
             número de asalariados: ${newSalaried}, salario medio: ${newAverage_salary}, desviación típica: ${newStandard_deviation}.`;
        } else if (status == 400) {
            message = `Faltan campos por rellenar: provincia: ${newProvince}, género: ${newGender}, año: ${newYear},
             número de asalariados: ${newSalaried}, salario medio: ${newAverage_salary}, desviación típica: ${newStandard_deviation} `;
            console.log(
                `ERROR. Missing one or more fields ${newProvince} ${newGender} ${newYear} ${newSalaried} ${newAverage_salary} ${newStandard_deviation}`
            );
        } else if (status == 409) {
            message = `Ya existe el recurso que se quiere introducir: ${newProvince} ${newGender} ${newYear}`;
            console.log(
                `ERROR. There is already a resource with the given id (${newProvince} ${newGender} ${newYear}) in the data base.`
            );
        }
    }

    async function deleteResource(province, gender, year) {
        resultStatus = result = "";
        const res = await fetch(
            API + "/" + province + "/" + gender + "/" + year,
            {
                method: "DELETE",
            }
        );
        const status = await res.status;
        resultStatus = status;
        if (status == 200) {
            getSalaryStats();
            if(salary_stats.length==undefined){
                location.reload();
            }
            message = `Se ha borrado correctamente el recurso ${newProvince}, género: ${newGender}, año: ${newYear} de la base de datos`;
            console.log("Resource deleted correctly.");
        } else if (status == 500) {
            message = `Error en el cliente.`;
            console.log("ERROR. Client error.");
        }
    }
    async function deleteAllStats() {
        resultStatus = result = "";
        const res = await fetch(API, {
            method: "DELETE",
        });
        const status = await res.status;
        resultStatus = status;
        if (status == 200) {
            await getSalaryStats();
            location.reload();
            message = `Se han borrado correctamente los datos de la base de datos.`;
            console.log("Deleted all resources correctly.");
        } else if (status == 500) {
            message = `Error en el cliente.`;
            console.log("ERROR. Client error.");
        }
    }
</script>

<h1 class="display-5" style="font-weight: 400;">Asalariados en las provincias de Andalucía <Button class="ms-3 btn-lg" color="danger" on:click={deleteAllStats}>Borrar Todo</Button></h1>
<Container class="d-flex justify-content-end">
    <Button class="ms-auto" color="secondary" on:click={getPgAnt}>Anterior</Button>
    <Button class="ms-2" color="secondary" on:click={getPgSig}>Siguiente</Button>
</Container>

<Table striped>
    <thead> <!--Cabecera de la tabla de SvelteStrap-->
        <tr>
            <th>Provincia</th>
            <th>Género</th>
            <th>Año</th>
            <th>Número de asalariados</th>
            <th>Salario medio</th>
            <th>Desviación típica</th>
            <th>Acción</th>

            <td>&nbsp</td>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><input bind:value={newProvince} /></td>
            <td><input bind:value={newGender} /></td>
            <td><input bind:value={newYear} /></td>
            <td><input bind:value={newSalaried} /></td>
            <td><input bind:value={newAverage_salary} /></td>
            <td><input bind:value={newStandard_deviation} /></td>
            <td><Button color="warning" on:click={createSalary}>Crear</Button></td>
        </tr>
 
        {#if salary_stats.length<1}
        <tr>
            <td></td>
        </tr>
        {/if}

        {#if salary_stats.length==undefined}
                <tr>
                    <td><a href="/salary-stats/{salary_stats.province}/{salary_stats.gender}/{salary_stats.year}">{salary_stats.province}</a></td>
                    <td>{salary_stats.gender}</td>
                    <td>{salary_stats.year}</td>
                    <td>{salary_stats.salaried}</td>
                    <td>{salary_stats.average_salary}</td>
                    <td>{salary_stats.standard_deviation}</td>
                    <td><Button color="danger" on:click={deleteResource(salary_stats.province,salary_stats.gender,salary_stats.year)}>Borrar recurso</Button></td>
                    <td>&nbsp</td>
                </tr>
        {/if}
        {#if salary_stats.length>1}
        {#each salary_stats as salary_stat}
            <tr>
                <td><a href="/salary-stats/{salary_stat.province}/{salary_stat.gender}/{salary_stat.year}">{salary_stat.province}</a></td>
                <td>{salary_stat.gender}</td>
                <td>{salary_stat.year}</td>
                <td>{salary_stat.salaried}</td>
                <td>{salary_stat.average_salary}</td>
                <td>{salary_stat.standard_deviation}</td>
                <td><Button color="danger" on:click={deleteResource(salary_stat.province,salary_stat.gender,salary_stat.year)}>Borrar recurso</Button></td>
                <td>&nbsp</td>
            </tr>
        {/each}
        {/if}
    </tbody>
</Table>
<Container>
    <h2>Búsquedas:</h2>
    <Row>
        <Col>
            <Row>
            <Col>
                Desde<input bind:value={from} placeholder="Año de inicio"/>
                Hasta<input bind:value={to} placeholder="Año final"/>
            </Col>
        </Row>
        <Row>
            <Col>
                Provincia<input bind:value={province} placeholder="Ingrese una provincia"/>
            </Col>
        </Row>
        <Row>
            <Col>
                Género<input bind:value={gender} placeholder="Ingrese un género"/>
            </Col>
        </Row>
        <Row>
            <Col>
                Año<input bind:value={year} placeholder="Ingrese un año concreto"/>
            </Col>
        </Row>
        <Row>
            <Col>
                Número de asalariados por debajo de: <input bind:value={salaried_behind} placeholder="Número de asalariados"/>
            </Col>
        </Row>
        <Row>
            <Col>
                Salario medio por debajo de: <input bind:value={average_salary_behind} placeholder="Salario Medio"/>
            </Col>
        </Row>
        <Row>
            <Col>
                Desviación típica por encima de: <input bind:value={standard_deviation_over} placeholder="Desviación típica"/>
            </Col>
        </Row>
        
        </Col>
        <Col>
            <Button color="info" on:click={getSalaryStats}>Filtrar</Button>
        </Col>
    </Row>
</Container>

{#if message != "" && (resultStatus == 200 || resultStatus == 201)}
    <!--Alerta para los códigos 200 y 201-->

    <div class="container text-center">
        <Alert color="success" dismissible>{message}</Alert>
    </div>
{/if}

{#if message != "" && (resultStatus == 400 || resultStatus == 404 || resultStatus == 409)}
    <!--Alerta para los códigos 400,404,409, ...-->

    <div class="container text-center">
        <Alert color="warning" dismissible>{message}</Alert>
    </div>
{/if}

{#if message != "" && resultStatus == 500}
    <!--Alerta para los códigos 500 (internal server error)-->

    <div class="container text-center">
        <Alert color="danger" dismissible>{message}</Alert>
    </div>
{/if}