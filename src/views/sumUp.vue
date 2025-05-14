<script>
import { mapStores } from 'pinia';
import { useMainStore } from '../stores/main.js'
import SumMajor from './../components/sumMajor.vue'
import * as htmlToImage from 'html-to-image'
// delete sewer data before save if irrelevant
export default {
  name: "SumUp",
  components: {SumMajor},
  data: () => ({
    canShare: false,
    wasDownloaded: false
  }),
  computed: {
    ...mapStores(useMainStore),
    name() {
      return this.$route.params.name
    },
    store() {
      return this.mainStore.stores[this.name]
    },
    date() {
      // return new Date().toISOstring   .split("T")[0]
      const d = new Date
      return `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`
    },
    sewerAmount() {
      // check for time in months since last bill
      return [2, 3, 4]
    },
  },
  methods: {
    async getFile() {
      const paper = this.$refs.paper
      const blob = await htmlToImage.toBlob(paper)
      const dateStr = this.date.split("/").slice(1,3).join(".")
      return new File([blob], `${this.name}-${dateStr}.png`, {type: blob.type})
    },
    async shareImage() {
      const file = await this.getFile()
      if(navigator.canShare({files: [file]}))
        navigator.share({files: [file]})
    },
    async download() {
      const file = await this.getFile()
      const link = window.URL.createObjectURL(file)
      let a = document.createElement("a")
      a.href = link
      a.setAttribute("download", '')
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(link)
      this.wasDownloaded = true
    },
    async whatsapp() {
      if(!this.wasDownloaded)
        await this.download()
      window.open("https://wa.me/" + this.mainStore.stores[this.name].pstn)
    },
    loadDefaultRates() {
      for(const type in this.store.rates) {
        this.store.rates[type] = this.mainStore[type[0] + "Rate"]
      }
    }
  },
  created() {
    if(navigator?.canShare && navigator.canShare({text: ""}))
      this.canShare = true
    this.loadDefaultRates()
    fetch(window.serverAddress + '/records/', {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify((({indivId, total, rates, readings}) => ({indivId, total, rates:JSON.stringify(rates), readings:JSON.stringify(readings)}))(this.mainStore.stores[this.name]))
    })
  },
}
</script>

<template>
  <div class="parent">
    <button class="backButton" @click="$router.push('/')">></button>
    <div id="paper" ref="paper">
      <div id="header">
        <h3 id="name">{{ store.name }}</h3>
        <input id="date" placeholder="תאריך:" :value="date"></input>
      </div>
      <div id="content">
        <span id="parts">
          <div id="electricity" v-if="store.readings.electricity">
            <h5 class="partTitle">חשמל</h5>
            <SumMajor class="partBody" type="electricity" />
          </div>
          <div id="water" v-if="store.readings.water">
            <h5 class="partTitle">מים</h5>
            <SumMajor class="partBody" type="water" />
          </div>
          <div class="part" id="gas" v-if="store.readings.gas">
            <h5 class="partTitle">גז</h5>
            <p class="partBody subTotal">{{store.readings.gas * store.rates.gas}} = {{store.rates.gas}} • {{store.readings.gas}}</p>
          </div>
          <div class="part" id="sewer" v-if="store.readings.sewer">
            <h5 class="partTitle">ביוב</h5>
            <p class="partBody">{{ sewerAmount.join("/") }}</p>
            <p class="partBody subTotal">{{sewerAmount.length * store.rates.sewer}} = {{store.rates.sewer}} • {{sewerAmount.length}}</p>
          </div>
        </span>
        <span id="sum">
          <div class="sumDiv">
            <p class="additive" v-for="v, k in Object.fromEntries(Object.entries(store.readings).filter(x => x[1]))">{{ (v * store.rates[k]).toFixed(2) }}</p>
            <p id="total">{{ store.total }}</p>
          </div>
        </span>
      </div>
    </div>
    <!-- <footer id="shareBar">
      <button class="shareBtn" @click="download"></button>
      <button class="shareBtn" @click="shareImage" v-if="canShare">Share</button>
      <button class="shareBtn" @click="whatsapp"></button>
    </footer> -->
  </div>
</template>

<style scoped>
#paper {
  height: calc(100vw * 1.414);
}

#header {
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
  height: 10%;
  padding: 10px;
}

#name {
  text-decoration: underline;
}

#date {
  background-color: transparent;
  border: none;
  font-size: 1rem;
}

#content {
  height: 90%;
  padding: 0px 15px 15px;
  direction: rtl;
  display: flex;
}

.part {
  width: max-content;
}

.partTitle{
  width: fit-content;
  padding: 5px;
  font-weight: bold;
  border-radius: 50%;
  border: 1px solid black;
}

.partBody { margin-right: 10vw; }

:is(#gas, #sewer) .partBody {
  width: fit-content;
  margin-right: auto;
}

#sum {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: end;
  align-items: end;
}

.sumDiv {
  height: fit-content;
  width: fit-content;
}

.additive {
  border-bottom: 1px solid black;
}

#total{
  width: fit-content;
  border-top: 1px solid black;
  border-bottom: 3px double black;
}

#shareBar {
  position: fixed;
  bottom: 0;
  height: 50px;
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: lightsteelblue;
}

.shareBtn {
  height: 80%;
  aspect-ratio: 1/1;
  border-radius: 10px;
  background-size: 70%;
  background-repeat: no-repeat;
  background-position: 50% 50%;
}

.shareBtn:last-child {
  background-image: url("./../assets/img/whatsapp_logo_green.png");
}

.shareBtn:first-child {
  background-image: url("./../assets/img/download.svg");
}
</style>

<style>
.subTotal::after {
  content: "";
  display: block;
  position: relative;
  height: 3px;
  width: 20px;
  top: -0.3em;
  right: -0.8em;
  transform: rotate(-30deg);
  border-block: 1px solid black;
  z-index: 1;
}
</style>