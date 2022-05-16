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
    
    
    <SpeechRecognition  :record="hide" @speeched="emitedWord" :words="selectedImage.map(x => x['name'])" />
    
    <TimeBar :duration=30 @timeout="this.hide= true" />
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
import SpeechRecognition from "../../components/SpeechRecognition.vue";


export default {
  name: "app",
  components:{
    DisplayImages,
    TimeBar,
    SpeechRecognition
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
   emitedWord(text) {
       this.selectedImage = this.selectedImage.map(entry => {
         if(entry['name'].toLowerCase()==text){
           return {...entry, 'recognized':true }
         }else{
           return entry
         }
       })
    }

  },
  created() {
    while(this.selectedImage.length<13){
      var img  =this.randomItem(Object.entries(this.images['imgs']))
      if(!this.selectedImage.map(x => x['name'] ).includes(img[0])){
          this.selectedImage.push({'url':img[1],'name':img[0], 'recognized':false});
          this.addImage(img);
      }
    }
    this.hide = false;
  }
}

</script>

