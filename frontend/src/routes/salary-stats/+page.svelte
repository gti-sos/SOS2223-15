<script>
    // @ts-nocheck

    import { onMount } from "svelte";
    import { dev } from "$app/environment"; // Esta variable de entorno nos indica si se está ejecutando en modo desarrollo (npm run dev --) o en modo de producción (npm start)
    import { Button, Table } from "sveltestrap";
    import { Alert } from 'sveltestrap';

    onMount(async () => {
        // Esto carga el getSalary_stats nada mas iniciar la aplicación.
        getSalaryStats();
    });

    let API = "/api/v2/salary-stats";

    if (dev)
        // Si accedemos en modo normal, accedemos en local a la API y si no, accedemos al servidor de Svelte
        API = "http://localhost:12345" + API;

    let salary_stats = [];
    let newProvince = 'provincia';
    let newGender = 'género';
    let newYear = 'año';
    let newSalaried = 'asalariados';
    let newAverage_salary = 'salario_medio';
    let newStandard_deviation = 'desviación_típica';

    let result = "";
    let resultStatus = "";
    let message = "";

    async function getSalaryStats() {
        resultStatus = result = "";
        const res = await fetch(API, { // fetch (url)
            method: "GET"
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
        if(status == 200){
            message = `Obtenidos todos los recursos correctamente.`
            console.log(`GET correctly done`)
        } else if(status==404){
            message = `No hay recursos en la base de datos.`
            console.log(`There is no data to show with GET method.`)
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
                standard_deviation: parseInt(newStandard_deviation)
            })
        });
        const status = await res.status;
        resultStatus = status;
        if (status == 201) {
            getSalaryStats();
            message=`Se ha creado el recurso correctamente. provincia:${newProvince}, género: ${newGender}, año: ${newYear},
             número de asalariados: ${newSalaried}, salario medio: ${newAverage_salary}, desviación típica: ${newStandard_deviation}`
        }else if(status==400){
            message = `Faltan campos por rellenar: provincia: ${newProvince}, género: ${newGender}, año: ${newYear},
             número de asalariados: ${newSalaried}, salario medio: ${newAverage_salary}, desviación típica: ${newStandard_deviation} `;
            console.log(`ERROR. Missing one or more fields ${newProvince} ${newGender} ${newYear} ${newSalaried} ${newAverage_salary} ${newStandard_deviation}`);
        }
        else if(status==409){
            message = `Ya existe el recurso que se quiere introducir: ${newProvince} ${newGender} ${newYear}`;
            console.log(`ERROR. There is already a resource with the given id (${newProvince} ${newGender} ${newYear}) in the data base.`);
        }
    }

    /*
    async function updateSalary(province,gender,year) {
        resultStatus = result = "";
        const res = await fetch(API + "/" + province + "/" + gender + "/" + year, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                province: province,
                gender: gender,
                year: parseInt(year),
                salaried: parseInt(newSalaried),
                average_salary: parseInt(newAverage_salary),
                standard_deviation: parseInt(newStandard_deviation)
            })
        });
        const status = await res.status;
        resultStatus = status;
        if(status==200){
            getSalaryStats();
            message = `Se ha actualizado el recurso correctamente.`;
            console.log("Resource updated correctly.");
        }
        else if(status ==400){


        }
        else if(status==500){
            message = `Error en el cliente.`;
            console.log("ERROR. Client error.");
        }
    }

    */

    async function deleteResource(province,gender,year) {
        resultStatus = result = "";
        const res = await fetch(API + "/" + province + "/" + gender + "/" + year, {
            method: "DELETE"
        });
        const status = await res.status;
        resultStatus = status;
        if(status==200){
            getSalaryStats();
            message = `Se ha borrado correctamente el recurso ${newprovince}, género: ${newGender}, año: ${newYear} de la base de datos`;
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
            await getSalaryStats();
            message = `Se han borrado correctamente los datos de la base de datos.`;
            console.log("Deleted all resources correctly.");
        }
        else if(status==500){
            message = `Error en el cliente.`;
            console.log("ERROR. Client error.");
        }
    }
</script>

<h1>salary-stats</h1>

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
            <td><Button on:click={createSalary}>Crear</Button></td>
        <!--    <td><Button on:click={updateSalary(newProvince,newGender,newYear)}>Editar</Button></td> -->
            <td><Button on:click={deleteAllStats}>Borrar Todo</Button></td>
            
        </tr>

        {#each salary_stats as salary_stat}
            <tr>
                <td><a href = "/salary-stats/{salary_stat.province}/{salary_stat.gender}/{salary_stat.year}">{salary_stat.province}</a></td>
                <td>{salary_stat.gender}</td>
                <td>{salary_stat.year}</td>
                <td>{salary_stat.salaried}</td>
                <td>{salary_stat.average_salary}</td>
                <td>{salary_stat.standard_deviation}</td>
                <td><Button on:click={deleteResource(salary_stat.province, salary_stat.gender,salary_stat.year)}>Borrar recurso</Button></td>
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




