<script>
    // @ts-nocheck
    import { onMount } from "svelte";
    import { Table } from "sveltestrap";
    import axios, { formToJSON } from 'axios';

    onMount(async () => {
        getPokemonData();
    });

    let Pokemon_stats = [];

    async function getPokemonData() {
        const options = {
            method: 'GET',
            url: 'https://pokemon-go1.p.rapidapi.com/pokemon_stats.json',
            headers: {
                'X-RapidAPI-Key': 'b72bf7a6a9mshc58f9ea15845135p17ac66jsne782008c78e3',
                'X-RapidAPI-Host': 'pokemon-go1.p.rapidapi.com'
            }
        };

        try {
            const response = await axios.request(options);
            Pokemon_stats = response.data;
        } catch (error) {
            console.error(error);
        }
    }

</script>

<main>

    <h3 align="center"><u>Pokémon Go</u></h3>
        <p style="text-align:center">
            Datos de: <a
                style="text-decoration: none; color:black"
                href="https://rapidapi.com/Chewett/api/pokemon-go1/"
                target="_blank"><u>Rapid API Pokémon Go</u></a
            >
        </p>
    <br>
    <Table striped>
        <thead>
            <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Ataque Base</th>
                <th>Defensa Base</th>
                <th>Resistencia Base</th>
                <th>Forma</th>
                <td>&nbsp</td>
            </tr>
        </thead>
        <tbody>
            {#each Pokemon_stats as Pokemon_stat}
                <tr>
                    <td>{Pokemon_stat["pokemon_id"]}</td>
                    <td>{Pokemon_stat["pokemon_name"]}</td>
                    <td>{Pokemon_stat["base_attack"]}</td>
                    <td>{Pokemon_stat["base_defense"]}</td>
                    <td>{Pokemon_stat["base_stamina"]}</td>
                    <td>{Pokemon_stat["form"]}</td>
                </tr>
            {/each}
            <br>
        </tbody>
    </Table>

</main>