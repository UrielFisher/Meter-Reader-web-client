<script>
import { markRaw } from 'vue';
import { useMainStore } from './../stores/main.js';
import { mapWritableState } from 'pinia';

export default{
  name: "Settings",
  computed: {
    ...mapWritableState(useMainStore, ['eRate', 'wRate', 'patternLength', 'patternExtension'])
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
    checkAlreadyOpen(index) {
      if(this.showEditor !== this.settings[index].variableName)
        this.closeEditor()
    }
  },
}
</script>

<template>
  <div @click="closeEditor()" class="parent">
    <button class="backButton" @click="$router.push('/')">></button>
    <Transition>
      <input type="number" autocomplete="off" id="editor" ref="editor" @click.stop :key="showEditor" v-if="showEditor" v-model="value" />
    </Transition>
    <div @click.stop="checkAlreadyOpen(ind)" @dblclick="openEditor(ind)" class="field" :key="ind" v-for="setting, ind of settings">
      <p class="text">{{this[setting.variableName]}}</p>
      <p class="text">{{setting.text}}</p>
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
  width: calc(100% / 3 * 2);
  height: 15%;
  margin-block: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
}

.text {
  display: inline;
  margin-inline: auto;
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
</style>