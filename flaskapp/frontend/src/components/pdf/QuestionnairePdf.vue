<template>
    <section class="user-details p-5">
        <div class="text-center">
            <h1>Infoblatt zum Fragebogen</h1>
            <h1>{{title}}</h1>
            <qr-code :content=content class="qr"></qr-code>
        </div>
        <h4>1. Fragebogen öffnen</h4>
        <p>
            Um den Fragebogen zu öffnen, scannen Sie den obigen QR-Code mit einem QR-Code-Scanner Ihrer Wahl.
            Sie können dazu zum Beispiel Ihr Smartphone benutzen.
        </p>
        <p>Alternativ können Sie den QR-Code auch direkt auf www.website.de einscannen.</p>
        <p>Falls Sie keine Kamera zur Verfügung haben, können Sie auch folgenden Code unter www.website.de eingeben:</p>
        <div class="text-center">
            <p class="font-weight-bold p-2 d-inline code">{{ queID }}</p>
        </div>
        <h4>2. Fragebogen ausfüllen</h4>
        <p>
            Füllen Sie den Fragebogen nach Anweisungen des Arztes aus und speichern Sie ihn anschließend.
            <br>Nach dem Speichern erhalten Sie eine weitere Datei mit einem neuen QR-Code, der genutzt werden kann, um Ihre verschlüsselten Antworten zu entschlüsseln.
            <br>Mit diesem können Sie Ihre Antworten im Nachhinein bearbeiten und ergänzen.
            <br> Beachten Sie, dass bei einer Änderung Ihrer Antworten aus Sicherheitsgründen immer ein neuer QR-Code erstellt wird und somit der alte QR-Code an Gültigkeit verliert.
        </p>
        <h4>3. Fragebogen auswerten</h4>
        <p>Bringen Sie den aktuellen QR-Code beim nächsten Termin mit, damit der Arzt Ihre Antworten auswerten kann.</p>
    </section>
</template>

<script>
    import QrCode from "@/components/QrCode"

    export default {
        props: {
            content: String,
            queID: String,
            title: String
        },
        components: {
            QrCode
        },
    }
</script>

<style lang="scss" scoped>
    .qr {
        width: 300px;
        height: 300px;
        margin-right: auto;
        margin-left: auto;
        margin-top: 50px;
        margin-bottom: 50px;
    }

    .code {
        border-radius: 10px;
        border: 2px solid black;
    }

    h4 {
        margin-top: 20px;
    }
</style>