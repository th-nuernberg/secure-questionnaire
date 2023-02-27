<template>
    <div>
        <div v-for="question in questionnaire.elements"
             :key="question.id"
             class="question">
            <component :is="question.type" :question="question" :storedAnswer="getStoredAnswer(question.id)" :dateTimeString="dateTimeString"></component>
        </div>
    </div>
</template>

<script>
    import Date from "./questionTemplates/Date.vue";
    import Description from "./questionTemplates/Description.vue";
    import Freetext from "./questionTemplates/FreeText.vue";
    import Multchoice from "./questionTemplates/MultChoice.vue";
    import Number from "./questionTemplates/Number.vue";
    import Scale from "./questionTemplates/Scale.vue";
    import Singlechoice from "./questionTemplates/SingleChoice.vue";
    import Time_ from "./questionTemplates/Time_.vue";


    export default {
        components: {
            Date,
            Description,
            Freetext,
            Multchoice,
            Number,
            Scale,
            Singlechoice,
            Time_,
        },
        props: {
            date: String,
            time: String,
        },
        computed: {
            questionnaire() {
                return this.$store.getters.getQuestionnaire;
            },
            dateTimeString() {
                return this.date + this.time
            }
        },

        methods: {
            getInputFromChild(questionID, answer) {
                if (this.$parent.getInputFromChild == undefined) {                 //in CollapseNavigation wird automatisch accordeon-Komponente eingef�gt
                    this.$parent.$parent.getInputFromChild(questionID, answer);
                }
                else {
                    this.$parent.getInputFromChild(questionID, answer);
                }

            },
            getStoredAnswer(id) {
                return this.$store.getters.getSingleAnswer({
                    date: this.date,
                    time: this.time,
                    id: id
                });
            }
        }
    }
</script>

<style scoped>

    .question {
        margin-bottom: 20px;
    }
</style>