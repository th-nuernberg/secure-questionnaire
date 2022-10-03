<template>
    <div id="wrapper" class="home">
        <div class="text-center" id="h">
            <p id="head">
                Willkommen auf der Startseite. Wählen Sie einen Bereich aus:
            </p>
            <b-button pill variant="dark" class="btn" to="patient">Patient</b-button>
            <br />
            <b-button pill variant="dark" class="btn" to="doctorView">Arzt</b-button>
            <br />
        </div>
    </div>
</template>



<script>
    export default {
        name: 'Home'
    };
</script>


<style scoped>
    #h {
        width: 600px;
        height: auto;
        margin: 0 auto;
        margin-top: 200px;
        border-style: solid;
        border-radius: 30px;
        border-color: grey;
    }



    #wrapper {
        height: 100%;
        justify-content: center;
        align-items: center;
        margin: 0;
        padding: 0px 10px;
        width: 100%;
        height: 100%;
    }



    .btn {
        margin: 10px;
        height: auto;
        padding: 10px;
        width: 100px;

    }



    #text {
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        overflow: hidden;
        padding: 10px;
        margin: 30px;
        padding-top: 20px;
    }



    #head {
        font-size: 35px;
        margin: 5px auto 10px;
        padding-top: 20px;
    }
</style>