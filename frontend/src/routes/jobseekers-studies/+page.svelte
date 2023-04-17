<script>
    // @ts-nocheck

    import { onMount } from "svelte";
    import { dev } from "$app/environment"; // Esta variable de entorno nos indica si se está ejecutando en modo desarrollo (npm run dev --) o en modo de producción (npm start)
    import { Button, Row, Table } from "sveltestrap";
    import { Alert } from "sveltestrap";
    import { Pagination, PaginationItem, PaginationLink } from "sveltestrap";

    onMount(async () => {
        // Esto carga el getjobseekers-studies nada mas iniciar la aplicación.
        getJobseekersStudies();
    });

    let API = "/api/v1/jobseekers-studies";

    if (dev)
        // Si accedemos en modo normal, accedemos en local a la API y si no, accedemos al servidor de Svelte
        API = "http://localhost:12345" + API;

    let jobseekers = [];
    let newYear = "";
    let newGender = "";
    let newTerritory = "";
    let newType = "";
    let newPrimary = "";
    let newFp_program = "";
    let newGeneral_education = "";
    let newTotal = "";

    let offsetFiltro = "";
    let limitFiltro = "";
    let from = "";
    let to = "";
    let year = "";
    let gender = "";
    let territory = "";
    let type = "";
    let primary_under = "";
    let primary_over = "";
    let fp_program_under = "";
    let fp_program_over = "";
    let general_education_under = "";
    let general_education_over = "";
    let total_under = "";
    let total_over = "";

    let result = "";
    let resultStatus = "";
    let message = "";

    async function getLoadInitialData(){
            resultStatus = result = "";
            const res = await fetch(API+'/loadInitialData', {
                method: 'GET'
            });
            const status = await res.status;
            resultStatus = status;
            if(status==200){
                message = "Se han insertado los datos de nuevo";
                //getJobseekersStudies();
            }else{
                message = "No se han podido insertar los datos de nuevo";
            }
        }

    async function getJobseekersStudies() {
        resultStatus = result = "";
        const res = await fetch(API, {
            // fetch (url)
            method: "GET",
        });
        try {
            const data = await res.json();
            result = JSON.stringify(data, null, 2);
            jobseekers = data;
        } catch (error) {
            console.log(`Error parsing result: ${error}`);
        }
        const status = await res.status;
        resultStatus = status;
        if (status == 200) {
            message = `Obtenidos todos los datos correctamente.`;
            console.log(`GET correctly done`);
        } else if (status == 404) {
            message = `No hay datos en la base de datos.`;
            console.log(`There is no data to show with GET method.`);
        }
    }

    async function getPaginacion(offsetFiltro, limitFiltro) {
        //
        resultStatus = result = "";
        const res = await fetch(
            API + "?offset=" + offsetFiltro + "&limit=" + limitFiltro,
            {
                method: "GET",
            }
        );
        console.log(API + "?offset=" + offsetFiltro + "&limit=" + limitFiltro);
        try {
            const data = await res.json();
            result = JSON.stringify(data, null, 2);
            jobseekers = data;
        } catch (error) {
            console.log(`Error parseando el resultado: ${error}`);
        }
        const status = await res.status;
        resultStatus = status;
    }

    async function getJobseekersFiltrado(){
            const consulta = {}; // crea un objeto vacío para los otros campo
            if (year) { 
                consulta.year = year; 
            }
            if (from) { 
                consulta.from = from; 
            }
            if (to) { 
                consulta.to = to; 
            }
            if (gender) { 
                consulta.gender = gender; 
            }
            if (territory) { 
                consulta.territory = territory; 
            }
            if (type) { 
                consulta.type = type; 
            }
            if (primary_over) { 
                consulta.primary_over = primary_over; 
            }
            if (primary_under) { 
                consulta.primary_under = primary_under; 
            }
            if (fp_program_over) { 
                consulta.fp_program_over = fp_program_under; 
            }
            if (fp_program_under) { 
                consulta.fp_program_over = fp_program_over; 
            }
            if (general_education_over) { 
                consulta.general_education_over = general_education_over; 
            }
            if (general_education_under) { 
                consulta.general_education_under = general_education_under;
            }
            if (total_over) { 
                consulta.total_over = total_over; 
            }
            if (total_under) { 
                consulta.total_under = total_under; 
            }
            //Realiza la solicitud GET al endpoint /api/v2/evolution con la consulta creada
            
            const res = await fetch(API+`?${new URLSearchParams(consulta).toString()}`, {
                method: "GET"
            });
            try{
                const data = await res.json();
                result = JSON.stringify(data, null, 2);
                jobseekers = data;
            }catch(error){
                console.log(`Error parseando el resultado: ${error}`);
            }
            const status = await res.status;
            resultStatus = status;
            if(status==200){
                message = "Mostrando datos correspondientes al filtrado";
            }else{
                message = "No se han podido encontrar los datos: ";
            }
        }


    async function getLimpiarFiltros() {
        resultStatus = result = "";
        if (from != "" || to != "" || year != "" || gender != "" || territory != "" || type != "" || primary_over != "" || primary_under != "" || fp_program_over != "" || fp_program_under != ""  || general_education_over != "" || general_education_under != "" || total_over != ""  || total_under != "") {
            from = "";
            to = "";
            year = "";
            gender = "";
            territory = "";
            type = "";
            primary_under = "";
            primary_over = "";
            fp_program_under = "";
            fp_program_over = "";
            general_education_under = "";
            general_education_over = "";
            total_under = "";
            total_over = "";
        }
        location.reload();
    }

    async function createJobseeker() {
        resultStatus = result = "";
        if (
            !newYear ||
            !newGender ||
            !newTerritory ||
            !newType ||
            !newPrimary ||
            !newFp_program ||
            !newGeneral_education ||
            !newTotal
        ) {
            message = `Faltan campos por rellenar`;
            console.log("ERROR. Missing one or more fields.");
            resultStatus = 400;
            return; // Salir de la función si algún campo está vacío
        }
        const res = await fetch(API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                year: parseInt(newYear),
                gender: newGender,
                territory: newTerritory,
                type: newType,
                primary: parseInt(newPrimary),
                fp_program: parseInt(newFp_program),
                general_education: parseInt(newGeneral_education),
                total: parseInt(newTotal),
            }),
        });
        const status = await res.status;
        resultStatus = status;
        if (status == 201) {
            getJobseekersStudies();
            message = `Se ha creado el recurso correctamente.`;
        } else if (status == 409) {
            message = `Ya existe el recurso que se quiere introducir ${res.body.year} ${res.body.gender} ${res.body.territory} ${res.body.type}`;
            console.log(
                `ERROR. There is already a resoruce with the given id ${res.body.year} ${res.body.gender} ${res.body.territory} ${res.body.type} in the data base.`
            );
        }
    }

    async function deleteResource(year, gender, territory, type) {
        resultStatus = result = "";
        const res = await fetch(
            API + "/" + year + "/" + gender + "/" + territory + "/" + type,
            {
                method: "DELETE",
            }
        );
        const status = await res.status;
        resultStatus = status;
        if (status == 200) {
            getJobseekersStudies();
            message = `Se ha borrado correctamente el recurso año: ${newYear}, género: ${newGender}, territorio: ${newTerritory}, tipo de demandante: ${newType} de la base de datos`;
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
            location.reload();
            message = `Se han borrado correctamente los datos de la base de datos.`;
            console.log("Deleted all resources correctly.");
        } else if (status == 500) {
            message = `Error en el cliente.`;
            console.log("ERROR. Client error.");
        }
    }
