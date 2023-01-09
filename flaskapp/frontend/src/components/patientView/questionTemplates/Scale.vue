<template>
    <div>
        <heading :question="question"></heading>
        <p class="mb-0">{{question.description}}</p>

        <form class="px-2" text-align="left" action="">
            <!-- <b-form-radio-group v-model="answer" @input="input()" :name="name">
                <b-form-radio v-for="option in question.options" :key="option.id" :value="option.text">
                    {{option.text}}
                </b-form-radio>
            </b-form-radio-group> -->
            <div class="form-check" v-for="option in question.options" :key="option.id" :value=option.text  >
                        <input class="form-check-input" type="checkbox" name="exampleForm" id="checkbox_single" />
                        <label class="form-check-label" margin-left="20px" for="checkbox_single">
                            {{option.text}}
                        </label>
            </div>
        </form>
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