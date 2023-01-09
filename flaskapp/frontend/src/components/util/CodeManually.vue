<template>
    <div class="container">
        <button @click="close" class="btn-close"><i class="bi bi-x-circle"></i></button>
        <br>
        <h5>Neuen Fragebogen ausfüllen</h5><br>
        <input class="form-control" type="text" placeholder="Code" id="inputcode" :state="codeValidation" v-model="codeNew" @input="codeValidation = null"/>
        <br>
        <button  class="btn btn-secondary mt-5"  variant="primary" @click="submit()" >Bestätigen</button>
    </div>
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

    div[class="container"] {
        text-align: left;
        background-color: white;
        padding: 30px;
        max-width: 700px;
        position: relative;
    }

    button[class="btn-close"]{
        position: absolute;
        top: 5px;
        right: 5px;
        color: black;
        border: none;
    }

</style>
