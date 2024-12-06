<script>
import { markRaw } from 'vue';
import { useMainStore } from './../stores/main.js';
import { mapStores } from 'pinia';

export default{
  name: "Settings",
  computed: {
    ...mapStores(useMainStore)
  },
  data() {
    return {
      settings: markRaw([
        {
          variableName: "eRate",
          text: "תעריף חשמל:‏"
        },
        {
          variableName: "wRate",
          text: "תעריף מים:‏"
        },
        {
          variableName: "gRate",
          text: "מחיר בלון גז:‏"
        },
        {
          variableName: "patternLength",
          text: "אורך מספר ראשי במונה:‏"
        },
        {
          variableName: "patternExtension",
          text: "אורך שבר במונה (מספר אדום):‏"
        }
      ]),
      showEditor: '',
      value: '',
    }
  },
  watch: {
    'this.value'() {
      this[showEditor] = this.value
    }
  },
  methods: {
    addIndividual() {},
    editIndividual() {},
    deleteIndividual() {
      confirm("Are you sure aboute deleting individual?")
    },
    openEditor(index) {
      if(this.showEditor) {
        this[this.showEditor] = this.value
        if(this.showEditor === this.settings[index].variableName) {
          this.$nextTick().then(() => {this.$refs.editor.focus()})
          return
        }
      }
      this.showEditor = this.settings[index].variableName
      this.value = this[this.settings[index].variableName]
      this.$nextTick().then(() => {this.$refs.editor.focus()})
    },
    closeEditor() {
      this[this.showEditor] = this.value
      this.showEditor = ''
    },
    ifAlreadyOpen(index) {
      if(this.showEditor !== this.settings[index].variableName)
        this.closeEditor()
    },
  },
}
</script>

<template>
  <div @click="closeEditor()" class="parent">
    <button class="backButton" @click="$router.push('/')">></button>
    <Transition>
      <input type="number" autocomplete="off" id="editor" ref="editor" @click.stop :key="showEditor" v-if="showEditor" v-model="value" />
    </Transition>
    <table>
      <tr v-for="indiv of mainStore.individualsArray">
        <td class="delete-cell">
          <button @click="deleteIndividual" class="delete-btn">🗑️</button>
        </td>
        <td>
          <input class="table-input" :value="indiv"/>
        </td>
      </tr>
      <tr>
        <td @click="addIndividual" colspan="2" class="add-indiv">+</td>
      </tr>
    </table>
    <!-- <div>
      <div v-for="indiv of mainStore.individualsArray">
        <div>
          <p v-for="property of indiv">{{ property }}</p>
        </div>
      </div>
    </div> -->
    <div v-for="setting, ind of settings" class="field">
      <div @click.stop="ifAlreadyOpen(ind)" @dblclick="openEditor(ind)" class="field-grid" :key="ind">
        <p class="text">{{mainStore[setting.variableName]}}</p>
        <p class="text">{{setting.text}}</p>
      </div>
      <div class="breakElement"></div>
    </div>
  </div>
</template>

<style scoped>
.parent {
  /* init in App.vue */
  display: flex;
  flex-direction: column;
  align-items: end;
}

.field {
  position: relative;
  height: 15%;
  width: 100%;
}

.field-grid {
  display: flex;
  height: 100%;
}

.text {
  flex: 1 1 0px;
  text-align: center;
  align-content: center;
  font-size: 1rem;
  user-select: none;
}

#editor {
  position: absolute;
  top: 20px;
  right: 5%;
  width: 90%;
  height: 18%;
  background-color: aquamarine;
  border-radius: 35px;
  text-align: center;
  font-size: 1rem;
  font-weight: bold;
}

.breakElement {
  height: 3px;
  background-image: linear-gradient(to right, transparent 5%, lightgray 20% 80%, transparent 95%);
}

.v-enter-from, .v-leave-to {
  transform: translateY(calc(-150%));
}

.v-enter-to, .v-leave-from {
  /* top: 20px; */
  transform: translateY(0%);
}

.v-enter-active {
  transition: all 1s cubic-bezier(0.8, 0, 0, 1);
}

.v-leave-active {
  transition: all 1s cubic-bezier(0, 0, 0, 1);
}

table {
  width: 100%;
}

td {
  text-align: right;
}

.table-input {
  height: 100%;
  width: 100%;
  border: none;
  text-align: right
}

.table-input:focus-visible {
  outline: none;
}

.delete-cell {
  width: 3rem;
}

.delete-btn {
  height: 3rem;
  width: 3rem;
  font-size: 1em;
  border : 5px outset red;
  background-color: red;
}

.add-indiv {
  text-align: center;
  background-image: linear-gradient(to right, transparent 5%, lightgray 20% 80%, transparent 95%);
}
</style>