</script>

<h1 style="text-align: center;">Demandantes de empleo</h1>

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

<div class="camposFiltros">
    <label class="columna">
        Desde el año:
        <input bind:value={from} type="text"/>
    </label>
    <label class="columna">
        Hasta el año:
        <input bind:value={to} type="text"/>
    </label>
    <label class="columna">
        Año:
        <input bind:value={year} type="text"/>
    </label>
    <label class="columna">
        Género:
        <input bind:value={gender} type="text"/>
    </label>
    <label class="columna">
        Territorio:
        <input bind:value={territory} type="text"/>
    </label>
    <label class="columna">
        Tipo demandante:
        <input bind:value={type} type="text"/>
    </label>
</div>

<div class="camposFiltros">
    <label class="columna">
        Estudios primarios mayor o igual que:
        <input bind:value={primary_over} type="text"/>
    </label>
    <label class="columna">
        Estudios primarios mayor o igual que: 
        <input bind:value={primary_under} type="text"/>
    </label>
</div>

<div class="camposFiltros">
    <label class="columna">
        Programa fp mayor o igual que:
        <input bind:value={fp_program_over} type="text"/>
    </label>
    <label class="columna">
        Programa fp menor o igual que:
        <input bind:value={fp_program_under} type="text"/>
    </label>
</div>

