<template>
    <div id="app">
        <div>
            <!-- navbar -->
            <NavBar />
        </div>
        <div>
            <!-- body -->
            <router-view class="router-container" />
        </div>
        <div>
            <!-- footer -->
            <Foot />
        </div>
    </div>
</template>

<script>
    import NavBar from './components/NavBar.vue';
    import Foot from './components/Foot.vue';

    export default {
        name: 'app',
        components: {
            NavBar,
            Foot
             
        }
    };
</script>

<style>
    .router-container {
        margin: 0 50px;
    }

    #app {
        background-color: #e1ecf3;
    }

    .boxStyling {
        border-radius: 20px;
        box-shadow: 0px 0px 5px #aaaaaa;
        padding: 15px;
        margin: 20px 0;
        background-color: white;
    }
</style>

