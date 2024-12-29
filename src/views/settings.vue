<script>
import { markRaw } from 'vue';
import { useMainStore } from './../stores/main.js';
import { mapStores } from 'pinia';
import { makeIndividualStore } from '@/stores/individual.js';

export default{
  name: "Settings",
  computed: {
    ...mapStores(useMainStore),
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
      individualToAdd: undefined,
      storesToPatchName: {},
    }
  },
  watch: {
    'this.value'() {
      this[showEditor] = this.value
    }
  },
  methods: {
    /**
     * Manages addition of new individuals.
     * for saving, calls @function saveNewIndiv
     */
    addIndividual() {
      if(this.individualToAdd) {
        if(this.individualToAdd?.name !== ""){
          this.saveNewIndiv()
        } else {
          this.checkAndCancel()
        }
      } else {
        this.individualToAdd = {name:"", pstn:""}
      }
    },
    // Saves individual when it's added
     saveNewIndiv() {
      this.mainStore.individuals.push(this.individualToAdd)
      this.mainStore.stores[this.individualToAdd.name] = makeIndividualStore(this.individualToAdd.name)()
      this.individualToAdd = undefined
    },
    // Cancel adding if entered data is empty
    checkAndCancel() {
      if(!Object.values(this.individualToAdd).some(x => x !== ''))
        this.individualToAdd = undefined
    },
    editIndividual(indivIndex, propertyName, event) {
      // update the pinia data stores
      if(propertyName === "name") {
        const oldName = this.mainStore.individuals[indivIndex].name
        const newName = event.target.value
        if(Object.values(this.storesToPatchName).includes(oldName)) {
          const keyName = Object.entries(this.storesToPatchName).find((x) => {x[1] === oldName})[0]
          this.storesToPatchName[keyName] = newName
        } else {
          this.storesToPatchName[oldName] = newName
        }
      }
      // update the individuals list
      this.mainStore.individuals[indivIndex][propertyName] = event.target.value
    },
    /**
     * Manages deletion of data about an individual
     * @param {Number} indivIndex - index of indiv to delete, from mainStore.individuals
     */
    deleteIndividual(indivIndex) {
      const name = this.mainStore.individuals[indivIndex].name

      if(confirm(`Are you sure aboute deleting ${name}?`)) {
        this.mainStore.individuals.splice(indivIndex, 1)
        this.mainStore.stores[name].$dispose()
      }
    },
    // Opens settings field editor
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
    // Closes settings field editor
    closeEditor() {
      this[this.showEditor] = this.value
      this.showEditor = ''
    },
    // Possibly closes settings field editor
    ifAlreadyOpen(index) {
      if(this.showEditor !== this.settings[index].variableName)
        this.closeEditor()
    },
    /**
     * Commits stacked name changes to stores
     * @param {Object} storesToPatchName - {oldName: newName}
     */
    modifyStoresNames() {
      for(let names of Object.entries(this.storesToPatchName)) {
        if(names[0] !== names[1]) {
          const newStore = makeIndividualStore(names[1])()
          newStore.$state = this.mainStore.stores[names[0]].$state
          this.mainStore.stores[names[1]] = newStore
          this.mainStore.stores[names[0]].$dispose()
          delete this.mainStore.stores[names[0]]
        }
      }
    },
  },
  unmounted() {
    this.modifyStoresNames()
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
      <tr>
        <th></th>
        <th>שם</th>
        <th>מספר טלפון</th>
      </tr>
      <tr v-for="indiv, indivIndex of mainStore.individuals">
        <td class="delete-cell">
          <button @click="deleteIndividual(indivIndex)" class="delete-btn">🗑️</button>
        </td>
        <td v-for="property, propertyName in indiv">
          <input  @change="editIndividual(indivIndex, propertyName, $event)" class="table-input" :value="property"/></td>
      </tr>
      <tr v-if="individualToAdd">
        <td></td>
        <td v-for="property, propertyName in individualToAdd">
          <input class="table-input add-input" v-model="individualToAdd[propertyName]"/>
        </td>
      </tr>
      <tr>
        <td       @click="addIndividual" colspan="3" :class="individualToAdd ? 'save-indiv' : 'add-indiv'">+</td>
      </tr>
    </table>
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
  height: 100px;
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
  padding: 5px;
}

th {
  text-align: end;
  text-decoration: underline;
  font-weight: bold;
}

td {
  text-align: right;
}

.table-input {
  height: 100%;
  width: fit-content;
  border: none;
  direction: rtl;
}

.table-input:focus-visible {
  outline: none;
}

.add-input {
  height: 3rem;
  padding: 8px;
  background-image:
    linear-gradient(to right, lightsteelblue, transparent 5% 95%, lightsteelblue),
    linear-gradient(lightsteelblue, transparent 20% 80%, lightsteelblue);
}

.delete-cell {
  width: 3rem;
}

.delete-btn {
  height: 3rem;
  width: 3rem;
  font-size: 1em;
  border: 5px outset red;
  background-color: red;
}

.add-indiv, .save-indiv {
  text-align: center;
  user-select: none;
}

.add-indiv {
  background-image: linear-gradient(to right, transparent 5%, lightgray 20% 80%, transparent 95%);
}

.save-indiv {
  background-image: linear-gradient(to right, transparent 5%, green 20% 80%, transparent 95%);
  font-weight: bolder;
}
</style>