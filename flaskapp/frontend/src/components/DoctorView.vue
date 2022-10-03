<template>
    <b-container class="container mt-5">
        <b-row>
            <b-col cols="12" md="5">
                <div class="wrapper">
                    <code-scanner @addAnalyseID="addAnalyseID"></code-scanner>
                    <div class="info">
                        <b-alert :show="existsCountDown"
                                 variant="warning"
                                 @dismissed="existsCountDown=0"
                                 @dismiss-count-down="existsCountDownChanged">
                            <p class="m-0">Dieser Code wurde bereits erfasst.</p>
                        </b-alert>
                        <b-alert :show="addedCountDown"
                                 variant="success"
                                 @dismissed="addedCountDown=0"
                                 @dismiss-count-down="addedCountDownChanged">
                            <h1 class="m-0">+</h1>
                        </b-alert>
                    </div>
                </div>
            </b-col>
            <b-col>
                <h4>Folgende Bögen wurden erfasst:</h4>
                <div v-if="idsKeys.length > 0">
                    <div class="ids">
                        <b-row v-for="(obj, index) in idsKeys" :key="obj.id" class="idRow" align-v="center">
                            <b-col>
                                {{obj.id}}
                            </b-col>
                            <b-col>
                                <b-button @click="deleteID(index)" variant="danger" size="sm" class="deleteBtn">
                                    <i class="fas fa-trash"></i>
                                </b-button>
                            </b-col>
                        </b-row>
                    </div>
                    <div class="text-center">
                        <b-btn variant="primary" class="startBtn" @click="start">Auswertung starten</b-btn>
                    </div>
                </div>
                <div v-else>
                    Scannen Sie einen QR-Code, um mit der Auswertung zu starten. <br />
                    Sie können beliebig viele QR-Codes auf einmal auswerten.
                </div>

            </b-col>
        </b-row>  
    </b-container>
</template>

<script>
    import CodeScanner from './util/CodeScanner.vue';

    export default {
        name: "DoctorView",
        components: { CodeScanner, },
        data() {
            return {
                idsKeys: [],
                existsCountDown: 0,
                addedCountDown: 0
            };
        },

        methods: {
            deleteID(index) {
                this.idsKeys.splice(index, 1);
            },
            addAnalyseID(obj) {
                if (this.idsKeys.includes(obj)) {
                    this.existsCountDown = 5;
                }
                else {
                    this.idsKeys.push(obj);
                    this.addedCountDown = 3;
                }

            },
            existsCountDownChanged(existsCountDown) {
                this.existsCountDown = existsCountDown;
            },
            addedCountDownChanged(addedCountDown) {
                this.addedCountDown = addedCountDown;
            },
            start() {
                this.$store.commit("setAnalyseObjects", this.idsKeys);
                this.$router.push({
                    name: "AnalyseQuestionnaires"
                })
            }
        },
    };
</script>


<style scoped>
    .wrapper {
        position:relative;
    }

    .info {
        position: absolute;
        top: 20%;
        left: 0;
        right: 0;
        margin-left: auto;
        margin-right: auto;
        text-align: center;
        width: 90%;
    }

    .alert-success {
        width: 30%;
        margin-left: auto;
        margin-right: auto;
        opacity: 80%;
    }

    .ids {
        max-height: 500px;
        overflow-y: auto;
        overflow-x: hidden;
    }

    .idRow {
        padding: 5px 20px;
    }

    .idRow:hover {
        background-color: #def3ff;
    }

    .deleteBtn {
        float: right;
    }

    .startBtn {
        margin-top: 30px;
    }
</style> 