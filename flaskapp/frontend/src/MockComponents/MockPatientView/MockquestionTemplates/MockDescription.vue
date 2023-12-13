<template>
  <p class="h5">Beschreibung des Fragebogens:</p>
  <p>{{ question.id }}. {{ question.text }}</p>

  <hr class="my-3">  
</template>

<script>
export default {
  props: {
    question: Object,
  },
};
</script>

<style scoped></style>
