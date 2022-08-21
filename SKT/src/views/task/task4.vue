<template>
  <body>

    <div v-if="!this.hide">
      <h3>Subtest IV: Zahlen ordnen</h3>
      <div>Aufgabe <strong>4</strong> von 8</div>
      <TimeBar :duration=6000 @timeout="this.timeOut" ref="timeBar" /><br>
      <h5> Wie Sie sehen, sind die Zahlen nicht geordnet.
        Kleine und große Zahlen sind durcheinander gemischt.
        Bitte ordnen Sie jetzt, so schnell Sie können, die Zahlen der Größe nach.
        Dazu suchen Sie die kleinste Zahl und stellen sie auf das erste Feld links oben.
        Dann suchen Sie die nächstgrößere Zahl und stellen sie daneben und so weiter.</h5><br>
      <DragNumber :listed_numbers="selectedNumber" /><br>
      <router-link class="btn-router" to="/task5" @click="timeOut">Fertig</router-link><br><br>
    </div>

    <div class="popup" v-if="this.hide">
      <h4>Die Zeit ist um!<br>Hier geht es weiter zur nächsten Aufgabe</h4><br>
      <router-link class="btn-router" to="/task5">Weiter geht's</router-link>
    </div>

  </body>
</template>

<script>

import TimeBar from "../../components/TimeBar.vue";
import DragNumber from "../../components/DragNumber.vue";

export default {
  components: {
    TimeBar,
    DragNumber,
  },
  data() {
    return {
      selectedNumber: [],
      hide: Boolean,
    };
  },
  methods: {
    getData() {
      return this.$store.getters.getData;
    },
    shuffleArray() {
      let array = [...this.selectedNumber]
      console.log(array);
      let a,
        b,
        temp;
      for (let i = 0; i < 10; i++) {
        a = Math.floor(Math.random() * 10)
        b = Math.floor(Math.random() * 10);
        temp = array[a];
        array[a] = array[b];
        array[b] = temp;
        console.log(array[a]);
      }
      return array;

    },
    timeOut() {
      console.log('TimeOUT!!!!!!!')
      this.finishedTask()
    },
    finishedTask() {
      this.hide = true;
      console.log();
      this.$store.dispatch("addData", { 'task': 4, 'content': { 'time': this.$refs.timeBar.time } })
    },
  },
  created() {
    this.hide = false;
    this.selectedNumber = this.getData()["3"]["numbers"];
    this.selectedNumber = this.shuffleArray(this.selectedNumber);
  },
}
</script>

