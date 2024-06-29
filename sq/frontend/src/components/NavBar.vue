<template>
  <div>
    <nav class="navbar fixed-top navbar-expand-md navbar-dark bg-dark">
      <div class="container">
        <a href="#" class="navbar-brand mb-o h1">Patientenfragebogen</a>
        <button 
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        class="navbar-toggler"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation">

        <span class="navbar-toggler-icon"></span>
      
      </button>
        <div 
        class="collapse navbar-collapse" 
        id="navbarNav">
          <ul class="navbar-nav">
            <li v-if="doctorView" class="nav-item active">
              <a href="/doctorView" class="nav-link active">
                Home
              </a>
            </li>
            <li v-if="doctorViewCreate" class="nav-item active">
              <a href="/doctorView" class="nav-link active">
                Home
              </a>
            </li>
            <li v-if="patientView" class="nav-item active">
              <a href="/" class="nav-link active">
                Home
              </a>
            </li>
            <li v-if="questView" class="nav-item active">
              <a href="/doctorView" class="nav-link active">
                Home
              </a>
            </li>
            <li v-if="doctorViewCreate" class="nav-item active">
              <a href="/doctorView" class="nav-link active">
                Fragebogen analysieren
              </a>
            </li>
            <li v-else-if="doctorView" class="nav-item active">
              <a href="/doctorView/create" class="nav-link active">
                Fragebogen erstellen
              </a>
            </li>
            <li v-if="doctorView" class="nav-item active">
              <a href="/doctorView/ViewQuestionnaires" class="nav-link active">
                Fragebögen anzeigen
              </a>
            </li>  
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  name: "NavBar",
  computed: {
    doctorView() {
      return this.$route.path == "/doctorView";
    },
    doctorViewCreate() {
      return this.$route.path == "/doctorView/create";
    },
    patientView() {
      return this.$route.path == "/patient";
    },
    questView() {
      return this.$route.path == "/doctorView/ViewQuestionnaires";
    },
  },
};
</script>


<style>
  #navbarNav{
    justify-content: flex-end;
  }
</style>
