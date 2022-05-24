<template>
    <div id="wrapper" style="background-color: #16a085;" class="home">
        <div class="text-center" id="h">
            <p id="head">
                Willkommen auf der Startseite. Wählen Sie einen Bereich aus:
            </p>
            <b-button pill variant="dark" to="patient">Patient</b-button>
            <br />
            <b-button pill variant="dark" class="btn" to="doctorView">Arzt</b-button>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'Home',
        data() {
            return {
                progress: 0,
                message: ""
            }
        },
        created: function () {
            document.body.style.backgroundColor = "#16a085";
        },
        destroyed: function () {
            document.body.style.backgroundColor = null;
        },

    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    #h {
        width: 500px;
        height: auto;
        background-color: rgb(198, 241, 200);
        margin: 0 auto;
        margin-top: 200px;
        border-radius: 20px;
    }

    #wrapper {
        height: 100%;
        justify-content: center;
        align-items: center;
        margin: 0;
        padding: 0px 10px;
        background-color: #16a085;
        width: 100%;
        height: 100%;
    }

    .btn {
        margin: 10px;
        height: auto;
        padding: 10px;
        width: 200px;
    }

    #text {
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        overflow: hidden;
        padding: 10px;
        margin: 30px;
        padding-top: 20px;
    }

    #head{
        font-size: 35px;
        margin: 5px auto 10px;
        padding-top: 20px;
    }

</style>

