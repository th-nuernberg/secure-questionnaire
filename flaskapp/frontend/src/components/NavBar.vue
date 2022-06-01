<template>
    <b-navbar style="background-color: #2A2A2A;" toggleable="lg" type="dark" variant="dark">
        <b-navbar-brand class="brand" :to="{ path: '/' }">Schlafambulanz</b-navbar-brand>

        <b-navbar-nav v-if="doctorViewCreate">
            <b-nav-item to="/doctorView">Antworten analysieren</b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav v-else-if="doctorView">
            <b-nav-item to="/doctorView/create">Fragebogen erstellen</b-nav-item>
        </b-navbar-nav>
    </b-navbar>
</template>

<script>
    export default {
        name: "NavBar",
        computed: {
            doctorView() {
                return this.$route.path == "/doctorView";
            },
            doctorViewCreate() {
                return this.$route.path == "/doctorView/create";
            }
        }
    }
</script>

<style scoped>
    .ms-auto {
        margin-right: 20px;
    }

    .brand {
        margin-left: 20px;
    }
</style>