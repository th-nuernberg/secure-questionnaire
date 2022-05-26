<template>
  <body>
    <!--placeholder-->
    <div class="placeholder"></div>

    <!--text-->
    <h3 v-if="true" class="txt-center">An welche Bilder können Sie sich erinnern? </h3>

    <DisplayImages :listed_images="this.selectedImage"/>
    <SpeechRecognition  ref="speechRecogn" @speeched="emitedWord" :words="selectedImage.map(x => x['name'])" />

  </body>
</template>

<script>

import DisplayImages from "../../components/DisplayImages.vue";
import images from "../../assets/images/images.js";
import SpeechRecognition from "../../components/SpeechRecognition.vue";

export default {
components:{
    DisplayImages,
    //TimeBar,
    SpeechRecognition
  },
  data() {
    return {
      selectedImage: [],
      images
    }
  },
  methods: {
        randomItem (items) {
      return items[Math.floor(Math.random()*items.length)];
    },    
    emitedWord(boolArray) {
      let test = boolArray.map( (value, index) => {
        return {...this.selectedImage[index], 'recognized': value || this.selectedImage[index]['recognized']}
      }).sort((a,b)=> {
        if(a['recognized'] == b['recognized']){
          return 0;
        }
        if (a['recognized'] && !b['recognized']){
          return -1;
          }
          return 1;
        }
        

      )


    //console.log(this.$refs.timeBar.time)
      this.selectedImage = test;
      //console.log(this.selectedImage)
      
      if(this.selectedImage.every(entry => entry['recognized'])){
        //this.hide = true;
       //this.finishedTask()
       this.$refs.speechRecogn.stop()
      }
    },

    getImages() {
      return this.$store.getters.getImages;
    }
  },
  created() {
    this.selectedImage = this.getImages()['1']['images'];
    //console.log(this.selectedImage['1']['images'])
    this.selectedImage = this.selectedImage.map(entry => ({...entry, 'recognized':false, 'url':images['white']}))

    while(this.selectedImage.length<4){
      var img  =this.randomItem(Object.entries(this.images['imgs']))
      if(!this.selectedImage.map(x => x['name'] ).includes(img[0])){
          this.selectedImage.push({'url':images['white'],'name':img[0], 'recognized':false});
          
      }
    }
  }
};
</script>