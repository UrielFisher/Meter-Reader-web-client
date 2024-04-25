<script>
export default{
  name: "Home"
}
</script>

<template>
  <div class="base">
    <div id="container">
      <div v-for="i in [0,1,2]" class="list-item"></div>
    </div>
  </div>
</template>

<style scoped>
div { color: red; }

#container {
  display: grid;
}

.list-item {
  background-color: lavender;
}
</style>