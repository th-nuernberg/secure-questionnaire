<template>
    <b-container class="container">
        <b-button @click="close" class="closeBtn"><b-icon-x-circle></b-icon-x-circle></b-button>
        <h5>Neuen Fragebogen ausfüllen</h5>
        <b-form-input class="input-field mt-2"
                      v-model="codeNew"
                      placeholder="Code"
                      :state="codeValidation"
                      @input="codeValidation = null">
        </b-form-input>

        <b-button class="mt-3" variant="primary" @click="submit()">Bestätigen</b-button>
    </b-container>
</template>

<script>
    export default {
        data() {
            return {
                codeNew: "",
                codeValidation: null,
            };
        },

        methods: {
            submit() {
                if (this.codeNew !== "") {
                    this.$router.push({path: `/patient/questionnaire/${this.codeNew}` });
                }
                else {
                    this.codeValidation = false
                }
            },
            close() {
                this.$emit('manually');
            }
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
        position: relative;
    }

    .closeBtn {
        position: absolute;
        top: 5px;
        right: 5px;
        background: none;
        color: black;
        border: none;
    }

</style>
