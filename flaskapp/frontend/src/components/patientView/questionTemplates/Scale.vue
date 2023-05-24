<template>
  <div>
    <heading :question="question"></heading>
    <p class="mb-0">{{ question.description }}</p>

    <div class="form-group form-check" v-for="option in question.options">
      <label class="check-label" :for="option.text">{{ option.text }}</label>
      <input
        type="checkbox"
        v-model="answer"
        :key="option.id"
        :value="option.text"
        @change="input()"
        :name="name"
        :true-value="option.text"
      />
    </div>
    <!-- <div>Selected: {{answer}}</div> -->
  </div>
</template>

<script>
import Heading from "../heading.vue";
export default {
  components: { Heading },
  props: {
    question: Object,
    storedAnswer: String,
    dateTimeString: String,
  },
  computed: {
    name() {
      return this.question.id.toString() + this.dateTimeString;
    },
  },
  data() {
    return {
      answer: this.storedAnswer,
    };
  },
  methods: {
    input() {
      this.$parent.getInputFromChild(this.question.id, this.answer);
    },
  },
};
</script>

<style scoped>
label {
  padding-left: 15px;
  margin-right: 15px;
}
input {
  width: 15px;
  height: 15px;
  padding: 0;
  margin: 0;
  vertical-align: text-bottom;
  position: relative;
  top: -1px;
}
</style>
