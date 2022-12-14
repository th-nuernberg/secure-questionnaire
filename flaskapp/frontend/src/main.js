import { createApp , h} from 'vue'
import './style.css'
import App from './App.vue'
import store from './store'
import {createRouter, createWebHistory} from 'vue-router'
import VueQrcodeReader from "vue3-qrcode-reader";
import Home from './components/Home.vue';
import PatientView from './components/PatientView.vue';
import DoctorView from './components/DoctorView.vue';
import PatientQuestionnaire from './components/patientView/PatientQuestionnaire.vue';
import AnalyseQuestionnaires from './components/doctorView/AnalyseQuestionnaires.vue'
import CreateQuestionnaire from './components/doctorView/CreateQuestionnaire.vue';
import "bootstrap/dist/css/bootstrap.css"
import 'bootstrap-vue/dist/bootstrap-vue.css'

const router = createRouter(
    {
        history: createWebHistory(),
        routes: [
            { path: '/' , name: 'Home' , component: Home },
            {
                path: '/doctorView',
                name: 'DoctorView',
                component: DoctorView
            },
            {
                path: '/patient',
                name: 'PatientView',
                component: PatientView
            },
            {
                path: '/doctorView/create',
                name: 'CreateQuestionnaire',
                component: CreateQuestionnaire
            },
            {
                path: '/doctorView/analyse',
                name: 'AnalyseQuestionnaires',
                component: AnalyseQuestionnaires
            },
            {
                path: '/patient/questionnaire/:id',
                name: 'PatientQuestionnaire',
                component: PatientQuestionnaire
            }
        ]
    }
)


const app = createApp({
    router,
    render: () => h(App),
    components: { App }
});

app.use( router )
app.use(VueQrcodeReader)
app.use(store)
app.mount('#app');



import "bootstrap/dist/js/bootstrap.js";