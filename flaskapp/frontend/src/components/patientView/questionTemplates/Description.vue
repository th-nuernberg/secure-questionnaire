<template>
  <p>{{ question.id }}. {{ question.text }}</p>
</template>

<script>
export default {
  props: {
    question: Object,
  },
};
</script>

<style scoped></style>
