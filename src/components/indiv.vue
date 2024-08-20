<script>
import Field from './field.vue'

export default{
  name: "Indiv",
  components: {Field},
  props: ["name"],
  data() {
    return {
      fields: ["name", "electricity", "water", "gas"],
    }
  },
}
</script>


<template>
  <div class="list-item">
    <Field v-for="i in fields" :type="i" :name="name"></Field>
    <button @click="$router.push(`/sumup/${name}`)" class="sumUp"></button>
  </div>
</template>


<style scoped>
.list-item {
  direction: rtl;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 2fr 2fr 2fr 1fr 2fr;
  height: 10vh;
  width: 90vw;
  margin: 20px 5vw;
  border-radius: 20px;
  background-color: lavender;
  border: 2.5px solid #000000bb;
}

.sumUp {
  width: 5vh;
  height: 5vh;
  margin: auto;
  border-radius: 5px;
  float: left;
}

.sumUp:hover {
  background-color: purple;
}
</style>