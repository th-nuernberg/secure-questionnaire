<template>
    <p class="heading">
        {{question.id}}. {{question.text}}
    </p>
</template>

<script>
    export default {
        props: {
            question: Object
        }
    }
</script>

<style scoped>
    .heading {
        font-weight: bold;
        margin-bottom: 5px;
    }
</style>