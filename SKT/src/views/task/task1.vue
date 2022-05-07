<template>
  <body>
    <!--placeholder-->
    <div class="placeholder"></div>

    <!--text-->
    <h3 class="txt-center">Subtest I: Gegenstände benennen und einprägen</h3>

    <div style="width: 100%;">
        <div style="float: left;"> 
          <p style="padding-left: 30px">Aufgabe <strong>1</strong> von 10</p>
        </div>
        <div> 
          <p style="text-align: right; padding-right: 30px" id="duration"></p>
        </div>
    </div>

    <!--time-bar-->
    <div class="round-time-bar" style="--duration: 10;" id="round-time-bar"> 
    <div></div>
    </div>

    <!--this elemts will be hidden after the timeout is reached-->
    <div id="timeout-hide">
      <h5 class="txt-center">Sagen Sie jetzt bitte ganz schnell, wie die Gegenstände heißen und merken Sie sie sich.</h5>

      <div class="row">
        <div class="column">
          <p class="card" v-if="selectedImage"><img :src="selectedImage[1]" alt=""></p>
          <p class="card" v-if="selectedImage"><img :src="selectedImage[2]" alt=""></p>
          <p class="card" v-if="selectedImage"><img :src="selectedImage[3]" alt=""></p>
        </div>
        <div class="column">
          <p class="card" v-if="selectedImage"><img :src="selectedImage[4]" alt=""></p>
          <p class="card" v-if="selectedImage"><img :src="selectedImage[5]" alt=""></p>
          <p class="card" v-if="selectedImage"><img :src="selectedImage[6]" alt=""></p>
        </div>
        <div class="column">
          <p class="card" v-if="selectedImage"><img :src="selectedImage[7]" alt=""></p>
          <p class="card" v-if="selectedImage"><img :src="selectedImage[8]" alt=""></p>
          <p class="card" v-if="selectedImage"><img :src="selectedImage[9]" alt=""></p>
        </div>
        <div class="column">
          <p class="card" v-if="selectedImage"><img :src="selectedImage[10]" alt=""></p>
          <p class="card" v-if="selectedImage"><img :src="selectedImage[11]" alt=""></p>
          <p class="card" v-if="selectedImage"><img :src="selectedImage[12]" alt=""></p>
        </div>
      </div>
    </div>

    <!--this elemts will be displayed only after the timeout is reached-->
    <div id="timeout-show">
      <h5 class="txt-center">Die Zeit ist um</h5>

      <!--placeholder-->
      <div class="placeholder"></div>

      <!--weiter button-->
      <div id="hidden-button" style="padding-left: 30px">
        <button class="btn-router">
          <router-link class="routerlink-2" to="/task2">Weiter</router-link>
        </button>
      </div>
    </div>

  </body>
</template>

<script>

import "bootstrap/dist/css/bootstrap.css";
import images from "../../assets/images/images.js";



myduration();

window.onload = function(){
    initialSetup();
    myduration();
}

/* This function hides selected HTML elements.
Hiding an element can be done by setting the display property to none. 
The element will be hidden, and the page will be displayed as if the element is not there
*/
function initialSetup(){
  document.getElementById('timeout-show').style.display = 'none';
}

/* This function starts a countdown for a given amount of time.
The output is displayed via a HTML element
The setInterval() method calls a function at specified intervals (in milliseconds).
The setInterval() method continues calling the function until clearInterval() is called, or the window is closed.
1 second = 1000 milliseconds.*/
function myduration(){
  var timeleft = 10;

  var downloadTimer = setInterval(function(){
    if(timeleft < 1){
      clearInterval(downloadTimer);
      timeout();
    }

    //output via HTML element
    document.getElementById("duration").innerText = timeleft+" Sek.";
    timeleft --;

  }, 1000);
}

/* This function starts after the timeout is reached.
Selected images will be hidden or displayed*/
function timeout(){
    document.getElementById("timeout-show").style.display = 'block';
    document.getElementById("timeout-hide").style.display = 'none';
}

/* The randomItem() method returns a random item out of the array images.
The created() method continues calling the function randomItem() until the array selectedImage has reached the length 12.
The method also ensures that no image is stored twice*/
export default {
  name: "app",
  data() {
    return{
      images,
      selectedImage: [null],
    };
  },
  methods: {
    randomItem (items) {
      return items[Math.floor(Math.random()*items.length)];
    }
  },
  created() {
    while(this.selectedImage.length<13){
      var img  =this.randomItem(this.images)
      if(!this.selectedImage.includes(img)){
          this.selectedImage.push(img);
      }
    }
  }
}

</script>

