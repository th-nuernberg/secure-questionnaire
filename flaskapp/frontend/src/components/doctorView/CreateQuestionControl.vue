<template>
    <div class="d-inline">
        <b-button @click="upwards()" variant="primary" size="sm">
            <i class="fas fa-caret-up"></i>
        </b-button>
        <b-button @click="deleteQuestion()" variant="danger" size="sm">
            <i class="fas fa-trash"></i>
        </b-button>
        <b-button @click="downwards()" variant="primary" size="sm">
            <i class="fas fa-caret-down"></i>
        </b-button>
    </div>
</template>

<script>
    export default { 
        methods: {
            deleteQuestion() {
                this.$emit("deleteQuestion");
            },
            upwards() {
                this.$emit("upwards");
            },
            downwards() {
                this.$emit("downwards");
            },

        }
    }
</script>

<style scoped>
    .btn {
        display: block;
        width: 40px;
        margin: 5px 0;
    }
</style>