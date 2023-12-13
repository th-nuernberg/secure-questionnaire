<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <div class="wrapper">
          <code-scanner id="v-step-10"></code-scanner>
        </div>
      </div>
      <div class="mt-5 col">
        <h4>Folgende Bögen wurden erfasst:</h4>
        <div>
          Scannen Sie einen QR-Code, um mit der Auswertung zu starten. <br />
          Sie können beliebig viele QR-Codes auf einmal auswerten.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CodeScanner from "./MockUtil/MockCodeScanner.vue";

export default { }

</script>

<!-- <style scoped> -->
<style>
.wrapper {
  position: relative;
}

.info {
  position: absolute;
  top: 20%;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  width: 90%;
}

.alert-success {
  width: 30%;
  margin-left: auto;
  margin-right: auto;
  opacity: 80%;
}

.ids {
  max-height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
}

.idRow {
  padding: 5px 20px;
}

.idRow:hover {
  background-color: #def3ff;
}

.deleteBtn {
  float: right;
}

.startBtn {
  margin-top: 30px;
}
</style>
