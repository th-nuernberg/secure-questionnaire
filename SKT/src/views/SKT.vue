<template>
  <body>
    <!--placeholder-->
    <div class="placeholder" style="padding: 15px;"></div>

    <!--text-->
    <h3 class="txt-center">Kurztest zur Erfassung von Gedächtnis- und Aufmerksamkeitsstörungen nach Erzigkeit</h3>
    <p class="txt-center">
      Damit Sie ein zuverlässiges Ergebnis erhalten, arbeiten Sie ruhig und konzentriert. 
      Da die Testdurchführung unter echten Prüfungsbedingungen stattfindet, ist eine Unterbrechung und spätere Fortsetzung des Tests leider nicht möglich. 
      Bitte sorgen Sie dafür, dass Sie den Test nur dann beginnen, wenn Sie genügend Zeit zur Verfügung haben und nicht abgelenkt werden.
      Die Durchführungszeit beträgt zwischen 10 und 15 Minuten.</p>
    <p class="txt-center">Viel Spaß und Erfolg!</p>

    <!--button-->
    <div style="padding-left: 30px;">
      <button class="btn-router">
        <router-link class="routerlink" to="/intro">Start</router-link>
      </button>
    </div>

  </body>
</template>

<script>
import "bootstrap/dist/css/bootstrap.css";

export default {};
</script>


