<template>
    <div>
        <b-container>
            <b-row class="navigationMenu text-center" align-h="center">
                <b-col cols="2">
                    <b-button @click="back" :disabled="index === 0" class="btnNavigate" variant="outline-primary">
                        <b-icon-chevron-left font-scale="2"></b-icon-chevron-left>
                    </b-button>
                </b-col>
                <b-col cols="auto">
                    <b-button v-b-modal.calendar class="date btn-accent">
                        {{currentDate}}
                    </b-button>

                    <b-button-toolbar class="editBtnsGroup">
                        <b-button-group>
                            <b-button v-b-modal.editEntry size="sm" class="dateBtns btn-white" variant="outline">
                                <b-icon-pencil-fill></b-icon-pencil-fill>
                                <span class="d-none d-lg-inline"> Datum bearbeiten</span>
                            </b-button>
                            <b-button variant="outline" v-b-modal.deleteEntry size="sm" class="dateBtns btn-white">
                                <b-icon-trash></b-icon-trash>
                                <span class="d-none d-lg-inline"> Datum löschen</span>
                            </b-button>
                            <b-button @click="openAddingModal" size="sm" class="dateBtns btn-white" variant="outline">
                                <b-icon-plus-circle></b-icon-plus-circle>
                                <span class="d-none d-lg-inline"> Datum hinzufügen</span>
                            </b-button>
                        </b-button-group>
                    </b-button-toolbar>

                </b-col>
                <b-col cols="2">
                    <b-button @click="forward" :disabled="index === entries.length - 1" class="btnNavigate" variant="outline-primary">
                        <b-icon-chevron-right font-scale="2"></b-icon-chevron-right>
                    </b-button>
                </b-col>
            </b-row>

            <div class="questionsContainer">
                <Collapse-Navigation v-if="type == 'dateTime'"
                                     :entries="oneDay">

                </Collapse-Navigation>

                <Questions-Container v-else
                                     :date="date" :time="time" :key="date">
                </Questions-Container>
            </div>


        </b-container>

        <b-modal id="calendar" size="md"
                 hide-header hide-footer centered>
            <b-button @click="cancelModal" class="closeBtn btn-white" variant="outline"><b-icon-x-circle></b-icon-x-circle></b-button>

            <h4>Alle Einträge:</h4>
            <b-button v-for="entry in entries" :key="entry.date" @click="goTo(entry.date)" class="button-calendar">
                {{entry.date}}
            </b-button>
        </b-modal>

        <b-modal id="addEntry" size="md"
                 hide-header hide-footer centered>
            <h4>Datum hinzufügen:</h4>
            <b-input type="date" v-model="date"></b-input>
            <p id="dateError" style="display:none; color:red;">Bitte geben Sie ein Datum an.</p>
            <p id="dateExistsError" style="display:none; color:red;">Datum existiert bereits.</p>
            <b-row align-h="between" class="mt-3">
                <b-col cols="auto">
                    <b-button @click="cancelModal" variant="outline-danger">Abbrechen</b-button>
                </b-col>
                <b-col cols="auto">
                    <b-button @click="addDateEntry" variant="primary">Eintrag hinzufügen</b-button>
                </b-col>
            </b-row>

        </b-modal>

        <b-modal id="firstEntry" size="md"
                 hide-header hide-footer centered no-close-on-esc no-close-on-backdrop>
            <h4>Fügen Sie ein Datum hinzu, um mit dem Fragebogen zu starten:</h4>
            <b-input type="date" v-model="date"></b-input>
            <p id="dateError" style="display:none; color:red;">Bitte geben Sie ein Datum an.</p>
            <p id="dateExistsError" style="display:none; color:red;">Datum existiert bereits.</p>
            <b-row align-h="between" class="mt-3">
                <b-col cols="auto">
                    <b-button @click="$router.push('/patient')" variant="outline">Zurück zur Startseite</b-button>
                </b-col>
                <b-col cols="auto">
                    <b-button @click="setDate" variant="primary" :disabled="date == ''">Eintrag hinzufügen</b-button>
                </b-col>
            </b-row>
        </b-modal>

        <b-modal id="editEntry" size="md"
                 hide-header hide-footer centered>
            <h4>Datum bearbeiten</h4>
            <b-input type="date" v-model="date"></b-input>
            <p id="dateError" style="display:none; color:red;">Bitte geben Sie ein Datum an.</p>
            <p id="dateExistsError" style="display:none; color:red;">Datum existiert bereits.</p>
            <b-row align-h="between" class="mt-3">
                <b-col cols="auto">
                    <b-button @click="cancelModal" variant="outline-danger">Abbrechen</b-button>
                </b-col>
                <b-col cols="auto">
                    <b-button @click="setDate" variant="primary">Aktualisieren</b-button>
                </b-col>
            </b-row>
        </b-modal>

        <b-modal id="deleteEntry" size="md"
                 hide-header hide-footer centered>
            <h4>Wollen Sie diesen Eintrag wirklich löschen?</h4>
            <p>Alle Einträge zu diesem Datum werden dadurch gelöscht.</p>
            <b-row align-h="between" class="mt-3">
                <b-col cols="auto">
                    <b-button @click="cancelModal" variant="outline-danger">Abbrechen</b-button>
                </b-col>
                <b-col cols="auto">
                    <b-button @click="deleteEntry" variant="danger">Löschen</b-button>
                </b-col>
            </b-row>
        </b-modal>
    </div>
