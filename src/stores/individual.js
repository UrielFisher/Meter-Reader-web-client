import { acceptHMRUpdate, defineStore } from 'pinia'

export const makeIndividualStore = (name) => {
  const useIndividualStore = defineStore(name, {
    state: () => ({
      indivId: undefined,
      name: name,
      pstn: undefined,
      paysForSewer: false,

      historyIndex: 0,

      history: [{
        date: new Date(new Date().toISOString().split('T')[0]).getTime()/1000,
        readings: {
          electricity: null,
          water: null,
          gas: null,
          sewer: null,
        },
        rates: {
          electricity: null,
          water: null,
          gas: null,
          sewer: null,
        },
      },{
        date: undefined,
        readings: {
          electricity: null,
          water: null,
          gas: null,
          sewer: null,
        },
        rates: {
          electricity: null,
          water: null,
          gas: null,
          sewer: null,
        },
      },],

      eImg: {img: null,value: null},
      wImg: {img: null,value: null},
    }),
    getters: {
      date: (state) => {
        return state.history[state.historyIndex].date
      },
      rates: (state) => {
        return state.history[state.historyIndex].rates
      },
      readings: (state) => {
        return state.history[state.historyIndex].readings
      },
      previousReadings: (state) => {
        return state.history[state.historyIndex+1]?.readings ?? {}
      },
      total: (state) => {
        let sum = 0
        for(let type in state.readings) {
          let amount
          try {
            amount = (state.readings[type] ?? 0) - (state.previousReadings[type] ?? 0)
          } catch(e) {
            amount =  state.readings[type]
          }

          sum += amount * state.rates[type] ?? 0
        }
        return sum.toFixed(2)
      }
    },
    actions: {
      // fetches record history, rehydrates JSON fields, triggers filling of previousReadings
      async fetchRecordHistory() {
        const historyList = await fetch(`${window.serverAddress}/records/${this.indivId}/history`)
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
        this.history.pop()
        this.history.push(...historyList)
      }
    }
  })
  
  import.meta.hot?.accept(acceptHMRUpdate(useIndividualStore, import.meta.hot))
  return useIndividualStore
}