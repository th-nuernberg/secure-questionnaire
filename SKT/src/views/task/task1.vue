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
    <div class="round-time-bar" style="--duration: 60;" id="round-time-bar"> 
    <div></div>
    </div>

    <!--this elemts will be hidden after the timeout is reached-->
    <div id="timeout-hide">
      <h5 class="txt-center">Sagen Sie jetzt bitte ganz schnell, wie die Gegenstände heißen und merken Sie sie sich.</h5>

      <div class="row">
       <div  class="column" v-for="item in [0,1,2,3]" :key="item">
        <div v-for="img in selectedImage.slice(item*3,3*item+3)" :key="img">
          <p class="card"><img :src="img[1]" alt=""></p>
        </div>
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
  var timeleft = 555;

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
      selectedImage: [],
    };
  },
  methods: {
    randomItem (items) {
      return items[Math.floor(Math.random()*items.length)];
    },
      addImage(img) {
      this.$store.dispatch("addImage", img);
    },

  },
  created() {
    while(this.selectedImage.length<13){
      var img  =this.randomItem(Object.entries(this.images['imgs']))
      if(!this.selectedImage.map(x => x[0] ).includes(img[0])){
          this.selectedImage.push(img);
          this.addImage(img);
      }
    }
    console.log(this.selectedImage.map(x => x[0]))
  }
}

</script>

