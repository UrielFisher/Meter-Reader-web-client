<script>
import { mapActions, mapState, mapWritableState } from 'pinia';
import { useMainStore } from './../stores/main'
import Indiv from './../components/indiv.vue'
import { makeIndividualStore } from '@/stores/individual';

export default{
  name: "Home",
  components: {Indiv},
  computed: {
    ...mapWritableState(useMainStore, ['stores']),
  },
  methods: {
    ...mapActions(useMainStore, ['initStores']),
  },
  mounted() {
    // this.initStores()
  }
}
</script>

<template>
  <div class="parent">
    <div id="container">
      <Indiv v-for="name in this.individualsArray" class="individual" :name="name" :key="name">
      </Indiv>
    </div>
  </div>
</template>

<style scoped>
</style>