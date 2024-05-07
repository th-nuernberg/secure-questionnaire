
<template>
  <body>
    <div v-if="!this.hide">
      <h3>Subtest IV: Zahlen ordnen</h3>
      <div>Aufgabe <strong>4</strong> von 7</div>
      <TimeBar :duration=60 @timeout="this.timeOut" ref="timeBar" /><br>
      <h5> Wie Sie sehen, sind die Zahlen nicht geordnet.
        Kleine und große Zahlen sind durcheinander gemischt.
        Bitte ordnen Sie jetzt, so schnell Sie können, die Zahlen der Größe nach.
        Dazu suchen Sie die kleinste Zahl und stellen sie auf das erste Feld links oben.
        Dann suchen Sie die nächstgrößere Zahl und stellen sie daneben und so weiter.</h5><br>

    
      <div class="container" style="width: 800px">
        <div class="row justify-content-md-center">
          <draggable :array="array" id="draggable">
            <div class="circle" v-for="element in array" :key="element.name"
              v-bind:style="{ background: element.color, color: element.font }">
              {{ element.name }}
            </div>
            <br />
          </draggable>
        </div>
      </div>

      
      <!-- <router-link class="btn-router" to="/task5" @click="finishedTask">Fertig</router-link><br><br> -->
    </div>
    <div class="popup" v-if="this.hide">
      <h4>Die Zeit ist um!<br>Hier geht es weiter zur nächsten Aufgabe</h4><br>
      <router-link class="btn-router" to="/task5">Weiter geht's</router-link>
    </div>
  </body>
</template>
<script>
import TimeBar from "../../components/TimeBar.vue";
import { VueDraggableNext } from "vue-draggable-next";

export default {
  components: {
    TimeBar,
    draggable: VueDraggableNext,
  },
  data() {
    return {
      selectedNumber: [],
      enabled: true,
      array: [],
      dragging: false,
      hide: Boolean,
    };
  },
  methods: {
    getData() {
      return this.$store.getters.getData;
    },
    shuffleArray() {
      let array = [...this.selectedNumber]
      let a,
        b,
        temp;
      for (let i = 0; i < 10; i++) {
        a = Math.floor(Math.random() * 10)
        b = Math.floor(Math.random() * 10);
        temp = array[a];
        array[a] = array[b];
        array[b] = temp;
        //console.log(array[a]);
      }
      return array;
    },
    timeOut() {
      console.log('TimeOUT!!!!!!!')
      this.finishedTask()
    },
    finishedTask() {
      this.hide = true;
      var finishedarray = document.getElementById("draggable").children
      
      var result = [];      
      for (let index = 0; index < finishedarray.length; index++) {
        result.push(finishedarray[index].textContent);      
      }
      result.pop();
      
      var correct = this.isSorted(result);
     
      this.$store.dispatch("addData", { 'task': 4, 'content': { 'time': this.$refs.timeBar.time, 'richtig':correct} })
    },
    isSorted(arr) {
      let second_index;
      for (let first_index = 0; first_index < arr.length; first_index++) {
        second_index = first_index + 1;
        if (arr[second_index] - arr[first_index] < 0)
        {
        return "Falsch";
        } 
      }
      return "Richtig";
    },
  },
  created() {
    this.hide = false;
    this.selectedNumber = this.getData()["3"]["numbers"];
    this.selectedNumber = this.shuffleArray(this.selectedNumber);

    for (let index = 0; index < 10; index++) {
      this.array.push({ name: "100", font: "#FFFFFF" })      
    }    

    this.selectedNumber.forEach(element => {
      this.array.push({
        name: element["num"],
        color: element["color"],
      })
    });
      
  },
}
</script>
