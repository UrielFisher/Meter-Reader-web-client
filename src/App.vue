<script>
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'

export default{
  components: {
    HelloWorld,
    TheWelcome,
  },
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
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />
    </div>
  </header>

  <main>
    <TheWelcome />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
