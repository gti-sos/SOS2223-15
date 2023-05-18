<script>
    // @ts-nocheck
    import { onMount } from "svelte";
    import { Table } from "sveltestrap";
    import axios, { formToJSON } from 'axios';

    onMount(async () => {
        getIMDbData();
    });

    let datosIMDb = [];
    async function getIMDbData() {
        const options = {
            method: 'GET',
            url: 'https://imdb-top-100-movies.p.rapidapi.com/',
            headers: {
                'X-RapidAPI-Key': 'b59f48aa26mshed592c021d6d930p1eab12jsn1f5001bba931',
                'X-RapidAPI-Host': 'imdb-top-100-movies.p.rapidapi.com'
            }
        };

        try {
            const response = await axios.request(options);
            datosIMDb = response.data;
        } catch (error) {
            console.error(error);
        }
    }
</script>
<main>
    <h3 align="center"><u>Top Películas</u></h3>
        <p style="text-align:center">
            Peliculas Mario:<a
                style="text-decoration: none; color:black"
                href="https://rapidapi.com/rapihub-rapihub-default/api/imdb-top-100-movies/"
            >
        </p>
    <br>
    <Table>
        <thead>
            <tr>
                <th>Ranking</th>
                <th>Título</th>
                <!--<th>Thumbnail</th>-->
                <th>Valoración</th>
                <th>ID</th>
                <th>Año</th>
                <!--<th>Image</th>-->
                <th>Descripción</th>
                <th>Tráiler</th>
                <th>Género</th>
                <th>Director</th>
                <th>Escritores</th>
            </tr>
        </thead>
        <tbody>
            {#each datosIMDb as dato}
                <tr>
                    <td>{dato["rank"]}</td>
                    <td>{dato["title"]}</td>
                    <!--<td>{dato["thumbnail"]}</td>-->
                    <td>{dato["rating"]}</td>
                    <td>{dato["id"]}</td>
                    <td>{dato["year"]}</td>
                    <!--<td>{dato["image"]}</td>-->
                    <td>{dato["description"]}</td>
                    <td>{dato["trailer"]}</td>
                    <td>{dato["genre"]}</td>
                    <td>{dato["director"]}</td>
                    <td>{dato["writers"]}</td>
                </tr>
            {/each}
            <br>
        </tbody>
    </Table>
</main>