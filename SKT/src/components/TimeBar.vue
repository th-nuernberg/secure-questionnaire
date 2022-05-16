<template>
  <div >
    <div>
      <p style="text-align: right; padding-right: 30px" id="duration">
        {{ this.time }}
      </p>
    </div>

    <div class="round-time-bar" :style="styleduration" id="round-time-bar">
      <div></div>
    </div>
  </div>

</template>


<script>
export default {
  name: "TimeBar",
  props: {
    duration: Number,
  },
  data() {
    return {
      time: Number,
      Timer: Object,
      styleduration: String,
    };
  },
  created() {
    this.time = this.duration;
    this.styleduration = "--duration: " + this.duration + ";";
    var vm = this;
    this.Timer = setInterval(function () {
      if (vm.time < 1) {
        //clearInterval(vm.Timer);
        vm.$emit("timeout")
      } else {
        vm.time = vm.time - 1;
      }
    }, 1000);
  },
  emits: ['timeout']
};
</script>