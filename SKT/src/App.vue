<template>
  <div id="app">
    <Header></Header>
    <router-view class="c-container"/>        
    <Footer></Footer> 
    <RecordAudio ></RecordAudio>
  </div>
 </template>

 <script>
import Footer from './components/Footer.vue';
import Header from './components/Header.vue';
import RecordAudio from './components/RecordAudio.vue';


    export default {
        name: 'app',
        components: {
    Footer,
    Header,
    RecordAudio
},methods: {
  test(){
    console.log('Test from APP.vue')
  }
}
    };
</script>
