<script>
    // @ts-nocheck

    import { onMount } from "svelte";
    import { dev } from "$app/environment"; // Esta variable de entorno nos indica si se está ejecutando en modo desarrollo (npm run dev --) o en modo de producción (npm start)
    import { Button, Table } from "sveltestrap";
    import { Alert } from 'sveltestrap';
    import { page } from "$app/stores";

    onMount(async () => {
        // Esto carga el getSalary_stats nada mas iniciar la aplicación.
        getSalaryStat();
    });

    let province = $page.params.province;
    let gender = $page.params.gender;
    let year = $page.params.year;

    let API = "/api/v2/salary-stats/" + province + "/" + gender + "/" + year;

    if (dev)
        // Si accedemos en modo normal, accedemos en local a la API y si no, accedemos al servidor de Svelte
        API = "http://localhost:12345" + API;

    let updatedProvince = province;
    let updatedGender = gender;
    let updatedYear = year;
    let updatedSalaried = 'salaried';
    let updatedAverage_salary = 'average_salary';
    let updatedStandard_deviation = 'standard_deviation';

    let result = "";
    let resultStatus = "";
    let message = "";
    let message2 ="";
    let message3 ="";


    async function getSalaryStat() {
        resultStatus = result = "";
        const res = await fetch(API, { // fetch (url)
            method: "GET"
        });
        try {
            const data = await res.json();
            result = JSON.stringify(data, null, 2);
            
            updatedProvince = province;
            updatedGender = gender;
            updatedYear = year;
            updatedSalaried = data.salaried;
            updatedAverage_salary = data.average_salary;
            updatedStandard_deviation = data.standard_deviation;
        } catch (error) {
            console.log(`Error parsing result: ${error}`);
            console.log(`Result:${updatedSalaried}`)
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

    async function updateSalary() {
        resultStatus = result = "";
        const res = await fetch(API , {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                province: updatedProvince,
                gender: updatedGender,
                year: parseInt(updatedYear),
                salaried: parseInt(updatedSalaried),
                average_salary: parseInt(updatedAverage_salary),
                standard_deviation: parseInt(updatedStandard_deviation)
            })
        });
        const status = await res.status;
        resultStatus = status;
        if(status == 200){
            getSalaryStat();
            message = `Se ha actualizado el recurso correctamente.`;
            /*
            if (salaried == "" || average_salary=="" || standard_deviation==""){
                message3= "Faltan campos"
            }
            */
            message2 ="Se ha actualizado el recurso correctamente.";

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

<h1>Detalles del recurso.</h1>

<Table>
    <thead>
        <tr>
            <th>Provincia</th>
            <th>Género</th>
            <th>Año</th>
            <th>Número de asalariados</th>
            <th>Salario medio</th>
            <th>Desviación típica</th>
            <th>Acción</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>{updatedProvince}</td>
            <td>{updatedGender}</td>
            <td>{updatedYear}</td>
            <td><input bind:value={updatedSalaried} /></td>
            <td><input bind:value={updatedAverage_salary} /></td>
            <td><input bind:value={updatedStandard_deviation} /></td>
            <td><Button on:click={updateSalary}>Editar</Button></td>
        </tr>
    </tbody>
</Table>

{#if message != "" && (resultStatus == 200 || resultStatus == 201)} <!--Alerta para los códigos 200 y 201-->

    {#if message2 !=""}
    <div class= "container text-center">
        <Alert color="success" dismissible>{message2}</Alert>
    </div>

    {/if}
    
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


