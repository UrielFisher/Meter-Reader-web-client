import { acceptHMRUpdate, defineStore } from 'pinia'
import { makeIndividualStore } from './individual.js'

let json = {
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

export const useMainStore = defineStore('main', {
  state: () => ({
    stores: {},
    individualsArray: ["ידז","עגד גשדשד","גדכגדשד"],
    eRate: null,
    wRate: null,
  }),
  // getters: {
  //   stores: () => ({

  //   })
  // },
  actions: {
    initStores() {
      for(let individual of this.individualsArray) {
        // if(!Object.keys(this.stores).includes(individual))
        this.stores[individual] = makeIndividualStore(individual)()
      }
    },
    async ocr(b64) {
      if(!b64) return
      json.requests[0].image.content = b64
      console.log(json);
      fetch(`https://vision.googleapis.com/v1/images:annotate?key=${import.meta.env.VITE_KEY}`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(json)
      })
      .then(data=> data.json())
      .then(data => data.responses[0])
      .then((data) => {console.log(data)})
      .catch(()=>{console.log("failure");})
    }
  }
})

import.meta.hot?.accept(acceptHMRUpdate(useMainStore, import.meta.hot))