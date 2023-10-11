<template>
  <div v-if="!saved">
    <div class="container">
      <h3>Fragebogen erstellen</h3>

      <div class="row">
        <div class="col-sm-6">
          <div class="py-3">
            <label for="titel" class="form-label">Titel</label>
            <input id="titel" type="text" class="form-control ml-0" placeholder="Fragebogen#1" required>
            <div class="invalid-feedback">
              Valid Titel is required.
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

      <div
          v-for="question in questionnaire.elements"
          :key="question.id"
          :class="['mb-3 p-3']"
        >
          <div class="row center">
            <div class="col-2">
              <create-question-control
                @deleteQuestion="deleteQuestion(question)"
                @upwards="questionUpwards(question)"
                @downwards="questionDownwards(question)"
              >
              </create-question-control>
            </div>
            <div class="col-md-10">
              <label
                >{{ question.id }}. Frage:
                {{ questionText(question.type) }}</label
              >

              <div class="form-floating">
                <textarea
                  class="form-control"
                  v-if="question.type === 'description'"
                  placeholder="Beschreibung/Anmerkungen/..."
                  id="floatingTextarea2"
                  style="height: 100px"
                ></textarea>
                <input
                  type="text"
                  class="form-control"
                  v-else
                  v-model="question.text"
                  placeholder="Bitte geben Sie eine Frage ein."
                />
              </div>

              <!-- Multiple Choice / Single Choice -->
              <span v-if="choiceQuestion(question.type)">
                <span class="d-block mt-2">Optionen: </span>
                <span
                  v-for="(option, index) in question.options"
                  :key="option.id"
                >
                  <div class="input-group">
                    <input
                      type="text"
                      class="form-control"
                      v-model="option.text"
                      :key="option.id"
                      :placeholder="'Option ' + (index + 1)"
                    />
                    <div class="input-group-append">
                      <button 
                      type="button"
                      class="btn btn-outline-dark"
                      v-if="index !== 0 && index !== 1"
                      @click="deleteOption(question, option)"
                      variant="danger"
                      >
                        <BootstrapIcon icon="trash" size="1x" />
                      </button>
                    </div>
                  </div>
                <br />
                </span>

                <button
                  type="button"
                  class="btn btn-outline-dark"
                  @click="addOption(question.id)"
                >
                  <BootstrapIcon icon="plus-circle" size="1x" />
                </button>
                <small class="text-muted ms-2">weitere Option hinzufügen</small>
              </span>

              <!-- Skala -->
              <span v-else-if="question.type == 'scale'">
                <span class="d-block mt-2">Beschreibung der Skala: </span>
                <input
                  class="form-control"
                  placeholder="(optional)"
                  v-model="question.description"
                />
                <br />
                <span
                  v-for="(option, index) in question.options"
                  :key="option.id"
                >
                  <div class="input-group">
                    <input
                      v-model="option.text"
                      class="form-control"
                      :placeholder="'Option ' + (index + 1)"
                    />
                    <div class="input-group-append">
                      <button
                      type="button"
                      class="btn btn-outline-dark"
                      v-if="index >=2"
                      @click="deleteOption(question, option)"
                      variant="danger"
                      >
                        <BootstrapIcon icon="trash" size="1x" />
                      </button>
                    </div>
                  </div> 
                <br />
                </span>

                <button
                  type="button"
                  class="btn btn-outline-dark"
                  @click="addOption(question.id)"
                >
                  <BootstrapIcon icon="plus-circle" size="1x" />
                </button>
                <small class="text-muted ms-2">weitere Option hinzufügen</small>
              </span>
            </div>
          </div>
        </div>

        

<div class="dropdown">
  <button
    class="btn btn-dark dropdown-toggle"
    type="button"
    @click="toggle"
    id="dropdownMenu2"
    data-toggle="dropdown"
    aria-haspopup="true"
    aria-expanded="false"
  >
    <BootstrapIcon icon="question-circle-fill" size="1x" /><br />
    Fragenmenue
          </button>
          <div v-if="active">
            <button
              class="dropdown-item"
              @click="addQuestion(question.type)"
              v-for="question in questionTypes"
              :key="question.text"
              type="button"
            >
              {{ question.text }}
            </button>
          </div>
        </div>

      <hr class="my-3">

      <button
          @click="save()"
          class="btn btn-dark btn-lg mt-3"
          variant="success">
            <div class="d-flex">
              <div class="p-2">
                <BootstrapIcon class="mb-0" icon="box-arrow-down" size="2x" />
              </div>
              <div class="p-2">
                Fragebogen speichern
              </div>
            </div>            
      </button>
    </div>
  </div>
