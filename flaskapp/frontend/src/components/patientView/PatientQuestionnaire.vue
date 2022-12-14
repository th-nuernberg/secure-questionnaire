<template>
    <b-container v-if="pageState === 'loading'">
        <div class="text-center mt-5">
            <b-spinner variant="primary"></b-spinner>
        </div>
    </b-container>

    <b-container v-else-if="pageState === 'error'">
        <div class="text-center mt-5">
            <p>Fehler beim Laden</p>
            <b-button variant="primary" to="/patient">Zur Startseite</b-button>
        </div>
    </b-container>

    <b-container v-else-if="pageState === 'saved'">
        <div class="saved">
            <b-button variant="outline" @click="pageState='ready'" class="mb-4">
                <b-icon-arrow-left></b-icon-arrow-left>
                Zurück zum Fragebogen
            </b-button>

            <div class="boxStyling mb-5">
                <h3 class="text-center mb-3">Erfolgreich gespeichert!</h3>
                <p class="text-center mb-3">Laden Sie Ihren QR-Code herunter, um Ihre Antworten später noch einmal zu bearbeiten oder dem Arzt zeigen zu können.</p>

                <b-row>
                    <b-col class="text-center">
                        <b-button variant="primary" @click="downloadPdf()" class="mt-3 btn-big">
                            <b-icon-download></b-icon-download>
                            QR-Code
                        </b-button>
                    </b-col>
                </b-row>
            </div>

            <div class="boxStyling">
                <section class="user-details p-5">
                    <div class="text-center">
                        <h1>Ihr ausgefüllter Fragebogen</h1>
                        <qr-code class="qr" :content=content></qr-code>
                    </div>
                    <h4>1. Fragebogen öffnen</h4>
                    <p>
                        Um den Fragebogen zu bearbeiten, scannen Sie den QR-Code auf www.website.de ein.
                        <br>Sie werden automatisch zu Ihrem ausgefüllten Fragebogen weitergeleitet.
                    </p>
                    <h4>2. Fragebogen auswerten</h4>
                    <p>Bringen Sie diesen QR-Code beim nächsten Termin mit, damit der Arzt Ihre Antworten auswerten kann.</p>
                    <p>Beachten Sie, dass dieser QR-Code nur solange gültig ist, bis Sie die Antworten bearbeiten oder ergänzen und einen neuen Code bekommen.</p>
                    <h4>Wichtiger Hinweis:</h4>
                    <p>Mit diesem QR-Code kann Ihr ausgefüllter Fragebogen entschlüsselt werden und somit sensible Daten eingesehen werden.<br>Geben Sie Ihn nicht an Dritte weiter.</p>
                </section>
            </div>

            <h4>Infos:</h4>
            <h6>Was passiert mit meinen Daten?</h6>
            <p>
                Die Antworten werden ausschließlich verschlüsselt auf unserem Server gespeichert.
                <br>Der Schlüssel dazu wird in dem QR-Code gespeichert, damit nur Sie Zugriff auf Ihre Daten haben.
            </p>
            <h6>Warum bekomme Ich nach jedem Speichern einen neuen QR-Code?</h6>
            <p>
                Beim Speichern wird jedes Mal ein neuer, zufälliger Schlüssel generiert. Dies hat zur Folge, dass Ihre Antworten neu verschlüsselt werden und somit ein neuer QR-Code generiert wird.
                <br>Somit können wir gewährleisten, dass Ihre Daten zu jedem Zeitpunkt geschützt sind.
            </p>


            <b-button variant="outline-primary" @click="$router.push('/patient')">Zur Startseite</b-button>


            <vue-html2pdf :show-layout="false"
                          :float-layout="true"
                          :enable-download="false"
                          :preview-modal="true"
                          :paginate-elements-by-height="1400"
                          filename="QR-Code für Fragebogen"
                          :pdf-quality="2"
                          :manual-pagination="false"
                          pdf-format="a4"
                          pdf-orientation="portrait"
                          pdf-content-width="800px"
                          @hasStartedGeneration="hasStartedGeneration()"
                          @hasGenerated="hasGenerated($event)"
                          ref="html2Pdf">
                <answers-pdf slot="pdf-content" :answersID="answers.UUID" :repeating="questionnaire.repeatingType !== 'single'" :AESkey="AESkey"></answers-pdf>
            </vue-html2pdf>

        </div>
    </b-container>

    <b-container v-else>
        <b-form>
            <h1 class="mt-5">{{ questionnaire.title }}</h1>

            <b-row class="name mb-4 mt-4">
                <b-col>
                    <b-input class="boxStyling" v-model="patientName" @input="setName" placeholder="Bitte geben Sie Ihren Namen ein."></b-input>
                </b-col>
            </b-row>

            <tab-navigation v-if="questionnaire.repeatingType !== 'single'"
                            :entries="tabEntries"
                            :type="questionnaire.repeatingType"
                            class="boxStyling navigation">
            </tab-navigation>

            <Questions-Container v-else class="boxStyling" date="" time=""></Questions-Container>

            <div class="text-center">
                <b-button @click="save()" variant="success" class="btn-big">Speichern</b-button>
                <div id="upload-error" style="display: none;">
                    <i class="fas fa-exclamation-circle"></i>
                    <p class="m-1 d-inline">Fehler beim Upload. Bitte versuchen Sie es erneut.</p>
                </div>
            </div>

        </b-form>
    </b-container>
