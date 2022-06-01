<template>
    <div>
        <div v-if="noEntries">
            <p>Fügen Sie eine Uhrzeit hinzu, um mit der Bearbeitung zu starten:</p>
            <b-row>
                <b-col style="max-width: 150px;">
                    <b-input type="time" v-model="newTime"></b-input>
                </b-col>
                <b-col class="text-left" cols="auto">
                    <b-button @click="setTime" variant="primary" class="addBtn">
                        <b-icon-plus></b-icon-plus>
                    </b-button>
                </b-col>
            </b-row>

            <p id="timeError" style="display:none; color:red;">Bitte geben Sie eine Uhrzeit an.</p>
            <p id="existsError" style="display:none; color:red;">Uhrzeit existiert bereits.</p>
        </div>


        <div v-else v-for="(entry,index) in entries.timeEntries" :key="entry.time"
             class="accordion" role="tablist">
            <b-card no-body class="mb-3">
                <b-card-header header-tag="header" class="p-0" role="tab">
                    <b-button v-b-toggle="'accordion-'+index" class="timeBtn" variant="primary">{{entry.time}}</b-button>
                    <b-button-group class="editBtnsGroup">
                        <b-button @click="setIndex(index)" v-b-modal.editTimeEntry size="sm" class="editBtns" variant="outlined">
                            <b-icon-pencil-fill></b-icon-pencil-fill>
                        </b-button>
                        <b-button @click="setIndex(index)" class="editBtns" variant="outlined" v-b-modal.deleteTimeEntry size="sm">
                            <b-icon-trash></b-icon-trash>
                        </b-button>
                    </b-button-group>


                </b-card-header>
                <b-collapse :id="'accordion-'+index" accordion="my-accordion" role="tabpanel" @shown="open(index)">
                    <b-card-body class="cardBody">

                        <Questions-Container :date="entries.date" :time="entry.time" :key="entry.time && entries.date"></Questions-Container>

                    </b-card-body>
                </b-collapse>
            </b-card>
        </div>

        <b-row class="text-center mt-3">
            <b-col>
                <b-button v-if="!noEntries" class="addBtn btn-accent" v-b-modal.addTimeEntry>
                    <b-icon-plus></b-icon-plus>
                </b-button>
            </b-col>

        </b-row>


        <b-modal id="addTimeEntry" size="md"
                 hide-header hide-footer centered>
            <h4>Uhrzeit hinzufügen</h4>

            <b-input type="time" v-model="newTime"></b-input>
            <p id="timeError" style="display:none; color:red;">Bitte geben Sie eine Uhrzeit an.</p>
            <p id="existsError" style="display:none; color:red;">Uhrzeit existiert bereits.</p>
            <b-row align-h="between" class="mt-3">
                <b-col cols="auto">
                    <b-button @click="cancelModal" variant="outline-danger">Abbrechen</b-button>
                </b-col>
                <b-col cols="auto">
                    <b-button @click="addEntry" variant="primary">Eintrag hinzufügen</b-button>
                </b-col>
            </b-row>
        </b-modal>


        <b-modal id="deleteTimeEntry" size="md"
                 hide-header hide-footer centered>
            <h4>Wollen Sie diesen Eintrag wirklich löschen?</h4>
            <p>Alle Antworten zu dieser Uhrzeit werden dadurch gelöscht.</p>
            <b-row align-h="between" class="mt-3">
                <b-col cols="auto">
                    <b-button @click="cancelModal" variant="outline-danger">Abbrechen</b-button>
                </b-col>
                <b-col cols="auto">
                    <b-button @click="deleteTimeEntry" variant="danger">Löschen</b-button>
                </b-col>
            </b-row>

        </b-modal>

        <b-modal id="editTimeEntry" size="md"
                 hide-header hide-footer centered>
            <h4>Uhrzeit bearbeiten: {{this.entries.timeEntries[editIndex].time}}</h4>
            <b-input type="time" v-model="editTime"></b-input>
            <p id="timeErrorModal" style="display:none; color:red;">Bitte geben Sie eine Uhrzeit an.</p>
            <p id="existsErrorModal" style="display:none; color:red;">Uhrzeit existiert bereits.</p>
            <b-row align-h="between" class="mt-3">
                <b-col cols="auto">
                    <b-button @click="cancelModal" variant="outline-danger">Abbrechen</b-button>
                </b-col>
                <b-col cols="auto">
                    <b-button @click="editTimeEntry" variant="primary">Aktualisieren</b-button>
                </b-col>
            </b-row>

        </b-modal>
    </div>
