import Vue from 'vue';
import Router from 'vue-router';

import Home from './components/Home.vue';
import PatientView from './components/PatientView.vue';
import PatientQuestionnaire from './components/patientView/PatientQuestionnaire.vue';
import DoctorView from './components/DoctorView.vue';
import AnalyseQuestionnaires from './components/doctorView/AnalyseQuestionnaires.vue'
import CreateQuestionnaire from './components/doctorView/CreateQuestionnaire.vue';

Vue.use(Router);

export default new Router({
    mode: 'history',
    scrollBehavior() {
        return { x: 0, y:0}
    },
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home
        },
        {
            path: '/doctorView',
            name: 'DoctorView',
            component: DoctorView
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
            path: '/patient',
            name: 'PatientView',
            component: PatientView
        },
        {
            path: '/patient/questionnaire/:id',
            name: 'PatientQuestionnaire',
            component: PatientQuestionnaire
        }
    ]
})