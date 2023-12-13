<template>
    <div class="container">
        <legend>Login</legend>
        <hr class="my-3">
        <form class="mt-3">
            <div id="v-step-1" class="col-6 pb-3">
                <label class="control-label" for="mail">
                    Email
                </label>
                <div class="input-group">
                    <span class="input-group-text">
                        <BootstrapIcon icon="envelope-at" size="1x" />
                    </span>
                    <input class="form-control" v-model="owner_mail" placeholder="Bitte Email eingeben" />
                    <!-- <input class="form-control" id="mail" v-model="owner_mail" placeholder="Bitte Email eingeben" /> -->
                </div>
            </div>
            <div class="col-6 pb-3">
                <label class="control-label" for="passphrase">
                    Passwort
                </label>
                <div class="input-group">
                    <span class="input-group-text">
                        <BootstrapIcon icon="lock" size="1x" />
                    </span>
                    <input id="v-step-2" class="form-control" v-model="passphrase" placeholder="Bitte Kennwort eingeben"
                    :type="passwordFieldType" />
                    <!-- <input class="form-control" id="passphrase" v-model="passphrase" placeholder="Bitte Kennwort eingeben"
                    :type="passwordFieldType" /> -->
                    <div class="input-group-append">
                        <button id="passBtn" class="btn btn-outline-dark" type="button" @click="switchVisibility()">
                            <BootstrapIcon v-if="this.clicked === true" icon="eye" size="1x" />
                            <BootstrapIcon v-else icon="eye-slash" size="1x" />
                        </button>
                    </div>
                </div>
            </div>
            <div class="custom-file mt-3">
                <input id="v-step-3" type="file" class="custom-file-input mt-3">
                <!-- <input id="selectFile" type="file" class="custom-file-input mt-3"> -->
            </div>
            <div class="d-grip col-4">
                <button id="v-step-4" type="button" class="btn btn-outline-dark btn-lg mt-2">
                    Login
                </button>
            </div>
        </form>
    </div>
</template>

<script>

export default { }
</script>

<style scoped>
.error {
    color: red;
    margin-top: 5px;
}

.success {
    color: green;
    margin-top: 5px;
}

.empty {
    border: 1px solid red;
}

#passBtn {
    border-color: #dee2e6
}
</style>
