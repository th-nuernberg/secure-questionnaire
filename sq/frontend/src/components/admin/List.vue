<template>
  <div class="container">
    <h1>Fragebogenliste</h1>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Name</th>
          <th scope="col">Aktion</th>
        </tr>
      </thead>
      <tbody>
      <tr v-for="(obj, index) in allqs" :key="obj.id" align-v="center">
        <td>{{ obj.queID }}</td>
        <td>{{ obj.title || 'unknown' }}</td>
        <td>
          <button class="btn btn-primary" @click="deleteID(index)" variant="danger" size="sm">
            <!-- <i class="fas fa-trash"></i> -->
            delete
          </button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import OrderQuestionControl from "./OrderQuestionControl.vue";
import InfoTooltip from "../util/InfoTooltip.vue";
import html2pdf from "html2pdf.js";
import QuestionnairePdf from "../pdf/QuestionnairePdf.vue";
import QrCode from "../QrCode.vue";

export default {
  components: {
    OrderQuestionControl,
    InfoTooltip,
    html2pdf,
    QuestionnairePdf,
    QrCode,
  },
  data() {
    return {
      idsKeys: [],
      allqs: [],
      questionnaire: {
        queID: "",
        title: "",
        elements: [],
      },
      saved: false,
      qrlink: "https://kiz1.in.ohmportal.de/sq/respond",
      active: false,
    };
  },
  mounted() {
    this.$store.dispatch("getAllQuestionnaires").then(r => {
      this.allqs = r.questionnaires
    })
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

    deleteID(id) {
      this.$store.dispatch('deleteID', this.allqs[id]._id).then(() => this.allqs.splice(id, 1))
    }
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
