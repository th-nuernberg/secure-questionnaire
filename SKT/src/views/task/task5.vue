<template>
  <body>

    <h3>V: Symbole zählen</h3>
    <div>Aufgabe <strong>5</strong> von 7</div>

    <div v-if="!this.hide">
      <TimeBar :duration="60" @timeout="this.finishedTask" ref="timeBar"/><br />
      <h5>
        Sie sehen hier auf dieser Tafel verschiedene Symbole: Vierecke, Sterne
        und Blumen. <br />Wichtig sind nur die Vierecke "▢" . Bitte zählen Sie sie so
        schnell sie können.
      </h5>

      <div class="input-group mb-3" style="width: 500px">
        <input type="text" class="form-control" placeholder="Anzahl gezählter Vierecke" v-model="eingabe"/>
        <div class="input-group-append">
          <button class="btn btn-primary" type="text" @click="this.auswertung"> OK </button>
        </div>
      </div>

      <Symbols @anzahl="anzahlSymbole" /><br />

    </div>

    <div class="popup" v-if="this.hide">
      <h4>Hier geht es weiter zur nächsten Aufgabe</h4><br />
      <router-link class="btn-router" to="/task6">Weiter geht's</router-link>
    </div>

  </body>
</template>

<script>
import TimeBar from "../../components/TimeBar.vue";
import Symbols from "../../components/DisplaySymbols.vue";

export default {
  components: {
    TimeBar,
    Symbols,
  },
  data() {
    return {
      hide: Boolean,
      anzahl: "",
      eingabe: "",
      ergebnis: Boolean,
    };
  },
  methods: {
    getData() {
      return this.$store.getters.getData;
    },
    finishedTask() {
      this.hide = true;
      this.$store.dispatch("addData", {
        task: 5,
        content: { 
          time: this.$refs.timeBar.time, 
          result: this.ergebnis },
      });
    },
    anzahlSymbole(anzahl) {
      this.anzahl = anzahl;
      //console.log(this.anzahl);
    },
    auswertung() {
      if (this.eingabe == this.anzahl) {
        this.ergebnis = "Richtig";
      } else {
        this.ergebnis = "Falsch";
      }
      this.finishedTask();
    },
  },
  created() {
    this.hide = false;
  },
};
</script>