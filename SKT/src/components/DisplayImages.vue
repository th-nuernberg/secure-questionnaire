<template>    
<div class="row">
       <div  class="column" v-for="item in [0,1,2,3]" :key="item">
        <div v-for="img in listed_images.slice(item*3,3*item+3)" :key="img">
          <p class="card"><img :src="img[1]" alt=""></p>
        </div>
        </div>
      </div>
</template>


<script>
    export default {
        name: 'DisplayImages',
        props: {
            listed_images: Array
        }
    }
</script>