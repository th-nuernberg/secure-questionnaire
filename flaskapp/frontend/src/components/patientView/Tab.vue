<template>
  <div class="tabContentWrapper">
    <p class="tabContent"> {{tabTitle}} </p>
  </div>
</template>

<script>
export default {
  name: "Tab",
  props : ['tabTitle']
}
</script>

<style scoped>
  .tabContentWrapper{
    height: 100%;
    width: 100%;
    display: table;
  }

  .tabContent{
    text-align: center;
    vertical-align: middle;
    display: table-cell;
  }
</style>