<template>
    <div>
        <heading :question="question"></heading>
        <input v-model="answer" @input="input()"/>
    </div>
</template>

<script>
    import Heading from '../heading.vue';

    export default {
        components: { Heading, },

        props: {
            question: Object,
            storedAnswer: String
        },
        data() {
            return {
                answer: this.storedAnswer,
            }
        },
        methods: {
            input() {
                this.$parent.getInputFromChild(this.question.id, this.answer);
            }
        }
    }
</script>

<style scoped>
</style>