</template>

<script>

    import TabNavigation from "./TabNavigation.vue";
    import QuestionsContainer from "./QuestionsContainer.vue";
    import VueHtml2pdf from 'vue-html2pdf';
    import AnswersPdf from "./../pdf/AnswersPdf.vue"
    import QrCode from "../QrCode.vue"
    import { uuid } from 'vue-uuid';

    export default {
        components: {
            TabNavigation,
            QuestionsContainer,
            VueHtml2pdf,
            AnswersPdf,
            QrCode
        },

        data() {
            return {
                pageState: null,
                AESkey: [],
                patientName: ""
            };
        },

        computed: {
            questionnaire() {
                return this.$store.getters.getQuestionnaire;
            },
            answers() {
                return this.$store.getters.getAllAnswers;
            },
            tabEntries() {
                return this.answers.dateEntries;
            },
            content() {
                let qrcontent = {
                    ID: this.answers.UUID,
                    key: Buffer.from(this.AESkey).toString('base64'),
                }
                return JSON.stringify(qrcontent);
            }
        },

        created() {
            this.pageState = "loading";
            this.$store.dispatch("getPatientQuestionnaire", this.$route.params.id)
                .then((res) => {
                    this.$store.commit("setQuestionnaire", res);
                    this.patientName = this.answers.patientName;
                    this.pageState = "ready";
                })
                .catch(() => {
                    this.pageState = "error";
                })
        },

        beforeRouteLeave(to, from, next) {
            if (this.pageState !== "saved" && this.pageState !== "error" && this.pageState !== "loading") {
                let confirm = window.confirm("Sind Sie sicher, dass Sie die Seite verlassen wollen? Sie haben ungespeicherte Änderungen.")
                if (!confirm) return false;
                else {
                    this.$store.commit("resetAnswers");
                    next();
                }
            }
            next();
        },

        methods: {
            getInputFromChild(questionID, answer, dateIndex = 0, timeIndex = 0) {
                let currentEntry = this.answers.dateEntries[dateIndex].timeEntries[timeIndex].answers;
                let index = currentEntry.findIndex((element) => element.id === questionID);

                if (index == -1) {
                    currentEntry.push({
                        "id": questionID,
                        "value": answer
                    });
                }
                else { //vorhandene Antwort bearbeiten
                    currentEntry[index] = {
                        "id": questionID,
                        "value": answer
                    }
                }
                this.$store.commit("setAnswers", this.answers);
            },

            setName() {
                this.answers.patientName = this.patientName;
            },

            setDate(date, index) {
                this.answers.dateEntries[index].date = date;
                this.sortQuestionnaire();
                this.$store.commit("setAnswers", this.answers);
            },

            setTime(time, dateIndex, timeIndex) {
                this.answers.dateEntries[dateIndex].timeEntries[timeIndex].time = time;
                this.sortQuestionnaire();
                this.$store.commit("setAnswers", this.answers);
            },

            addDateEntry(date) {
                this.answers.dateEntries.push({
                    date: date,
                    timeEntries: [{
                        time: "",
                        answers: []
                    }]
                });
                this.sortQuestionnaire();
                this.$store.commit("setAnswers", this.answers);
            },

            addTimeEntry(dateIndex, time) {
                this.answers.dateEntries[dateIndex].timeEntries.push({
                    time: time,
                    answers: []
                });
                this.sortQuestionnaire();
                this.$store.commit("setAnswers", this.answers);
            },

            deleteEntry(date) {
                this.answers.dateEntries = this.answers.dateEntries.filter(item => item.date != date);
                this.sortQuestionnaire();
                this.$store.commit("setAnswers", this.answers);
            },

            deleteTimeEntry(dateIndex, timeIndex) {
                this.answers.dateEntries[dateIndex].timeEntries.splice(timeIndex, 1);
                this.sortQuestionnaire();
                this.$store.commit("setAnswers", this.answers);
            },

            sortQuestionnaire() {

                function sort_by_date(a, b) {
                    let a_date = a.date;
                    let b_date = b.date;

                    let a_split = a_date.split(".")
                    let b_split = b_date.split(".")

                    let a_newDate = a_split[1] + "/" + a_split[0] + "/" + a_split[2]
                    let b_newDate = b_split[1] + "/" + b_split[0] + "/" + b_split[2]

                    return new Date(a_newDate).getTime() - new Date(b_newDate).getTime();
                }

                function sort_by_time(a, b) {
                    if (a.time == "") {
                        return 0;
                    }
                    else {
                        let a_time = parseFloat(a.time.replace(":", "")) 
                        let b_time = parseFloat(b.time.replace(":", ""))

                        return a_time - b_time;
                    }
                }

                for (let i = 0; i <= this.answers.dateEntries.length - 1; i++) {
                    this.answers.dateEntries[i].timeEntries.sort(sort_by_time)
                }
                this.answers.dateEntries.sort(sort_by_date)
            },

            save() {
                document.getElementById("upload-error").style.display = "none";

                this.sortQuestionnaire()

                this.answers.queID = this.questionnaire.queID;
                if (this.answers.UUID === undefined) {
                    this.answers.UUID = uuid.v4();
                }
                this.$store.dispatch("encryptAndUpload", {
                    "answers": this.answers 
                })
                    .then((result) => {
                        this.AESkey = result;
                        window.scrollTo(0, 0);
                        this.pageState = "saved";
                    })
                    .catch(() => {
                        document.getElementById("upload-error").style.display = "block";
                    })
            },

            async downloadPdf() {
                this.$refs.html2Pdf.generatePdf();
            },
        },
    };
</script>


<style scoped lang="scss">

    .question {
        padding-top: 15px;
        padding-bottom: 15px;
    }

    #upload-error {
        color: red;
        margin-top: 5px;
    }

    .name {
        .form-control {
            max-width: 400px;
        }
    }

    .saved {
        max-width: 1000px;
        margin-right: auto;
        margin-left: auto;
        margin-top: 40px;
    }

    .navigation {
        padding: 15px 0;
    }

    .qr {
        width: 300px;
        height: 300px;
        margin-right: auto;
        margin-left: auto;
        margin-top: 50px;
        margin-bottom: 50px;
    }

    .code {
        border-radius: 10px;
        border: 2px solid black;
    }

    h4 {
        margin-top: 20px;
    }
</style> 