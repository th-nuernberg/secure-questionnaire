<template>
    <div>
        <heading :question="question"></heading>
        <p class="mb-1">(Mehrere Antworten möglich)</p>
        <!-- <form-group>
            <b-form-checkbox-group v-model="answer">
                <b-form-checkbox v-for="option in question.options" :key="option.id" :value=option.text @input="input()">
                    {{option.text}}
                </b-form-checkbox>
            </b-form-checkbox-group>
        </form-group> -->
        <form class="px-2" text-align="left" action="">
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
            storedAnswer: [String, Array]
        },
        data() {
            return {
                answer: this.storedAnswer == "" ? [] : this.storedAnswer,
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