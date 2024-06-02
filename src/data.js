import { defineStore } from 'pinia'

export const useDataStore = defineStore('data', {
  state: () => ({
    final: {
      electricity: {
        reading: 1234,
        rate: 0.5252,
        sum: null,
      },
      water: {
        reading: 12345,
        rate: 9.86,
        sum: null,
      },
      gas: {
        rate: 202,
        amount: null,
        sum: null,
      },
      sewer: {
        rate: 67.5,
        months: null,
        sum: null,
      }
    }, // reset and fetch
  })
})