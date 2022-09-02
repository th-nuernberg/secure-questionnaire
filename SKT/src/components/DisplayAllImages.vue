<template>
  <div class="c-row">
    <div class="c-column" v-for="item in [0, 1, 2, 3, 4, 5, 6, 7]" :key="item">
      <div
        v-for="img in allImages.slice(item * 6, 6 * item + 6)"
        :key="img"
      >
        <p style="positon: relative" class="card">
          <img :src="img['url']" alt="" />
          <img
            v-if="img['recognized']"
            :src="images['checker']"
            style="height: 150px; position: absolute"
          />
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import images from "../plugins/images.js";

export default {
  name: "DisplayImages",
  props: {
    listed_images: Array,
  },
  watch: { // It listens to the change in prop name
    listed_images: function () {
      this.listed_images.forEach(element => {
        this.allImages.forEach(image => {
          if (image["name"] == element["name"]) {
            image["recognized"] = element["recognized"]
          }
        })        
      });
    }
  },
  data() {
    return { 
      images,
      allImages: [] };
  },
  methods: {
    randomItem(items) {
      return items[Math.floor(Math.random() * items.length)];
    },
    shuffleArray(array) {
        let a,
        b,
        temp;
      for (let i = 0; i < 35; i++) {
        a = Math.floor(Math.random() * 35)
        b = Math.floor(Math.random() * 35);
        temp = array[a];
        array[a] = array[b];
        array[b] = temp;

      }
      return array;
    },
  },
  created() {
      this.listed_images.forEach(element => {
        this.allImages.push(element)
      });

      while (this.allImages.length < 36) {
      var img = this.randomItem(Object.entries(this.images["imgs"]));
      if (!this.allImages.map((x) => x["name"]).includes(img[0])) {
        this.allImages.push({
          url: img[1],
          name: img[0],
          recognized: false,
        });
      }
    }

    this.allImages = this.shuffleArray(this.allImages)

    
  },
};
</script>
