<template>
    <div v-if="!saved">
        <div class="container">
            <h1>Fragebogen erstellen</h1>
            <div>
                <div class="mb-2">
                    <label>Titel: </label>
                    <input type="text"  v-model="questionnaire.title"  >
                </div>
                <div class="row g-5">
                  <h4 class="fw-bold"></h4>
                  <form class="px-2" text-align="left" action="">
                    <p class="fw-bold">Geben Sie an, ob der Patient den Fragebogen einmalig oder mehrmals ausfüllen soll. Falls es sich um einen wiederholenden Fragebogen handelt, müssen Sie angeben, in welchem Intervall der Fragebogen ausgefüllt werden soll.</p>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" name="exampleForm" id="checkbox_single" />
                      <label class="form-check-label" margin-left="20px" for="checkbox_single">
                        Einmalig
                      </label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" name="exampleForm" id="checkbox_date" />
                      <label class="form-check-label" margin-left="20px" for="checkbox_date">
                        Wiederholend (Datum)
                      </label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" name="exampleForm" id="checkbox_dateTime" />
                      <label class="form-check-label" margin-left="20px" for="checkbox_dateTime">
                        Wiederholend (Datum und Uhrzeit)
                      </label>
                    </div>
                  </form>
                </div>

                <div v-for="question in questionnaire.elements" :key="question.id" :class="[question.id % 2 == 0 ? 'background-color' : '', 'mb-3 p-3']">
                    <div class="row center">
                        <div class="col">
                            <create-question-control @deleteQuestion="deleteQuestion(question)"
                                                     @upwards="questionUpwards(question)"
                                                     @downwards="questionDownwards(question)">
                            </create-question-control>
                        </div>
                        <div class="col">
                            <label>{{question.id}}. Frage: {{questionText(question.type)}}</label>

                            <div class="form-floating">
                                <textarea class="form-control" v-if="question.type === 'description'" placeholder="Beschreibung/Anmerkungen/..." id="floatingTextarea2" style="height: 100px" ></textarea>
                                <input type="text" class="form-control" v-else v-model="question.text" placeholder="Bitte geben Sie eine Frage ein.">
                            </div>


                            <!--Multiple Choice / Single Choice-->
                            <span v-if="choiceQuestion(question.type)">
                                <span class="d-block mt-2">Optionen: </span>
                                <span v-for="(option, index) in question.options" :key="option.id">
                                    <input type="text" class="form-control" v-model="option.text"  :placeholder="'Option ' + (index + 1)">
                                    <button type="button" class="btn btn-outline-primary" v-if="index !== 0 && index !== 1"
                                              @click="deleteOption(question, option)"
                                              variant="danger" >
                                        Delete
                                    </button>
                                    <br />
                                </span>

                                <button type="button" class="btn btn-outline-primary" @click="addOption(question.id)">
                                    Add
                                </button>
                            </span>

                            <!--Skala-->
                            <span v-else-if="question.type == 'scale'">
                                <input class="mt-2 mb-2" placeholder="Beschreibung der Skala (optional)" v-model="question.description">
                                <span v-for="(option, index) in question.options" :key="option.id">
                                    <input v-model="option.text" class="mc-option mb-2" :placeholder="'Option ' + (index + 1)">
                                    <button v-if="index >= 2"
                                              @click="deleteOption(question, option)"
                                              variant="danger" size="sm">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                    <br />
                                </span>

                                <button @click="addOption(question.id)">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </span>
                        </div>
                    </div>
                </div>

                <div class="dropdown" >
                    <button class="btn btn-secondary dropdown-toggle" type="button" @click="toggle" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      Fragenmenue
                    </button>
                        <div v-if="active">
                          <button class="dropdown-item" @click="addQuestion(question.type)" v-for="question in questionTypes" :key="question.text" type="button" >
                            {{question.text}}
                          </button>
                        </div>
                </div>

                <button @click="save()" class="btn btn-secondary mt-5" variant="success">Fragebogen speichern</button>
                <div id="upload-error" style="display: none;">
                    <i class="fas fa-exclamation-circle"></i>
                    <p class="m-1 d-inline">Fehler beim Upload. Bitte versuchen Sie es erneut.</p>
                </div>
                
            </div>

        </div>
    </div>
    <div v-else class="saved">
        <div class="boxStyling mb-5">
            <h3 class="text-center mb-3">Erfolgreich gespeichert!</h3>
            <div class="row">
                <div class="col center">
                    <button type="button" class="btn btn-outline-primary" @click="downloadPdf()" variant="primary">
                        <b-icon-download></b-icon-download>
                        Infoblatt
                    </button>
                    <b-button @click="restart()" class="mt-3 btn-big" variant="outline-primary">Neuer Fragebogen</b-button>
                </div>
            </div>
        </div>

       <html2pdf :show-layout="false"
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
           <questionnaire-pdf slot="pdf-content" :content="qrlink" :queID="questionnaire.queID" :title="questionnaire.title"></questionnaire-pdf>
       </html2pdf>

        <div class="boxStyling">
            <section class="user-details p-5">
                <div class="text-center">
                    <h1>Infoblatt zum Fragebogen</h1>
                    <h1>{{questionnaire.title}}</h1>
                    <qr-code :content=qrlink class="qr"></qr-code>
                </div>
                <h4>1. Fragebogen öffnen</h4>
                <p>
                    Um den Fragebogen zu öffnen, scannen Sie den obigen QR-Code mit einem QR-Code-Scanner Ihrer Wahl.
                    Sie können dazu zum Beispiel Ihr Smartphone benutzen.
                </p>
                <p>Alternativ können Sie den QR-Code auch direkt auf www.website.de einscannen.</p>
                <p>Falls Sie keine Kamera zur Verfügung haben, können Sie auch folgenden Code unter www.website.de eingeben:</p>
                <div class="text-center">
                    <p class="font-weight-bold p-2 d-inline code">{{ questionnaire.queID }}</p>
                </div>
                <h4>2. Fragebogen ausfüllen</h4>
                <p>
                    Füllen Sie den Fragebogen nach Anweisungen des Arztes aus und speichern Sie ihn anschließend.
                    <br>Nach dem Speichern erhalten Sie eine weitere Datei mit einem neuen QR-Code, der genutzt werden kann, um Ihre verschlüsselten Antworten zu entschlüsseln.
                    <br>Mit diesem können Sie Ihre Antworten im Nachhinein bearbeiten und ergänzen.
                    <br> Beachten Sie, dass bei einer Änderung Ihrer Antworten aus Sicherheitsgründen immer ein neuer QR-Code erstellt wird und somit der alte QR-Code an Gültigkeit verliert.
                </p>
                <h4>3. Fragebogen auswerten</h4>
                <p>Bringen Sie den aktuellen QR-Code beim nächsten Termin mit, damit der Arzt Ihre Antworten auswerten kann.</p>
            </section>
        </div>
    </div>


    
