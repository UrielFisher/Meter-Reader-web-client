<script>
import { mapState } from 'pinia';
import { useMainStore } from './../stores/main.js'
import { makeIndividualStore } from '../stores/individual';

export default{
  name: "Field",
  props: ["type", "name"],
  computed: {
    ...mapState(useMainStore, ['stores']),
    store() {
      return this.stores[this.name]
    }
  },
  methods: {
    setAsNumber(event) {
      this.store.readings[this.type] = Number(event.target.value)
    }
  },
}
</script>


<template>
  <div v-if="type === 'name'" class="field-box">
    <h3 style="text-decoration: underline">{{ name }}</h3>
  </div>
  <div v-else-if="type === 'gas'" class="field-box">
    <select :value="store.readings[type]" @change="setAsNumber">
      <option value="0">0</option>
      <hr></hr>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
    </select>
  </div>
  <div v-else class="field-box">
    <div class="field">
      <button class="symbol-button" @click="$router.push(`/camera/${type[0]}/${name}`)">
        <img class="symbol" :src="`/${type}.svg`"
        onload="this.onerror=null;this.onload=null;"
        onerror="this.onerror=null;this.onload=null;this.src='/empty.svg'"
        />
      </button>
      <input v-model="store.readings[type]" type="number" class="numbers" min="0" max="999999">
    </div>
  </div>
</template>


<style scoped>
.field-box {
  display: flex;
  justify-content: start;
  align-items: center;
  padding-inline: 15px;
  min-width: 0;
}

.field {
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
}

.symbol-button {
  position: relative;
  height: 5vh;
  width: 5vh;
  border-radius: 50px;
  background-color: lightgray;
}

.symbol-button:hover {
  background-color: gray;
}

.symbol {
  position: absolute;
  height: 75%;
  transform: translate(50%, -50%)
}

.numbers {
  width: 4em;
}

.numbers::-webkit-outer-spin-button,
.numbers::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>