</template>

<script>
import CreateQuestionControl from "./CreateQuestionControl.vue";
import InfoTooltip from "./../util/InfoTooltip.vue";
import html2pdf from "html2pdf.js";
import QuestionnairePdf from "./../pdf/QuestionnairePdf.vue";
import QrCode from "../QrCode.vue";

export default {
  components: {
    CreateQuestionControl,
    InfoTooltip,
    html2pdf,
    QuestionnairePdf,
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
    setOwner() {
      let checked = document.getElementById("owner").checked
      // TODO: CS: Login management in order to retreive the email of the currently logged in physician
      // as first entry of check box
      // mock mail
      this.questionnaire.owner = checked ? "foo@bar.com" : ""
    },
    save() {
      document.getElementById("upload-error").style.display = "none";

      const characters = "ABCDEFGHKLMNPQRSTXYZabcdefghkmnpqrstxyz23456789";

      function generateString(length) {
        let result = "";
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
          result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
          );
        }

        return result;
      }

      let id = generateString(5);

      function getCheckedBoxes() {
        var checkboxes = document.querySelectorAll('input[type=checkbox]')
        var checkboxesChecked = [];

        for (var i = 0; i < checkboxes.length; i++) {
          if (checkboxes[i].checked) {
            checkboxesChecked.push(checkboxes[i]);
          }
        }

        return checkboxesChecked;
      }

      let checkedBoxes = getCheckedBoxes();

      // collect emails of selected owners in dropdown list in this.owner field
      for (var i = 0; i < checkedBoxes.length; i++) {
        this.questionnaire.owners.push(
          checkedBoxes[i].parentElement.getElementsByClassName("owner_mail")[0].textContent
        );
      }

      this.$store
        .dispatch("checkID", id)
        .then((res) => {
          if (res.status == true) {
            this.questionnaire.queID = id;
            this.qrlink = this.qrlink + this.questionnaire.queID;
            this.$store
              .dispatch("uploadQuestionnaire", {
                questionnaire: this.questionnaire,
              })
              .then(() => {
                window.scrollTo(0, 0);
                this.saved = true;
              })
              .catch(() => {
                document.getElementById("upload-error").style.display = "block";
              });
          } else {
            this.save();
          }
        })
        .catch(() => { });
    },
    restart() {
      this.questionnaire = {
        queID: "",
        title: "",
        elements: [],
        owners: []
      };
      this.saved = false;
    },
    async downloadPdf() {
      //this.$refs.html2Pdf.generatePdf();
      html2pdf(this.$refs.document, {
        margin: 1,
        filename: "document.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { dpi: 500, letterRendering: true },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
          putOnlyUsedFonts: "true",
        },
      });
    },
    getOwners() {
      this.$store.dispatch("getPublicKey", "")
        .then((res) => {
          res.data.forEach(element => {
            let owner = document.createElement('p')

            let input = document.createElement('input')
            let label = document.createElement('label')

            let owner_name = document.createElement("p")
            let owner_mail = document.createElement("p")

            input.type = "checkbox"

            owner_name.innerHTML = element.owner_name

            owner_mail.innerHTML = element.owner_mail
            owner_mail.classList.add("owner_mail")

            label.appendChild(owner_name)
            label.appendChild(owner_mail)

            owner.appendChild(input)
            owner.appendChild(label)

            document.getElementById("owner-list").appendChild(owner)
          });
        })
    }
  },
  beforeMount() {
    this.getOwners()
  }
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

/* .background-color {
  background: #11111111;
} */

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

.dropdown-owner {
    position: relative;
  }
  
  .dropdown-owner-content {
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    border: 1px solid #ccc;
    max-height: 200px;
    overflow-y: auto;
}

.dropdown-owner-content label {
    display: block;
    padding: 8px;
}

.dropdown-owner-content label:hover {
    background-color: #e0e0e0;
}

.dropdown-owner:hover .dropdown-owner-content {
    display: block;
}
</style>
