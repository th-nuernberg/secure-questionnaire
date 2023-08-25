//import Vue from 'vue';
import Vuex from "vuex";
import axios from "../axios-auth";
import { encryptAES, decryptAES, encryptRSA, decryptRSA } from "./encryption.js";


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

    encryptAndUpload({ dispatch }, info) {
      let data = {
        answers: info.answers,
        id: info.answers.UUID,
        IV: [],
      };

      encryptAES(JSON.stringify(data.answers))
        .then((result) => {
          data.answers = Buffer.from(result.Cipher).toString("base64");
          data.IV = Buffer.from(result.IV).toString("base64");

          // hier AES key auf alle RSA public keys verschluesseln

          
          
          //for owner in keys
          
          // TODO: CS: string encoding eigl unnoetig, encryption umbauen, funktioniert im moment nur auf strings... 
          encryptRSA(new TextDecoder().decode(result.Key), Buffer.from(info.key, "base64"))
          .then((result) => {
            data.answers = Buffer.from(result).toString("base64");
          })

          // {
          //   "queID": {
          //     "owner1@mail.com": "encrypted1",
          //     "owner2@mail.com": "encrypted2",
          //     ...
          //   }
          // }


          dispatch("uploadAnswers", data)
            .then(dispatch("uploadEncryptedAESKey", encryptedAESKeys))
            .then(() => {
              resolve();
            })
            .catch(() => {
              reject();
            });
        })
        .catch(() => {
          reject();
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

    uploadEncryptedAESKey(_, data) {
      return new Promise((resolve, reject) => {
        axios
          .put("/AESkeys", data)
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
          .then((res) => {




            // decrypt AES key....

            // TODO: CS: hardcoded owner ...
            //let keyParams = JSON.parse(window.localStorage.getItem(questionnaire.data.owner))
            let keyParams = JSON.parse(window.localStorage.getItem("foo@bar.com"))
          
            // convert to Uint8Array, for handling in decryption methods
            keyParams.salt = Buffer.from(keyParams.salt, "base64")
            keyParams.wrappingIv = Buffer.from(keyParams.wrappingIv, "base64")
            keyParams.wrappedPrivateKey = Buffer.from(keyParams.wrappedPrivateKey, "base64").buffer
            
            // TODO: CS: hardcoded passphrase
            decryptRSA(answersArray, keyParams, "1234567890")
            .then((result) => {
              let parsedKey = new TextEncoder().encode(result);

              commit("setAnswers", parsedKey);
              resolve(state.answers);
              })

            // decrypt AES key....






            let keyArray = Buffer.from(infos.key, 'base64');
            let IVArray = Buffer.from(res.data.IV, 'base64');
            let answersArray = Buffer.from(res.data.answers, 'base64');

            decryptAES(keyArray, answersArray, IVArray)
              .then((result) => {
                  let parsed = JSON.parse(result)
                  commit("setAnswers", parsed.answers);
                  resolve(state.answers);
              })
          })
          .catch(() => {
            reject();
          });
      });
    },

    // OUTCOMMENT
    // getAnswers({ commit, state }, infos) {
    //   return new Promise((resolve, reject) => {
    //     axios
    //       .get("/answers", { params: { queID: infos.id } })
    //       .then((res) => {
    //         let keyArray = Buffer.from(infos.key, "base64");
    //         let IVArray = Buffer.from(res.data.IV, "base64");
    //         let answersArray = Buffer.from(res.data.answers, "base64");

    //         decryptAES(keyArray, answersArray, IVArray).then((result) => {              
    //           // TODO: CS: hardcoded owner ...
    //           //let keyParams = JSON.parse(window.localStorage.getItem(questionnaire.data.owner))
    //           let keyParams = JSON.parse(window.localStorage.getItem("foo@bar.com"))
            
    //           // convert to Uint8Array, for handling in decryption methods
    //           keyParams.salt = Buffer.from(keyParams.salt, "base64")
    //           keyParams.wrappingIv = Buffer.from(keyParams.wrappingIv, "base64")
    //           keyParams.wrappedPrivateKey = Buffer.from(keyParams.wrappedPrivateKey, "base64").buffer
              
    //           // TODO: CS: hardcoded passphrase
    //           decryptRSA(new Uint8Array(Object.values(JSON.parse(result))), keyParams, "1234567890")
    //           .then((result) => {
    //             let parsed = JSON.parse(result);
                
    //             // TODO: CS: weird TEMPORARY fix
    //             parsed = { answers: parsed }
                
    //             if (questionnaire.data.owner != "") {
    //               commit("setAnswers", parsed.answers);
    //             } else {
    //               commit("setAnswers", questionnaire.data.answers);
    //             }

    //             resolve(state.answers);
    //             })
    //         });
    //       })
    //       .catch(() => {
    //         reject();
    //       });
    //   });
    // },

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
          .put("/RSAkeys", data) 
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
          .get("/RSAkeys", { params: { owner: owner } })
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
