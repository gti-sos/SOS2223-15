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
            <Col xs="auto"><a href="/about">Vídeos</a></Col>
            <Col xs="auto"><a href="/analytics">Gráfica Conjunta</a></Col>
            <Col xs="auto"><a href="/salary-stats">Estadísticas de asalariados</a></Col>
            <Col xs="auto"><a href="/jobseekers-studies">Estudio de demandantes de empleo</a></Col>
            <Col xs="auto"><a href="/loss-jobs">Causas de pérdidas de trabajo</a></Col>
            <Col xs="auto"><a href="/integrations">Integraciones/Usos</a></Col>
            <Col xs="auto"><a href="/graficas">Gráficas</a></Col>
        </Row>
    </nav>
</Container>