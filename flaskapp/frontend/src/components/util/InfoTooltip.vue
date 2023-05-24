<template>
  <span>
    <button variant="primary" size="sm" class="info-button" id="button">
      i
    </button>
    <tooltip target="button">{{ msg }}</tooltip>
  </span>
</template>

<script>
export default {
  name: "InfoTooltip",
  props: {
    msg: String,
  },
};
</script>

<style scoped>
.info-button {
  width: 24px;
  height: 24px;
  border-radius: 12px;
  line-height: 1;
  font-size: 1rem;
}
</style>
