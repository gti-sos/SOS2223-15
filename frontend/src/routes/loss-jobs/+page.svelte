<script>
    // @ts-nocheck

    import { onMount } from "svelte";
    import { dev } from "$app/environment"; // Esta variable de entorno nos indica si se está ejecutando en modo desarrollo (npm run dev --) o en modo de producción (npm start)
    import { Button, Table } from "sveltestrap";
    import { Alert } from 'sveltestrap';

    onMount(async () => {
        // Esto carga el getloss-jobs nada mas iniciar la aplicación.
        getLossJobs();
    });

    let API = "/api/v1/loss-jobs";

    if (dev)
        // Si accedemos en modo normal, accedemos en local a la API y si no, accedemos al servidor de Svelte
        API = "http://localhost:12345" + API;

    let loss_jobs = [];
    let newProvince = 'province';
    let newYear = 'year';
    let newGender = 'gender';
    let newLow_due_to_placement = 'low_due_to_placement';
    let newNo_renovation = 'no_renovation';
    let newOther_reason = 'other_reason';

    let result = "";
    let resultStatus = "";
    let message = "";

    async function getLossJobs() {
        resultStatus = result = "";
        const res = await fetch(API, { // fetch (url)
            method: "GET"
        });
        try {
            const data = await res.json();
            result = JSON.stringify(data, null, 2);
            loss_jobs = data;
        } catch (error) {
            console.log(`Error parsing result: ${error}`);
        }
        const status = await res.status;
        resultStatus = status;
        if(status == 200){
            message = `Obtenidos todos los recursos correctamente.`
        } else if(status==404){
            message = `No hay recursos en la base de datos.`
        }
    }

    async function createJobs() {
        resultStatus = result = "";
        const res = await fetch(API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json", 
            },
            body: JSON.stringify({
                province: newProvince,
                year: parseInt(newYear),
                gender: newGender,
                low_due_to_placement: parseInt(newLow_due_to_placement),
                no_renovation: parseInt(newNo_renovation),
                other_reason: parseInt(newOther_reason)
            })
        });
        const status = await res.status;
        resultStatus = status;
        if (status == 201) {
            getLossJobs();
        }else if(status==400){
            message = `Faltan campos por rellenar: provincia: ${res.body.province}, año: ${res.body.year}, genero: ${res.body.gender},
             bajas por colocacion: ${res.body.low_due_to_placement}, sin renovacion: ${res.body.no_renovation}, por otras razones: ${res.body.other_reason} `;
            console.log("ERROR. Missing one or more fields.");
        }
        else if(status==409){
            message = `Ya existe el recurso que se quiere introducir: ${res.body.province} ${res.body.year} ${res.body.gender}`;
            console.log("ERROR. There is already a resoruce with the given id (province, year and gender) in the data base.");
        }
    }


    async function deleteResource(province,year,gender) {
        resultStatus = result = "";
        const res = await fetch(API + "/" + province + "/" + year + "/" + gender, {
            method: "DELETE"
        });
        const status = await res.status;
        resultStatus = status;
        if(status==200){
            getLossJobs();
            message = `Se ha borrado correctamente el recurso de la base de datos.`;
            console.log("Resource deleted correctly.");
        }
        else if(status==500){
            message = `Error en el cliente.`;
            console.log("ERROR. Client error.");
        }
    }

    async function deleteAllStats() {
        resultStatus = result = "";
        const res = await fetch(API, {
            method: "DELETE"
        });
        const status = await res.status;
        resultStatus = status;
        if(status==200){
            getLossJobs();
            message = `Se han borrado correctamente los datos de la base de datos.`;
            console.log("Deleted all resources correctly.");
        }
        else if(status==500){
            message = `Error en el cliente.`;
            console.log("ERROR. Client error.");
        }
    }
</script>

<h1>loss-jobs</h1>

<Table>
    <thead>
        <tr>
            <th>Provincia</th>
            <th>Genero</th>
            <th>Año</th>
            <th>Bajas debido a puesto</th>
            <th>Sin renovacion</th>
            <th>Otras razones</th>
            <th>Acciones</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><input bind:value={newProvince} /></td>
            <td><input bind:value={newYear} /></td>
            <td><input bind:value={newGender} /></td>
            <td><input bind:value={newLow_due_to_placement} /></td>
            <td><input bind:value={newNo_renovation} /></td>
            <td><input bind:value={newOther_reason} /></td>
            <td><Button on:click={createJobs}>Crear</Button></td>
            <td><Button on:click={deleteResource(newProvince,newYear,newGender)}>Borrar recurso</Button></td>
            <td><Button on:click={deleteAllStats}>Borrar</Button></td>
        </tr>

        {#each loss_jobs as loss_job}
            <tr>
                <td><a href = "/loss-jobs/{loss_job.province}/{loss_job.year}/{loss_job.gender}">{loss_job.province}</a></td>
                <td>{loss_job.year}</td>
                <td>{loss_job.gender}</td>
                <td>{loss_job.low_due_to_placement}</td>
                <td>{loss_job.no_renovation}</td>
                <td>{loss_job.other_reason}</td>
                <td><Button on:click={deleteResource(loss_job.province, loss_job.year,loss_job.gender)}>Borrar recurso</Button></td>
                <td>&nbsp</td>
            </tr>
        {/each}
    </tbody>
</Table>

{#if message != "" && (resultStatus == 200 || resultStatus == 201)} <!--Alerta para los códigos 200 y 201-->

    <div class= "container text-center">
        <Alert color="success" dismissible>{message}</Alert>
    </div>

{/if}

{#if message != "" && ((resultStatus == 400 || resultStatus == 404 || resultStatus == 409))} <!--Alerta para los códigos 400,404, ...-->

    <div class= "container text-center">
        <Alert color="warning" dismissible>{message}</Alert>
    </div>

{/if}

{#if message != "" && resultStatus == 500} <!--Alerta para los códigos 500 (internal server error)-->

    <div class= "container text-center">
        <Alert color="danger" dismissible>{message}</Alert>
    </div>

{/if}

{#if resultStatus != ""}
    <p>Result:</p>
    <pre>
{resultStatus}
{result}
        </pre>
{/if}



