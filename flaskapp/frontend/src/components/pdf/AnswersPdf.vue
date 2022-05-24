<template>
    <section class="p-5">
        <h1>Antworten bearbeiten</h1>
        <p v-if="repeating">Scannen Sie folgenden QR-Code ein, um Ihre Antworten zu bearbeiten oder weitere Einträge hinzuzufügen.</p>
        <p v-else>Scannen Sie folgenden QR-Code ein, um Ihre Antworten zu bearbeiten.</p>
        <qr-code :content=contentPatient></qr-code>
        <h1>Antworten anzeigen</h1>
        <p>Geben Sie folgenden QR-Code an Ihren Arzt weiter, damit dieser Ihre Antworten auswerten kann.</p>
        <qr-code :content=contentDoctor></qr-code>

        <p>Alternativ kann auch folgender Code manuell eingegeben werden:</p>
        <h1>{{ answersID }}</h1>

    </section>
</template>

<script>
    import QrCode from "@/components/QrCode"

    export default {
        props: {
            answersID: String,
            AESkey: Uint8Array,
            repeating: Boolean
        },
        components: {
            QrCode
        },
        data() {
            return {
                patient: {
                    type: "answersPatient",
                    ID: this.answersID,
                    key: this.decodedKey()
                },

                doctor: {
                    type: "answersDoctor",
                    ID: this.answersID,
                    key: this.decodedKey()
                }
            }
        }, 
        computed: {
            contentPatient() {
                return JSON.stringify(this.patient);
            },
            contentDoctor() {
                return JSON.stringify(this.doctor);
            },
        },
        methods: {
            decodedKey() {
                return Buffer.from(this.AESkey).toString('base64');
            }
        }
    }
</script>

<style lang="scss" scoped>
    qr-code {
        display: inline;
        margin: auto;
    }
</style>