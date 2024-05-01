<script>
import Indiv from './indiv.vue'

export default{
  name: "Home",
  components: {Indiv},
  data() {
    return {
      array: [0,1,2],
    }
  },  
}
</script>

<template>
  <div class="base">
    <div id="container">
      <Indiv v-for="i in this.array" class="individual" :entity="i" :key="i">
      </Indiv>
    </div>
  </div>
</template>

<style scoped>
</style>