<div class="camposFiltros">
    <label class="columna">
        Educación general mayor o igual que:
        <input bind:value={general_education_over} type="text"/>
    </label>
    <label class="columna">
        Educación general menor o igual que:
        <input bind:value={general_education_under} type="text"/>
    </label>
</div>

<div class="camposFiltros">
    <label class="columna">
        Total mayor o igual que:
        <input bind:value={general_education_over} type="text"/>
    </label>
    <label class="columna">
        Total menor o igual que:
        <input bind:value={general_education_under} type="text"/>
    </label>
</div>
<p></p>
<div style="text-align: center; word-spacing: 15px;">
    <Button color = "primary" on:click={getJobseekersFiltrado}>Filtrar</Button>

    <Button color="secondary" on:click={getLimpiarFiltros}>Limpiar Filtros</Button>
</div>

<Table hover>
    <thead>
        <tr>
            <th>Año</th>
            <th>Género</th>
            <th>Territorio</th>
            <th>Tipo de demandante</th>
            <th>Estudios primarios</th>
            <th>Programa FP</th>
            <th>Educación general</th>
            <th>Total</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><input placeholder="Año" bind:value={newYear} /></td>
            <td><input placeholder="Género" bind:value={newGender} /></td>
            <td><input placeholder="Territorio" bind:value={newTerritory} /></td
            >
            <td><input placeholder="Tipo demandante" bind:value={newType} /></td
            >
            <td
                ><input
                    placeholder="Estudios primarios"
                    bind:value={newPrimary}
                /></td
            >
            <td
                ><input
                    placeholder="Programa FP"
                    bind:value={newFp_program}
                /></td
            >
            <td
                ><input
                    placeholder="Educación general"
                    bind:value={newGeneral_education}
                /></td
            >
            <td><input placeholder="Total" bind:value={newTotal} /></td>
            <td
                ><Button color="primary" on:click={createJobseeker}
                    >Crear</Button
                ></td
            >
        </tr>

        {#each jobseekers as jobseekers}
            <tr>
                <td>{jobseekers.year}</td>
                <td>{jobseekers.gender}</td>
                <td
                    ><a
                        href="/jobseekers-studies/{jobseekers.year}/{jobseekers.gender}/{jobseekers.territory}/{jobseekers.type}"
                        >{jobseekers.territory}</a
                    ></td
                >
                <td>{jobseekers.type}</td>
                <td>{jobseekers.primary}</td>
                <td>{jobseekers.fp_program}</td>
                <td>{jobseekers.general_education}</td>
                <td>{jobseekers.total}</td>
                <td
                    ><Button
                        color="danger"
                        on:click={deleteResource(
                            jobseekers.year,
                            jobseekers.gender,
                            jobseekers.territory,
                            jobseekers.type
                        )}>Borrar</Button
                    ></td
                >
            </tr>
        {/each}
    </tbody>
</Table>

<div style="text-align: center; word-spacing: 20px;">
    <Button color="danger" on:click={deleteAllStats}>Borrar Datos</Button>
    <Button color="success" on:click={getLoadInitialData}>Cargar Datos</Button>
</div>

<div class="pagination-container">
    <Pagination ariaLabel="Page navigation example">
        <PaginationItem>
          <PaginationLink on:click={() => getPaginacion(0,5)} first href="/jobseekers-studies"/>
        </PaginationItem>
        <!--<PaginationItem disabled>
          <PaginationLink previous href="#" />
        </PaginationItem> -->
        <PaginationItem>
            <PaginationLink on:click={() => getPaginacion(0,5)} href="/jobseekers-studies">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
            <PaginationLink on:click={() => getPaginacion(4,5)} href="/jobseekers-studies?offset=5&limit=5">2</PaginationLink>
        </PaginationItem>
        <PaginationItem>
            <PaginationLink on:click={() => getPaginacion(9,5)} href="/jobseekers-studies?offset=10&limit=5">3</PaginationLink>
        </PaginationItem>
        <!-- <PaginationItem>
          <PaginationLink next href="#" />
        </PaginationItem> -->
        <PaginationItem>
          <PaginationLink on:click={() => getPaginacion(9,5)} last href="/jobseekers-studies?offset=10&limit=5" />
        </PaginationItem>
      </Pagination>
</div>

<!-- 
    {#if resultStatus != ""}
    <p>Result:</p>
    <pre>
        {resultStatus}
        {result}
    </pre>
    {/if}
-->

<style>
    .camposFiltros{
            display: flex;
            justify-content: center;
        }
    input {
        max-width: 150px;
    }
    .pagination-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}
.columna{
            padding: 5px;
            margin: 5px;
        }
</style>
