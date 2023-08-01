<template>
    <body>

        <h4>Kurztest zur Erfassung von Gedächtnis- und Aufmerksamkeitsstörungen</h4><br>

        <div class="Datenübermittlung" v-if="!this.transfer">
            <h5 class="txt-center">Datenübermittlung</h5>
            <p>Durch einen Klick auf den Button „Transfer starten“ wird ihr Testergebnis übermittelt. Sie erhalten im
                Anschluss einen QR-Code.</p>
            <button class="button" v-on:click="EncryptMessage(task_data)">Transfer starten</button>
        </div>

        <div v-if="this.transfer">

            <div v-if="this.error">
                <div class="error">{{ this.responseText }}</div>
            </div>
            <div v-if="!this.error">
                <div class="error">{{ this.responseText }}</div>
                <h5 class="txt-center">Bitte bewahren Sie den ausgedruckten QR-Code an einem sicheren Ort auf!</h5>
                Wenn Sie den ausgedruckten QR Code entsorgen, achten Sie bitte auf eine sichere Zerstörung, damit niemand
                anderes
                diesen verwenden kann.<br><br>
                <div v-if="task_data">
                    <h4>Resultate: </h4><br>
                    <h5 class="txt-center">Test 1: {{ test_res_1 }}</h5>
                    <h5 class="txt-center">Test 2: {{ test_res_2 }}</h5>
                    <h5 class="txt-center">Test 3: {{ test_res_3 }}</h5>
                    <h5 class="txt-center">Test 4: {{ test_res_4 }}</h5>
                    <h5 class="txt-center">Test 5: {{ test_res_5 }}</h5>
                    <h5 class="txt-center">Test 6: {{ test_res_6 }}</h5>
                    <h5 class="txt-center">Test 7: {{ test_res_7 }}</h5>
                </div>

                <button class="button" v-on:click="downloadQRCode()">Download QR-Code</button>
                <qrcode-vue id="qrcode" class=qrcode v-if=showQR :value="this.valueQR" :size="this.sizeQR" level="H" />
            </div>

        </div>

        <!-- <div v-if="task_data"> -->
        <!-- <pre>{{ task_data }}</pre> -->
        <!-- </div> -->
    </body>
</template>


<script >
import QrcodeVue from 'qrcode.vue';
import encryption from "../plugins/deEncryption.js";

