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
    
    
    <SpeechRecognition v-if="!this.hide"  ref="speechRecogn" :record="hide" @speeched="emitedWord" :words="selectedImage.map(x => x['name'])" />
    
    <TimeBar :duration=60 @timeout="this.timeOut" ref="timeBar" v-if="!this.hide" />
    <div v-if="!this.hide">
    <h5  class="txt-center">Sagen Sie jetzt bitte ganz schnell, wie die Gegenstände heißen und merken Sie sie sich.</h5>
    <DisplayImages :listed_images="selectedImage" />
    </div>
   <div v-if="this.hide && !this.selectedImage.every(entry => entry['recognized'])"  id="timeout-show" style="padding-right">
     <br>
    <h5 class="txt-center">Die Zeit ist um</h5>
   </div>

    <div v-if="this.hide && this.selectedImage.every(entry => entry['recognized'])"  id="timeout-show" style="padding-right">
     <br>
    <h5 class="txt-center">Sie haben alle Bilder vorgelesen!</h5>
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
    timeOut(){
      this.hide = true;
      console.log('TimeOUT!Q!!!!!!')
      this.finishedTask()
    },
    finishedTask(){
      this.$store.dispatch("addImage", {'task':1, 'content':{'images':this.selectedImage ,'time':this.$refs.timeBar.time}})
      //console.log(this.$refs.timeBar.time)
      this.hide = true;
      this.$refs.speechRecogn.stop()
    },
    emitedWord(boolArray) {
      let test = boolArray.map( (value, index) => {
        return {...this.selectedImage[index], 'recognized': value || this.selectedImage[index]['recognized']}
      })


    //console.log(this.$refs.timeBar.time)
      this.selectedImage = test;
      //console.log(this.selectedImage)
      
      if(this.selectedImage.every(entry => entry['recognized'])){
        this.hide = true;
       this.finishedTask()
      }
    }

  },
  created() {
    while(this.selectedImage.length<4){
      var img  =this.randomItem(Object.entries(this.images['imgs']))
      if(!this.selectedImage.map(x => x['name'] ).includes(img[0])){
          this.selectedImage.push({'url':img[1],'name':img[0], 'recognized':false});
          
      }
    }
    this.hide = false;

  },
  beforeUnmount() {
          this.hide = true;
      this.$refs.speechRecogn.stop()
  }
  
}

</script>

