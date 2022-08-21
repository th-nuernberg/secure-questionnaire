<template>
  <div id="app">
    <Header></Header>
    <router-view class="c-container" />
    <Footer></Footer>
    <RecordAudio ref="recordAudio" :taskNr="1"></RecordAudio>
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
   }, methods: {
     test() {
       console.log('Test from APP.vue')
     },
     record() {
       this.$refs.recordAudio.record()
     },
     stop() {
       this.$refs.recordAudio.stop()
       console.log("STOOOP")
     }
 
   }
 };
 </script>
