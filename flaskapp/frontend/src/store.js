//import Vue from 'vue';
import Vuex from "vuex";
import axios from "../axios-auth";
import { encryptAES, decryptAES, encryptRSA, decryptRSA } from "./encryption.js";
import { isValidJwt, EventBus } from "./utils";


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
    user: {},
    jwt: ""
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
    uploadQuestionnaire(_, questionnaire, jwt) {
      //send Questionnaire to backend
      return new Promise((resolve, reject) => {
        axios
          .put("/questionnaire", questionnaire, { headers: { Authorization: `Bearer: ${jwt}` } })
          .then(() => {
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },

    encryptAndUpload({ dispatch }, info, jwt) {
      let data = {
        answers: info.answers,
        id: info.answers.UUID,
        IV: [],
        owners: info.owners
      };

      return new Promise((resolve, reject) => {
        encryptAES(JSON.stringify(data.answers))
          .then((result) => {
            data.answers = Buffer.from(result.Cipher).toString("base64");
            data.IV = Buffer.from(result.IV).toString("base64");

            // Encrypt single AES key with every public key of given owners each
            // https://stackoverflow.com/questions/49497489/encrypt-to-multiple-public-keys-with-rsa-using-webcrypto
            info.owners.forEach((owner) => {
              dispatch("getPublicKey", owner)
              .then((publicKey) => {
                // TODO: CS: string encoding eigl unnoetig, encryption umbauen, funktioniert im moment nur auf strings... 
                encryptRSA(Buffer.from(result.Key).toString("base64"), Buffer.from(publicKey.data, "base64"))
                .then((encryptedAESKey) => {
                  return new Promise((resolve, reject) => {
                    axios.put("/AESkeys", 
                      {
                        encryptedAESKey: Buffer.from(encryptedAESKey).toString("base64"),
                        owner_mail: owner,
                        queID: data.id
                      }, 
                      { headers: { Authorization: `Bearer: ${jwt}` } }
                    ) 
                    .then(() => {
                      resolve();
                    })
                    .catch(() => {
                      reject();
                    });
                  });
                })
              })
            })
            
            dispatch("uploadAnswers", data)
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
        })
    },

    uploadAnswers(_, data, jwt) {
      //send Answers to backend
      return new Promise((resolve, reject) => {
        axios
          .put("/answers", data, { headers: { Authorization: `Bearer: ${jwt}` } })
          .then(() => {
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },

    getPatientQuestionnaire(_, id, jwt) {
      return new Promise((resolve, reject) => {
        axios
          .get("/questionnaire", { params: { queID: id }, headers: { Authorization: `Bearer: ${jwt}` } })
          .then((res) => {
            resolve(res.data);
          })
          .catch(() => {
            reject();
          });
      });
    },

    getAnswers({ commit, state }, info, jwt) {
      return new Promise((resolve, reject) => {
        axios
          .get("/answers", { params: { queID: info.id }, headers: { Authorization: `Bearer: ${jwt}` } })
          .then((res) => {
            // TODO: CS: temporaer als proof of concept email und password aus local storage...
            // natuerlich null sicher...
            // -> eigl dann per Session erkennen welcher Nutzer und passenden Key aus DB holen

            let user_details = JSON.parse(window.localStorage.getItem("user_details"))
            
            axios.get("/AESkeys", { params: { queID: info.id, owner_mail: user_details.user_mail }, headers: { Authorization: `Bearer: ${jwt}` } }) 
              .then((encryptedAESKeyObject) => {
                let keyParams = JSON.parse(window.localStorage.getItem(user_details.user_mail))
                
                // convert to Uint8Array, for handling in decryption methods
                let encryptedAESKey = Buffer.from(encryptedAESKeyObject.data, 'base64');
                keyParams.salt = Buffer.from(keyParams.salt, "base64")
                keyParams.wrappingIv = Buffer.from(keyParams.wrappingIv, "base64")
                keyParams.wrappedPrivateKey = Buffer.from(keyParams.wrappedPrivateKey, "base64").buffer
                
                return decryptRSA(encryptedAESKey, keyParams, user_details.user_password)
                .then((decryptedAESKey) => {
                  // let decryptedAESKey = new TextEncoder().encode(result)
                  
                  // TODO: CS: string encoding eigl unnoetig, decryption umbauen, gitb im moment strings aus...
                  let keyArray = Buffer.from(decryptedAESKey, 'base64')
                  let IVArray = Buffer.from(res.data.IV, 'base64')
                  let answersArray = Buffer.from(res.data.answers, 'base64')
                  
                  return decryptAES(keyArray, answersArray, IVArray)
                  .then((result) => {
                    return JSON.parse(result)
                  })
                })
              })
              .then((parsed) => {
                commit("setAnswers", parsed)
                resolve(state.answers)
              })
          })
          .catch(() => {
            reject();
          });
      });
    },

    checkID(_, id, jwt) {
      return new Promise((resolve, reject) => {
        axios
          .get("/questionnaire/idcheck", { params: { queID: id, headers: { Authorization: `Bearer: ${jwt}` } } })
          .then((res) => {
            resolve(res.data);
          })
          .catch(() => {
            reject();
          });
      });
    },

    uploadPublicKey(_, data, jwt) {
      return new Promise((resolve, reject) => {
        axios
          .put("/RSAkeys", data, { headers: { Authorization: `Bearer: ${jwt}` } }) 
          .then(() => {
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },

    getPublicKey(_, owner_mail, jwt) {
      return new Promise((resolve, reject) => {
        axios
          .get("/RSAkeys", { params: { owner_mail: owner_mail, headers: { Authorization: `Bearer: ${jwt}` } } })
          .then((res) => {
            resolve(res);
          })
          .catch(() => {
            reject();
          });
      });
    },

    authenticate (userData) {
      return axios.post("/login", userData)
    },
    
    register (userData) {
      return axios.post("/register", userData)
    }
  },
});
