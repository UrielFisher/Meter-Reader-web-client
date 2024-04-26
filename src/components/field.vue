<script>
export default{
  name: "Field",
  props: ["type", "entity"],
}
</script>


<template>
  <div class="base">
    <p>{{ type }}</p>
  </div>
</template>


<style scoped>
.base {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  padding: 15px;
}
</style>