</template>

<script>
    import CreateQuestionControl from './CreateQuestionControl.vue';
    import InfoTooltip from './../util/InfoTooltip.vue';
    import html2pdf from 'html2pdf';
    import QuestionnairePdf from './../pdf/QuestionnairePdf.vue';
    import QrCode from "../QrCode.vue"

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
                    queID: '',
                    title: '',
                    elements: []
                },
                saved: false,
                qrlink:'localhost:8080/patient/questionnaire/',
                active: false
            }
        },
        computed: {
            questionTypes() {

                return this.$store.getters.getQuestionTypes;

            },
            choiceQuestion() {
                return type => {
                    return type.includes('choice')
                }
            },
            questionText() {
                return type => {
                    return this.$store.getters.getQuestionText(type);
                }
            }
        },
        methods: {
            toggle () {
                  this.active = !this.active
                },
            addQuestion(type) {
                if (this.choiceQuestion(type) || type == "scale") {
                    this.questionnaire.elements.push({
                        type: type,
                        id: this.questionnaire.elements.length + 1,
                        options: [
                            { id: 1 },
                            { id: 2 }
                        ]
                    });
                }
                else {
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
                    text: '',
                    id: currentQuestion.options.length + 1
                });
            },
            deleteQuestion(question) {
                this.questionnaire.elements.splice(question.id - 1, 1);
                this.questionnaire.elements.forEach(question => {
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
                currentOptions.forEach(option => {
                    option.id = currentOptions.indexOf(option) + 1;
                });
            },
            save() {
                document.getElementById("upload-error").style.display = "none";

                const characters = 'ABCDEFGHKLMNPQRSTXYZabcdefghkmnpqrstxyz23456789';

                function generateString(length) {
                    let result = '';
                    const charactersLength = characters.length;
                    for (let i = 0; i < length; i++) {
                        result += characters.charAt(Math.floor(Math.random() * charactersLength));
                    }

                    return result;
                }

                let id = generateString(5);

                this.$store.dispatch("checkID", id)
                    .then((res) => {
                        if (res.status == true) {
                            this.questionnaire.queID = id;
                            this.qrlink = this.qrlink + this.questionnaire.queID;
                            this.$store.dispatch("uploadQuestionnaire", {
                                "questionnaire": this.questionnaire
                            })
                                .then(() => {
                                    window.scrollTo(0, 0);
                                    this.saved = true;
                                })
                                .catch(() => {
                                    document.getElementById("upload-error").style.display = "block";
                                })
                        } else {
                            this.save();
                        }
                    })
                    .catch(() => {
                    })
            },

            restart() {
                this.questionnaire = {
                    queID: '',
                    title: '',
                    elements: []
                };
                this.saved = false;
            },
            async downloadPdf() {
                //this.$refs.html2Pdf.generatePdf();
            },
        },
    }
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

    input[type="text"], textarea {

        background-color : #11111111;
        margin-left: 10px;
        color: black;
    }

    form[class="px-2"]
    {
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

    .saved {
        max-width: 1000px;
        margin-right: auto;
        margin-left: auto;
        margin-top: 40px;
    }
</style>