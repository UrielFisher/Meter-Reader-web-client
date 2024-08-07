import { acceptHMRUpdate, defineStore } from 'pinia'

export const makeIndividualStore = (name) => {
  const useIndividualStore = defineStore(name, {
    state: () => ({
      total: 0,
      eImg: {img: null,value: null},
      wImg: {img: null,value: null},
      final: {
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
          amount: '0',
          sum: null,
        },
        sewer: {
          rate: null,
          months: null,
          sum: null,
        }
      } // reset and fetch
    }),
  })
  import.meta.hot?.accept(acceptHMRUpdate(useIndividualStore, import.meta.hot))
  return useIndividualStore
}