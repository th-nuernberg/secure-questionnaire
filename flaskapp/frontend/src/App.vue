<template>
  <!-- <div class="content text-center"> -->
  <div class="content">

  <!-- <div id="app"> -->
    <div>
      <!-- navbar -->
      <NavBar />
    </div>
    <router-view></router-view>
    <div>
      <!-- footer -->
      <Foot />
    </div>
  <!-- </div> -->
  </div>
</template>

<script>
import NavBar from "./components/NavBar.vue";
import Foot from "./components/Foot.vue";
import "./custom.scss";

export default {
  name: "app",
  components: {
    NavBar,
    Foot,
  },
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

*{
  margin: 0;
  padding: 0;
}
html{
  height: 100%;
}

body{
  background-color: rgba(0,0,0,0.05);

  min-height: 100%;
  display: flex;
  flex-direction: column;

  font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 500;
}
.content{
  margin-top: 100px;
  margin-bottom: 120px;
}

// .router-container {
//   margin: 0 50px;
// }

// #app {
//   background-color: $background;
// }

// .boxStyling {
//   border-radius: 20px;
//   box-shadow: 0px 0px 5px #aaaaaa;
//   padding: 15px;
//   margin: 20px 0;
//   background-color: white;
// }

// .btn-big {
//   padding: 10px 20px !important;
// }

// .btn-primary {
//   background-color: $primary !important;
//   border-color: $primary !important;
// }

// .btn-primary:hover {
//   background-color: $primary-dark !important;
// }

// .btn-outline-primary {
//   color: $primary !important;
//   border-color: $primary !important;
// }

// .btn-outline-primary:hover {
//   background-color: $primary-dark !important;
//   color: white !important;
// }

// .btn-accent {
//   background-color: $accent !important;
//   color: black !important;
//   border: none !important;
// }

// .btn-accent:hover {
//   background-color: $accent-dark !important;
// }

// .dropdown-item.active,
// .dropdown-item:active {
//   background-color: $primary !important;
// }

// .btn-white {
//   color: black !important;
//   background-color: none !important;
// }

// .btn-white:hover {
//   background-color: $background !important;
// }

// .text-primary {
//   color: $primary !important;
// }
</style>
