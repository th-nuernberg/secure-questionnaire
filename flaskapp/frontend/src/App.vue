<template>
  <!-- <div class="content text-center"> -->
  <div class="content">

  <!-- <div id="app"> -->
    <div>
      <!-- navbar -->
      <NavBar />
      <v-tour name="myTour" :steps="steps" :options="myOptions"></v-tour>
      <!-- <v-tour name="myTour" :steps="steps">
        <template slot-scope="tour">
          <transition name="fade">
            <v-step
              v-if="tour.currentStep === index"
              :key="index"
              :step="step"
              :previous-step="tour.previousStep"
              :next-step="tour.nextStep"
              :stop="tour.stop"
              :is-first="tour.isFirst"
              :is-last="tour.isLast"
              :labels="tour.labels"
              >
              <div v-for="(step, index) of tour.steps">
                <template>
                  <div slot="actions">
                    <button @click="tour.previousStep" class="btn btn-primary">Previous step</button>
                    <button @click="tour.nextStep" class="btn btn-primary">Next step</button>
                  </div>
                </template>
              </div>
            </v-step>
          </transition>
        </template>
      </v-tour> -->
    </div>
    <router-view></router-view>
    <div>
      <!-- footer -->
      <Foot />
    </div>
  <!-- </div> -->
  </div>
</template>

<script>
import NavBar from "./components/NavBar.vue";
import Foot from "./components/Foot.vue";
import "./custom.scss";

export default {
  name: "app",
  components: {
    NavBar,
    Foot,
  },
  mounted: function () {
    // Only run the tour only when visiting site for the first time 
    // (no record in localStorage)
    if(!localStorage.getItem('tourDone')){
        this.$tours['myTour'].start()
        localStorage.setItem('tourDone', true)
    }
  },
  data() {
    return {
      myOptions: {
        useKeyboardNavigation: false,
        labels: {
          buttonNext: 'Next',
          buttonStop: 'Finish'
        },
        enabledButtons: {
          buttonSkip: false,
          buttonPrevious: false,
          buttonNext: true,
          buttonStop: true
        }
      },
      steps: [
        {
          target: '#v-step-0',
          header: {
            title: 'Tutorial Starten',
          },
          content: `Folgen Sie den Tutorial-Schritten um die Funktionen des <strong>Secure Quesionnaires</strong> kennenzulernen!`,
          params: {
            placement: 'bottom'
          },
        },
        {
          target: '#v-step-1',
          content: 'Geben Sie Ihre Email Adresse an.',
          params: {
            placement: 'bottom'
          },
          before: () => new Promise((resolve) => {
            this.$router.push({ path: '/mockLogin' });
            resolve(true);
          })
        },
        {
          target: '#v-step-2',
          content: 'Geben Sie Ihr Passwort an.',
          params: {
            placement: 'bottom'
          },
        },
        {
          target: '#v-step-3',
          content: 'Bitte laden Sie hier die .json Datei hoch, die Sie von Ihrem Administrator bekommen haben.',
          params: {
            placement: 'bottom'
          },
        },
        {
          target: '#v-step-4',
          content: 'Jetzt nur noch einloggen!',
          params: {
            placement: 'bottom'
          },
        },
        {
          target: '#v-step-5',
          content: 'Hier koennen Sie auswählen ob Sie sich bereits ausgefüllte Fragebögen ansehen möchten oder neue erstellen.\nFalls Sie zum ersten mal hier sind erstellen Sie mit dem oberen Button Ihren aller ersten Fragebogen!',
          params: {
            placement: 'bottom'
          },
          before: () => new Promise((resolve) => {
            this.$router.push({ path: '/mockSelection' });
            resolve(true);
          })
        },
        {
          target: '#v-step-6',
          content: 'Auf dieser Seite können Sie Ihren Fragenbogen erstellen.',
          params: {
            placement: 'bottom'
          },
          before: () => new Promise((resolve) => {
            this.$router.push({ path: '/mockCreateQuestionnaire' });
            resolve(true);
          })
        },
        {
          target: '#v-step-7',
          content: 'Über das diese Auswahl können Sie diverse Fragetypen hinzufügen!',
          params: {
            placement: 'bottom'
          },
        },
        {
          target: '#v-step-8',
          content: 'Hier können Sie den Fragebogen speichern.\n(Bevor Sie zum nächsten Tutorial-Schritte gehen, können Sie sich gerne bei den Fragen durchklicken.)',
          params: {
            placement: 'bottom'
          },
        },
        {
          target: '#v-step-9',
          content: 'Hier können direkt weitere Fragebögen erstellen.',
          params: {
            placement: 'bottom'
          },
        },
        {
          target: '#v-step-10',
          content: 'Wenn Ihr Patient dann den Fragebogen ausgefüllt und seinen QR-Code mitgebracht, können Sie den code hier einscannen um die Ergebnisse zu sichten.',
          params: {
            placement: 'bottom'
          },
          before: () => new Promise((resolve) => {
            this.$router.push({ path: '/mockDoctorView' });
            resolve(true);
          })
        },
        {
          target: '#v-step-11',
          content: 'Fertig! Viel Spaß mit dem Secure-Questionnaire.',
          params: {
            placement: 'bottom'
          },
          before: () => new Promise((resolve) => {
            this.$router.push({ path: '/' });
            resolve(true);
          })
        },
      ],
    }
  }
};
</script>

<!--<style scoped>-->
<!--.logo {-->
<!--  height: 6em;-->
<!--  padding: 1.5em;-->
<!--  will-change: filter;-->
<!--}-->
<!--.logo:hover {-->
<!--  filter: drop-shadow(0 0 2em #646cffaa);-->
<!--}-->
<!--.logo.vue:hover {-->
<!--  filter: drop-shadow(0 0 2em #42b883aa);-->
<!--}-->
<!--</style>-->
<style lang="scss">
@import "custom.scss";

*{
  margin: 0;
  padding: 0;
}
html{
  height: 100%;
}

body{
  background-color: rgba(0,0,0,0.05);

  min-height: 100%;
  display: flex;
  flex-direction: column;

  font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 500;
}
.content{
  margin-top: 100px;
  margin-bottom: 120px;
}

// .router-container {
//   margin: 0 50px;
// }

// #app {
//   background-color: $background;
// }

// .boxStyling {
//   border-radius: 20px;
//   box-shadow: 0px 0px 5px #aaaaaa;
//   padding: 15px;
//   margin: 20px 0;
//   background-color: white;
// }

// .btn-big {
//   padding: 10px 20px !important;
// }

// .btn-primary {
//   background-color: $primary !important;
//   border-color: $primary !important;
// }

// .btn-primary:hover {
//   background-color: $primary-dark !important;
// }

// .btn-outline-primary {
//   color: $primary !important;
//   border-color: $primary !important;
// }

// .btn-outline-primary:hover {
//   background-color: $primary-dark !important;
//   color: white !important;
// }

// .btn-accent {
//   background-color: $accent !important;
//   color: black !important;
//   border: none !important;
// }

// .btn-accent:hover {
//   background-color: $accent-dark !important;
// }

// .dropdown-item.active,
// .dropdown-item:active {
//   background-color: $primary !important;
// }

// .btn-white {
//   color: black !important;
//   background-color: none !important;
// }

// .btn-white:hover {
//   background-color: $background !important;
// }

// .text-primary {
//   color: $primary !important;
// }
</style>
