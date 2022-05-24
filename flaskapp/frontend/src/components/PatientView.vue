<template>
    <b-container class="container">
        <code-scanner class="mt-5"></code-scanner>
        <b-button class="small-button mt-3" @click="manually()">Code manuell eingeben</b-button>

        <code-manually v-show="showManually"></code-manually>

    </b-container>
</template>

<script>
    import CodeManually from './util/CodeManually.vue';
    import CodeScanner from './util/CodeScanner.vue';

    export default {
        name: "PatientView",
        components: { CodeManually, CodeScanner, },
        data() {
            return {
                showManually: false,
            };
        },
        created() {
            this.$store.commit("resetAnswers");
        },
        methods: {
            manually() {
                this.showManually = !this.showManually;
            }
        },
    };
</script>


<style scoped>

    .small-button {
        background: none;
        color: black;
        border: none;
        max-width: 200px;
        margin-left: auto;
        margin-right: auto;
    }

    .small-button:hover, .small-button:active, .small-button:focus {
        background: none;
        color: black;
        border: none;
        text-decoration: underline;
    }

    .container {
        max-width: 800px;
    }
</style> 