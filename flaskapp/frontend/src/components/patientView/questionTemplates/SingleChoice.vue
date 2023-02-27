<template>
    <div>
        <heading :question="question"></heading>

        <!-- <b-form-group>
            <b-form-radio-group v-model="answer" @input="input()" :name="name">
                <b-form-radio v-for="option in question.options" :key="option.id" :value="option.text">
                    {{option.text}}
                </b-form-radio>
            </b-form-radio-group>
        </b-form-group> -->
        <!-- <form class="px-2" text-align="left" action="">
            <div class="form-group form-check" v-for="option in question.options" v-bind:key="option.id">
                <label class="form-check-label" :for="option.id">{{option.text}}</label>
                <input type="checkbox"  v-model="answer" :id="option.id" :key="option.id" :value="option.text" @input="input()" :name="name" >
            </div>
            <div>Selected: {{answer}}</div>
        </form> -->


        <div class="form-group form-check" v-for="option in question.options" >
            <label class="check-label" :for="option.text" >{{option.text}}</label>
            <input type="checkbox"  v-model="answer"  :key="option.id" :value="option.text" @change="input()" :name="name" :true-value="option.text" />
        </div>
        <div>Selected: {{answer}}</div>
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