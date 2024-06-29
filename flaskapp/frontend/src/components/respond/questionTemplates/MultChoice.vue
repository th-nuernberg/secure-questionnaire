<template>
  <!-- <div>
    <heading :question="question"></heading>
    <p class="mb-1">(Mehrere Antworten möglich)</p>

    <div class="form-group form-check" v-for="option in question.options">
      <label class="check-label" :for="option.text">{{ option.text }}</label>
      <input
        type="checkbox"
        v-model="answer"
        :key="option.id"
        :value="option.text"
        @change="input()"
      />
    </div>
  </div> -->

  <div class="container">
    <heading :question="question"></heading>
    <p class="text-muted mb-1">Mehrere Antworten möglich</p>

    <div class="form-group form-check" v-for="option in question.options">
      <input
        type="checkbox"
        v-model="answer"
        :key="option.id"
        :value="option.text"
        @change="input()">
      <label class="check-label" :for="option.text">{{ option.text }}</label>
      
    
    </div>
  </div>

  <hr class="my-3">


</template>

<script>
import Heading from "../heading.vue";
export default {
  components: { Heading },
  props: {
    question: Object,
    storedAnswer: [String, Array],
  },
  data() {
    return {
      answer: this.storedAnswer == "" ? [] : this.storedAnswer,

      //answer: answer,
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
