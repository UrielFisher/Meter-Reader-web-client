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
  async mounted() {
    let dat = "PCFET0NUWVBFIGh0bWw+CjxodG1sIGxhbmc9ImVuIj4KICA8aGVhZD4KICAgIDxzY3JpcHQgdHlwZT0ibW9kdWxlIiBzcmM9Ii9AaWQvdmlydHVhbDp2dWUtZGV2dG9vbHMtcGF0aDpvdmVybGF5LmpzIj48L3NjcmlwdD4KICAgIDxzY3JpcHQgdHlwZT0ibW9kdWxlIiBzcmM9Ii9AaWQvdmlydHVhbDp2dWUtaW5zcGVjdG9yLXBhdGg6bG9hZC5qcyI+PC9zY3JpcHQ+CgogICAgPHNjcmlwdCB0eXBlPSJtb2R1bGUiIHNyYz0iL0B2aXRlL2NsaWVudCI+PC9zY3JpcHQ+CgogICAgPG1ldGEgY2hhcnNldD0iVVRGLTgiPgogICAgPGxpbmsgcmVsPSJpY29uIiBocmVmPSIvZmF2aWNvbi5pY28iPgogICAgPG1ldGEgbmFtZT0idmlld3BvcnQiIGNvbnRlbnQ9IndpZHRoPWRldmljZS13aWR0aCwgaW5pdGlhbC1zY2FsZT0xLjAiPgogICAgPHRpdGxlPlZpdGUgQXBwPC90aXRsZT4KICA8L2hlYWQ+CiAgPGJvZHk+CiAgICA8ZGl2IGlkPSJhcHAiPjwvZGl2PgogICAgPHNjcmlwdCB0eXBlPSJtb2R1bGUiIHNyYz0iL3NyYy9tYWluLmpzP3Q9MTcxMzczNTE0MDY4MSI+PC9zY3JpcHQ+CiAgPC9ib2R5Pgo8L2h0bWw+Cg=="
    // await this.getImageAsBase64("./assets/google-ocr-sign.jpg", (base64String) => {
    //   if(!base64String) console.log("Empty base64");
    //   dat = base64String ? base64String : ""
    // });
    this.json.requests[0].image.content = dat
    console.log(JSON.stringify(this.json));
    fetch("https://vision.googleapis.com/v1/images:annotate",{
      method: "POST",
      body: JSON.stringify(this.json)
    })
    .then(()=>{console.log("success");})
    .catch(()=>{console.log("failure");})
  },
  methods: {
    getImageAsBase64(imagePath, callback) {
      fetch(imagePath)
        .then(response => response.blob())
        .then(blob => {
          var reader = new FileReader();
          reader.onload = function() {
            callback(reader.result.split(',')[1]);
          };
          reader.readAsDataURL(blob);
        })
        .catch(error => {
          callback(null);
        });
    },
    async notWorkingHere() {
      const vision = require('@google-cloud/vision')
      const client = new vision.ImageAnnotatorClient()
      const [result] = await client.labelDetection('./assets/google-ocr-sign.jpg')
      const labels = result.labelAnnotations
      console.log("Labels:\n");
      labels.forEach((label) => {console.log(label.description);})
    }
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
