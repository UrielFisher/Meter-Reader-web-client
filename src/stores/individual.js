import { acceptHMRUpdate, defineStore } from 'pinia'

export const makeIndividualStore = (name) => {
  const useIndividualStore = defineStore(name, {
    state: () => ({
      indivId: undefined,
      name: name,
      pstn: undefined,
      paysForSewer: false,
      lastRecordTime: undefined,

      eImg: {img: null,value: null},
      wImg: {img: null,value: null},
      rates: {
        electricity: null,
        water: null,
        gas: null,
        sewer: null,
      },
      previousReadings: {
        electricity: null,
        water: null,
      },
      readings: {
        electricity: null,
        water: null,
        gas: null,
        sewer: null,
      },
      // reset and fetch
    }),
    getters: {
      total: (state) => {
        let sum = 0
        for(let type in state.readings) {
          let amount
          try {
            amount = state.readings[type] - (state.previousReadings[type] ?? 0)
          } catch(e) {
            amount =  state.readings[type]
            console.error(`Previous readings of ${type} for ${state.name} are not Numbers like required`)
          }

          sum += amount * state.rates[type] ?? 0
        }
        return sum.toFixed(2)
      }
    },
    actions: {
    // fills the previousReadings object of the individual with the last record from the server
    getPreviousReadings() {
      fetch(`${window.serverAddress}/records/${this.indivId}/indexFromRecent/0`)
      .then(res => res.json())
      .then(res => {
        this.lastRecordTime = res.date
        return res.readings
      })
      .then(res => JSON.parse(res))
      .then((res) => {
        for(let type in res) {
           if(type in this.previousReadings)
            this.previousReadings[type] = res[type]
          }
      })
    }
    }
  })
  
  import.meta.hot?.accept(acceptHMRUpdate(useIndividualStore, import.meta.hot))
  return useIndividualStore
}