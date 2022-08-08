<template>
  <body>

    <h3>Lernphase</h3>

    <div v-if="!this.hide">
      <TimeBar :duration=5 @timeout="timeout" ref="time"/>
      <h5>Die Gegenstände werden jetzt noch einmal für 5 Sekunden gezeigt:</h5>
      <DisplayImages :listed_images="selectedImage" />
      <router-link class="btn-router" to="/task3">Weiter</router-link><br><br> 
    </div>
    
   <div class="popup" v-if="this.hide"  id="timeout-show">
    <h5>Hier geht es weiter zur nächsten Aufgabe</h5><br>
    <router-link class="btn-router" to="/task3">Beenden</router-link>
   </div>

    <vue-record-audio @result="onResult" />
  </body>
</template>

<script>

import TimeBar from "../../components/TimeBar.vue";
import DisplayImages from "../../components/DisplayImages.vue";

export default {
  components:{
    TimeBar,
    DisplayImages,
  },
  data() {
    return {
      task_data: [],
      selectedImage: [],
      hide: Boolean,
    }
  },
  methods: {
    timeout(){
      this.hide= true
    },
    onResult (data) {
      console.log('The blob data:', data);
      console.log('Downloadable audio', window.URL.createObjectURL(data));
    }
  },
  created() {   
    this.hide = false;  
    this.task_data = this.$store.getters.getData;
    this.selectedImage = this.task_data["1"]["images"];
    this.selectedImage = this.selectedImage.map(entry => {return {...entry, 'recognized':false }})    
  }
};
</script>