<script>
import { mapActions, mapState } from 'pinia';
import { useMainStore } from './../stores/main'
import Indiv from './../components/indiv.vue'

export default{
  name: "Home",
  components: {Indiv},
  computed: {
    ...mapState(useMainStore, ['stores']),
  },
  methods: {
    ...mapActions(useMainStore, ['initStores']),
  },
}
</script>

<template>
  <div class="parent">
    <div id="container">
      <Indiv v-for="{name, historyIndex} in stores" :name="name" :key="name"
      :class="{'past' : (historyIndex > 0)}">
      </Indiv>
      <div v-if="!Object.keys(stores)?.length" class="no-indivs-sign">נראה שאתם לא מנהלים מידע על אף בית.<br>היכנסו להגדרות, לחצו על הפלוס ומלאו את הפרטים ליצירת בית למעקב.</div>
    </div>
    <button id="settings" @click="$router.push('/settings')"><img src="/fence.svg" /></button>
  </div>
</template>

<style scoped>
#settings {
  position: absolute;
  bottom: 25px;
  left: 25px;
  height: 80px;
  width: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: 50%;
  font-size: 50px;
  padding: 12px;
}

#settings:active {
  background-color: lightgray;
}

.no-indivs-sign {
  direction: rtl;
  width: 90vw;
  margin: 20px 5vw;
  padding: 10px;
  text-align: center;
  /* outline: 3px solid black; */
  background-color: lavender;
  border-radius: 20px;
  /* font-weight: 500; */
  font-family: serif;
}
</style>