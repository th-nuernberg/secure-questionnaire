<template>
    <div class="image-carousel">
        <div class="image-container">
        <div class="image-wrapper">
            <img :src="currentImage" alt="Image">
        </div>
        </div> 
        <button v-if="currentIndex<images.length-1" @click="nextImage" :disabled="currentIndex === images.length - 1">Nächstes Bild... </button>
        <button v-else @click="calculateResult">Test abschließen</button>
    </div>
</template>

<script>
export default {
    props: {
        images: {
            type: Array,
            required: true,
        },
    },
    emits: ["displayedlastimage"],

    data() {
        return {
            currentIndex: 0,
        };
    },
    computed: {
        currentImage() {
            return this.images[this.currentIndex];
        },
    },
    methods: {
        nextImage() {
            if (this.currentIndex < this.images.length - 1) {
                this.currentIndex++;
            }

        },
        calculateResult() {
            console.log("calculateResult");
            this.$emit("displayedlastimage");

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
  margin-bottom: 10px; /* Add some spacing between the image and the button */
}

.image-wrapper {
  max-width: 80%;
  max-height: 300px; /* Adjust the height as per your preference */
  display: flow-root;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px; /* Add some spacing between the image and the button */
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
</style>