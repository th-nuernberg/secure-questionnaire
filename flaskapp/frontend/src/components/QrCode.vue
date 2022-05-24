<template>
    <qrcode-vue :value="content" size="300" level="H" />
</template>
<script>
    import QrcodeVue from 'qrcode.vue'
    export default {
        props: {
            content: String
        },
        data() {
            return {
                size: 300
            }
        },
        components: {
            QrcodeVue,
        }
    }
</script>


<style scoped>
</style>