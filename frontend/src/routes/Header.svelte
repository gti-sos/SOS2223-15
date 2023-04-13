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


    <nav>
        <Row>
            <Col xs="auto"><a href="/">Home</a></Col>
            <Col xs="auto"><a href="/salary-stats">salary-stats</a></Col>
            <Col xs="auto"><a href="/jobseekers-studies">Demandantes de empleo</a></Col>
            <Col xs="auto"><a href="/loss-jobs">loss-jobs</a></Col>
        </Row>
    </nav>
</Container>

<style>
    a{
        color : red;
    }
    
</style>

