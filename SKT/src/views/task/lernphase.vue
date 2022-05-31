<template>
  <body class="body">

    <h3>Lernphase</h3>

    <div v-if="!this.hide">
      <TimeBar :duration=5 @timeout="timeout" ref="time" /><br>
      <h5>Die Gegenstände werden jetzt noch einmal für 5 Sekunden gezeigt:</h5><br>
      <DisplayImages :listed_images="selectedImage" /><br>
      <router-link class="btn-router" to="/auswertung">Weiter</router-link>     
    </div>
    
   <div class="popup" v-if="this.hide"  id="timeout-show">
    <h5>Alle Aufgaben wurden bearbeitet!</h5><br>
    <router-link class="btn-router" to="/auswertung">Beenden</router-link>
   </div>

    
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
    }
  },
  created() {   
    this.hide = false;  
    this.task_data = this.$store.getters.getData;
    this.selectedImage = this.task_data["1"]["images"];
    this.selectedImage = this.selectedImage.map(entry => {return {...entry, 'recognized':false }})    
    console.log("Store nach Task 2: ");
    console.log(this.task_data);
  }
};
</script>