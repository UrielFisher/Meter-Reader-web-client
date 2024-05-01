<script>
import Field from './field.vue'

export default{
  name: "Indiv",
  components: {Field},
  props: ["entity"],
  data() {
    return {
      fields: ["name", "water", "electricity", "gas"]
    }
  }
}
</script>


<template>
  <div class="list-item">
    <Field v-for="i in this.fields" :type="i" :entity="entity"></Field>
  </div>
</template>


<style scoped>
.list-item {
  direction: rtl;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr 1fr 1fr 1fr;
  height: 10vh;
  width: 90vw;
  margin: 20px 5vw;
  border-radius: 20px;
  background-color: lavender;
  border: 2.5px solid #000000bb;
}
</style>