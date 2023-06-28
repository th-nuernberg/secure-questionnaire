//import Vue from 'vue';
import Vuex from "vuex";
import axios from "../axios-auth";
import { encryptAES, decryptAES, encryptRSA, decryptRSA } from "./encryption.js";

//Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    questionnaire: null,
    answers: {
      dateEntries: [
        {
          date: "",
          timeEntries: [
            {
              time: "",
              answers: [],
            },
          ],
        },
      ],
    },
    questionTypes: [
      { text: "Beschreibung", type: "description" },
      { text: "Freitext", type: "freetext" },
      { text: "Multiple Choice", type: "multchoice" },
      { text: "Single Choice", type: "singlechoice" },
      { text: "Uhrzeit (hh:mm)", type: "time_" },
      { text: "Zahl", type: "number" },
      { text: "Datum", type: "date" },
      { text: "Skala", type: "scale" },
    ],
    analyseObj: [],
  },
  getters: {
    getQuestionnaire: (state) => state.questionnaire,
    getAllQuestionnaire: (state) => state.questionnaire,
    getAllAnswers: (state) => state.answers,
    getQuestionTypes: (state) => state.questionTypes,
    getAnalyseObjects: (state) => state.analyseObj,

    getSingleAnswer: (_, getters) => (params) => {
      let entry = getters.getEntry(params);
      if (entry == undefined) return ""; //entry noch nicht vorhanden
      else {
        let answer = entry.answers.find((element) => element.id == params.id);
        if (answer == undefined) return ""; //answer noch nicht vorhanden
        return answer.value;
      }
    },

    getEntryAnswers: (_, getters) => (params) => {
      let entry = getters.getEntry(params);
      if (entry == undefined) return [];
      return entry.answers;
    },

    //gibt Entry zur�ck mit gesuchtem Datum und/oder Uhrzeit
    //wenn nur nach Datum gesucht wird (repeatingType == date) muss params.time = "" sein
    getEntry: (state) => (params) => {
      let date = state.answers.dateEntries.find(
        (element) => element.date == params.date
      );
      if (date == undefined) return undefined;
      return date.timeEntries.find((element) => element.time == params.time);
    },

    getQuestionText: (state) => (type) => {
      return state.questionTypes.find((element) => element.type == type).text;
    },
  },
  mutations: {
    setQuestionnaire(state, questionnaire) {
      state.questionnaire = questionnaire;
    },
    setAnswers(state, answers) {
      state.answers = answers;
    },
    resetAnswers(state) {
      state.answers = {
        dateEntries: [
          {
            date: "",
            timeEntries: [
              {
                time: "",
                answers: [],
              },
            ],
          },
        ],
      };
    },
    resetTimeEntries(state, index) {
      state.answers.dateEntries[index].timeEntries = [
        {
          time: "",
          answers: [],
        },
      ];
    },
    setAnalyseObjects(state, obj) {
      state.analyseObj = obj;
    },
  },
  actions: {
    uploadQuestionnaire(_, questionnaire) {
      //send Questionnaire to backend
      return new Promise((resolve, reject) => {
        axios
          .put("/questionnaire", questionnaire)
          .then(() => {
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },

    encryptAndUpload({ dispatch }, questionnaire) {
      let data = {
        answers: questionnaire.answers,
        id: questionnaire.answers.UUID,
        IV: [],
        owner: questionnaire.owner
      };

      return new Promise((resolve, reject) => {
        encryptAES(JSON.stringify(data.answers))
        .then((result) => {
          data.answers = Buffer.from(result.Cipher).toString("base64");
          data.IV = Buffer.from(result.IV).toString("base64");
          
            // only encrypt asymmetric if somebody owns the questionnaire (owner)
            if (data.owner) {
              encryptRSA(JSON.stringify(data.answers), questionnaire.key)
                .then((cipher) => {
                  data.answers = Buffer.from(cipher).toString("base64")
                })
                .catch(() => {
                  reject();
                });
              }
            // wartet der hier auf die RSA verschluesselung???
            dispatch("uploadAnswers", data)
              .then(() => {
                resolve(result.Key);
              })
              .catch(() => {
                reject();
              });
          })
          .catch(() => {
            reject();
          });
      });
    },

    uploadAnswers(_, data) {
      //send Answers to backend
      return new Promise((resolve, reject) => {
        axios
          .put("/answers", data)
          .then(() => {
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },

    getPatientQuestionnaire(_, id) {
      return new Promise((resolve, reject) => {
        axios
          .get("/questionnaire", { params: { queID: id } })
          .then((res) => {
            resolve(res.data);
          })
          .catch(() => {
            reject();
          });
      });
    },

    getAnswers({ commit, state }, infos) {
      return new Promise((resolve, reject) => {
        axios
          .get("/answers", { params: { queID: infos.id } })
          .then((questionnaire) => {

            let answersArray = Buffer.from(questionnaire.data.answers, "base64");
            
            //RSA 
            if (questionnaire.owner) {
              keyParams = window.localStorage.getItem(questionnaire.owner)

              // TODO: get passphrase via input  
              answersArray = decryptRSA(answersArray, keyParams, "1234567890")  
            }

            // AES
            let keyArray = Buffer.from(infos.key, "base64");
            let IVArray = Buffer.from(questionnaire.data.IV, "base64");

            decryptAES(keyArray, answersArray, IVArray).then((result) => {
              let parsed = JSON.parse(result);
              commit("setAnswers", parsed.answers);
              resolve(state.answers);
            });
          })
          .catch(() => {
            reject();
          });
      });
    },

    checkID(_, id) {
      return new Promise((resolve, reject) => {
        axios
          .get("/questionnaire/idcheck", { params: { queID: id } })
          .then((res) => {
            resolve(res.data);
          })
          .catch(() => {
            reject();
          });
      });
    },

    uploadPublicKey(_, data) {
      return new Promise((resolve, reject) => {
        axios
          .put("/keys", data)  // public key can later be retreived via email field included in data
          .then(() => {
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },

    getPublicKey(_, owner) {
      return new Promise((resolve, reject) => {
        axios
          .get("/keys", { params: { owner: owner } })
          .then((res) => {
            resolve(res);
          })
          .catch(() => {
            reject();
          });
      });
    }
  },
});
