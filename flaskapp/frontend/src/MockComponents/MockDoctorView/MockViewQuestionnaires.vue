<template>
  <div class="container">
    <h1>Fragebogenliste</h1>

    <div class="col">
      <h4>Folgende Bögen wurden erstellt</h4>

      <div class="ids">
        <div
          class="row"
          v-for="(obj, index) in allquestionnaire"
          :key="obj.id"
          align-v="center"
        >
          <div class="col">
            {{ obj.title }}
          </div>
          <div class="col">
            <button
              class="btn btn-primary"
              @click="deleteID(index)"
              variant="danger"
              size="sm"
            >
              <!-- <i class="fas fa-trash"></i> -->
              delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CreateQuestionControl from "./CreateQuestionControl.vue";
import InfoTooltip from "../util/InfoTooltip.vue";
import html2pdf from "html2pdf.js";
import QuestionnairePdf from "../pdf/QuestionnairePdf.vue";
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
      idsKeys: [],
      questionnaire: {
        queID: "",
        title: "",
        elements: [],
      },
      saved: false,
      qrlink: "localhost:8080/patient/questionnaire/",
      active: false,
    };
  },
  computed: {
    allquestionnaire() {
      return this.$store.getters.getAllQuestionnaire;
    },
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
        .catch(() => {});
    },

    restart() {
      this.questionnaire = {
        queID: "",
        title: "",
        elements: [],
      };
      this.saved = false;
    },
  },
};
</script>

<style scoped>
label {
  font-weight: bold;
}

.mc-option {
  display: inline;
  width: 50%;
  margin-right: 10px;
}

input[type="text"],
textarea {
  background-color: #11111111;
  margin-left: 10px;
  color: black;
}

form[class="px-2"] {
  text-align: left;
}

.background-color {
  background: #11111111;
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
</style>
