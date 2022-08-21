<template>
  <div class="container">
    <div
      class="row justify-content-md-center"
      v-for="item in [0, 1]"
      :key="item"
    >
      <div class="col-md-auto" v-for="item in [0, 1, 2, 3, 4]" :key="item">
        <div class="simplecircle"></div>
      </div>
    </div>

    <div
      class="row justify-content-md-center"
      v-for="item in [0, 1]"
      :key="item"
    >
      <div
        class="col-md-auto"
        v-for="item in listed_numbers.slice(item * 5, 5 * item + 5)"
        :key="item"
      >
        <div class="circle" v-bind:style="{ background: item['color'] }">
          {{ item["num"] }}
          <img
            v-if="item['recognized']"
            :src="images['checker']"
            style="height: 50px; position: absolute"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import images from "../plugins/images.js";
export default {
  name: "DisplayNumber",
  props: {
    listed_numbers: Array,
  },
  data() {
    return { images };
  },
};
</script>
