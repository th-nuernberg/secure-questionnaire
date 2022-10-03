<template>
  <div class="container">
    <div class="symbol">

      <div class="row justify-content-md-center" v-for="item in [0,1,2,3,4,5,6,7,8,9,]" :key="item">
        <div class="col-md-auto" v-for="item in array.slice(item*13,13*item+13)" :key="item">
            <div v-text="item"></div>
        </div> 
      </div>
   
    </div>
        

  </div>
</template>

<script>

  export default {
    data() {
      return {
        symbols: ['★','✻','▢'],
        array: [],
        number: 0,
      
      }
    },
    emits: ['anzahl'],
    methods: {
      randomItem(items) {
      return items[Math.floor(Math.random()*items.length)];
      },
      countSymbol(){
        var count = 0;
        for(var i = 0; i < this.array.length; i++){
          if(this.array[i]=='▢'){
            count++;
          }
        }
        return count;
      },
    },
    created() {
      while(this.array.length<117){
        var symbol  =this.randomItem(Object.entries(this.symbols))[1]
        this.array.push(symbol);  
      }
      this.number = this.countSymbol(); 
      this.$emit('anzahl',this.number)     
    },
  }
</script>