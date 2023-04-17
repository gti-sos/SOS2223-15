<script>
    // @ts-nocheck

    import { onMount } from "svelte";
    import { dev } from "$app/environment"; // Esta variable de entorno nos indica si se está ejecutando en modo desarrollo (npm run dev --) o en modo de producción (npm start)
    import { Button, Table } from "sveltestrap";
    import { Alert } from 'sveltestrap';
    import { page } from "$app/stores";

    onMount(async () => {
        // Esto carga el getSalary_stats nada mas iniciar la aplicación.
        getJobseekersStudies();
    });

    let gender = $page.params.gender;
    let year = $page.params.year;
    let territory = $page.params.territory;
    let type = $page.params.type;

    let API = "/api/v1/jobseekers-studies/" + year + "/" + gender + "/" + territory + "/" + type ;

    if (dev)
        // Si accedemos en modo normal, accedemos en local a la API y si no, accedemos al servidor de Svelte
        API = "http://localhost:12345" + API;

    let updatedYear = year;
    let updatedGender = gender;
    let updatedTerritory = territory;
    let updatedType = type;
    let updatedPrimary = 'primary';
    let updatedFp_program = 'fp_program';
    let updatedGeneral_education = 'general_education';
    let updatedTotal = 'total';

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
            
            updatedYear = year;
            updatedGender = gender;
            updatedTerritory = territory;
            updatedType = type;
            updatedPrimary = data.primary;
            updatedFp_program = data.fp_program;
            updatedGeneral_education = data.general_education;
            updatedTotal = data.total;
        } catch (error) {
            console.log(`Error parsing result: ${error}`);
        }
        const status = await res.status;
        resultStatus = status;
        if(status == 404){
            message = `No existe ningún recurso para la provincia: ${updatedProvince}, en el año: ${updatedYear}.`;
            color_alert = "danger";
        }else{
            if(status == 400){
                message = "Ha habido un error en la petición";
                color_alert = "danger";
            }
        }
    }

    async function updateJobseeker(year,gender,territory,type) {
        resultStatus = result = "";
        const res = await fetch(API , {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                year: parseInt(updatedYear),
                gender: updatedGender,
                territory: updatedTerritory,
                type: updatedType,
                primary: parseInt(updatedPrimary),
                fp_program: parseInt(updatedFp_program),
                general_education: parseInt(updatedGeneral_education),
                total: parseInt(updatedTotal)
            })
        });
        const status = await res.status;
        resultStatus = status;
        if(status==200){
            getJobseekersStudies();
            message = `Se ha actualizado el recurso correctamente.`;
            console.log("Resource updated correctly.");
        }
        else if(status ==400){
            message = `Los datos introducidos no son correctos.`;
        }
        else if(status==500){
            message = `Error en el cliente.`;
            console.log("ERROR. Client error.");
        }
    }


</script>

<h1>Detalles del recurso.</h1>

{#if message != "" && (resultStatus == 200 || resultStatus == 201)} <!--Alerta para los códigos 200 y 201-->

    <div class= "container text-center">
        <Alert color="success" dismissible>{message}</Alert>
    </div>

{/if}

{#if message != "" && ((resultStatus == 400 || resultStatus == 404 || resultStatus == 409))} <!--Alerta para los códigos 400,404,409, ...-->

    <div class= "container text-center">
        <Alert color="warning" dismissible>{message}</Alert>
    </div>

{/if}

{#if message != "" && resultStatus == 500} <!--Alerta para los códigos 500 (internal server error)-->

    <div class= "container text-center">
        <Alert color="danger" dismissible>{message}</Alert>
    </div>

{/if}

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
            <td>{updatedYear}</td>
            <td>{updatedGender}</td>
            <td>{updatedTerritory}</td>
            <td>{updatedType}</td>
            <td><input bind:value={updatedPrimary} /></td>
            <td><input bind:value={updatedFp_program} /></td>
            <td><input bind:value={updatedGeneral_education} /></td>
            <td><input bind:value={updatedTotal} /></td>
            <td><Button on:click={updateJobseeker}>Editar</Button></td>
        </tr>

        <tr>
            <td>{updatedYear}</td>
            <td>{updatedGender}</td>
            <td>{updatedTerritory}</td>
            <td>{updatedType}</td>
            <td>{updatedPrimary}</td>
            <td>{updatedFp_program}</td>
            <td>{updatedGeneral_education}</td>
            <td>{updatedTotal}</td>
        </tr>
    </tbody>
</Table>


<!--
    {#if resultStatus != ""}
        <p>Result:</p>
        <pre>
    {resultStatus}
    {result}
            </pre>
    {/if}
-->