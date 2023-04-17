<script>
    import { Container, Row, Col } from "sveltestrap";
</script>

<style>
    nav {
        background-color: #F5F5F5;
        padding: 10px;
    }
    
    a {
        color: #000;
        text-decoration: none;
        font-weight: bold;
        font-size: 18px;
        padding: 10px;
        border-radius: 5px;
        transition: background-color 0.2s ease-in-out;
    }
    
    a:hover {
        background-color: #000;
        color: #fff;
    }
</style>


<Container fluid>
    <nav>
        <Row>
            <Col xs="auto"><a href="/">Inicio</a></Col>
<<<<<<< HEAD
            <Col xs="auto"><a href="/salary-stats">Estadísticas de asalariados</a></Col>
            <Col xs="auto"><a href="/jobseekers-studies">Estudio de buscadores de empleo</a></Col>
            <Col xs="auto"><a href="/loss-jobs">Causas de pérdidas de trabajo</a></Col>
=======
            <Col xs="auto"><a href="/salary-stats">Salarios</a></Col>
            <Col xs="auto"><a href="/jobseekers-studies">Demandantes de empleo</a></Col>
            <Col xs="auto"><a href="/loss-jobs">Baja de demandantes</a></Col>
>>>>>>> 0d166cc5897bb37c5a395ac20803b5071e10c63b
        </Row>
    </nav>
</Container>