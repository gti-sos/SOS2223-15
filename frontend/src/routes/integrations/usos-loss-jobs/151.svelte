<script>
    // @ts-nocheck
    import { Row, Col, Container, Card, CardHeader, CardTitle, CardText} from 'sveltestrap';
    import { onMount } from 'svelte';
    onMount(async () => {
        let get = await getPokemon();
        datos = get.results;
        getUsers();
    });
    let datos = [];
    async function getUsers(){
        fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => response.json())
      .then(json => console.log(json))
    }
    async function getPokemon(){
        let response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=300&offset=151');
        let data = await response.json();
        return data;
    }

    function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
</script>
<main>
        <Container>
            <Row>
                <Col sm={{ size: 'auto', offset: 2 }}><h1> Todos los pokemons de la segunda generación </h1></Col>
            </Row>
        </Container>
        <br/>
        <Container>
            <Row cols={{ xs:2,sm: 3, md: 3, lg: 3, xl:4}}>
            {#each datos as pokemon}
                <Col class = 'mb-3'>
                    <Card>
                        <CardHeader>
                        <CardTitle>{capitalizeFirstLetter(pokemon.name)}</CardTitle>
                        </CardHeader>
                    </Card>
                </Col>
            {/each}
        </Row>
        </Container>
</main>
<style></style>