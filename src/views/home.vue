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
      <Indiv v-for="name in Object.keys(this.individuals)" class="individual" :name="name" :key="name">
      </Indiv>
    </div>
  </div>
</template>

<style scoped>
</style>