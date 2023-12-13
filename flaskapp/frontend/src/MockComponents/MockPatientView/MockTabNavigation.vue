<template>
  <div>
    <div class="container">
      <div class="row navigationMenu text-center" align-h="center">
        <p class="h4">{{ currentDate }}</p>        
        <div class="col">
          <button
            type="button"
            class="btn btn-outline-dark"
            @click="back"
            :disabled="index == 1"
          >
            <!-- <i class="bi bi-chevron-left"></i> -->
            <BootstrapIcon icon="arrow-left" size="2x" />
          </button>
        </div>
        <div class="col" align-h="center">
          <!-- <button v-modal.calendar class="date btn-accent">
                        {{currentDate}}
                    </button> -->
          <!-- <button
            type="button"
            class="date btn-outline-dark"
            v-modal.calendar
            data-bs-toggle="modal"
            data-bs-target="#firstEntry"
          >
            Datum hinzufügen!
            {{ currentDate }}
          </button> -->

          <div class="btn-toolbar">
            <div class="btn-group me-2" align-h="center">
              <button
                type="button"
                class="btn btn-outline-dark"
                v-modal.calendar
                data-bs-toggle="modal"
                data-bs-target="#editEntry"
              >
                <BootstrapIcon icon="pencil-fill" size="2x" /><br />
                Datum bearbeiten
              </button>

              <button
                type="button"
                class="btn btn-outline-dark"
                v-modal.calendar
                data-bs-toggle="modal"
                data-bs-target="#deleteEntry"
              >
                <BootstrapIcon icon="trash" size="2x" /><br />
                Datum löschen
              </button>

              <button
                type="button"
                class="btn btn-outline-dark"
                v-modal.calendar
                data-bs-toggle="modal"
                data-bs-target="#addEntry"
              >
                <BootstrapIcon icon="plus-circle" size="2x" /><br />
                Datum hinzufügen
              </button>
            </div>
          </div>
        </div>
        <div class="col">
          <button
            @click="forward"
            :disabled="index === entries.length - 1"
            type="button"
            class="btn btn-outline-dark"
            variant="outline-dark"
          >
            <!-- <i class="bi bi-chevron-right"></i> -->
            <BootstrapIcon icon="arrow-right" size="2x" />
          </button>
        </div>

        <hr class="my-3">

      </div>

      <div class="questionsContainer">
        <Collapse-Navigation v-if="type == 'dateTime'" :entries="oneDay">
        </Collapse-Navigation>

        <Questions-Container v-else :date="date" :time="time" :key="date">
        </Questions-Container>
      </div>
    </div>

    <div class="modal" id="calendar" size="md" hide-header hide-footer centered>
      <button
        @click="cancelModal"
        class="closeBtn btn-white"
        variant="outline"
      ></button>

      <h4>Alle Einträge:</h4>
      <button
        v-for="entry in entries"
        :key="entry.date"
        @click="goTo(entry.date)"
        class="button-calendar"
      >
        {{ entry.date }}
      </button>
    </div>

    <!-- Modal -->
    <div
      class="modal fade"
      id="firstEntry"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Datum bearbeiten</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <h4>
              Fügen Sie ein Datum hinzu, um mit dem Fragebogen zu starten:
            </h4>
            <input id="myInput" type="date" v-model="date" />
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-dark"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              class="btn btn-dark"
              @click="setDate"
              data-bs-dismiss="modal"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      class="modal fade"
      id="editEntry"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Datum bearbeiten</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <h4>Ändern Sie das aktuelle Datum:</h4>
            <input id="myInput" type="date" v-model="date" />
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-dark"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              class="btn btn-dark"
              @click="setDate"
              data-bs-dismiss="modal"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      class="modal fade"
      id="addEntry"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Datum Hinzufügen</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
            <p id="dateError" style="display: none; color: red">
              Bitte geben Sie ein Datum an.
            </p>
            <p id="dateExistsError" style="display: none; color: red">
              Datum existiert bereits.
            </p>
          </div>
          <div class="modal-body">
            <h4>Fügen Sie ein Datum hinzu:</h4>
            <input id="myInput" type="date" v-model="date" />
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-dark"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              class="btn btn-dark"
              @click="addDateEntry"
              data-bs-dismiss="modal"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      class="modal fade"
      id="deleteEntry"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Datum löschen</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <h4>Wollen Sie diesen Eintrag wirklich löschen?</h4>
            <p>Alle Einträge zu diesem Datum werden dadurch gelöscht.</p>
            {{ currentDate }}
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-dark"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              class="btn btn-dark"
              @click="deleteEntry"
              data-bs-dismiss="modal"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QuestionsContainer from "./QuestionsContainer.vue";
import CollapseNavigation from "./CollapseNavigation.vue";

