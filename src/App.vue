<script>

export default{
  name: "App",
  data() {
    return {
      json: {
        "requests": [
          {
            "image": {
              "content": ""
            },
            "features": [
              {
                "type": "TEXT_DETECTION"
              }
            ]
          }
        ]
      }
    }
  },
  mounted() {
    this.getImageAsBase64("./assets/google-ocr-sign.jpg")
  },
  methods: {
    ocr(b64) {
      this.json.requests[0].image.content = b64
      fetch("https://vision.googleapis.com/v1/images:annotate",{
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(this.json)
      })
      .then(data=> data.json())
      .then((data) => {console.log(data)})
      .catch(()=>{console.log("failure");})
    },
    getImageAsBase64(imagePath) {
      fetch('http://localhost:5173/src/assets/google-ocr-sign.jpg')
        .then(response => response.blob())
        .then(blob => {
          var reader = new FileReader();
          reader.onload = function() {
            const b64 = reader.result.split(',')[1];
            if(b64) {
              this.ocr(b64)
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
}
</script>

<template>
  <div id="base">
    <router-view />
  </div>
</template>

<style>
#base {
  height: 100vh;
  width: 100vw;
}

.parent {
  height: 100%;
  width: 100%;
}
</style>