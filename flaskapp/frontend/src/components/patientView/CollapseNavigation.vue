<template>
  <div>
    <div v-if="noEntries">
      <p>Fügen Sie eine Uhrzeit hinzu, um mit der Bearbeitung zu starten:</p>
      <div class="row">
        <div class="col">
          <div class="form-outline timepicker">
            <input type="time" class="form-control" v-model="newTime">
          </div>         
        </div>

        <div class="col" cols="auto">
          <button class="btn btn-outline-dark" type="button" @click="setTime">
            <BootstrapIcon icon="clock-history" size="1x" />
          </button>
        </div>
      </div>

      <p id="timeError" style="display: none; color: red">
        Bitte geben Sie eine Uhrzeit an.
      </p>
      <p id="existsError" style="display: none; color: red">
        Uhrzeit existiert bereits.
      </p>
    </div>

    <div
      v-else
      v-for="(entry, index) in entries.timeEntries"
      :key="entry.time"
      class="accordion"
      role="tablist"
    >
      <!-- <div class="card mb-3"> -->
      <div class="mb-3">

        <!-- <div class="card-header" header-tag="header" role="tab">
          <button
            v-b-toggle="'accordion-' + index"
            class="timeBtn"
            variant="primary"
          >
            {{ entry.time }}
          </button>
          <button-group class="editBtnsGroup">
            <button
              @click="setIndex(index)"
              v-b-modal.editTimeEntry
              size="sm"
              class="editBtns"
              variant="outlined"
            >
              <BootstrapIcon icon="pencil-fill" size="2x" />
            </button>
            <button
              @click="setIndex(index)"
              class="editBtns"
              variant="outlined"
              v-b-modal.deleteTimeEntry
              size="sm"
            >
              <BootstrapIcon icon="trash" size="2x" />
            </button>
          </button-group>
        </div> -->

        <div class="row text-center">
        <div class="col align-self-center">
          Ausgewählte Uhrzeit:
        </div>
        <div class="col-1 border border-dark rounded align-self-center">
          {{ entry.time }}
        </div>
        <div class="col">
          <button-group>
            <button
              @click="setIndex(index)"
              v-b-modal.editTimeEntry
              size="sm"
              class="btn btn-outline-dark mx-1"
              variant="outlined"
            >
              <BootstrapIcon icon="pencil" size="1x" />
            </button>
            <button
              @click="setIndex(index)"
              class="btn btn-outline-dark"
              variant="outlined"
              v-b-modal.deleteTimeEntry
              size="sm"
            >
              <BootstrapIcon icon="trash3" size="1x" />
            </button>
          </button-group>
        </div>
      </div>

      <hr class="my-3">
        
        <!-- <button
          class="btn btn-primary"
          type="button"
          data-toggle="collapse"
          :id="'accordion-' + index"
          accordion="my-accordion"
          role="tabpanel"
          @shown="open(index)"
          :visible="isOpen(index)"
        > -->
          <div class="card-body">
            <Questions-Container
              :date="entries.date"
              :time="entry.time"
              :key="entry.time && entries.date"
            ></Questions-Container>
          </div>
        <!-- </button> -->
      </div>
    </div>

    <div class="d-grid col-3 mt-4">
      <button
          v-if="!noEntries"
          class="btn btn-outline-dark"
          v-b-modal.addTimeEntry
        >
          <div class="d-flex">
            <div>
              <BootstrapIcon icon="plus-circle" size="1x" />
            </div>
            <div class="mx-auto align-self-center">
              Fragen für Uhrzeit hinzufügen
            </div>
          </div>
        </button>
    </div>
    

    <div
      class="modal"
      id="addTimeEntry"
      size="md"
      hide-header
      hide-footer
      centered
    >
      <h4>Uhrzeit hinzufügen</h4>

      <input type="time" v-model="newTime" />
      <p id="timeError" style="display: none; color: red">
        Bitte geben Sie eine Uhrzeit an.
      </p>
      <p id="existsError" style="display: none; color: red">
        Uhrzeit existiert bereits.
      </p>
      <div class="row" align-h="between">
        <div class="col" cols="auto">
          <button @click="cancelModal" variant="outline-danger">
            Abbrechen
          </button>
        </div>
        <div class="col" cols="auto">
          <button @click="addEntry" variant="primary">
            Eintrag hinzufügen
          </button>
        </div>
      </div>
    </div>

    <div
      class="modal"
      id="deleteTimeEntry"
      size="md"
      hide-header
      hide-footer
      centered
    >
      <h4>Wollen Sie diesen Eintrag wirklich löschen?</h4>
      <p>Alle Antworten zu dieser Uhrzeit werden dadurch gelöscht.</p>
      <div class="row" align-h="between">
        <div class="col" cols="auto">
          <button @click="cancelModal" variant="outline-danger">
            Abbrechen
          </button>
        </div>
        <div class="col" cols="auto">
          <button @click="deleteTimeEntry" variant="danger">Löschen</button>
        </div>
      </div>
    </div>

    <div
      class="modal"
      id="editTimeEntry"
      size="md"
      hide-header
      hide-footer
      centered
    >
      <h4>
        Uhrzeit bearbeiten: {{ this.entries.timeEntries[editIndex].time }}
      </h4>
      <input type="time" v-model="editTime" />
      <p id="timeErrorModal" style="display: none; color: red">
        Bitte geben Sie eine Uhrzeit an.
      </p>
      <p id="existsErrorModal" style="display: none; color: red">
        Uhrzeit existiert bereits.
      </p>
      <div class="row" align-h="between">
        <div class="row" cols="auto">
          <button @click="cancelModal" variant="outline-danger">
            Abbrechen
          </button>
        </div>
        <div class="row" cols="auto">
          <button @click="editTimeEntry" variant="primary">
            Aktualisieren
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QuestionsContainer from "./QuestionsContainer.vue";

