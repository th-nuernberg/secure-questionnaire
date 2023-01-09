<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
//import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
   <div id="app">
         <div>
            <!-- navbar -->
            <NavBar />
        </div>
          <!--  <div>-->
          <!--    <a href="https://vitejs.dev" target="_blank">-->
          <!--      <img src="/vite.svg" class="logo" alt="Vite logo" />-->
          <!--    </a>-->
          <!--    <a href="https://vuejs.org/" target="_blank">-->
          <!--      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />-->
          <!--    </a>-->
          <!--  </div>-->
          <!--  <HelloWorld msg="Vite + Vue" />-->
            <router-view></router-view>
          <div>
            <!-- footer -->
            <Foot />
        </div>
   </div>
</template>

<script>
    import NavBar from './components/NavBar.vue';
    import Foot from './components/Foot.vue';
    import "./custom.scss";

    export default {
        name: 'app',
        components: {
            NavBar,
            Foot

        }
    };
</script>

<!--<style scoped>-->
<!--.logo {-->
<!--  height: 6em;-->
<!--  padding: 1.5em;-->
<!--  will-change: filter;-->
<!--}-->
<!--.logo:hover {-->
<!--  filter: drop-shadow(0 0 2em #646cffaa);-->
<!--}-->
<!--.logo.vue:hover {-->
<!--  filter: drop-shadow(0 0 2em #42b883aa);-->
<!--}-->
<!--</style>-->
<style lang="scss">

    @import "custom.scss";

    .router-container {
        margin: 0 50px;
    }

    #app {
        background-color: $background;
    }

    .boxStyling {
        border-radius: 20px;
        box-shadow: 0px 0px 5px #aaaaaa;
        padding: 15px;
        margin: 20px 0;
        background-color: white;
    }

    .btn-big {
        padding: 10px 20px !important;
    }

    .btn-primary {
        background-color: $primary !important;
        border-color: $primary !important;
    }

    .btn-primary:hover {
        background-color: $primary-dark !important;
    }

    .btn-outline-primary {
        color: $primary !important;
        border-color: $primary !important;
    }

    .btn-outline-primary:hover {
        background-color: $primary-dark !important;
        color: white !important;
    }

    .btn-accent {
        background-color: $accent !important;
        color: black !important;
        border: none !important;
    }

    .btn-accent:hover {
        background-color: $accent-dark !important;
    }

    .dropdown-item.active, .dropdown-item:active {
        background-color: $primary !important;
    }

    .btn-white {
        color: black !important;
        background-color: none !important;
    }

    .btn-white:hover {
        background-color: $background !important;
    }

    .text-primary {
        color: $primary !important;
    }
</style>