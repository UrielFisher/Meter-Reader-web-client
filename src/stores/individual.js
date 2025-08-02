import { acceptHMRUpdate, defineStore } from 'pinia'

export const makeIndividualStore = (name) => {
  const useIndividualStore = defineStore(name, {
    state: () => ({
      indivId: undefined,
      name: name,
      pstn: undefined,
      paysForSewer: false,

      history: undefined,

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
      // fills previousReadings from record history
      async fillPreviousReadings() {
        const {readings} = this.history[0]
        for(let type in readings) {
          if(type in this.previousReadings)
            this.previousReadings[type] = readings[type]
        }
      },

      // fetches record history, rehydrates JSON fields, triggers filling of previousReadings
      async fetchRecordHistory() {
        this.history = await fetch(`${window.serverAddress}/records/${this.indivId}/history`)
        .then(res => res.json())
        .then(res => {
          for(const record of res) {
            for(const fieldName in record) {
              if(typeof(record[fieldName]) === 'string') {
                try {
                  record[fieldName] = JSON.parse(record[fieldName])
                } catch(e) {}
              }
            }
          }
          return res
        })
        this.fillPreviousReadings()
      }
    }
  })
  
  import.meta.hot?.accept(acceptHMRUpdate(useIndividualStore, import.meta.hot))
  return useIndividualStore
}