export default {
  components: {
    QuestionsContainer,
  },
  props: {
    entries: Object,
  },
  data() {
    return {
      newTime: "",
      index: 0,
      editIndex: 0,
      editTime: "",
    };
  },
  computed: {
    noEntries() {
      return (
        this.entries.timeEntries.length == 1 &&
        this.entries.timeEntries[0].time == ""
      );
    },
    isOpen() {
      return function (index) {
        if (this.index == index) {
          return true;
        } else return false;
      };
    },
  },
  methods: {
    addEntry() {
      document.getElementById("timeError").style.display = "none";
      document.getElementById("existsError").style.display = "none";
      if (this.newTime == "") {
        document.getElementById("timeError").style.display = "block";
      } else if (this.existsAlready()) {
        document.getElementById("existsError").style.display = "block";
      } else {
        document.getElementById("timeError").style.display = "none";
        this.$parent.addTimeEntry(this.newTime);
        this.openAccordion(this.newTime);
        this.newTime = "";
        this.$bvModal.hide("addTimeEntry");
      }
    },

    openAccordion(newTime) {
      if (newTime == "") {
        this.index = -1;
      }

      for (let i = 0; i < this.entries.timeEntries.length; i++) {
        if (this.entries.timeEntries[i].time == newTime) {
          this.index = i;
        }
      }
    },

    setTime() {
      if (this.newTime == "") {
        document.getElementById("timeError").style.display = "block";
      } else {
        document.getElementById("timeError").style.display = "none";
        this.$parent.timeInput(this.newTime, 0);
        this.openAccordion(this.newTime);
        this.newTime = "";
      }
    },

    getInputFromChild(questionID, answer) {
      this.$parent.getInputFromChild(questionID, answer, this.index);
    },
    open(index) {
      this.index = index;
    },
    cancelModal() {
      this.$bvModal.hide("deleteTimeEntry");
      this.$bvModal.hide("editTimeEntry");
      this.$bvModal.hide("addTimeEntry");
      this.editTime == "";
    },
    deleteTimeEntry() {
      let time = "";
      if (this.index != this.editIndex)
        time = this.entries.timeEntries[this.index].time;
      this.$parent.deleteTimeEntry(this.editIndex);
      this.editIndex = 0;
      this.openAccordion(time);
      this.$bvModal.hide("deleteTimeEntry");
    },
    editTimeEntry() {
      this.newTime = "";

      document.getElementById("timeErrorModal").style.display = "none";
      document.getElementById("existsErrorModal").style.display = "none";
      if (this.editTime == "") {
        document.getElementById("timeErrorModal").style.display = "block";
      } else if (
        this.existsAlready() &&
        this.editTime != this.entries.timeEntries[this.editIndex].time
      ) {
        document.getElementById("existsErrorModal").style.display = "block";
      } else {
        this.$parent.timeInput(this.editTime, this.editIndex);
        this.$bvModal.hide("editTimeEntry");
        this.openAccordion(this.editTime);
        this.editTime = "";
      }
    },
    setIndex(index) {
      this.editIndex = index;
    },

    existsAlready() {
      var found = false;
      this.entries.timeEntries.forEach((entry) => {
        if (entry.time == this.newTime || entry.time == this.editTime) {
          found = true;
        }
      });
      return found;
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../custom.scss";

.timeBtn {
  width: 100%;
  border-radius: calc(0.25rem - 1px) calc(0.25rem - 1px) 0 0;
}

.timeBtn:focus {
  box-shadow: none;
}

.cardBody {
  background-color: $background;
}

.card-header {
  position: relative;
}

.addBtn {
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 0;
  padding-bottom: 0;
  font-size: 150%;
}

.editBtnsGroup {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
}

.editBtns {
  color: white;
}

.editBtns:hover {
  color: black;
  background: $background;
}
</style>
