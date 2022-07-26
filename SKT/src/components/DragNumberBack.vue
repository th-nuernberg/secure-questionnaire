<template>
  <div class="container" style="width: 900px;">
        
    <div class="row justify-content-md-center">
      <draggable :array="array" > 
        <div class="circle" v-for="element in array" :key="element.name" v-bind:style="{ background: element.color, color: element.font}">{{ element.name }}</div><br>       
      </draggable>
     </div>  

  </div>
</template>

<script>
  import { defineComponent } from 'vue'
  import { VueDraggableNext } from 'vue-draggable-next'

  export default defineComponent({
    props:{
       listed_numbers: Array
    },
    components: {
      draggable: VueDraggableNext,
    },
    data() {
      
      return {
        enabled: true,
        array: [
          { name: this.listed_numbers[0]['num'], color: this.listed_numbers[0]['color'],},
          { name: this.listed_numbers[1]['num'], color: this.listed_numbers[1]['color']},
          { name: this.listed_numbers[2]['num'], color: this.listed_numbers[2]['color']},
          { name: this.listed_numbers[3]['num'], color: this.listed_numbers[3]['color']},
          { name: this.listed_numbers[4]['num'], color: this.listed_numbers[4]['color']},
          { name: this.listed_numbers[5]['num'], color: this.listed_numbers[5]['color']},
          { name: this.listed_numbers[6]['num'], color: this.listed_numbers[6]['color']},
          { name: this.listed_numbers[7]['num'], color: this.listed_numbers[7]['color']},
          { name: this.listed_numbers[8]['num'], color: this.listed_numbers[8]['color']},
          { name: this.listed_numbers[9]['num'], color: this.listed_numbers[9]['color']},
          { name: '0', font: '#FFFFFF',},
          { name: '0', font: '#FFFFFF',},
          { name: '0', font: '#FFFFFF',},
          { name: '0', font: '#FFFFFF',},
          { name: '0', font: '#FFFFFF',},
          { name: '0', font: '#FFFFFF',},
          { name: '0', font: '#FFFFFF',},
          { name: '0', font: '#FFFFFF',},
          { name: '0', font: '#FFFFFF',},
          { name: '0', font: '#FFFFFF',},
        ],
          dragging: false,
      }
    },
    methods: {
      log(event) {
        console.log(event)
      },
    },
  })
</script>