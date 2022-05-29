<template>
  <div id="app">
    <Header></Header>
    <Footer></Footer>
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
