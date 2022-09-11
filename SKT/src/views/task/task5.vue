<template>

  <body>
    <h3>V: Zahlen zurücklegen</h3>
    <div>Aufgabe <strong>5</strong> von 8</div>

    <TimeBar :duration="60" @timeout="this.timeOut" ref="timeBar" v-if="!this.hide" /><br />
    <div v-if="!this.hide">
      <h5>
        Stellen Sie jetzt bitte, so schnell Sie können, die Spielsteine wieder
        auf ihren alten Platz zurück. </h5><br />

        <div class="container" style="width: 900px">
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


      <router-link class="btn-router" to="/task6" @click="timeOut">Weiter</router-link><br /><br />
    </div>

    <div class="popup" v-if="
      this.hide && !this.selectedNumber.every((entry) => entry['recognized'])
    ">
      <h4>Die Zeit ist um!<br />Hier geht es weiter zur nächsten Aufgabe</h4>
      <br />
      <router-link class="btn-router" to="/task6">Weiter geht's</router-link>
    </div>

    <div class="popup" v-if="
      this.hide && this.selectedNumber.every((entry) => entry['recognized'])
    ">
      <h4>
        Sie haben alle Zahlen vorgelesen!<br />Hier geht es weiter zur nächsten
        Aufgabe
      </h4>
      <br />
      <router-link class="btn-router" to="/task6">Weiter geht's</router-link>
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
      compared: [],
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
      }
      return array;
    },
    timeOut() {
      this.finishedTask();
    },
    finishedTask() {
      this.hide = true;
      var finishedarray = document.getElementById("draggable").children
      
      var result = [];      
      for (let index = 0; index < finishedarray.length; index++) {
        result.push(finishedarray[index].textContent);      
      }
      result.pop();


      var correct = this.compare(result);
     
      this.$store.dispatch("addData", { 'task': 5, 'content': { 'time': this.$refs.timeBar.time, 'richtig':correct} })
    },
    compare(arr) {
   
      var i = 0;
      for (let index = 10; index < arr.length; index++) {
        if (arr[index] == this.compared[i]){
          i++;
        }
        else{
          return "Falsch"
        }   
        return "Richtig"    
      }
     

    },
  },
  created() {
    this.hide = false;
    this.selectedNumber = this.getData()["3"]["numbers"];

    for (let index = 0; index <  this.selectedNumber.length; index++) {
        this.compared.push( this.selectedNumber[index]["num"]);      
      }

    var selectedNumber = this.shuffleArray(this.selectedNumber);
    
    for (let index = 0; index < 10; index++) {
      this.array.push({ name: "100", font: "#FFFFFF" })      
    }     
    
    selectedNumber.forEach(element => {
      this.array.push({
        name: element["num"],
        color: element["color"],
      })
    });
  },
};
</script>

