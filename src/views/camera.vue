<script>
export default{
  name: "Camera",
  data() {
    return {
      height: 0,
      width: 320,
      streaming: false,
      toggleToSnap: false,
    }
  },
  mounted() {
    const video = document.getElementById("video")
    const canvas = document.getElementById("canvas")
    const picture = document.getElementById('picture');
    const snapButton = document.getElementById('snapButton');
    
    navigator.mediaDevices.getUserMedia({video: {facingMode: {exact: "environment"}}})  
    .then((stream) => {
      video.srcObject = stream  
      video.play()
    })
    .catch((error) => {
      console.log("ERROR: "+ error);
    })

    video.addEventListener(
      "canplay",
      () => {
        if (!this.streaming) {
          this.height = (video.videoHeight / video.videoWidth) * this.width;
        
          video.setAttribute("width", this.width);
          video.setAttribute("height", this.height);
          canvas.setAttribute("width", this.width);
          canvas.setAttribute("height", this.height);
          this.streaming = true;
        }
      },
      {once: true},
    );
    snapButton.addEventListener(
      "click",
      (ev) => {
        ev.preventDefault();
        this.takePicture();
      },
      false
    );
  },
  methods: {
    takePicture() {
      const context = canvas.getContext("2d");
      if (this.width && this.height) {
        canvas.width = this.width;
        canvas.height = this.height;
        context.drawImage(video, 0, 0, this.width, this.height);
      
        const data = canvas.toDataURL("image/png");
        picture.setAttribute("src", data);
      } else {
        this.clearPicture();
      }
    },
    clearPicture() {
      const context = canvas.getContext("2d");
      context.fillStyle = "#AAA";
      context.fillRect(0, 0, canvas.width, canvas.height);

      const data = canvas.toDataURL("image/png");
      picture.setAttribute("src", data);
    },
  },
}
</script>

<template>
  <div id="parent">
    <canvas id="canvas"></canvas>
    <video id="video"></video>
    <Transition name="image"><img id="picture" :key="toggleToSnap" /></Transition>
    <button id="backButton" @click="$router.push('/')">></button>
    <button id="snapButton" @click="toggleToSnap=!toggleToSnap">Take picture</button>
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
  height: 30vh;
  /* height: 100dvh; */
  outline: 5px dashed black;
  outline-offset: -5px;
  transition: 0.3s linear;
}

.snap-enter-from {
  width: 100%;
  height: 100vh;
}

#snapButton {
  position: fixed;
  width: 10vh;
  height: 10vh;
  bottom: 10vh;
  left: calc(50vw - 5vh);
  border-radius: 50px;
  /* outline: 3px dashed orange; */
}

#backButton {
  float: right;
  font-size: 18px;
  height: 30px;
  width: 30px;
  margin: 10px;
  opacity: 0.8;
  border: none;
  background-color: transparent;
}

#canvas {
  display: none;
}
</style>