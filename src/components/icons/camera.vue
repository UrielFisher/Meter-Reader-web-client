<script>
export default{
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
    const photo = document.getElementById('photo');
    const startbutton = document.getElementById('startbutton');
    
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then((stream) => {
      video.srcObject = stream  
      video.play()
    })
    .catch((error) => {
      console.log("ERROR: "+ error);
    })

    video.addEventListener(
      "canplay",
      (ev) => {
        if (!this.streaming) {
          this.height = (video.videoHeight / video.videoWidth) * this.width;
        
          video.setAttribute("width", this.width);
          video.setAttribute("height", this.height);
          canvas.setAttribute("width", this.width);
          canvas.setAttribute("height", this.height);
          this.streaming = true;
        }
      },
      false,
    );
    startbutton.addEventListener(
      "click",
      (ev) => {
        ev.preventDefault();
        this.takepicture();
      },
      false,
    );
  },
  methods: {
    takepicture() {
      const context = canvas.getContext("2d");
      if (this.width && this.height) {
        canvas.width = this.width;
        canvas.height = this.height;
        context.drawImage(video, 0, 0, this.width, this.height);
      
        const data = canvas.toDataURL("image/png");
        photo.setAttribute("src", data);
      } else {
        this.clearphoto();
      }
    },
    clearphoto() {
      const context = canvas.getContext("2d");
      context.fillStyle = "#AAA";
      context.fillRect(0, 0, canvas.width, canvas.height);

      const data = canvas.toDataURL("image/png");
      photo.setAttribute("src", data);
    },
  },
}
</script>

<template>
  <div id="parent">
    <video id="video"></video>
    <button id="startbutton">Take photo</button>
    <canvas id="canvas"> </canvas>
    <div class="output">
      <img id="photo" alt="The screen capture will appear in this box." />
    </div>
  </div>
</template>

<style scoped>
#parent {
  width: 100%;
  height: 100%;
}

#video {
  position: relative;
  width: 50%;
  height: 50%;
  top: 25vh;
  left:25vw;
  border: 3px solid black;
}

#startbutton {
  position: absolute;
}
</style>