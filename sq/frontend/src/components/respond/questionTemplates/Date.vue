<template>
  <!-- <div>
    <heading :question="question"></heading>
    <input type="date" v-model="answer" @input="input()" />
  </div> -->

  <div class="row">
    <div class="col-sm-6">
      <div class="py-3">
        <label for="date" class="form-label"><heading :question="question"></heading></label>
        <input type="date" v-model="answer" id="date" class="form-control ml-0" required @input="input()" />
      </div>
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
    storedAnswer: String,
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
input {
  max-width: 200px;
}
</style>
