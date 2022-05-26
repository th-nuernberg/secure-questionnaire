<template>
  <body>
    <!--placeholder-->
    <div class="placeholder"></div>

    <!--text-->
    <h3 class="txt-center">{{selectedImage}} </h3>

    <DisplayImages :listed_images="this.selectedImage"/>


  </body>
</template>

<script>

import DisplayImages from "../../components/DisplayImages.vue";
import images from "../../assets/images/images.js";

export default {
    components:{
    DisplayImages,
  },
  data() {
    return {
      selectedImage: [],
      images
    }
  },
  computed: {
    getImages() {
      return this.$store.getters.getImages;
    }
  },
  created() {
    this.selectedImage = this.$store.getters.getImages['1']['images'];
    //this.selectedImage = this.selectedImage.map(element => ({...element, 'recognized':false}))
    
    while(this.selectedImage.length<4){
      var img  =this.randomItem(Object.entries(this.images['imgs']))
      if(!this.selectedImage.map(x => x['name'] ).includes(img[0])){
          this.selectedImage.push({'url':img[1],'name':img[0], 'recognized':false});
          
      }
    }
  }
};
</script>