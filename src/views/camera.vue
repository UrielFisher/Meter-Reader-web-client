<script>
export default{
  name: "Camera",
  data() {
    return {
      height: 0,
      width: 320,
      streaming: false,
    }
  },
  mounted() {
    const video = document.getElementById("video")
    const canvas = document.getElementById("canvas")
    const picture = document.getElementById('picture');
    const snapButton = document.getElementById('snapButton');
    
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then((stream) => {
      video.srcObject = stream  
      video.play()
    })
    .catch((error) => {
      console.log("ERROR: "+ error);
      // go back to home screen
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
    <video id="video"></video>
    <img id="picture" />
    <button id="snapButton">Take picture</button>
    <canvas id="canvas"></canvas>
  </div>
</template>

<style scoped>
#parent {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

#video {
  position: absolute;
  width: 100%;
  height: 100%;
}

#picture {
  position: absolute;
  width: 100%;  
  /* height: 100%; */
}

#snapButton {
  position: absolute;
  bottom: 10vh;
  bottom: 10dvh;
  width: 10vw;
  height: 10vh;
  left: 45vw;
  border-radius: 50px;
}

#canvas {
  display: none;
}

@media (orientation: portrait){
  #snapButton {
    width: 10vh;
    left: calc(50vw - 5vh);
  }
}
</style>