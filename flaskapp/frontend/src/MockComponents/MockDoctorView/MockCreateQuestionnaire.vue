<template>
  <div v-if="!saved">
    <div class="container">
      <h3 id="v-step-6">Fragebogen erstellen</h3>

      <div class="row">
        <div class="col-sm-6">
          <div class="py-3">
            <label for="title" class="form-label">Titel</label>
            <input v-model="questionnaire.title" id="title" type="text" class="form-control ml-0"
              placeholder="Fragebogen#1" required>
            <div class="invalid-feedback">
              Valid title is required.
            </div>
          </div>
        </div>
      </div>

      <hr class="my-3">

      <p class="text-muted mb-0">
        Geben Sie an, ob der Patient den Fragebogen einmalig oder mehrmals
        ausfüllen soll. Falls es sich um einen wiederholenden Fragebogen
        handelt, müssen Sie angeben, in welchem Intervall der Fragebogen
        ausgefüllt werden soll.
      </p>

      <form>
        <div div class="form-group col-md-4 py-3">
          <label for="interval" class="form-label">Testintervall</label>
          <select v-model="questionnaire.repeatingType" id="interval" class="form-control">
            <option selected disabled value="">Bitte wählen...</option>
            <option value="single">Einmalig</option>
            <option value="date">Wiederholend (Datum)</option>
            <option value="dateTime">Wiederholend (Datum und Uhrzeit)</option>
          </select>
          <small class="text-muted">Bitte wählen!</small>
        </div>
      </form>

      <hr class="my-3">

      <div v-for="question in questionnaire.elements" :key="question.id" :class="['mb-3 p-3']">
        <div class="row center">
          <div class="col-2">
            <create-question-control @deleteQuestion="deleteQuestion(question)" @upwards="questionUpwards(question)"
              @downwards="questionDownwards(question)">
            </create-question-control>
          </div>
          <div class="col-md-10">
            <label>{{ question.id }}. Frage:
              {{ questionText(question.type) }}</label>

            <div class="form-floating">
              <textarea class="form-control" v-if="question.type === 'description'"
                placeholder="Beschreibung/Anmerkungen/..." id="floatingTextarea2" style="height: 100px"
                v-model="question.text"></textarea>
              <input type="text" class="form-control" v-else v-model="question.text"
                placeholder="Bitte geben Sie eine Frage ein." />
            </div>

            <!-- Multiple Choice / Single Choice -->
            <span v-if="choiceQuestion(question.type)">
              <span class="d-block mt-2">Optionen: </span>
              <span v-for="(option, index) in question.options" :key="option.id">
                <div class="input-group">
                  <input type="text" class="form-control" v-model="option.text" :key="option.id"
                    :placeholder="'Option ' + (index + 1)" />
                  <div class="input-group-append">
                    <button type="button" class="btn btn-outline-dark" v-if="index !== 0 && index !== 1"
                      @click="deleteOption(question, option)" variant="danger">
                      <BootstrapIcon icon="trash" size="1x" />
                    </button>
                  </div>
                </div>
                <br />
              </span>

              <button type="button" class="btn btn-outline-dark" @click="addOption(question.id)">
                <BootstrapIcon icon="plus-circle" size="1x" />
              </button>
              <small class="text-muted ms-2">weitere Option hinzufügen</small>
            </span>

            <!-- Skala -->
            <span v-else-if="question.type == 'scale'">
              <span class="d-block mt-2">Beschreibung der Skala: </span>
              <input class="form-control" placeholder="(optional)" v-model="question.description" />
              <br />
              <span v-for="(option, index) in question.options" :key="option.id">
                <div class="input-group">
                  <input v-model="option.text" class="form-control" :placeholder="'Option ' + (index + 1)" />
                  <div class="input-group-append">
                    <button type="button" class="btn btn-outline-dark" v-if="index >= 2"
                      @click="deleteOption(question, option)" variant="danger">
                      <BootstrapIcon icon="trash" size="1x" />
                    </button>
                  </div>
                </div>
                <br />
              </span>

              <button type="button" class="btn btn-outline-dark" @click="addOption(question.id)">
                <BootstrapIcon icon="plus-circle" size="1x" />
              </button>
              <small class="text-muted ms-2">weitere Option hinzufügen</small>
            </span>
          </div>
        </div>
      </div>

      <div id="v-step-7" class="dropdown">
        <button class="btn btn-outline-dark dropdown-toggle" type="button" @click="toggle" id="dropdownMenu2"
          data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <BootstrapIcon icon="plus-circle" size="1x" /><br />
          Fragenmenü
        </button>
        <div v-if="active">
          <button class="dropdown-item" @click="addQuestion(question.type)" v-for="question in questionTypes"
            :key="question.text" type="button">
            {{ question.text }}
          </button>
        </div>
      </div>

      <hr class="my-3">
      
      <p id="owner-selection" class="dropdown-owner" tabindex="100">
        <button class="btn btn-outline-dark dropdown-toggle" type="button" @click="toggleDoctors">
          Behandelnde Ärzte
        </button>
        <div id="owner-list" class="dropdown-owner-content"></div>
      </p>   

      <hr class="my-3">

      <button id="v-step-8" @click="save()" class="btn btn-outline-dark btn-lg mt-3" variant="success">
        <div class="d-flex">
          <div class="p-2">
            <BootstrapIcon class="mb-0" icon="box-arrow-down" size="2x" />
          </div>
          <div class="p-2">
            Fragebogen speichern
          </div>
        </div>
      </button>

      <div id="upload-error" style="display: none">
        <BootstrapIcon icon="exclamation-circle-fill" size="2x" />
        <p class="m-1 d-inline">
          Fehler beim Upload. Bitte versuchen Sie es erneut.
        </p>
      </div>
    </div>
  </div>

  <div v-else class="saved">

    <div class="my-5">
      <h3 class="text-center mb-3">Erfolgreich gespeichert!</h3>

      <div class="d-grid gap-3 col-3 mx-auto mt-4">
        <button type="button" class="btn btn-outline-dark" variant="primary">
          <div class="d-flex">
            <div>
              <BootstrapIcon icon="download" size="2x" />
            </div>
            <div class="mx-auto align-self-center">
              Infoblatt
            </div>
          </div>

        </button>
        <button id="v-step-9" type="button" class="btn btn-outline-dark" variant="outline-primary">
          <div class="d-flex">
            <div>
              <BootstrapIcon icon="menu-down" size="2x" />
            </div>
            <div class="mx-auto align-self-center">
              Neuer Fragebogen
            </div>
          </div>
        </button>
      </div>
    </div>


    <div class="my-5">
      <section class="user-details p-5" ref="document">
        <div class="text-center">
          <h1>Infoblatt zum Fragebogen</h1>
          <h4>{{ questionnaire.title }}</h4>
          <qr-code :content="qrlink" class="qr"></qr-code>
        </div>
        <h4>1. Fragebogen öffnen</h4>
        <p>
          Um den Fragebogen zu öffnen, scannen Sie den obigen QR-Code mit einem
          QR-Code-Scanner Ihrer Wahl. Sie können dazu zum Beispiel Ihr
          Smartphone benutzen.
          <br />
          Alternativ können Sie den QR-Code auch direkt auf www.website.de
          einscannen.
        </p>
        <p>
          Falls Sie keine Kamera zur Verfügung haben, können Sie auch folgenden
          Code unter www.website.de eingeben:
        </p>
        <div class="text-center">
          <p class="font-weight-bold p-2 d-inline code">
            {{ questionnaire.queID }}
          </p>
        </div>
        <h4>2. Fragebogen ausfüllen</h4>
        <p>
          Füllen Sie den Fragebogen nach Anweisungen des Arztes aus und
          speichern Sie ihn anschließend.
          <br />Nach dem Speichern erhalten Sie eine weitere Datei mit einem
          neuen QR-Code, der genutzt werden kann, um Ihre verschlüsselten
          Antworten zu entschlüsseln. <br />Mit diesem können Sie Ihre Antworten
          im Nachhinein bearbeiten und ergänzen. <br />
          Beachten Sie, dass bei einer Änderung Ihrer Antworten aus
          Sicherheitsgründen immer ein neuer QR-Code erstellt wird und somit der
          alte QR-Code an Gültigkeit verliert.
        </p>
        <h4>3. Fragebogen auswerten</h4>
        <p>
          Bringen Sie den aktuellen QR-Code beim nächsten Termin mit, damit der
          Arzt Ihre Antworten auswerten kann.
        </p>
      </section>
    </div>
  </div>
