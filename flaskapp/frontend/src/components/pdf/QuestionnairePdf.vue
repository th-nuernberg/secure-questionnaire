<template>
    <section class="user-details p-5">
        <h1>Unter folgendem QR-Code finden sie den Fragebogen:</h1>
        <qr-code :content=content ></qr-code>
        <br><br><br>
        <h1></h1>
        <h1>{{ queID }}</h1>
        <h1>Schritt 2</h1>
        <h1>Schritt 3</h1>
    </section>
</template>

<script>
    import QrCode from "@/components/QrCode"

    export default {
        props: {
            content: String,
            queID: String
        },
        components: {
            QrCode
        },
    }
</script>

<style lang="scss" scoped>
    qr-code {
        display: inline;
        margin: auto;
    }
</style>