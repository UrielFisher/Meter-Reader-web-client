<script>
import Home from './views/home.vue'

export default{
  name: "App",
  components: {Home}
}
</script>

<template>
  <div class="base">
    <router-view />
  </div>
</template>

<style>
.base {
  height: auto;
  width: auto;
}
</style>