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
          <ul v-if="admin"  class="navbar-nav">
            <li class="nav-item active">
              <RouterLink to="/admin" class="nav-link active">Übersicht</RouterLink>
            </li>
            <li class="nav-item active">
              <RouterLink to="/admin/list" class="nav-link active">Fragebögen</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/admin/create" class="nav-link active">Erstellen</RouterLink>
            </li>
            <li class="nav-item active">
              <RouterLink to="/admin/register" class="nav-link active">Registrieren</RouterLink>
            </li>
            <li class="nav-item active">
              <RouterLink to="/admin/aggregate" class="nav-link active">Einlesen</RouterLink>
            </li>
            <li class="nav-item active">
              <RouterLink to="/respond" class="nav-link">Ende</RouterLink>
            </li>
          </ul>
          <ul v-else  class="navbar-nav">
            <li class="nav-item active">
              <RouterLink to="/respond" class="nav-link active">Teilnehmen</RouterLink>
            </li>
            <li class="nav-item active">
              <RouterLink to="/admin" class="nav-link active">Verwaltung</RouterLink>
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
    admin() {
      return this.$route.path.startsWith("/admin");
    },
  },
};
</script>


<style>
  #navbarNav{
    justify-content: flex-end;
  }
</style>