export default {
    name: "app",
    components: {
        QrcodeVue,

    },
    data() {
        return {
            valueQR: "",
            showQR: false,
            sizeQR: 400,
            data: Object,
            secret: String,
            rsa_pub_key: String,
            task_data: [],
            transfer: Boolean,
            error: Boolean,
            audio: null,
            responseText: "",
            test_res_1: "",
            test_res_2: "",
            test_res_3: "",
            test_res_4: "",
            test_res_5: "",
            test_res_6: "",
            test_res_7: "",
        };
    },
    methods: {
        getData() {
            return this.$store.getters.getData;
        },
        generateQRCode(value, id) {
            this.showQR = true;
            this.valueQR = value.toLocaleString() + ";" + id;
        },
        downloadQRCode() {
            const a = document.createElement("a");
            var canvas = document.getElementById("qrcode");
            a.href = canvas.toDataURL("image/png");
            a.download = "qrcode.png";
            a.click();
        },
        async EncryptMessage(message) {
            this.error = false
            this.transfer = true;

            console.log(message);

            message = JSON.stringify(message);
            let id = crypto.randomUUID();

            let values = await encryption['AES']['encrypt'](message)

            this.generateQRCode(values['Key'], id)

            let body = {
                'Message': values['Cipher'],
                'IV': values['IV'],
                'ID': id
            }

            values = await encryption['AES']['encrypt'](body['Message'])

            body['Message'] = values['Cipher']
            body['IV2'] = values['IV']

            body['Key'] = await encryption['RSA']['encrypt'](this.rsa_pub_key, values['Key'])


            console.log(body)
            // let url = "http://localhost/POST/" + id  
            // fetch(url, {
            //   'method': "POST",
            //   "headers": {
            //     "Content-Type": "application/json"
            //   },
            //   "body": JSON.stringify(body)
            // }).then(this.handleResponse).catch(this.handleErrors)


        },
        handleResponse(response) {

            if (response.ok) {
                this.responseText = "Die Daten wurden erfolgreich Übermittelt.";
            }
            if (response.status == 409 || response.status == 503) {
                this.responseText = "Es gab ein Problem mit unserer Datenbank. Bitte wenden Sie sich an den technischen Support."
            }
            if (response.status == 400) {
                this.responseText = "Upps... Es wurden falsche Daten gesendet. Bitte wenden Sie sich an den technischen Support."
            }
            return response
        },
        handleErrors() {

            this.error = true;
            this.responseText = "Es gab einen Fehler bei der Datenübermittlung. Überprüfen Sie ihre Internetverbindung oder wenden Sie sich an den technischen Support."
        },
        calculateResults() {

            let task1_rec = this.task_data['1']['images'].map(entry => entry['recognized']).reduce((x, y) => x + y)
            let task1_time = 60 - this.task_data['1']['time']
            this.test_res_1 = "Aufgabe 1 - Gegenstände benennen: Ihre Bearbeitungszeit: " + task1_time + " Sekunden  ---  Erkannte Gegenstände: " + task1_rec + "/12"

            let task2_rec = 12 - (this.task_data['2']['missing']).length
            let task2_time = 60 - parseInt(this.task_data['2']['time'])
            this.test_res_2 = "Aufgabe 2 - Gegenstände unmittelbar reproduzieren: Ihre Bearbeitungszeit: " + task2_time + " Sekunden  ---  Erkannte Gegenstände: " + task2_rec + "/12"

            let task3_numbers = 10 - (this.task_data['3']['missing']).length
            let task3_time = 60 - parseInt(this.task_data['3']['time'])
            this.test_res_3 = "Aufgabe 3 - Zahlen lesen: Ihre Bearbeitungszeit: " + task3_time + " Sekunden  ---  Vorgelesene Zahlen: " + task3_numbers + "/10"

            let task4_correct = (this.task_data['4']['richtig'])
            let task4_time = 60 - this.task_data['4']['time']
            this.test_res_4 = "Aufgabe 4 - Zahlen ordnen: Ihre Bearbeitungszeit: " + task4_time + " Sekunden  ---  Zahlen wurden richtig geordnet: " + task4_correct

            let task5_time = 60 - this.task_data['5']['time']
            let taks5_result = (this.task_data['5']['result'])
            this.test_res_5 = "Aufgabe 5 - Symbole zählen: Ihre Bearbeitungszeit: " + task5_time + " Sekunden  ---  Richige Anzahl der Symbole: " + taks5_result

            let task6_rec = 12 - (this.task_data['6']['missing']).length
            let task6_time = 60 - this.task_data['6']['time']
            this.test_res_6 = "Aufgabe 6 - Gegenstände nach Ablenkung reproduzieren: Ihre Bearbeitungszeit:  " + task6_time + " Sekunden  ---  Erkannte Gegenstände: " + task6_rec + "/12"

            let task7_rec = 12 - (this.task_data['7']['missing']).length
            let task7_time = 60 - this.task_data['7']['time']
            this.test_res_7 = "Aufgabe 7 - Gegenstände wiedererkennen: Ihre Bearbeitungszeit: " + task7_time + " Sekunden  ---  Erkannte Gegenstände: " + task7_rec + "/12"

        }


    },
    created() {
        this.hide = false;
        this.transfer = false;
        this.$root.stop();
        this.task_data = this.getData();
        this.calculateResults();
        console.log(this.task_data);
        this.rsa_pub_key =
            `-----BEGIN PUBLIC KEY-----
    MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxMDhX3bxEgrA+9qb67KH
    BjQTK6xhx3NkaaCWQSdHheNKIejcZi1YQUssEGKelPKWr5/5sX2oy9W7CUx1ir3t
    jmSwkn5R5nxCbwbvkv+XGQuRYn+xlsiktjnQJEHV2gZcui+HX82++55bV2ac/Qap
    4mhz/TO+aQ2g5dwXeDrt+oC+qUIjlSTYDAvgDYRKlksJCKElpZLfLzEaVbhljSlo
    JCXj5EtJq/aHJUzKfJl13X+ykzq01dQmLzqjZ5Fn0RKnym0piJFzENK4KfqEkudd
    e601IpcoU2zUJmZYeCel/pBpn+/TMTnxd7wt64e8kmbCjTMSTAHBcBj8U/w0Q73H
    XwIDAQAB
    -----END PUBLIC KEY-----`;
    },
}
</script>
