<template>
    <div class="d-inline">
        <button type="button" class="btn btn-outline-primary" @click="upwards()" variant="primary" >Up</button>
<!--            <i class="fas fa-caret-up"></i>-->

        <button type="button" class="btn btn-outline-primary" @click="deleteQuestion()" variant="danger" >Delete</button>
<!--            <i class="fas fa-trash"></i>-->

        <button type="button" class="btn btn-outline-primary" @click="downwards()" variant="primary" >Down</button>
<!--            <i class="fas fa-caret-down"></i>-->

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