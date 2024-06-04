<script>
import Indiv from './../components/indiv.vue'

export default{
  name: "Home",
  components: {Indiv},
  data() {
    return {
      // get user specific
      array: ["ידז","עגד גשדשד","גדכגדשד"],
    }
  },  
}
</script>

<template>
  <div class="parent">
    <div id="container">
      <Indiv v-for="name in this.array" class="individual" :name="name" :key="i">
      </Indiv>
    </div>
  </div>
</template>

<style scoped>
</style>