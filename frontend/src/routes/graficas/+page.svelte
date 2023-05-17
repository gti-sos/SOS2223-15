<svelte:head>
  <title>SOS2223-15</title>
</svelte:head>
<section class="team">
  <hr>
  <div class="container">
    <h2>Gráficas </h2>
    <ul>
        <ul>
            <li><a href="/graficas/salary-stats">Gráficas Ángel</a></li>
        </ul>
    </ul>
    <ul>
      <ul>
          <li><a href="/graficas/jobseekers">Gráficas Jara</a></li>
      </ul>
    </ul>
    <ul>
      <ul>
          <li><a href="/graficas/loss-jobs-graph">Gráficas Mario</a></li>
        </ul>
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
    background-color: rgb(236, 235, 235);
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
    background-color: #cbd3d6fa;
  }

</style>
