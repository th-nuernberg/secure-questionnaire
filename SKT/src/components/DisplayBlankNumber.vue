<template>  
  <div class="container">

    <div class="row justify-content-md-center" v-for="item in [0,1]" :key="item">
      <div class="col-md-auto" v-for="item in [0,1,2,3,4]" :key="item">
        <div class="simplecircle"></div>
      </div>     
    </div>

    <div class="row justify-content-md-center">
      <div class="col-md-auto" v-for="item in listed_numbers.slice(0,5)" :key="item">
          <div class="circle" v-if="!item['recognized']" v-text="item['num']" style="color:gray"></div>
      </div> 
    </div>
    
    <div class="row justify-content-md-center">
      <div class="col-md-auto" v-for="item in listed_numbers.slice(5,10)" :key="item">
          <div class="circle" v-if="!item['recognized']" v-text="item['num']" style="color:gray"></div>
      </div> 
    </div>

  </div>
</template>

<script>
import images from "../plugins/images.js";
export default {
  name: 'DisplayNumber',
  props: {
      listed_numbers: Array
  },
  data() {
    return {images}
  }, 
}
</script>