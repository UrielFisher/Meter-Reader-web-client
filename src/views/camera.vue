<script>
import { mapStores } from 'pinia';
import { useMainStore } from './../stores/main'

export default{
  name: "Camera",
  data() {
    return {
      videoStream: undefined,
      height: 0,
      width: 320,
      streaming: false,
      toggleToSnap: false,
      video: undefined,
      canvas: undefined,
      picture: undefined,
      snapButton: undefined,
    }
  },
  computed: {
    ...mapStores(useMainStore),
    indivStore() {
      return this.mainStore.stores[this.$route.params.name]
    },
    source() {
      if(this.$route.params.type)
        return this.indivStore[this.$route.params.type + 'Img']
      else {
        alert("התמונה לא נשמרה, נא לפתוח עמוד זה מחדש")
        return this.mainStore.currentPicture
      }
    },
  },
  mounted() {
    this.getElements()

    navigator.mediaDevices.getUserMedia({video: {facingMode: "environment"}})
    .then((stream) => {
      this.videoStream = stream
      this.video.srcObject = stream
      this.video.play()
    })
    .catch((error) => {
      console.error("healthy camera access or stream could not be obtained:\n" + error);
    })

    this.video.addEventListener(
      "canplay",
      () => {
        if (!this.streaming) {
          this.height = (this.video.videoHeight / this.video.videoWidth) * this.width;
        
          this.video.setAttribute("width", this.width);
          this.video.setAttribute("height", this.height);
          this.canvas.setAttribute("width", this.width);
          this.canvas.setAttribute("height", this.height);
          this.streaming = true;
        }
      },
      {once: true},
    );
    this.snapButton.addEventListener(
      "click",
      (ev) => {
        ev.preventDefault();
      },
      false
    );
  },
  unmounted() {
    if(this.videoStream?.getTracks) {
      this.videoStream.getTracks()[0].stop()
    } else {
      // terminate stream when it's created
    }
  },
  methods: {
    getElements() {
      this.video = document.getElementById("video")
      this.canvas = document.getElementById("canvas")
      this.picture = document.getElementById('picture');
      this.snapButton = document.getElementById('snapButton');
    },
    async takePicture() {
      const context = this.canvas.getContext("2d");
      if (this.width && this.height) {
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        context.drawImage(this.video, 0, 0, this.width, this.height);
      
        const data = this.canvas.toDataURL("image/png");
        //this.mainStore.currentPicture = data
        this.source.img = data
        const rawData = data.replace(/^data:image\/png;base64,/, '')
        this.source.value = await this.mainStore.ocr(rawData)
        const type = this.$route.params.type==="e" ? "electricity" : "water"
        this.indivStore.readings[type] = this.source.value?.join('')
        if(!this.source.value.includes(undefined))
          this.$router.push('/')
      } else {
        this.clearPicture();
      }
    },
    clearPicture() {
      const context = this.canvas.getContext("2d");
      context.fillStyle = "#AAA";
      context.fillRect(0, 0, this.canvas.width, this.canvas.height);

      const data = this.canvas.toDataURL("image/png");
      this.picture.setAttribute("src", data);
    },
  },
}
</script>

<template>
  <div id="parent">
    <canvas id="canvas"></canvas>
    <video id="video"></video>
    <Transition name="image"><img id="picture" :key="toggleToSnap" :src="this.source.img" v-if="this.source.img" /></Transition>
    <button class="backButton" @click="$router.push('/')">></button>
    <button id="snapButton" @click="takePicture(); toggleToSnap=!toggleToSnap;"><img src="/shutter.svg" alt="Take picture" /></button>
    <button id="galleryButton"><img src="/gallery.svg" alt="Gallery" /></button>
  </div>
</template>

<style scoped>
#parent {
  /* display: flex;
  justify-content: center;
  align-items: center; */
  /* position: fixed; */
  height: 100vh;
  height: 100dvh;
  /* outline: 5px dashed red;
  outline-offset: -5px; */
}

#video {
  position: fixed;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  /* outline: 3px dashed blue; */
  outline-offset: -3px;
}

#picture {
  position: fixed;
  width: 30%;
  height: fit-content;
  /* height: 100dvh; */
  outline: 5px dashed black;
  outline-offset: -5px;
}

.image-enter-from {
  transform: scale(calc(20/3));
}

.image-enter-active {
  transition:  0.1s ease-out;
}

#snapButton {
  position: fixed;
  height: 10vh;
  width: 10vh;
  bottom: 10vh;
  left: calc(50vw - 5vh);
  border-radius: 50%;
  border: none;
  cursor: pointer;
  background-color: hsl(0, 0%, 95%);
}

#snapButton:hover {
  background-color: hsl(0, 0%, 83%);
}

#snapButton > img {
  position: absolute;
  transform: translate(-50%, -50%);
  height: 101%;
}

#galleryButton {
  position: fixed;
  height: 8vh;
  width: 8vh;
  bottom: 30px;
  left: 30px;
  border-radius: 25px;
  background-color: hsl(0, 0%, 90%);
  cursor: pointer;
}

#galleryButton:hover {
  background-color: hsl(0, 0%, 83%);
}

#galleryButton > img {
  position: absolute;
  transform: translate(-50%, -50%);
  height: 70%;
}

#canvas {
  display: none;
}
</style>