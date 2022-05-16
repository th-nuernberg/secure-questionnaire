<template>    
<div class="row">
       <div  class="column" v-for="item in [0,1,2,3]" :key="item">
        <div v-for="img in listed_images.slice(item*3,3*item+3)" :key="img">

          <p style="positon:relative"  class="card">
            <img v-if="!img['recognized']" :src="img['url']" alt="">
            <img  v-if="img['recognized']" :src="images['checker']" alt="">
          </p>

          
         
        </div>
        </div>
      </div>
</template>


<script>

import images from "../assets/images/images.js";

    export default {
        name: 'DisplayImages',
        props: {
            listed_images: Array
        },
        data() {
          return {images}
        },
        created(){
        }
    }
</script>