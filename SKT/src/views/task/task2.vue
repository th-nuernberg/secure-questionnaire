<template>
  <body>
    <!--placeholder-->
    <div class="placeholder"></div>

    <!--text-->
    <h3 class="txt-center">{{selectedImage}} </h3>

    <DisplayImages :listed_images="[]"/>


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
    this.selectedImage = this.$store.getters.getImages;
    console.log(this.selectedImage)
  }
};
</script>