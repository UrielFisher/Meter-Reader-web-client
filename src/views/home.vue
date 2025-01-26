<script>
import { mapActions, mapState } from 'pinia';
import { useMainStore } from './../stores/main'
import Indiv from './../components/indiv.vue'

export default{
  name: "Home",
  components: {Indiv},
  computed: {
    ...mapState(useMainStore, ['individuals', 'stores']),
  },
  methods: {
    ...mapActions(useMainStore, ['initStores']),
  },
  created() {
    this.initStores()
  }
}
</script>

<template>
  <div class="parent">
    <div id="container">
      <Indiv v-for="name of individuals" class="individual" :name="name" :key="name">
      </Indiv>
    </div>
    <button id="settings" @click="$router.push('/settings')">⚙️</button>
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
}

#settings:active {
  background-color: lightgray;
}
</style>