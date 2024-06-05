import { defineStore } from 'pinia'

export const makeDataStore = (name) => {
  const useDataStore = defineStore(name, {
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
  return useDataStore
}