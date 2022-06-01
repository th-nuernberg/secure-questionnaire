<template>
  <div id="app">
    <Header></Header>
    <div id="page-container">
      <div id="content-wrap">
        <Footer></Footer>
      </div>
    </div>

  </div>
 </template>

 <script>
import Footer from './components/Footer.vue';
import Header from './components/Header.vue';

    export default {
        name: 'app',
        components: {
    Footer,
    Header
}
    };
</script>
