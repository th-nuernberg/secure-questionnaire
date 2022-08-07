<template> 
  <body>
    <h5>Auswertung</h5>   
    <table>  
      <tr v-for="(item,index) in tableData" :key="item">
        <td v-for="item in item" :key="item" v-text="item"></td>
         <Button>Button {{ index + 1}}</Button> 
      </tr>
    </table>
  </body>
</template>

<script>
export default {
    name: 'DisplayResults',
    props: {
      task_data: Object
    },
    methods:{
        play(index){
          console.log(index+1)
          let audio = new Audio(this.task_data['1']['audio']);
          audio.play()
        }
    },
    created(){
      console.log(this.task_data)
    },
    data(){
      return{
      tableData: [
        [
          "Aufgabe: 1",
          "Zeit: "+(60-this.task_data['1']['time'])+" Sekunden",
          "Erkannte Gegenstände: "+this.task_data["1"]["images"].map(entry => entry['recognized']).reduce((x,y)=>x+y)
        ],
        [
          "Aufgabe: 2",
          "Zeit: "+(60-this.task_data['2']['time'])+" Sekunden",
          "Fehlende Gegenstände: "+this.task_data["2"]["missing"].length
        ],
        [
          "Aufgabe: 3",
          "Zeit: "+this.task_data['2']['time']+" Sekunden"
        ]
      ]
    }
  }
} 

</script>

