<template>
  <div >
    <div style="text-align: right; padding-right: 30px" id="duration">
      {{ this.time }}
    </div>
    <div class="round-time-bar" :style="styleduration" id="round-time-bar"></div>
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
      done: Boolean,
    };
  },
  created() {
    //console.log("start Timebar");
    this.done = false;
    this.time = this.duration;
    this.styleduration = "--duration: " + this.duration + ";";
    var vm = this;
    this.Timer = setInterval(function () {
      if (vm.time < 1 && !this.done) {
        //clearInterval(vm.Timer);
        vm.$emit("timeout")
        vm.done = true;
      } else {
        if(!this.done){
        vm.time = vm.time - 1;
        }
      }
    }, 1000);
  },
  emits: ['timeout']
};
</script>