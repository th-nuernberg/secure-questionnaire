//import Vue from 'vue';

import Vuex from "vuex";
import axios from "../axios-auth";
import { encryptAES, decryptAES, encryptRSA, decryptRSA } from "./encryption.js";
import { isValidJwt } from "./utils";


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
    privateKeyParams: [],
    jwt: { "token": sessionStorage.getItem("token") }
  },
  getters: {
    getQuestionnaire: (state) => state.questionnaire,
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
    isAuthenticated(state) {
      return isValidJwt(state.jwt.token)
    }
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
    setPrivateKeyParams(state, privateKeyParams) {
      state.privateKeyParams = privateKeyParams
    },
    setJwtToken(state, payload) {
      sessionStorage.token = payload.jwt.token
      state.jwt = payload.jwt
    }
  },
  actions: {
    uploadQuestionnaire({ state }, questionnaire) {
      //send Questionnaire to backend
      return new Promise((resolve, reject) => {
        axios
          .put("questionnaire", questionnaire, { headers: { Authorization: `Bearer: ${state.jwt.token}` } })
          .then(() => {
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },

    encryptAndUpload({ dispatch, state }, info) {
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
                encryptRSA(Buffer.from(result.Key).toString("base64"), Buffer.from(publicKey.data, "base64"))
                .then((encryptedAESKey) => {
                  return new Promise((resolve, reject) => {
                    axios.put("AESkeys", 
                      {
                        encryptedAESKey: Buffer.from(encryptedAESKey).toString("base64"),
                        owner_mail: owner,
                        queID: data.id
                      }, 
                      { headers: { Authorization: `Bearer: ${state.jwt.token}` } }
                    ) 
                    .then(() => {
                      resolve();
                    })
                    .catch(() => {
                      reject();
                    });
                  });
                })
              }).catch((e) => { console.log(e) })
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

    uploadAnswers({ state }, data) {
      //send Answers to backend
      return new Promise((resolve, reject) => {
        axios
          .put("response/"+data.id, data, { headers: { Authorization: `Bearer: ${state.jwt.token}` } })
          .then(() => {
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },

    getAllQuestionnaires({ state }) {
      return new Promise((resolve, reject) => {
        axios
          .get("questionnaire/", { headers: { Authorization: `Bearer: ${state.jwt.token}` } })
          .then((res) => {
            resolve(res.data);
          })
          .catch(() => {
            reject();
          });
      });
    },

    getPatientQuestionnaire({ state }, id) {
      return new Promise((resolve, reject) => {
        axios
          .get("questionnaire/" + id, { headers: { Authorization: `Bearer: ${state.jwt.token}` } })
          .then((res) => {
            resolve(res.data);
          })
          .catch(() => {
            reject();
          });
      });
    },

    deleteID({state}, id) {
      return axios.delete("questionnaire/" + id, { headers: { Authorization: `Bearer: ${state.jwt.token}` } });
    },

    getAnswers({ commit, state }, info) {
      return new Promise((resolve, reject) => {
        axios
          .get("response/" + info.id, {headers: { Authorization: `Bearer: ${state.jwt.token}` } })
          .then((res) => {
            axios.get("userDetails", { headers: { Authorization: `Bearer: ${state.jwt.token}` } })
            .then((details) => {
              let user_details = details.data

              axios.get("AESkeys", { params: { queID: info.id, owner_mail: user_details.owner_mail }, headers: { Authorization: `Bearer: ${state.jwt.token}` } }) 
                .then((encryptedAESKeyObject) => {
                  let keyParams = state.privateKeyParams
  
                  // Convert to Uint8Array, for handling in decryption methods
                  let encryptedAESKey = Buffer.from(encryptedAESKeyObject.data, 'base64')
                  keyParams.salt = Buffer.from(keyParams.salt, "base64")
                  keyParams.wrappingIv = Buffer.from(keyParams.wrappingIv, "base64")
                  keyParams.wrappedPrivateKey = Buffer.from(keyParams.wrappedPrivateKey, "base64").buffer
                  
                  return decryptRSA(encryptedAESKey, keyParams, user_details.password)
                  .then((decryptedAESKey) => {
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
          })
          .catch(() => {
            reject();
          });
      });
    },

    checkID({ state }, id) {
      return new Promise((resolve, reject) => {
        axios
          .get("questionnaire/idcheck", { params: { queID: id }, headers: { Authorization: `Bearer: ${state.jwt.token}`} })
          .then((res) => {
            resolve(res.data);
          })
          .catch(() => {
            reject();
          });
      });
    },

    uploadPublicKey({ state }, data) {
      return new Promise((resolve, reject) => {
        axios
          .put("RSAkeys", data, { headers: { Authorization: `Bearer: ${state.jwt.token}` } }) 
          .then(() => {
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },

    getPublicKey({ state }, owner) {
      return new Promise((resolve, reject) => {
        axios
          .get("RSAkeys", { params: { owner_mail: owner}, headers: { Authorization: `Bearer: ${state.jwt.token}`} })
          .then((res) => {
            resolve(res);
          })
          .catch(() => {
            reject();
          });
      });
    },

    getUserDetails({ state }) {
      return new Promise((resolve, reject) => {
        axios
          .get("userDetails", { headers: { Authorization: `Bearer: ${state.jwt.token}` } })
          .then((res) => {
            resolve(res.data);
          })
          .catch(() => {
            reject();
          });
      });
    },

    login_admin({ commit }, userData) {
      return new Promise((resolve, reject) => {
        axios
          .put("login", userData)
          .then((res) => {
            commit('setJwtToken', { jwt: res.data })
            resolve(res);
          })
          .catch(() => {
            reject();
          });
      });
    },

    async verifyPassword(_, userData) {
      return new Promise((resolve, reject) => {
        axios
          .put("verifyPassword", {
            owner_mail: userData.owner_mail,
            password: userData.password,
          })
          .then((res) => {
            resolve(res.data) 
          })
          .catch(() => {
            reject();
          });
      });
    },

    async login({ state, commit }, userData) {
      return axios.put("verify", {
        owner_mail: userData.owner_mail,
        spki_public_key: userData.publicKey,
        jwk_public_key_exponent: userData.publicExponent
      }).then((res) => {
        // let challenge = base64ToArrayBuffer(res.data.challenge)
        let challenge = Buffer.from(res.data.challenge, "base64")
        
        let keyParams = {}
        keyParams.salt = Buffer.from(state.privateKeyParams.salt, "base64")
        keyParams.wrappingIv = Buffer.from(state.privateKeyParams.wrappingIv, "base64")
        keyParams.wrappedPrivateKey = Buffer.from(state.privateKeyParams.wrappedPrivateKey, "base64").buffer
        
        return {
          keyParams: keyParams,
          challenge: challenge  
        }
      }).then((decryptionParams) => {
        // Decrypt secret
        decryptRSA(
          decryptionParams.challenge,
          decryptionParams.keyParams, 
          userData.password
        ).then((secret) => {
          return new Promise((resolve, reject) => {
            let payload = {
              owner_mail: userData.owner_mail,
              password: userData.password,
              secret: secret.toString("base64")
            }
    
            axios
              .put("login", payload)
              .then((loginResult) => {
                commit('setJwtToken', { jwt: loginResult.data })
                resolve(loginResult);
              })
              .catch(() => {
                reject();
              });
          });
        })
      })
    },
    
    register({ state }, userData) {
      return new Promise((resolve, reject) => {
        axios
          .put("register", userData, { headers: { Authorization: `Bearer: ${state.jwt.token}`} })
          .then((res) => {
            resolve(res);
          })
          .catch((res) => {
            reject(res);
          });
      });
    }
  },
});
