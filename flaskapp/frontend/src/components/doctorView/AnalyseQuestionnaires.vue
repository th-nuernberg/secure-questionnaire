<template>
    <b-container :key="componentKey">
        <h2 class="mt-5">Ergebnisse</h2>
        <div v-if="loading" class="d-flex justify-content-center mb-3">
            <b-spinner style="width: 3rem; height: 3rem;"></b-spinner>
        </div>
        
        <div v-for="(que, index) in queIDs" class="mt-5">
            <div class="boxStyling">
                <b-row align-h="between">
                    <b-col>
                        <h5> {{title(que)}} ({{que}})</h5>
                    </b-col>
                    <b-col cols="auto">
                        <b-button class="exportBtn" variant="primary" @click="exportCSV(que)" pill v-b-tooltip.hover title="Download CSV">
                            <b-icon-download></b-icon-download>
                        </b-button>
                    </b-col>
                </b-row>


                <b-table id="table"
                         :items="answersFromOneQue(que)"
                         :fields="fieldsForOneQue(que)"
                         striped responsive>
                </b-table>
            </div>
        </div>

    </b-container>


</template>

<script>
    export default {
        name: "AnalyseQuestionnaires",
        data() {
            return {
                answers: {},
                queIDs: [],
                analyseObjects: [],
                tableData: {},
                componentKey: 0,
                fields: {},
                ques: {},
                loading: true
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
                return queID => this.tableData[queID];
            },
            fieldsForOneQue() {
                return queID => this.fields[queID];
            },
            title() {
                return queID => this.ques[queID].title;
            }
        },
        methods: {
            loadAnswers() {
                let promises = [];
                this.analyseObjects.forEach(obj => {
                    promises.push(this.$store.dispatch("getAnswers", obj)
                        .then((data) => {
                            if (data.queID in this.answers) {
                                this.answers[data.queID].push(data);
                            }
                            else {
                                this.answers[data.queID] = [data];
                                this.queIDs.push(data.queID)
                            }
                        })
                        .catch(() => {

                        }))
                })
                Promise.all(promises)
                    .then(() => {
                        this.setupTable();
                    })
                    .catch(() => {
                        //TODO: Fehlermeldung
                    })
            },

            setupTable() {
                this.queIDs.forEach(id => {
                    this.buildRows(id)
                        .then((rows) => {
                            this.tableData[id] = rows;
                            this.loading = false;
                            this.componentKey += 1; //to update the view
                        })
                })                
            },

            buildRows(queID) {
                return new Promise((resolve, reject) => {
                    let answers = this.answers[queID];
                    this.buildFields(queID)
                        .then(() => {
                            let rows = [];
                            answers.forEach(patientEntry => {
                                patientEntry.dateEntries.forEach(dateEntry => {
                                    dateEntry.timeEntries.forEach(timeEntry => {

                                        let row = {
                                            patientName: patientEntry.patientName,
                                            date: dateEntry.date,
                                            time: timeEntry.time
                                        };

                                        timeEntry.answers.forEach(answer => {
                                            if (typeof (answer.value) != "object") {
                                                row[answer.id] = answer.value
                                            }
                                            else {
                                                let value = "";
                                                answer.value.forEach(obj => {
                                                    value += obj;
                                                    value += ", ";
                                                })
                                                row[answer.id] = value.slice(0, -2);
                                            }
                                            
                                        })
                                        rows.push(row);

                                    })
                                })
                            })
                            resolve(rows);
                        })
                })

            },

            buildFields(queID) {
                return new Promise((resolve, reject) => {
                    this.loadQuestionnaire(queID)
                        .then(() => {
                            this.fields[queID] = [{
                                key: "patientName",
                                label: "Patientenname",
                                sortable: true
                            }];

                            if (this.ques[queID].repeatingType.includes("date")) {
                                this.fields[queID].push({
                                    key: "date",
                                    label: "Datum",
                                    sortable: true
                                });
                            }
                            if (this.ques[queID].repeatingType == "dateTime") {
                                this.fields[queID].push({
                                    key: "time",
                                    label: "Uhrzeit",
                                    sortable: true
                                });
                            }

                            //pro Frage eine Spalte in Tabelle hinzufügen
                            this.ques[queID].elements.forEach(question => {
                                if (question.type !== "description") {
                                    this.fields[queID].push({
                                        key: question.id.toString(),
                                        label: question.text
                                    });
                                }
                            })                           

                            resolve();
                        })
                        .catch(() => {
                            //TODO: Fehlermeldung
                        })
                })
            },

            loadQuestionnaire(queID) {
                return new Promise((resolve, reject) => {
                    this.$store.dispatch("getPatientQuestionnaire", queID)
                        .then((res) => {
                            this.ques[queID] = res;
                            resolve();
                        })
                })
            },

            exportCSV(queID) {
                let data = this.answersFromOneQue(queID);
                let str = '';
                let fields = this.fieldsForOneQue(queID);

                for (let i = 0; i < fields.length; i++) {
                    if (fields[i].label) {
                        str += fields[i].label.replace(";", ",") + ';';
                    }
                    else {
                        str += fields[i].key.replace(";", ",") + ';';
                    }
                }
                str += '\n';

                for (let i = 0; i < data.length; i++) {
                    let line = '';
                    for (let j = 0; j < fields.length; j++) {
                        if (data[i][fields[j].label]) {
                            str += data[i][fields[j].label].replace(";", ",");
                        }
                        else if (data[i][fields[j].key]) {
                            str += data[i][fields[j].key].replace(";", ",");
                        }
                        str += ' ;'
                    }

                    line.slice(0, line.Length - 1);
                    str += line + '\r\n';
                }

                var a = document.createElement('a');
                a.setAttribute("href", "data:text/csv;charset=utf-8," + escape(str));
                a.setAttribute('download', queID);

                a.click();
            },
        }
    }
</script>

<style scoped>
</style>