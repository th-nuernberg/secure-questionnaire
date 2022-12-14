<template>
    <div class="foot">
        <div class="container p-3"> 
            <hr class="mt-3 text-secondary">
            <div class="container-fuiled">
                <!-- row -->
                <div class="row">
                    <!-- copyright column -->
                    <div class="col-sm">
                        <div class="p-3 text-white text-center">
                            © Copyright: Schlafambulanz
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
        margin-top: 300px;
    }
</style>