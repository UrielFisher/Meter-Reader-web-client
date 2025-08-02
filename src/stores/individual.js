import { acceptHMRUpdate, defineStore } from 'pinia'

export const makeIndividualStore = (name) => {
  const useIndividualStore = defineStore(name, {
    state: () => ({
      indivId: undefined,
      name: name,
      pstn: undefined,
      paysForSewer: false,

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
      // fills readings data of the individual with record data from the server
      // if elapsed time since last record is greater than threshold, load into previousReadings
      // if shorter, load into readings and load the record before into previousReadings
      async getLatestReadings() {
        const {readings} = await this.fetchRecentRecord()
        for(let type in readings) {
          if(type in this.previousReadings)
            this.previousReadings[type] = readings[type]
        }
      },
      async fetchRecentRecord() {
        return await fetch(`${window.serverAddress}/records/${this.indivId}/indexFromRecent/0`)
        .then(res => res.json())
        .then(res => {
          for(let fieldName in res) {
            if(typeof(res[fieldName]) === 'string') {
              try {
                res[fieldName] = JSON.parse(res[fieldName])
              } catch(e) {}
            }
          }
          return res
        })
      }
    }
  })
  
  import.meta.hot?.accept(acceptHMRUpdate(useIndividualStore, import.meta.hot))
  return useIndividualStore
}