<template>
    <section class="user-details">
        <h1>Unter folgendem QR-Code finden sie den Fragebogen:</h1>
        <qr-code :content=content class="m-5"></qr-code>
        <p>{{content}}</p>
        <br><br><br>
        <h1>Hier könnte ihre Anleitung stehen:</h1>
        <h1>Schritt 1</h1>
        <h1>Schritt 2</h1>
        <h1>Schritt 3</h1>
    </section>
</template>

<script>
    import QrCode from "@/components/QrCode"

    export default {
        props: {
            content: String
        },
        components: {
            QrCode
        }
    }
</script>

<style lang="scss" scoped>
    qr-code {
        display: inline;
        margin:auto;
    }
</style>