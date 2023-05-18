<script>
    // @ts-nocheck
    import { onMount } from "svelte";
    import { Button, Table, Container} from "sveltestrap";
    import { Alert } from "sveltestrap";
    onMount(async () => {
        // Esto carga el getentity_stats nada mas iniciar la aplicación.
        getSalaryStats();
    });

    let API_localentities = "https://sos2223-13.appspot.com/api/v2/localentities";
    
    let entity_stats = [];

    //PAGINACIÓN
    let offset = 0;
    let limit = 10;

    let result = "";
    //let result2 = ""; // Result auxiliar para usarlo en la paginación.
    let resultStatus = "";
    //let resultStatus2 = "";
    let message = "";
    async function getSalaryStats() {
        resultStatus = result = "";
        let ruta = `?offset=${offset}&limit=${limit}`; //Definimos una ruta por defecto.
       console.log(` la url es ${API_localentities}${ruta}`);
       
        const res = await fetch(API_localentities + ruta, {
            // fetch (url)
            method: "GET",
        });
        try {
            const data = await res.json();
            result = JSON.stringify(data, null, 2);
            entity_stats = data;
        } catch (error) {
            console.log(`Error parsing result: ${error}`);
        }
        const status = await res.status;
        resultStatus = status;
        if (status == 200) {
            message = `Obtenidos todos los recursos correctamente.`;
            console.log(`GET correctly done. There is ${entity_stats.length} resources, with an offset of ${offset}`);
        }
        console.log(` Número de datos devueltos: ${entity_stats.length}`);
    }

    async function getPgSig() {
        if (offset * 10 < entity_stats.length && entity_stats.length>(limit-1)) {
            //console.log(`entity_stats.length ${entity_stats.length}`);
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

</script>

<Container class="d-flex justify-content-end">
    <Button class="ms-auto" color="secondary" on:click={getPgAnt}>Anterior</Button>
    <Button class="ms-2" color="secondary" on:click={getPgSig}>Siguiente</Button>
</Container>

<Table striped>
    <thead> <!--Cabecera de la tabla de SvelteStrap-->
        <tr>
            <th>Provincia</th>
            <th>landline</th>
            <th>first_name</th>
            <th>second_name</th>
            <th>president_appointment_date</th>
            <th>surface_extension</th>
            <th>population</th>
            <th>expense</th>
            <th>income</th>
          <!-- <td><Button on:click={irAPagina}>Página:</Button><input bind:value={pagina}/></td>--> 

            <td>&nbsp</td>
        </tr>
    </thead>
    <tbody>
        {#each entity_stats as entity_stat}
            <tr>
                <td>{entity_stat.province}</td>
                <td>{entity_stat.landline}</td>
                <td>{entity_stat.first_name}</td>
                <td>{entity_stat.second_name}</td>
                <td>{entity_stat.president_appointment_date}</td>
                <td>{entity_stat.surface_extension}</td>
                <td>{entity_stat.population}</td>
                <td>{entity_stat.expense}</td>
                <td>{entity_stat.income}</td>
                <td>&nbsp</td>
            </tr>
        {/each}
    </tbody>
</Table>

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