<script>
    // @ts-nocheck

    import { onMount } from "svelte";
    import { dev } from "$app/environment"; // Esta variable de entorno nos indica si se está ejecutando en modo desarrollo (npm run dev --) o en modo de producción (npm start)
    import { Button, Table } from "sveltestrap";
    import { Alert } from 'sveltestrap';

    onMount(async () => {
        // Esto carga el getSalary_stats nada mas iniciar la aplicación.
        getSalary_stats();
    });

    let API = "/api/v1/salary-stats";

    if (dev)
        // Si accedemos en modo normal, accedemos en local a la API y si no, accedemos al servidor de Svelte
        API = "http://localhost:12345" + API;

    let salary_stats = [];
    let newProvince = 'province';
    let newGender = 'gender';
    let newYear = 'year';
    let newSalaried = 'salaried';
    let newAverage_salary = 'average_salary';
    let newStandard_deviation = 'standard_deviation';

    let result = "";
    let resultStatus = "";
    let message = "";

    async function getSalary_stats() {
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
    }

    async function createContact() {
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
            getSalary_stats();
        }else if(status==400){
            message = "Faltan campos por rellenar.";
            console.log("ERROR. Missing one or more fields.")
        }
        else if(status==409){
            message = "Ya existe ese recurso";
            console.log("ERROR. There is already a resoruce with the given id (province, gender and year) in the data base.")
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
            <td><Button on:click={createContact}>Crear</Button></td>
        </tr>

        {#each salary_stats as salary_stat}
            <tr>
                <td>{salary_stat.province}</td>
                <td>{salary_stat.gender}</td>
                <td>{salary_stat.year}</td>
                <td>{salary_stat.salaried}</td>
                <td>{salary_stat.average_salary}</td>
                <td>{salary_stat.standard_deviation}</td>
                <td>&nbsp</td>
            </tr>
        {/each}
    </tbody>
</Table>

{#if message != ""}

    <div class= "container text-center">
        <Alert color="warning" dismissible>{message}</Alert>
    </div>

{/if}

{#if resultStatus != ""}
    <p>Result:</p>
    <pre>
{resultStatus}
{result}
        </pre>
{/if}



