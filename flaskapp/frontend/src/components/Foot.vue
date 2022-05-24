<template>
    <div class="foot">
        <div class="container p-5"> 
            <div class="row text-white text-center p-5">
                <div class="col-sm">
                    <h3>Anfahrt</h3>
                    <p><a class="text-white text-decoration-none" target="_blank" href="https://www.google.de/maps/place/Technische+Hochschule+N%C3%BCrnberg+Georg-Simon-Ohm+%7C+Fakult%C3%A4t+Informatik/@49.4583422,11.1001839,17z/data=!4m13!1m7!3m6!1s0x479f579168cdc6cd:0xc93e84f30657cf30!2sHohfederstra%C3%9Fe,+90489+N%C3%BCrnberg!3b1!8m2!3d49.4585552!4d11.1017451!3m4!1s0x479f579173e3b119:0x83c987085aebecdc!8m2!3d49.4583421!4d11.1023723">Hohfederstraße 40, 90489 Nürnberg</a></p>
                </div>
                <div class="col-sm">
                    <h3>Kontakt</h3>
                    <address>
                        <p class="text-break"><a class="text-white ms-2 text-decoration-none" href="mailto:webmaster@example.com">BeschtesITeam@gmail.com</a></p>
                    </address>
                    <p><a href="tel: 1234567" class="text-decoration-none text-white">Tel: 1234567</a></p>
                </div>
                <div class="col-sm">
                    <h3>Arbeitszeiten</h3>
                    <p>Mo, Mi, Fr : 08:00 - 18:00</p>
                    <p>Di, Do: 08:00 - 13:00</p>
                </div>               
            </div>
            <hr class="mt-3 text-secondary">
            <div class="container-fuiled">
                <!-- row -->
                <div class="row">
                    <!-- copyright column -->
                    <div class="col-sm">
                        <div class="p-3 text-white text-center">
                            © Copyright :
                            <a class="text-white text-decoration-none" href="https://git.informatik.fh-nuernberg.de/miehlinglu71510/it-projekt-master.git">IT-Projekt Schlafambulanz</a>
                        </div>
                    </div>                  
                    <!-- Privacy Policy link and Terms Condition link column -->
                    <div class="col-sm p-3  text-white text-center">
                        <div class="col">
                            <a href="javascript:void(0)" class="text-decoration-none text-white pe-3">Privacy Policy </a>
                            <a href="javascript:void(0)" class="text-decoration-none text-white ps-3"> Terms Condition</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { ref } from 'vue'
    export default {
        name: 'foot',
        setup() {
            //Copyright Date
            const date = ref(new Date().getFullYear())
            return {
                date
            }
        }
    }
</script>

<style scoped>
    .foot {
        background-color: #2A2A2A;
        margin-top: 500px;
    }
</style>