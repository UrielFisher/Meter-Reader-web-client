<script>
import { mapActions } from 'pinia';
import { useMainStore } from './stores/main';

export default{
  name: "App",
  methods: {
    ...mapActions(useMainStore, ['initiate']),
    getImageAsBase64(imagePath) {
      fetch("http://localhost:5173/public/google-ocr-sign.jpg")
        .then(response => response.blob())
        .then(blob => {
          var reader = new FileReader();
          reader.onload = () => {
            const b64 = reader.result.split(',')[1];
            if(b64) {
              // send to ocr
            }
            else {console.log("Empty base64")}
          };
          reader.readAsDataURL(blob);
        })
        .catch(error => {
          console.log("Error B64ing image: " + error)
        });
    },
  },
  created() {
    this.$router.push("/")
    this.initiate()
  },
}
</script>

<template>
  <div id="base">
    <router-view />
  </div>
</template>

<style>
#base {
  height: 100%;
  width: 100%;
}

.parent {
  height: 100%;
  width: 100%;
}

.backButton {
  float: right;
  font-size: 18px;
  height: 30px;
  width: 30px;
  margin: 10px;
  opacity: 0.8;
  border: none;
  background-color: transparent;
}
</style>