<template>
    <div class=".container">
        <button @click="close" class="closeBtn"><i class="bi bi-x-circle"></i></button>
        <br>
        <h5>Neuen Fragebogen ausfüllen</h5><br>
        <input class="form-control" type="text" placeholder="Code" :state="codeValidation"/>
        <br>
        <button class="mt-3 btn-big" variant="primary" @click="submit()">Bestätigen</button>
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
                    //this.$router.push({path: `/patient/questionnaire/${this.codeNew}` });
                }
                else {
                    this.codeValidation = false
                }
            },
            close() {
                //this.$emit('manually');
            }
        },
    };
</script>

<style scoped>
    .input-field {
        max-width: 300px;
    }

    .container {
        background-color: white;
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
