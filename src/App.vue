<script>

export default{
  name: "App",
}
</script>

<template>
  <div id="base">
    <router-view />
  </div>
</template>

<style>
#base {
  height: 100vh;
  width: 100vw;
}

.parent {
  height: 100%;
  width: 100%;
}
</style>