<template>
    <div>
        <heading :question="question"></heading>

        <b-form-group>
            <b-form-radio-group v-model="answer" @input="input()" :name="name">
                <b-form-radio v-for="option in question.options" :key="option.id" :value="option.text">
                    {{option.text}}
                </b-form-radio>
            </b-form-radio-group>
        </b-form-group>
    </div>
</template>

<script>
    import Heading from '../heading.vue';
    export default {
        components: { Heading, },
        props: {
            question: Object,
            storedAnswer: String,
            dateTimeString: String
        },
        computed: {
            name() {
                return this.question.id.toString() + this.dateTimeString
            }
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