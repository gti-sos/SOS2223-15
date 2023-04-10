<script>
    // @ts-nocheck

    import { onMount } from "svelte";
    import { dev } from "$app/environment"; // Esta variable de entorno nos indica si se está ejecutando en modo desarrollo (npm run dev --) o en modo de producción (npm start)
    import { Button, Table } from "sveltestrap";
    import { Alert } from 'sveltestrap';
    import { page } from "$app/stores";

    onMount(async () => {
        // Esto carga el getloss-jobs nada mas iniciar la aplicación.
        getLossJobs();
    });

    let province = $page.params.province;
    let gender = $page.params.gender;
    let year = $page.params.year;

    let API = "/api/v1/loss-jobs/" + province + "/" + year + "/" + gender;

    if (dev)
        // Si accedemos en modo normal, accedemos en local a la API y si no, accedemos al servidor de Svelte
        API = "http://localhost:12345" + API;

    let updatedProvince = province;
    let updatedYear = year;
    let updatedGender = gender;
    let updatedLow_due_to_placement = 'low_due_to_placement';
    let updatedNo_renovation = 'no_renovation';
    let updatedOther_reason = 'other_reason';

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
            
            updatedProvince = province;
            updatedYear = year;
            updatedGender = gender;
            updatedLow_due_to_placement = data.low_due_to_placement;
            updatedNo_renovation = data.no_renovation;
            updatedOther_reason = data.other_reason;
        } catch (error) {
            console.log(`Error parsing result: ${error}`);
            console.log(`Result:${updatedLow_due_to_placement}`)
        }
        const status = await res.status;
        resultStatus = status;
        if(status == 200){
            message = `Obtenidos todos los recursos correctamente.`
        } else if(status==404){
            message = `No existe el recurso especificado.`
            console.log(`There is no resorce with such parameters. `)
        }
    }

    async function updateLossJobs() {
        resultStatus = result = "";
        const res = await fetch(API , {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                province: updatedProvince,
                year: parseInt(updatedYear),
                gender: updatedGender,
                low_due_to_placement: parseInt(updatedLow_due_to_placement),
                no_renovation: parseInt(updatedNo_renovation),
                other_reason: parseInt(updatedOther_reason)
            })
        });
        const status = await res.status;
        resultStatus = status;
        if(status == 200){
            getLossJobs();
            message = `Se ha actualizado el recurso correctamente.`;
            console.log("Resource updated correctly.");
        }
        else if(status == 400){
            message = `Los datos introducidos no son correctos.`;
        }
        else if(status == 500){
            message = `Error en el cliente.`;
            console.log("ERROR. Client error.");
        }
    }

</script>

<h1>loss-jobs update</h1>

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
            <td>{updatedProvince}</td>
            <td>{updatedYear}</td>
            <td>{updatedGender}</td>
            <td><input bind:value={updatedLow_due_to_placement} /></td>
            <td><input bind:value={updatedNo_renovation} /></td>
            <td><input bind:value={updatedOther_reason} /></td>
            <td><Button on:click={updateLossJobs}>Editar</Button></td>
        </tr>
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



