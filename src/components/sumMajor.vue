<script>
import { mapState } from 'pinia'
import { useMainStore } from '../stores/main.js'

export default {
  name: "SumMajor",
  props: ['type'],
  data() {
    return {
      previous: 1230,
    }
  },
  computed: {
    ...mapState(useMainStore, ['stores']),
    data() {
      return this.stores[this.$route.params.name]
    },
    t() { return this.data.final[this.type] },
    subtract() {
      return (this.t.reading - this.previous).toFixed(2)
    },
    by() {
      return (this.subtract * this.t.rate).toFixed(2)
    },
    tax() {
      return (this.subtract * this.t.rate * 0.17).toFixed(2)
    },
    sum() {
      return (this.subtract * this.t.rate * (this.type !== 'water' ? 1.17 : 1)).toFixed(2)
    },
  },
  watch: {
    sum: {
      handler() {
        this.data.final[this.type].sum = parseFloat(this.sum)
      },
      immediate: true
    }
  }
}
</script>


<template>
  <div class="part">
    <p class="hint">ק. נוכחית</p>
    <p class="data">{{ t.reading?.toFixed(2) }}</p>
    <p class="hint">ק. קודמת</p>
    <p class="data">{{ previous.toFixed(2) }}</p>
    <p class="data line enil">{{ subtract }}</p>
    <label class="hint">
      לפי
      <input type="number" v-model="t.rate" style="width: 50px;">
    </label>
    <p v-if="this.type !== 'water'" class="data">{{ by }}</p>
    <p v-if="this.type !== 'water'" class="hint">17%+</p>
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

input{ border: none; }
</style>