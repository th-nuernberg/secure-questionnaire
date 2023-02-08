<template>
    <div class="d-inline">
        <button type="button" class="btn btn-outline-primary" @click="upwards()" variant="primary" ><BootstrapIcon icon="arrow-up" size="2x" /></button>
        

        <button type="button" class="btn btn-outline-primary" @click="deleteQuestion()" variant="danger" ><BootstrapIcon icon="trash" size="2x" /></button>
        

        <button type="button" class="btn btn-outline-primary" @click="downwards()" variant="primary" ><BootstrapIcon icon="arrow-down" size="2x" /></button>

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
        width: 80px;
        margin: 5px 0;
    }
</style>