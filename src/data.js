import { defineStore } from 'pinia'

export const useDataStore = defineStore('data', {
  state: () => ({
    final: {
      total: 0,
      electricity: {
        reading: null,
        rate: null,
        sum: null,
      },
      water: {
        reading: null,
        rate: null,
        sum: null,
      },
      gas: {
        rate: null,
        amount: 0,
        sum: null,
      },
      sewer: {
        rate: null,
        months: null,
        sum: null,
      }
    }, // reset and fetch
  })
})