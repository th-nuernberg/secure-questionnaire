<template>
<!--    <navbar style="background-color: #2A2A2A;" toggleable="lg" type="dark" variant="dark">-->
<!--        <navbar-brand class="brand" :to="{ path: '/' }">Schlafambulanz</navbar-brand>-->
<!--        <router-link to="/"> Home</router-link>-->
<!--        <navbar-nav v-if="doctorViewCreate">-->
<!--            <b-nav-item to="/doctorView">Antworten analysieren</b-nav-item>-->
<!--        </navbar-nav>-->
<!--        <navbar-nav v-else-if="doctorView">-->
<!--            <b-nav-item to="/doctorView/create">Fragebogen erstellen</b-nav-item>-->
<!--        </navbar-nav>-->
<!--    </navbar>-->
<nav class="navbar navbar-expand-lg navbar-light">
  <a class="navbar-brand" href="#">Patientenfragebogen</a>

  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav mr-auto">
      <li  class="nav-item active">
        <a class="nav-link" href="/">Home </a>
      </li>
      <li v-if="doctorViewCreate" class="nav-item">
        <a class="nav-link" href="/doctorView/create">Fragebogen analysieren</a>
      </li>
      <li v-else-if="doctorView" class="nav-item">
        <a class="nav-link" href="/doctorView/create">Fragebogen erstellen</a>
      </li>

    </ul>

  </div>
</nav>
</template>

<script>
    export default {
        name: "NavBar",
        computed: {
            doctorView() {
                return  this.$route.path == "/doctorView";
            },
            doctorViewCreate() {
                return this.$route.path == '/doctorView/create';
            }
        }
    }
</script>

<style scoped>
    .navbar {
        background-color: lightgray;
        margin-bottom: 30px;
    }
    .ms-auto {
        margin-right: 20px;
    }

    .navbar-brand {
        margin-left: 20px;
        margin-right: 20px;
    }
</style>