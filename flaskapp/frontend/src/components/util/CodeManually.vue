<template>
    <b-container class="container">
        <b-row>
            <b-col>
                <h5>Neuen Fragebogen ausfüllen</h5>
                <b-form-input class="input-field mt-2"
                              v-model="codeNew"
                              placeholder="Code"
                              :state="codeValidation"
                              @input="codeValidation = null">
                </b-form-input>
            </b-col>

            <b-col>
                <h5>Antworten bearbeiten</h5>
                <b-form-input class="input-field mt-2"
                              v-model="codeEdit"
                              placeholder="Code"
                              :state="codeValidation"
                              @input="codeValidation = null">
                </b-form-input>
            </b-col>
        </b-row>
        <b-button class="mt-3" variant="primary" @click="submit()">Bestätigen</b-button>
    </b-container>
</template>

<script>
    export default {
        data() {
            return {
                codeNew: "",
                codeEdit: "",
                codeValidation: null,
            };
        },

        methods: {
            submit() {
                if (this.codeNew !== "" && this.codeEdit !== "") {
                    this.codeValidation = false;
                }
                else if (this.codeNew !== "") {
                    this.$router.push({path: `/patient/questionnaire/${this.codeNew}` });
                }
                else if (this.codeEdit !== "") {
                    this.$store.dispatch("getAnswers", this.codeEdit)
                        .then((queID) => {
                            this.$router.push({ name: 'PatientQuestionnaire', params: { id: queID } })
                        })
                        .catch(() => {
                        })
;
                }
                else {
                    this.codeValidation = false
                }
            },
        },
    };
</script>

<style scoped>
    .input-field {
        max-width: 300px;
    }

    .container {
        background-color: #def3ff;
        padding: 30px;
        max-width: 700px; 
    }

</style>