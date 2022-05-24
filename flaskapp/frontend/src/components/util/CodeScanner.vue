<template>
    <div class="col">
        <div class="card">
            <qrcode-stream @decode="onDecode" @init="onInit" class="camera" />
            <div class="card-body">
                <p class="card-text">Scannen Sie hier Ihren CR-Code</p>
                <hr>
                <div class="alert" :class="alert" role="alert">
                    {{ status }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { QrcodeStream } from 'vue-qrcode-reader';

    export default {
        components: { QrcodeStream },
        data() {
            return {
                status: 'Kamera bereit!',
                alert: 'alert-warning',
            }
        },
        methods: {
            async onDecode(result) {
                if (result.includes('patient/questionnaire')) { //QR-Code vom Arzt mit kompletter URL
                    this.alert = 'alert-success'
                    let path = result.split("/");
                    let queID = path.pop();
                    this.$router.push({ name: 'PatientQuestionnaire', params: { id: queID } })
                }
                else {
                    let obj = JSON.parse(result);
                    if (obj.type === 'answersPatient' && obj.ID !== undefined && obj.key !== undefined) { //QR-Code zum Bearbeiten der Antworten
                        this.alert = 'alert-success'
                        this.$store.dispatch("getAnswers", { 'id': obj.ID, 'key': obj.key })
                            .then((answers) => {
                                this.$router.push({ name: 'PatientQuestionnaire', params: { id: answers.queID } })
                            })
                            .catch(() => {
                                this.alert = 'alert-warning'
                            })
                    }
                    if (obj.type === 'answersDoctor' && obj.ID !== undefined && obj.key !== undefined) { //QR-Code zum Auslesen durch Arzt
                        this.$emit('addAnalyseID', {
                            'id': obj.ID,
                            'key': obj.key
                        });
                    }
                }                
            },
            async onInit(promise) {
                try {
                    await promise
                } catch (error) {
                    if (error.name === 'NotAllowedError') {
                        this.alert = 'alert-danger'
                        this.status = "ERROR: Kamerazugriff notwendig!"
                    } else if (error.name === 'NotFoundError') {
                        this.alert = 'alert-danger'
                        this.status = "ERROR: Kamera notwendig!"
                    } else if (error.name === 'NotSupportedError') {
                        this.alert = 'alert-danger'
                        this.status = "ERROR: secure context required (HTTPS, localhost)"
                    } else if (error.name === 'NotReadableError') {
                        this.alert = 'alert-danger'
                        this.status = "ERROR: Kamera kann nicht doppelt verwendet werden!"
                    } else if (error.name === 'OverconstrainedError') {
                        this.alert = 'alert-danger'
                        this.status = "ERROR: Kamera ungeeignet."
                    } else if (error.name === 'StreamApiNotSupportedError') {
                        this.alert = 'alert-danger'
                        this.status = "ERROR: Stream API is not supported in this browser"
                    }
                }
            }
        }
    }

</script>

<style scoped>
</style>