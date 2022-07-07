<template>  
  <div>
    <div class="container">
      <div class="row">
        <span class="simplecircle" v-for="item in [0,1,2,3,4]" :key="item"></span>             
      </div>
      <div class="row">
        <span class="simplecircle" v-for="item in [0,1,2,3,4]" :key="item"></span>             
      </div>
      <div class="row">
        <span class="circle" v-text="listed_numbers[0]['num']" style="background: #6188EC"></span>
        <span class="circle" v-text="listed_numbers[1]['num']" style="background: #BDC2D6"></span>
        <span class="circle" v-text="listed_numbers[2]['num']" style="background: #D93737"></span>
        <span class="circle" v-text="listed_numbers[3]['num']" style="background: #4CD38B"></span>
        <span class="circle" v-text="listed_numbers[4]['num']" style="background: #8D7CE3"></span>             
      </div>
      <div class="row">
        <span class="circle" v-text="listed_numbers[5]['num']" style="background: #F7AE7E"></span>
        <span class="circle" v-text="listed_numbers[6]['num']" style="background: #7EEAF7"></span>
        <span class="circle" v-text="listed_numbers[7]['num']" style="background: #599B5A"></span>
        <span class="circle" v-text="listed_numbers[8]['num']" style="background: #B97ACB"></span>
        <span class="circle" v-text="listed_numbers[9]['num']" style="background: #FA833D"></span>             
      </div>
    </div> 
  </div>             
</template>

<script>
export default {
    name: 'DisplayNumber',
    props: {
        listed_numbers: Array
    },
    created(){
      console.log(this.listed_numbers);
    }
  
}
</script>