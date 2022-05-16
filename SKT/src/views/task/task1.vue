<template>
  <body>
    <!--placeholder-->
    <div class="placeholder"></div>

    <!--text-->
    <h3 class="txt-center">Subtest I: Gegenstände benennen und einprägen</h3>

    <div style="width: 100%;">
        <div style="float: left;"> 
          <p style="padding-left: 30px">Aufgabe <strong>1</strong> von 10</p>
        </div>

    </div>
    
    

    
    <TimeBar :duration=3 @timeout="this.hide= true" />
    <div v-if="!this.hide">
    <h5  class="txt-center">Sagen Sie jetzt bitte ganz schnell, wie die Gegenstände heißen und merken Sie sie sich.</h5>
    <DisplayImages :listed_images="selectedImage"/>
</div>
   <div v-if="this.hide"  id="timeout-show">
     <br>
    <h5 class="txt-center">Die Zeit ist um</h5>
   </div>




      <div class="placeholder"></div>

      <!--weiter button-->
      <div id="hidden-button" style="padding-left: 30px">
        <button class="btn-router">
          <router-link class="routerlink-2" to="/task2">Weiter</router-link>
        </button>
      </div>


  </body>
</template>

<script>

import "bootstrap/dist/css/bootstrap.css";
import images from "../../assets/images/images.js";
import DisplayImages from "../../components/DisplayImages.vue";
import TimeBar from "../../components/TimeBar.vue";


export default {
  name: "app",
  components:{
    DisplayImages,
    TimeBar,
  },
  data() {
    return{
      images,
      selectedImage: [],
      hide: Boolean,
    };
  },
  methods: {
    randomItem (items) {
      return items[Math.floor(Math.random()*items.length)];
    },
      addImage(img) {
      this.$store.dispatch("addImage", img);
    },

  },
  created() {
    while(this.selectedImage.length<13){
      var img  =this.randomItem(Object.entries(this.images['imgs']))
      if(!this.selectedImage.map(x => x[0] ).includes(img[0])){
          this.selectedImage.push(img);
          this.addImage(img);
      }
    }
    this.hide = false;
  }
}

</script>

