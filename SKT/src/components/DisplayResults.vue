<template> 
  <body>
    <h5>Auswertung</h5>   
    <table>  
      <tr v-for="(item, index) in tableData" :key="item"  >
        <td  v-for="item in item" :key="item" v-text="item" ></td>
         <button  @click="play(index)" v-if="index+1 in this.task_data['audio']" >Play Audio </button> 
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

          function convertURIToBinary(dataURI) {
  let BASE64_MARKER = ';base64,';
  let base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  let base64 = dataURI.substring(base64Index);
  let raw = window.atob(base64);
  let rawLength = raw.length;
  let arr = new Uint8Array(new ArrayBuffer(rawLength));

  for (let i = 0; i < rawLength; i++) {
    arr[i] = raw.charCodeAt(i);
  }
  return arr;
}

let binary = convertURIToBinary(this.task_data['audio'][index+1]);
let blob = new Blob([binary], {
  type: 'audio/ogg'
});
let blobUrl = URL.createObjectURL(blob);

          console.log(index)
          console.log(this.task_data['audio']['1'])
          //let blob = new Blob(this.task_data['audio'][index+1], { type: "audio/mp3" });
          //let audioUrl = URL.createObjectURL(blob);
          let audio = new Audio(blobUrl);
          audio.play()
        }
    },
    created(){
      console.log('1' in this.task_data['audio'])
      this.tableData = this.tableData.filter((value,index) => (index+1).toString() in this.task_data)
      
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