</template>

<script>
import CreateQuestionControl from "./MockCreateQuestionControl.vue";
import InfoTooltip from "./../MockUtil/MockInfoTooltip.vue";
import QrCode from "../MockQrCode.vue";

export default {
  components: {
    CreateQuestionControl,
    InfoTooltip,
    QrCode,
  },
  data() {
    return {
      questionnaire: {
        queID: "",
        title: "",
        elements: [],
        owners: [],
      },
      saved: false,
      qrlink: "localhost:8080/patient/questionnaire/",
      active: false,
      isOpen: false
    };
  },
  computed: {
    questionTypes() {
      return this.$store.getters.getQuestionTypes;
    },
    choiceQuestion() {
      return (type) => {
        return type.includes("choice");
      };
    },
    questionText() {
      return (type) => {
        return this.$store.getters.getQuestionText(type);
      };
    },
  },
  methods: {
    toggle() {
      this.active = !this.active;
    },
    toggleDoctors() {
      if(!this.isOpen){
        document.getElementById("owner-list").style.display = "block";
        this.isOpen = true;
      } else{
        document.getElementById("owner-list").style.display = "none";
        this.isOpen = false;
      }      
    },
    addQuestion(type) {
      if (this.choiceQuestion(type) || type == "scale") {
        this.questionnaire.elements.push({
          type: type,
          id: this.questionnaire.elements.length + 1,
          options: [{ id: 1 }, { id: 2 }],
        });
      } else {
        this.questionnaire.elements.push({
          type: type,
          id: this.questionnaire.elements.length + 1,
        });
      }
      //Problem: Ansicht wird erst geupdated, wenn Funktion fertig ist (-> scrollTo wird zu früh ausgeführt)
      //window.scrollTo(0, document.body.scrollHeight);
      this.toggle();
    },
    addOption(id) {
      let currentQuestion = this.questionnaire.elements[id - 1];
      currentQuestion.options.push({
        text: "",
        id: currentQuestion.options.length + 1,
      });
    },
    deleteQuestion(question) {
      this.questionnaire.elements.splice(question.id - 1, 1);
      this.questionnaire.elements.forEach((question) => {
        question.id = this.questionnaire.elements.indexOf(question) + 1;
      });
    },
    questionUpwards(question) {
      if (question.id > 1) {
        this.swapQuestions(question.id - 1, question.id - 2);
      }
    },
    questionDownwards(question) {
      if (question.id < this.questionnaire.elements.length) {
        this.swapQuestions(question.id - 1, question.id);
      }
    },
    swapQuestions(index1, index2) {
      let tmp = this.questionnaire.elements[index1];
      this.questionnaire.elements[index1] = this.questionnaire.elements[index2];
      this.questionnaire.elements[index1].id = index1 + 1;
      this.questionnaire.elements[index2] = tmp;
      this.questionnaire.elements[index2].id = index2 + 1;
    },
    deleteOption(question, option) {
      let currentOptions = this.questionnaire.elements[question.id - 1].options;
      currentOptions.splice(option.id - 1, 1);
      currentOptions.forEach((option) => {
        option.id = currentOptions.indexOf(option) + 1;
      });
    },
    save() {
      document.getElementById("upload-error").style.display = "none";

      window.scrollTo(0, 0);
      this.saved = true;

      this.$tours['myTour'].nextStep()
    },
  },
};
</script>

<style>

.ml-0 {
  margin-left: 0 !important;
}

.mb-0 {
  margin-bottom: 0 !important;
}

.mc-option {
  display: inline;
  width: 50%;
  margin-right: 10px;
}

form[class="px-2"] {
  text-align: left;
}

.skala {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.skalaInput {
  width: 120px;
  margin: 0 10px;
}

#upload-error {
  color: red;
  margin-top: 5px;
}

.btnPDF {
  margin-right: 30px;
}

.qr {
  display: inline-block;
  width: 280px;
  height: 280px;
  margin-right: auto;
  margin-left: auto;
  margin-top: 30px;
  margin-bottom: 30px;
}

.code {
  border-radius: 10px;
  border: 2px solid black;
}

h4 {
  margin-top: 15px;
}

.saved {
  max-width: 1000px;
  margin-right: auto;
  margin-left: auto;
  margin-top: 40px;
}

#owner-list{
  display: none;
}

.entry{
  display: flex;
  margin: 8px;
}

.doctors{
  padding-left: 20px;
}
</style>
