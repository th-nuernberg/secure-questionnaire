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

export default {
    components:{
    DisplayImages,
  },
  data() {
    return {
      selectedImage: []
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
    console.log(this.selectedImage)
  }
};
</script>