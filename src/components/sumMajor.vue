<script>
import { mapState } from 'pinia'
import { useMainStore } from '../stores/main.js'

export default {
  name: "SumMajor",
  props: ['type'],
  computed: {
    ...mapState(useMainStore, ['stores']),
    store() {
      return this.stores[this.$route.params.name]
    },
    readingMargin() {
      return (this.store.readings[this.type] - this.store.previousReadings[this.type]).toFixed(2)
    },
    by() {
      return (this.readingMargin * this.store.rates[this.type]).toFixed(2)
    },
    tax() {
      return (this.by * 0.18).toFixed(2)
    },
    sum() {
      return (this.by * (this.type !== 'water' ? 1.18 : 1)).toFixed(2)
    },
  },
}
</script>


<template>
  <div class="part">
    <p class="hint">ק. נוכחית</p>
    <input type="number" class="data" v-model="store.readings[type]" />
    <p class="hint">ק. קודמת</p>
    <input type="number" class="data" v-model="store.previousReadings[type]" />
    <p class="data line enil">{{ readingMargin }}</p>
    <label class="hint">
      לפי
      <input type="number" v-model="store.rates[type]" style="width: 50px; background-color: transparent">
    </label>
    <p v-if="this.type !== 'water'" class="data">{{ by }}</p>
    <p v-if="this.type !== 'water'" class="hint">18%+</p>
    <p v-if="this.type !== 'water'" class="data enil">{{ tax }}</p>
    <p class="data subTotal">{{ sum }}</p>
  </div>
</template>


<style scoped>
.part {
  display: grid;
  grid-template-columns: max-content 60px;
  grid-auto-rows: 1.5em;
  width: fit-content;
  direction: rtl;
}

.data { grid-column: 2; }

.hint { grid-column: 1; }

.line { border-top: 1px solid black; }

.enil { border-bottom: 1px solid black; }

input {
  background-color: transparent;
  border: none;
}
</style>