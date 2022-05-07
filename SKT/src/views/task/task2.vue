<template>
  <body>
    <!--placeholder-->
    <div class="placeholder"></div>

    <!--text-->
    <h3 class="txt-center">Subtest II: </h3>


    <div class="row">
      <div class="column">
        <p class="card"><img :src="getImages[0]" alt=""></p>
        <p class="card"><img :src="getImages[1]" alt=""></p>
        <p class="card"><img :src="getImages[2]" alt=""></p>
      </div>
      <div class="column">
        <p class="card"><img :src="getImages[3]" alt=""></p>
        <p class="card"><img :src="getImages[4]" alt=""></p>
        <p class="card"><img :src="getImages[5]" alt=""></p>
      </div>
      <div class="column">
        <p class="card"><img :src="getImages[6]" alt=""></p>
        <p class="card"><img :src="getImages[7]" alt=""></p>
        <p class="card"><img :src="getImages[8]" alt=""></p>
      </div>
      <div class="column">
        <p class="card"><img :src="getImages[9]" alt=""></p>
        <p class="card"><img :src="getImages[10]" alt=""></p>
        <p class="card"><img :src="getImages[11]" alt=""></p>
      </div>
    </div>

  </body>
</template>

<script>
export default {
  computed: {
    getImages() {
      return this.$store.getters.getImages;
    }
  }
};
</script>