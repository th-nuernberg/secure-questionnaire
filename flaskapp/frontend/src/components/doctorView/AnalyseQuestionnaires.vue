<template>
  
  <div class="container" :key="componentKey">
    <h2 class="mt-5">Ergebnisse</h2>
    <div v-if="loggedIn">
      <!-- TODO: CS should not be queried if doctor already logged in with session -->
      <input id="password" placeholder="Bitte Passwort eingeben">
    </div>

    <div v-else="loading" class="d-flex justify-content-center mb-3">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>

    <div v-else v-for="(que, index) in queIDs" class="mt-5">
      <div class="boxStyling">
        <div class="row" align-h="between">
          <div class="col">
            <h5>{{ title(que) }} ({{ que }})</h5>
          </div>
          <div class="col" cols="auto">
            <button
              class="exportBtn"
              variant="primary"
              @click="exportCSV(que)"
              pill
              title="Download CSV"
            >
              <BootstrapIcon icon="download" size="2x" />
            </button>
          </div>
        </div>

        <table-lite
          :is-loading="table.isLoading"
          :columns="fieldsForOneQue(que)"
          :rows="answersFromOneQue(que)"
          :total="this.analyseObjects.length"
          :messages="table.messages"
          @is-finished="table.isLoading = false"
        ></table-lite>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive } from "vue";
import TableLite from "vue3-table-lite";

const sampleData1 = (offst, limit) => {
  offst = offst + 1;
  let data = [];
  for (let i = offst; i <= limit; i++) {
    data.push({
      id: i,
      name: "TEST" + i,
      email: "test" + i + "@example.com",
    });
  }
  return data;
};
// Fake Data for 'desc' sortable
const sampleData2 = (offst, limit) => {
  let data = [];
  for (let i = limit; i > offst; i--) {
    data.push({
      id: i,
      name: "TEST" + i,
      email: "test" + i + "@example.com",
    });
  }
  return data;
};

export default {
  name: "AnalyseQuestionnaires",

  components: { TableLite },
  setup() {
    // Table config
    const table = reactive({
      isLoading: false,
      columns: [],
      rows: [],
      totalRecordCount: 0,
      sortable: {
        order: "patientName",
        sort: "asc",
      },
    });
    /**
     * Search Event
     */
    const doSearch = (offset, limit, order, sort) => {
      table.isLoading = true;
      setTimeout(() => {
        table.isReSearch = offset == undefined ? true : false;
        if (offset >= 10 || limit >= 20) {
          limit = 20;
        }
        // if (sort == "asc") {
        // table.rows = sampleData1(offset, limit);
        // } else {
        // table.rows = sampleData2(offset, limit);
        // }

        //table.totalRecordCount = this.analyseObjects.length;
        table.sortable.order = order;
        table.sortable.sort = sort;
        table.isLoading = false;
      }, 600);
    };
    // First get data
    // doSearch(0, 10, 'id', 'asc');
    return {
      table,
      doSearch,
    };
  },
  data() {
    return {
      answers: {},
      queIDs: [],
      analyseObjects: [],
      tableData: {},
      componentKey: 0,
      fields: {},
      ques: {},
      loading: true,
      loggedIn: false
    };
  },
  created() {
    this.analyseObjects = this.$store.getters.getAnalyseObjects;
    if (this.analyseObjects.length >= 1) {
      this.loadAnswers();
    }
  },
  computed: {
    answersFromOneQue() {
      return (queID) => this.tableData[queID];
    },
    fieldsForOneQue() {
      return (queID) => this.fields[queID];
    },
    title() {
      return (queID) => this.ques[queID].title;
    },
  },
  methods: {
    loadAnswers() {
      let promises = [];
      this.analyseObjects.forEach((obj) => {
        promises.push(
          this.$store
            .dispatch("getAnswers", obj)
            .then((data) => {
              if (data.queID in this.answers) {
                this.answers[data.queID].push(data);
              } else {
                this.answers[data.queID] = [data];
                this.queIDs.push(data.queID);
              }
            })
            .catch(() => {})
        );
      });
      Promise.all(promises)
        .then(() => {
          this.setupTable();
        })
        .catch(() => {});
    },

    setupTable() {
      this.queIDs.forEach((id) => {
        this.buildRows(id).then((rows) => {
          this.tableData[id] = rows;
          this.loading = false;
          this.componentKey += 1; //to update the view
        });
      });
    },

    buildRows(queID) {
      return new Promise((resolve, reject) => {
        let answers = this.answers[queID];
        this.buildFields(queID).then(() => {
          let rows = [];
          answers.forEach((patientEntry) => {
            patientEntry.dateEntries.forEach((dateEntry) => {
              dateEntry.timeEntries.forEach((timeEntry) => {
                let row = {
                  patientName: patientEntry.patientName,
                  date: dateEntry.date,
                  time: timeEntry.time,
                };

                timeEntry.answers.forEach((answer) => {
                  if (typeof answer.value != "object") {
                    row[answer.id] = answer.value;
                  } else {
                    let value = "";
                    answer.value.forEach((obj) => {
                      value += obj;
                      value += ", ";
                    });
                    row[answer.id] = value.slice(0, -2);
                  }
                });
                rows.push(row);
              });
            });
          });
          resolve(rows);
        });
      });
    },

    buildFields(queID) {
      return new Promise((resolve, reject) => {
        this.loadQuestionnaire(queID)
          .then(() => {
            this.fields[queID] = [
              {
                field: "patientName",
                label: "Patientenname",
                sortable: false,
              },
            ];

            if (this.ques[queID].repeatingType.includes("date")) {
              this.fields[queID].push({
                field: "date",
                label: "Datum",
                sortable: false,
              });
            }
            if (this.ques[queID].repeatingType == "dateTime") {
              this.fields[queID].push({
                field: "time",
                label: "Uhrzeit",
                sortable: false,
              });
            }

            //pro Frage eine Spalte in Tabelle hinzuf�gen
            this.ques[queID].elements.forEach((question) => {
              if (question.type !== "description") {
                this.fields[queID].push({
                  field: question.id.toString(),
                  label: question.text,
                });
              }
            });

            resolve();
          })
          .catch(() => {});
      });
    },

    loadQuestionnaire(queID) {
      return new Promise((resolve, reject) => {
        this.$store.dispatch("getPatientQuestionnaire", queID).then((res) => {
          this.ques[queID] = res;
          resolve();
        });
      });
    },

    exportCSV(queID) {
      let data = this.answersFromOneQue(queID);
      let str = "";
      let fields = this.fieldsForOneQue(queID);

      for (let i = 0; i < fields.length; i++) {
        if (fields[i].label) {
          str += fields[i].label.replace(";", ",") + ";";
        } else {
          str += fields[i].key.replace(";", ",") + ";";
        }
      }
      str += "\n";

      for (let i = 0; i < data.length; i++) {
        let line = "";
        for (let j = 0; j < fields.length; j++) {
          if (data[i][fields[j].field]) {
            str += data[i][fields[j].field].replace(";", ",");
          } else if (data[i][fields[j].key]) {
            str += data[i][fields[j].key].replace(";", ",");
          }
          str += " ;";
        }

        line.slice(0, line.length - 1);
        str += line + "\r\n";
      }

      var a = document.createElement("a");
      a.setAttribute("href", "data:text/csv;charset=utf-8," + escape(str));
      a.setAttribute("download", queID);

      a.click();
    },
  },
};
</script>

<style scoped></style>
