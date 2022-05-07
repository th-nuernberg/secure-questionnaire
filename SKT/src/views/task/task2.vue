<template>
  <body>
    <!--placeholder-->
    <div class="placeholder"></div>

    <!--text-->
    <h3 class="txt-center">{{getImages[1][0]}} </h3>

    <div class="row">
      <div class="column">
        <p class="card"><img :src="getImages[0][1]" alt=""></p>
        <p class="card"><img :src="getImages[1][1]" alt=""></p>
        <p class="card"><img :src="getImages[2][1]" alt=""></p>
      </div>
      <div class="column">
        <p class="card"><img :src="getImages[3][1]" alt=""></p>
        <p class="card"><img :src="getImages[4][1]" alt=""></p>
        <p class="card"><img :src="getImages[5][1]" alt=""></p>
      </div>
      <div class="column">
        <p class="card"><img :src="getImages[6][1]" alt=""></p>
        <p class="card"><img :src="getImages[7][1]" alt=""></p>
        <p class="card"><img :src="getImages[8][1]" alt=""></p>
      </div>
      <div class="column">
        <p class="card"><img :src="getImages[9][1]" alt=""></p>
        <p class="card"><img :src="getImages[10][1]" alt=""></p>
        <p class="card"><img :src="getImages[11][1]" alt=""></p>
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