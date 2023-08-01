<template>
    <div>
        <div class="image-carousel">
            <div class="image-container">
                <div class="image-wrapper">
                    <div class="image-overlay" :ref="imageOverlay">
                        <img v-if="recognized" :src="checker" alt="Checker" :style="overlayImageStyle" class="overlay-image"
                            :ref="checker" />
                        <img :src="currentImage" alt="Image" class="background-image" :ref="bgimage" />
                        <button v-if="currentIndex < images.length - 1" @click="nextImage"
                            :disabled="currentIndex === images.length - 1">Nächstes Bild... </button>
                        <button v-else @click="calculateResult">Test abschließen</button>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>

import images from "../plugins/images.js";

export default {
    props: {
        images: {
            type: Array,
            required: true,
            checker: String,
        },
        recognized: Boolean,
    },
    emits: ["testfinished", "nextimage"],

    data() {
        return {
            currentIndex: 0,
            overlayImageStyle: {},
        };
    },
    computed: {
        currentImage() {
            return this.images[this.currentIndex];
        },
    },
    created() {
        this.checker = (images['checker']);
    },
    mounted() {
        this.calculateOverlaySize();
        window.addEventListener('resize', this.calculateOverlaySize);
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.calculateOverlaySize);
    },
    methods: {
        nextImage() {
            if (this.currentIndex < this.images.length - 1) {
                this.currentIndex++;
            }

            console.log("nextImage");
            this.$emit("nextimage");

        },
        calculateResult() {
            console.log("calculateResult");
            this.$emit("testfinished");

        },
        calculateOverlaySize() {
            const backgroundImage = this.$refs.bgimage;
            const overlayChecker = this.$refs.checker;
            if (backgroundImage && overlayChecker) {
                const bgWidth = backgroundImage.clientWidth;
                const overlayWidth = bgWidth * 0.5;
                const aspectRatio = overlayChecker.naturalWidth / overlayChecker.naturalHeight;
                const overlayHeight = overlayWidth / aspectRatio;

                this.overlayImageStyle = {
                    width: `${overlayWidth}px`,
                    height: `${overlayHeight}px`,
                    top: `50%`,
                    left: `50%`,
                    transform: `translate(-50%, -50%)`,
                    zIndex: 1,
                };
            }
        },
    },
};
</script>

<style>
.image-carousel {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.image-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
    /* Add some spacing between the image and the button */
}

.image-wrapper {
    max-width: 80%;
    max-height: 300px;
    /* Adjust the height as per your preference */
    display: flow-root;
    justify-content: center;
    align-items: bottom;
    margin-bottom: 10px;
    /* Add some spacing between the image and the button */
}

.image-wrapper img {
    max-width: 80%;
    max-height: 80%;
}

/* Style the "Next" button */
.image-carousel button {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;
}

.image-carousel button:disabled {
    background-color: #c0c0c0;
    cursor: not-allowed;
}

.image-overlay {
    position: relative;
}

.background-image,
.overlay-image {
    display: block;
    width: 100%;
}

.overlay-image {
    position: absolute;
}
</style>