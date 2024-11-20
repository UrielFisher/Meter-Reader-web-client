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
    patternLength: 5,
    patternExtension: 1,  // for fractions, -----.-, each user sets manually
    currentPicture: null,  // not benefitial without history, but may be filled from 'camera' on route errors
  }),
  // getters: {
  //   currentStore: (state) => {
  //     return state.stores
  //   }
  // },
  actions: {
    // Initiates the stores for all saved individuals
    initStores() {
      for(let individual of this.individualsArray) {
        if(!Object.keys(this.stores).includes(individual))
          this.stores[individual] = makeIndividualStore(individual)()
      }
    },

    /**
     * Sends a JSON encased, Base-64 encoded image to the Google Cloud OCR API. Fetches as well.
     * @param {String} b64 - Base 64 encoded image
     * @returns {Object} - OCR result
     */
    async ocr(b64) {
      if(!b64) return
      json.requests[0].image.content = b64
      return await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${import.meta.env.VITE_KEY}`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(json)
      })
      .then(data=> data.json())
      .then(data => data.responses[0])
      .then(data => this.actualReading(data))
      .catch((e)=>{console.log("failure: " + e);})
    },

    /**
     * Takes raw data returned from OCR and initiates
     * population of data pattern with relevant results
     * @param {Object} ocrResult
     * @returns {Array} from @function fillPattern
     */
    actualReading(ocrResult) {
      let pattern = []
      for(let i=0;i<this.patternLength;i++)
        pattern.push(undefined)
      const regex = new RegExp(`^\\d{${this.patternLength},${this.patternLength+this.patternExtension}}$`)

      let possibilities = []
      for(const [index, {description}] of ocrResult.textAnnotations.entries()) {
        if(regex.test(description))
          possibilities.push(index)
      }
      console.log("Possible OCR blocks:", possibilities);
      if(!possibilities.length){
        console.warn("No data from the image was found to fit the pattern");
        return []
      }

      // use 'possibilities' for getting options to compare with last reading value, and also use with multi meter reading
      console.log("Out of the following blocks:", ocrResult.fullTextAnnotation.pages[0].blocks);
      
      const ocrData = ocrResult.fullTextAnnotation.pages[0].blocks[possibilities[0] - 1].paragraphs[0].words[0].symbols.slice(0,pattern.length)
      return this.fillPattern(pattern, ocrData)
    },

    /**
     * Populates the empty 'pattern' with digits from 'ocrData'.
     * Using distance derived from vertex values, if 'pattern'
     * is longer than the data, than appropriately placed spaces
     * are inserted as well.
     * @param {Array} pattern - []
     * @param {Array} ocrData - [{ {[vertices]} , "text"}]
     * @returns {Array} pattern populated by ocrData
     */
    fillPattern(pattern, ocrData) {
      // Create auxilary array 'gaps' to store pixel distance between subsequent characters,
      // used for figuring out later the position of unrecognised characters
      const locations = ocrData.map(coords => this.centerPoint(coords.boundingBox.vertices))
      let gaps = [], smallestGaps = []
      for(let i = 0; i < locations.length-1; i++) {
        const xDiff = Math.abs(locations[i][0] - locations[i+1][0])
        const yDiff = Math.abs(locations[i][1] - locations[i+1][1])
        const distance = Math.sqrt(xDiff ** 2 + yDiff ** 2)
        gaps.push(distance)
      }
      // Used to find base distance beteen consecutive digits in average
      let smallestUnitGap = gaps[0]
      for(let d = 0; d < gaps.length; d++) {
        if(gaps[d] < smallestUnitGap * 0.75) {
          smallestUnitGap = gaps[d]
          smallestGaps = [gaps[d]]
        }
        else if(gaps[d] < smallestUnitGap * 1.5) {
          smallestGaps.push(gaps[d])
          smallestUnitGap = smallestGaps.reduce((accumulator, gap) => accumulator + gap) / smallestGaps.length
        }
      }
      // gaps[pixel distance] parallel to finalGaps[eventual character distance]
      const finalGaps = gaps.map(() => 0)
      const emptySpaces = pattern.length - ocrData.length
      for(let space = 0; space < emptySpaces; space++) {
        finalGaps[gaps.indexOf(Math.max(...gaps))]++
        gaps[gaps.indexOf(Math.max(...gaps))] -= smallestUnitGap
      }
      // Go over the data, and increment the pointer 'fillPointer' to the index where the
      // data should be placed on the pattern based on the gaps
      let fillPointer = 0
      for(let i=0; i < ocrData.length; i++) {
        pattern[fillPointer] = ocrData[i].text
        fillPointer += (finalGaps[i] ?? 0) + 1
      }
      return pattern
    },

    /**
     * Returns the average of vertices
     * Should be the middle, as expecting rectangles
     * @param {Array} vertices - [{x,y}]
     * @returns {Array} - [x, y]
     */
    centerPoint(vertices) {
      let [x, y] = [0, 0]
      for (const vertex of vertices) {
        x += vertex?.x ?? 0
        y += vertex?.y ?? 0
      }
      x /= vertices.length
      y /= vertices.length
      return [x, y]
    },
  }
})

import.meta.hot?.accept(acceptHMRUpdate(useMainStore, import.meta.hot))