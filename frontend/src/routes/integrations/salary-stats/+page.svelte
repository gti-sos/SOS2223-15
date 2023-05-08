<script>
    import { dev } from "$app/environment";

    let API = "/api/v2/salary-stats";
    
    if (dev)
        // Si accedemos en modo normal, accedemos en local a la API y si no, accedemos al servidor de Svelte
        API = "http://localhost:12345" + API;

</script>

<section class="team">
    <div class="container">
      <h2>Integraciones</h2>
      <ul>
        <li><a href="https://sos2223-15.appspot.com/api/v2/integrations/uso1">Usos/Integraciones Ángel. Uso 1</a></li>
        <li><a href="https://sos2223-15.appspot.com/api/v2/integrations/uso2">Usos/Integraciones Ángel. Uso 2</a></li>
        <li><a href="https://sos2223-15.appspot.com/api/v2/integrations/integracion1">Usos/Integraciones Ángel. Integración 1</a></li>
        <li><a href="https://sos2223-15.appspot.com/api/v2/integrations/integracion2">Usos/Integraciones Ángel. Integración 2</a></li>
      </ul>
    </div>
  </section>
  
  
  <style>
      h2 {
          font-size: 24px;
          font-weight: normal;
          margin-top: 15px;
          margin-left: 2%;
          color: #15297c;
          list-style-type: circle;
      }
      ul {
          margin: 0;
          margin-left: 2%;
          padding: 0;
          list-style: none;
      }
      li {
          margin: 10px 0;
          list-style-type: circle;
      }
      a {
          color: #1e90ff;
          text-decoration: none;
          font-weight: bold;
          list-style-type: circle;
      }
      section {
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 10px;
          box-shadow: 0px 5px 8px 5px rgba(0, 0, 0, 0.1);
          margin-bottom: 1%;
          margin-top: 1.5%;
      }
  </style>