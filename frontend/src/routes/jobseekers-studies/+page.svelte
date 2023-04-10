
<script>
    // @ts-nocheck

    import { onMount } from "svelte";
    import { dev } from "$app/environment"; // Esta variable de entorno nos indica si se está ejecutando en modo desarrollo (npm run dev --) o en modo de producción (npm start)
    import { Button, Table } from "sveltestrap";
    import { Alert } from 'sveltestrap';

    onMount(async () => {
        // Esto carga el getjobseekers-studies nada mas iniciar la aplicación.
        getJobseekersStudies();
    });

    let API = "/api/v1/jobseekers-studies";

    if (dev)
        // Si accedemos en modo normal, accedemos en local a la API y si no, accedemos al servidor de Svelte
        API = "http://localhost:12345" + API;

    let jobseekers = [];
    let newYear = 'year';
    let newGender = 'gender';
    let newTerritory = 'territto';
    let newType = 'type';
    let newPrimary = 'primary';
    let newFp_program = 'fp_program';
    let newGeneral_education = 'general_education';
    let newTotal = 'total';

    let result = "";
    let resultStatus = "";
    let message = "";

    async function getJobseekersStudies() {
        resultStatus = result = "";
        const res = await fetch(API, { // fetch (url)
            method: "GET"
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
        if(status == 200){
            message = `Obtenidos todos los datos correctamente.`
        } else if(status==404){
            message = `No hay datos en la base de datos.`
        }
    }

    async function createJobseeker() {
        resultStatus = result = "";
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
                total: parseInt(newTotal)
            })
        });
        const status = await res.status;
        resultStatus = status;
        if (status == 201) {
            getJobseekersStudies();
        }else if(status==400){
            message = `Faltan campos por rellenar: año: ${res.body.year}, genero: ${res.body.gender},
             territorio: ${res.body.territory}, tipo de demandante: ${res.body.type}, estudios primarios: ${res.body.primary}, programa FP: ${res.body.fp_program}, educacion general: ${res.body.general_education}, total: ${res.body.total}`;
            console.log("ERROR. Missing one or more fields.");
        }
        else if(status==409){
            message = `Ya existe el recurso que se quiere introducir: ${res.body.year} ${res.body.gender} ${res.body.territory} ${res.body.type}`;
            console.log(`ERROR. There is already a resoruce with the given id ${res.body.year} ${res.body.gender} ${res.body.territory} ${res.body.type} in the data base.`);
        }
    }

    async function deleteResource(year,gender,territory,type) {
        resultStatus = result = "";
        const res = await fetch(API + "/" + year + "/" + gender + "/" + territory + "/" + type, {
            method: "DELETE"
        });
        const status = await res.status;
        resultStatus = status;
        if(status==200){
            getJobseekersStudies();
            message = `Se ha borrado correctamente el recurso año: ${newYear}, género: ${newGender}, territorio: ${newTerritory}, tipo de demandante: ${newType} de la base de datos`;
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
            getJobseekersStudies();
            message = `Se han borrado correctamente los datos de la base de datos.`;
            console.log("Deleted all resources correctly.");
        }
        else if(status==500){
            message = `Error en el cliente.`;
            console.log("ERROR. Client error.");
        }
    }
</script>

<h1>jobseekers-studies</h1>

<Table>
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
            <td><input bind:value={newYear} /></td>
            <td><input bind:value={newGender} /></td>
            <td><input bind:value={newTerritory} /></td>
            <td><input bind:value={newType} /></td>
            <td><input bind:value={newPrimary} /></td>
            <td><input bind:value={newFp_program} /></td>
            <td><input bind:value={newGeneral_education} /></td>
            <td><input bind:value={newTotal} /></td>
            <td><Button on:click={createJobseeker}>Crear</Button></td>
            <td><Button on:click={deleteResource(newYear,newGender,newTerritory,newType)}>Borrar recurso</Button></td>
            <td><Button on:click={deleteAllStats}>Borrar</Button></td>
        </tr>

        {#each jobseekers as jobseekers}
            <tr>
                <td><a href="/jobseekers-studies/{jobseekers.year}/{jobseekers.gender}/{jobseekers.territory}/{jobseekers.type}">{jobseekers.territory}</a></td>
                <td>{jobseekers.year}</td>
                <td>{jobseekers.gender}</td>
                <td>{jobseekers.territory}</td>
                <td>{jobseekers.type}</td>
                <td>{jobseekers.primary}</td>
                <td>{jobseekers.fp_program}</td>
                <td>{jobseekers.general_education}</td>
                <td>{jobseekers.total}</td>
                <td><Button on:click={deleteResource(jobseekers.year,jobseekers.gender,jobseekers.territory,jobseekers.type)}>Borrar recurso</Button></td>
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

{#if message != "" && ((resultStatus != 200 || resultStatus != 201 || resultStatus != 500))} <!--Alerta para los códigos 400,404, ...-->

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



