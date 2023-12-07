<template>
    <div class="container">
        <legend>Bitte auswählen</legend>
        <hr class="my-3">

        <div class="d-grip col-4">
            <button type="button" class="btn btn-outline-dark btn-lg mt-2" @click="this.$router.push({ path: `/doctorView/create` })">
                Fragebogen erstellen
            </button>
            <button type="button" class="btn btn-outline-dark btn-lg mt-2" @click="this.$router.push({ path: `/doctorView` })">
                Fragebögen auslesen
            </button>
        </div>
    </div>
</template>

<script>
</script>

<style scoped>
</style>
