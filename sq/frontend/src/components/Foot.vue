<template>
  <div>
    <footer class="bg-dark pt-3 fixed-bottom">
      <div class="container text-light text-center">
        <!-- <p class="h5 mb-3">Patientenfragebogen</p> -->
        <small class="text-white-35">&copy; Copyright</small>
        <div>
          <ul class="list-unstyled list-inline">
            <li class="list-inline-item">
              <a href="avascript:void(0)" class="text-light footer-link">Privacy Policy</a>
            </li>
            <li class="list-inline-item">
              <a href="avascript:void(0)" class="text-light footer-link">Terms Condition</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  name: "foot",
  setup() {
    //Copyright Date
    const date = ref(new Date().getFullYear());
    return {
      date,
    };
  },
};
</script>

<style>
  .footer-link{
    text-decoration: none;
  }
</style>