export default {
  name: "TabNavigation",
  components: {
    QuestionsContainer,
    CollapseNavigation,
  },
  props: {
    entries: Array,
    type: String,
  },
  data() {
    return {
      date: "",
      time: "",
      index: this.entries.length - 1, //start with last entry
    };
  },
  mounted() {
    if (this.entries.length == 1 && this.entries[0].date === "") {
      this.$nextTick(function () {
        //waiting for child components to be mounted
        //this.$bvModal.show("firstEntry");
        // var myModal = document.getElementById('firstEntry')
        // var myInput = document.getElementById('myInput')
        // myModal.on('shown.bs.modal', function () {
        // });
        // myModal.on('shown.bs.modal', function () {
        //         myInput.trigger('focus')
        //     })
      });
    } else {
      this.$nextTick(function () {
        this.index = this.entries.length - 1;
        this.date = this.entries[this.entries.length - 1].date;
      });
    }
  },
  computed: {
    currentDate() {
      return this.entries[this.index].date;
    },

    entryAnswers() {
      return this.$store.getters.getEntryAnswers({
        date: this.date,
        time: this.time,
      });
    },

    oneDay() {
      let dayEntry = this.entries.find(
        (entry) => entry.date == this.currentDate
      );
      if (dayEntry == undefined) return [];
      return dayEntry;
    },
  },
  methods: {
    timeInput(time, timeIndex) {
      this.$parent.setTime(time, this.index, timeIndex);
    },
    addDateEntry() {
      if (this.validate()) {
        this.$parent.addDateEntry(this.german(this.date));

        let dateIndex = this.entries.indexOf(
          this.entries.find((entry) => entry.date == this.german(this.date))
        );

        this.index = dateIndex;
        //this.$bvModal.hide("addEntry");
      }
    },
    addTimeEntry(time) {
      this.$parent.addTimeEntry(this.index, time);
      setDate();
    },
    setDate() {
      if (this.validate()) {
        this.$parent.setDate(this.german(this.date), this.index);
        //this.$bvModal.hide("firstEntry");
        //this.$bvModal.hide("editEntry");
      }
    },
    back() {
      this.index = this.index - 1;
      setDate();
    },
    forward() {
      this.index = this.index + 1;
      setDate();
    },
    getInputFromChild(questionID, answer, timeIndex = 0) {
      this.$parent.getInputFromChild(questionID, answer, this.index, timeIndex);
    },
    goTo(date) {
      this.index = this.entries.findIndex((element) => element.date === date);
      //this.$bvModal.hide("calendar");
    },
    openAddingModal() {
      this.date = "";
      //this.$bvModal.show("addEntry");
    },

    deleteEntry() {
      if (this.entries.length == 1) {
        this.$store.commit("resetAnswers");
        //this.$bvModal.show("firstEntry");
      } else {
        this.$parent.deleteEntry(this.currentDate);
        if (this.index == 0) this.index = 1;
        else this.index--;
      }

      // this.$bvModal.hide("deleteEntry");
    },
    deleteTimeEntry(timeIndex) {
      if (this.entries[this.index].timeEntries.length == 1) {
        this.$store.commit("resetTimeEntries", this.index);
      } else {
        this.$parent.deleteTimeEntry(this.index, timeIndex);
      }
    },
    cancelModal() {
      // this.$bvModal.hide("editEntry");
      // this.$bvModal.hide("addEntry");
      // this.$bvModal.hide("deleteEntry");
      // this.$bvModal.hide("calendar");
    },
    german(date) {
      let year = date.slice(0, 4);
      let month = date.slice(5, 7);
      let day = date.slice(8);

      return day + "." + month + "." + year;
    },

    existsAlready() {
      var found = false;
      var germanDate = this.german(this.date);
      this.entries.forEach((entry) => {
        if (entry.date == germanDate) {
          found = true;
        }
      });
      return found;
    },

    validate() {
      let valid = true;
      document.getElementById("dateError").style.display = "none";
      document.getElementById("dateExistsError").style.display = "none";

      if (this.date == "") {
        document.getElementById("dateError").style.display = "block";
        valid = false;
      } else if (this.existsAlready()) {
        document.getElementById("dateExistsError").style.display = "block";
        valid = false;
      }
      return valid;
    },
  },
  watch: {
    index: function (newIndex) {
      this.date = this.entries[newIndex].date;
      let element = document.getElementById("timeError");
      if (element != undefined) element.style.display = "none";
      element = document.getElementById("existsError");
      if (element != undefined) element.style.display = "none";
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../custom.scss";

// .navigationMenu {
//   border-bottom: 1px solid $accent;
//   padding: 15px 0;
//   margin-bottom: 30px;
// }

.date {
  display: block;
  margin-left: auto;
  margin-right: auto;
  font-size: 150%;
  width: 90%;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

// .questionsContainer {
//   margin: 30px;
// }

.editBtnsGroup {
  justify-content: center;
}

.closeBtn {
  position: absolute;
  top: 5px;
  right: 5px;
}

.editBtns {
  background-color: none;
  color: black;
  padding-right: 20px;
  padding-left: 20px;
}

.editBtns:hover {
  border: 1px solid black;
}

.btnNavigate {
  height: 100%;
  border: none;
}

.btn-outline-primary:disabled,
.btn-outline-primary.disabled {
  color: grey;
}

.dateBtns {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border: 1px solid $accent;
  padding-right: 20px;
  padding-left: 20px;
}
</style>
