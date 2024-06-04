<script>
import { mapWritableState } from 'pinia';
import { useDataStore } from '@/data';

export default{
  name: "Field",
  props: ["type", "entity"],
  computed: { ...mapWritableState(useDataStore, ['final']) }
}
</script>


<template>
  <div v-if="type === 'name'" class="field-box">
    <h3 style="text-decoration: underline">{{entity}}</h3>
  </div>
  <div v-else-if="type === 'gas'" class="field-box">
    <select v-model="final[type].amount">
      <option value="0">0</option>
      <option value="1">1</option>
      <option value="2">2</option>
    </select>
  </div>
  <div v-else class="field-box">
    <div class="field">
      <button class="symbol"></button>
      <input v-model="final[type].reading" type="number" class="numbers" min="0" max="999999">
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

.symbol {
  height: 5vh;
  width: 5vh;
  border-radius: 50px;
  background-color: coral;
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