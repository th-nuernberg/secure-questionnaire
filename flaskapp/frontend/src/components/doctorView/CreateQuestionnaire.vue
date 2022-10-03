<template>
    <div v-if="!saved">
        <b-container class="mt-5">
            <h1>Fragebogen erstellen</h1>
            <b-form> 
                <b-form-group class="mb-2">
                    <label>Titel:</label>
                    <b-form-input v-model="questionnaire.title"></b-form-input>
                </b-form-group>

                <b-form-radio-group v-model="questionnaire.repeatingType">
                    <label>Bitte wählen Sie die Art des Fragebogens aus: 
                        <info-tooltip msg="Geben Sie an, ob der Patient den Fragebogen einmalig oder mehrmals ausfüllen soll. Falls es sich um einen wiederholenden Fragebogen handelt, müssen Sie angeben, in welchem Intervall der Fragebogen ausgefüllt werden soll."></info-tooltip>
                    </label>
                    <b-form-radio value="single">Einmalig</b-form-radio>
                    <b-form-radio value="date">Wiederholend (Datum)</b-form-radio>
                    <b-form-radio value="dateTime">Wiederholend (Datum und Uhrzeit)</b-form-radio>
                </b-form-radio-group>

                <b-form-group v-for="question in questionnaire.elements" :key="question.id" :class="[question.id % 2 == 0 ? 'background-color' : '', 'mb-3 p-3']">
                    <b-row align-v="center">
                        <b-col cols="auto">
                            <create-question-control @deleteQuestion="deleteQuestion(question)"
                                                     @upwards="questionUpwards(question)"
                                                     @downwards="questionDownwards(question)">
                            </create-question-control>
                        </b-col>
                        <b-col>
                            <label>{{question.id}}. Frage: {{questionText(question.type)}}</label>

                            <b-form-textarea v-if="question.type === 'description'" v-model="question.text" placeholder="Beschreibung/Anmerkungen/..." rows="3"></b-form-textarea>
                            <b-form-input v-else v-model="question.text" placeholder="Bitte geben Sie eine Frage ein."></b-form-input>

                            <!--Multiple Choice / Single Choice-->
                            <span v-if="choiceQuestion(question.type)">
                                <span class="d-block mt-2">Optionen: </span>
                                <span v-for="(option, index) in question.options" :key="option.id">
                                    <b-form-input v-model="option.text" class="mc-option mb-2" :placeholder="'Option ' + (index + 1)"></b-form-input>
                                    <b-button v-if="index !== 0 && index !== 1"
                                              @click="deleteOption(question, option)"
                                              variant="danger" size="sm">
                                        <i class="fas fa-trash"></i>
                                    </b-button>
                                    <br />
                                </span>

                                <b-button @click="addOption(question.id)">
                                    <i class="fas fa-plus"></i>
                                </b-button>
                            </span>

                            <!--Skala-->
                            <span v-else-if="question.type == 'scale'">
                                <b-form-input class="mt-2 mb-2" placeholder="Beschreibung der Skala (optional)" v-model="question.description"></b-form-input>
                                <!--<span class="skala">
        Skala von
        <vue-number-input class="skalaInput"
                          v-model="question.from"
                          controls inline center size="small" rounded
                          placeholder="von">
        </vue-number-input>
        bis
        <vue-number-input class="skalaInput"
                          v-model="question.to"
                          controls inline center size="small" rounded
                          placeholder="bis">
        </vue-number-input>
    </span>
    <vue-number-input :min="1"
                      v-model="question.step"
                      controls inline center size="small" rounded
                      placeholder="Schrittweite">
    </vue-number-input>-->
                                <span v-for="(option, index) in question.options" :key="option.id">
                                    <b-form-input v-model="option.text" class="mc-option mb-2" :placeholder="'Option ' + (index + 1)"></b-form-input>
                                    <b-button v-if="index >= 2"
                                              @click="deleteOption(question, option)"
                                              variant="danger" size="sm">
                                        <i class="fas fa-trash"></i>
                                    </b-button>
                                    <br />
                                </span>

                                <b-button @click="addOption(question.id)">
                                    <i class="fas fa-plus"></i>
                                </b-button>
                            </span>
                        </b-col>
                    </b-row>
                </b-form-group>


                <div class="mt-3 mb-3">
                    <b-dropdown text="Frage hinzufügen" variant="primary">
                        <b-dropdown-item-button v-for="question in questionTypes" :key="question.text" @click="addQuestion(question.type)">
                            {{question.text}}
                        </b-dropdown-item-button>
                    </b-dropdown>
                </div>

                <b-button @click="save()" class="mt-5" variant="success">Fragebogen speichern</b-button>
                <div id="upload-error" style="display: none;">
                    <i class="fas fa-exclamation-circle"></i>
                    <p class="m-1 d-inline">Fehler beim Upload. Bitte versuchen Sie es erneut.</p>
                </div>
                
            </b-form>

        </b-container>
    </div>
    <div v-else class="saved">
        <div class="boxStyling mb-5">
            <h3 class="text-center mb-3">Erfolgreich gespeichert!</h3>
            <b-row>
                <b-col class="text-center">
                    <b-button @click="downloadPdf()" class="mt-3 btn-big btnPDF" variant="primary">
                        <b-icon-download></b-icon-download>
                        Infoblatt
                    </b-button>
                    <b-button @click="restart()" class="mt-3 btn-big" variant="outline-primary">Neuer Fragebogen</b-button>
                </b-col>
            </b-row>
        </div>

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
            <questionnaire-pdf slot="pdf-content" :content="qrlink" :queID="questionnaire.queID" :title="questionnaire.title"></questionnaire-pdf>
        </vue-html2pdf>

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
    import VueHtml2pdf from 'vue-html2pdf';
    import QuestionnairePdf from './../pdf/QuestionnairePdf.vue';
    import QrCode from "@/components/QrCode"

    export default {
        components: {
            CreateQuestionControl,
            InfoTooltip,
            VueHtml2pdf,
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
                qrlink:'localhost:8080/patient/questionnaire/'
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
                this.$refs.html2Pdf.generatePdf();
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