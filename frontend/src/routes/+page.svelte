<svelte:head>
  <title>Esto es un Title</title>
</svelte:head>
<section class="team">
  <hr>
  <div class="container">
    <h2>Equipo</h2>
    <ul>
      <li>
        <a href="https://github.com/AngelUs04">Ángel Marín Rodríguez</a>:
        salary-stats
      </li>
      <li>
        <a href="https://github.com/jardelpac01"
          >Jara Xiao del Viejo Pacheco</a
        >:
        jobseekers-studies
      </li>
      <li>
        <a href="https://github.com/marmedsan6">Mario Medina Santos</a>:
        loss-jobs
      </li>
    </ul>
  </div>

  <div class="container">
    <h2>Interfaces (Front-ends)</h2>
    <ul>
      <li><a href="/salary-stats">/salary-stats</a></li>
      <li><a href="/jobseekers-studies">/jobseekers-studies</a></li>
      <li><a href="/loss-jobs">/loss-jobs</a></li>
    </ul>
  </div>

  <div class="container">
    <h2>APIs</h2>
    <ul>
      <li><a href="https://sos2223-15.appspot.com/api/v1/salary-stats">api/v1/salary-stats</a></li>
      <li><a href="https://sos2223-15.appspot.com/api/v2/salary-stats">api/v2/salary-stats</a></li>
      <li><a href="https://sos2223-15.appspot.com/api/v1/jobseekers-studies">/jobseekers-studies</a></li>
      <li><a href="https://sos2223-15.appspot.com/api/v1/loss-jobs">api/v1/loss-jobs</a></li>
      <li><a href="https://sos2223-15.appspot.com/api/v2/loss-jobs">api/v2/loss-jobs</a></li>
    </ul>
  </div>

  <div class="container">
    <h2>Repositorio</h2>
    <ul>
      <li><a href="https://github.com/gti-sos/SOS2223-15">gti-sos/SOS2223-15</a></li>
    </ul>
  </div>

  <div class="container">
    <h2>Documentación POSTMAN</h2>
    <ul>
      <li>
        <a href="https://sos2223-15.appspot.com/api/v1/salary-stats/docs">api/v1/salary-stats/docs</a>
        Desarrollado por: Ángel Marín Rodríguez
      </li>
      <li>
        <a href="https://sos2223-15.appspot.com/api/v2/salary-stats/docs2">api/v2/salary-stats/docs</a>
        Desarrollado por: Ángel Marín Rodríguez
      </li>
      <li>
        <a href="https://sos2223-15.appspot.com/api/v1/jobseekers-studies/docs">/jobseekers-studies/docs</a>
        Desarrollado por: Jara Xiao del Viejo Pacheco
      </li>
      <li>
        <a href="https://sos2223-15.appspot.com/api/v1/loss-jobs/docs">api/v1/loss-jobs/docs</a>
        Desarrollado por: Mario Medina Santos
      </li>
      <li>
        <a href="https://sos2223-15.appspot.com/api/v2/loss-jobs/docs">api/v2/loss-jobs/docs</a>
        Desarrollado por: Mario Medina Santos
      </li>
    </ul>
  </div>
  <hr>
</section>


<style>
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .team {
    font-family: Arial, sans-serif;
    color: #333;
    line-height: 1.5;
  
  }

  .container h2 {
    font-size: 35px;
  }
  .container {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
    padding: 15px;
    background-color: rgb(218, 218, 218);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    margin-bottom: 20px;
    margin-top: 10px;
  }

  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  li {
    margin-bottom: 10px;
  }

  a {
    color: #007bff;
    text-decoration: none;
    font-weight: 600;
  }

  a:hover {
    text-decoration: underline;
  }

  .team {
    background-color: #305465;
  }

</style>
