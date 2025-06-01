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
      // fills readings data of the individual with record data from the server
      // if elapsed time since last record is greater than threshold, load into previousReadings
      // if shorter, load into readings and load the record before into previousReadings
      async getLatestReadings() {
        function distributeReadings(readings, dest){
          for(let type in readings) {
            if(type in dest)
            dest[type] = readings[type]
          }
        }
        const recentRecord = await this.fetchRecentRecord(0)
        const isLong = ((Date.now() / 1000) - recentRecord.recordTime) > 60*60*24*27

        const dest = isLong ? this.previousReadings : this.readings
        distributeReadings(recentRecord.readings, dest)
        if (!isLong) {
          const secRecentRecord = await this.fetchRecentRecord(1)
          distributeReadings(secRecentRecord.readings, this.previousReadings)
        }
      },
      async fetchRecentRecord(index=0) {
        let recordTime
        const readings = await fetch(`${window.serverAddress}/records/${this.indivId}/indexFromRecent/${index}`)
        .then(res => res.json())
        .then(res => {
          recordTime = res.date
          return res.readings
        })
        .then(res => JSON.parse(res))
        return {readings, recordTime}
      }
    }
  })
  
  import.meta.hot?.accept(acceptHMRUpdate(useIndividualStore, import.meta.hot))
  return useIndividualStore
}