</template>

<script>
    import QuestionsContainer from "./QuestionsContainer";

    export default {
        components: {
            QuestionsContainer,
        },
        props: {
            entries: Object,
        },
        data() {
            return {
                newTime: '',
                index: 0,
                editIndex: 0,
                editTime: ''
            }
        },
        computed: {
            noEntries() {
                return (this.entries.timeEntries.length == 1 && this.entries.timeEntries[0].time == "");
            }
        },
        methods: {
            addEntry() {
                document.getElementById("timeError").style.display = "none";
                document.getElementById("existsError").style.display = "none";
                if (this.newTime == "") {
                    document.getElementById("timeError").style.display = "block";
                }
                else if (this.existsAlready()) {
                    document.getElementById("existsError").style.display = "block";
                }
                else {
                    document.getElementById("timeError").style.display = "none";
                    this.$parent.addTimeEntry(this.newTime);
                    this.newTime = '';
                    this.$bvModal.hide("addTimeEntry");
                }
            },

            setTime() {
                if (this.newTime == "") {
                    document.getElementById("timeError").style.display = "block";
                }
                else {
                    document.getElementById("timeError").style.display = "none";
                    this.$parent.timeInput(this.newTime, 0);
                    this.newTime = '';
                }

            },

            getInputFromChild(questionID, answer) {
                this.$parent.getInputFromChild(questionID, answer, this.index);
            },
            open(index) {
                this.index = index;
            },
            cancelModal() {
                this.$bvModal.hide("deleteTimeEntry");
                this.$bvModal.hide("editTimeEntry");
                this.$bvModal.hide("addTimeEntry");
                this.editTime == '';
            },
            deleteTimeEntry() {
                this.$parent.deleteTimeEntry(this.editIndex);
                this.$bvModal.hide("deleteTimeEntry");
            },
            editTimeEntry() {
                this.resetAdding();

                document.getElementById("timeErrorModal").style.display = "none";
                document.getElementById("existsErrorModal").style.display = "none";
                if (this.editTime == "") {
                    document.getElementById("timeErrorModal").style.display = "block";
                }
                else if (this.existsAlready() && this.editTime != this.entries.timeEntries[this.editIndex].time) {
                    document.getElementById("existsErrorModal").style.display = "block";
                }
                else {
                    this.$parent.timeInput(this.editTime, this.editIndex);
                    this.$bvModal.hide("editTimeEntry");
                    this.editTime = "";
                }

            },
            setIndex(index) {
                this.editIndex = index;
            },

            existsAlready() {
                var found = false;
                this.entries.timeEntries.forEach(entry => {
                    if (entry.time == this.newTime || entry.time == this.editTime) {
                        found = true;
                    }
                });
                return found;
            },
            resetAdding() {
                this.newTime = "";
                document.getElementById("existsError").style.display = "none";
                document.getElementById("timeError").style.display = "none";
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../../custom.scss";

    .timeBtn {
        width: 100%;
        border-radius: calc(0.25rem - 1px) calc(0.25rem - 1px) 0 0;
    }

    .timeBtn:focus {
        box-shadow: none;
    }

    .cardBody {
        background-color: $background;
    }

    .card-header {
        position: relative;
    }

    .addBtn {
        padding-left: 20px;
        padding-right: 20px;
        padding-top: 0;
        padding-bottom: 0;
        font-size: 150%;
    }

    .editBtnsGroup {
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
    }

    .editBtns {
        color: white;
    }

    .editBtns:hover {
        color: black;
        background: $background;
    }

</style>