</template>

<script>
    import QuestionsContainer from "./QuestionsContainer";
    import CollapseNavigation from "./CollapseNavigation";

    export default {
        name: "TabNavigation",
        components: {
            QuestionsContainer,
            CollapseNavigation
        },
        props: {
            entries: Array,
            type: String
        },
        data() {
            return {
                date: "",
                time: "",
                index: this.entries.length - 1 //start with last entry
            }
        },
        mounted() {
            if (this.entries.length == 1 && this.entries[0].date == "") {
                this.$nextTick(function () { //waiting for child components to be mounted
                    this.$bvModal.show("firstEntry");
                })
            }
            else {
                this.$nextTick(function () {
                    this.index = this.entries.length - 1;
                    this.date = this.entries[this.entries.length - 1].date;
                })
            }
        },
        computed: {
            currentDate() {
                return this.entries[this.index].date;
            },

            entryAnswers() {
                return this.$store.getters.getEntryAnswers({date: this.date, time: this.time})
            },

            oneDay() {
                let dayEntry = this.entries.find(entry => entry.date == this.currentDate);
                if (dayEntry == undefined) return [];
                return dayEntry;
            }
        },
        methods: {
            timeInput(time, timeIndex) {
                this.$parent.setTime(time, this.index, timeIndex);
            },
            addDateEntry() {
                if (this.validate()) {
                    this.$parent.addDateEntry(this.german(this.date));

                    let dateIndex = this.entries.indexOf(this.entries.find(entry => entry.date == this.german(this.date)));

                    this.index = dateIndex;
                    this.$bvModal.hide("addEntry");
                }

            },
            addTimeEntry(time) {
                this.$parent.addTimeEntry(this.index, time);
            },

            back() {
                this.index = this.index - 1;
            },
            forward() {
                this.index = this.index + 1;
            },
            getInputFromChild(questionID, answer, timeIndex = 0) {
                this.$parent.getInputFromChild(questionID, answer, this.index, timeIndex);
            },
            goTo(date) {
                this.index = this.entries.findIndex((element) => element.date === date);
                this.$bvModal.hide("calendar");
            },
            openAddingModal() {
                this.date = "";
                this.$bvModal.show("addEntry");
            },
            setDate() {
                if (this.validate()) {
                    this.$parent.setDate(this.german(this.date), this.index);
                    this.$bvModal.hide("firstEntry");
                    this.$bvModal.hide("editEntry");
                }
            },
            deleteEntry() {
                if (this.entries.length == 1) {
                    this.$store.commit("resetAnswers");
                    this.$bvModal.show("firstEntry");
                }
                else {
                    this.$parent.deleteEntry(this.currentDate);
                    if (this.index == 0)
                        this.index = 1;
                    else
                        this.index--;
                }

                this.$bvModal.hide("deleteEntry");
            },
            deleteTimeEntry(timeIndex) {
                if (this.entries[this.index].timeEntries.length == 1) {
                    this.$store.commit("resetTimeEntries", this.index);
                }
                else {
                    this.$parent.deleteTimeEntry(this.index, timeIndex);
                }
            },
            cancelModal() {
                this.$bvModal.hide("editEntry");
                this.$bvModal.hide("addEntry");
                this.$bvModal.hide("deleteEntry");
                this.$bvModal.hide("calendar");
            },
            german(date) {
                let year = date.slice(0, 4);
                let month = date.slice(5, 7);
                let day = date.slice(8);

                return day + "." + month + "." + year;
            },

            existsAlready() {
                var found = false;
                var germanDate = this.german(this.date);
                this.entries.forEach(entry => {
                    if (entry.date == germanDate) {
                        found = true;
                    }
                });
                return found;
            },

            validate() {
                let valid = true;
                document.getElementById("dateError").style.display = "none";
                document.getElementById("dateExistsError").style.display = "none";

                if (this.date == "") {
                    document.getElementById("dateError").style.display = "block";
                    valid = false;
                }
                else if (this.existsAlready()) {
                    document.getElementById("dateExistsError").style.display = "block";
                    valid = false;
                }
                return valid;
            }
        },
        watch: {
            index: function (newIndex) {
                this.date = this.entries[newIndex].date;
                let element = document.getElementById("timeError");
                if (element != undefined)
                    element.style.display = "none";
                element = document.getElementById("existsError");
                if (element != undefined)
                    element.style.display = "none";
            },
        }
    }
</script>

<style scoped lang="scss">
    @import "../../custom.scss";

    .navigationMenu {
        border-bottom: 1px solid $accent;
        padding: 15px 0;
        margin-bottom: 30px;
    }

    .date {
        display: block;
        margin-left: auto;
        margin-right: auto;
        font-size: 150%;
        width: 100%;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
    }


    .questionsContainer {
        margin: 30px;
    }

    .editBtnsGroup {
        justify-content: center;
    }

    .closeBtn {
        position: absolute;
        top: 5px;
        right: 5px;
    }


    .editBtns {
        background-color: none;
        color: black;
        padding-right: 20px;
        padding-left: 20px;
    }

        .editBtns:hover {
            border: 1px solid black;
        }

    .btnNavigate {
        height: 100%;
        border: none;
    }

    .btn-outline-primary:disabled, .btn-outline-primary.disabled {
        color: grey;
    }

    .dateBtns {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        border: 1px solid $accent;
        padding-right: 20px;
        padding-left: 20px;
    }

</style>