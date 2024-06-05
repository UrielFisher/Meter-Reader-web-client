<script>
import { mapState } from 'pinia';
import { makeDataStore } from './../data.js'
import SumMajor from './../components/sumMajor.vue'
// delete sewer data before save if irrelevant
export default {
  name: "SumUp",
  components: {SumMajor},
  data() {
    return {
      // inputData: {
      //   eReading: 12345,
      //   wReading: 678,
      //   gas: 0,
      //   sewer: false,
      // },
    }
  },
  computed: {
    ...mapState(makeDataStore('ידז'), ['final']),
    date() {
      // return new Date().toISOstring   .split("T")[0]
      const d = new Date
      return `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`
    },
    gasTotal() {
      return this.final.gas.amount * this.final.gas.rate
    },
    sewerTotal() {
      return this.final.sewer.months?.length ?? 0 * this.final.sewer.rate
    },
    total() {
      const t = this.final
      return t.electricity.sum + t.water.sum + this.gasTotal + this.sewerTotal
    },
    sewerAmount() {
      // check for time in months since last bill
      return [2, 3, 4]
    },
  },
  watch: {
    gasTotal: {
      handler() {
        this.final.gas.sum = this.gasTotal
      },
      immediate: true
    },
    sewerTotal: {
      handler() {
        this.final.sewer.sum = this.sewerTotal
      },
      immediate: true
    },
    total: {
      handler() {
        this.final.total = this.total
      },
      immediate: true
    },
  },
  methods: {
  },
}
</script>

<template>
  <div class="parent">
    <div id="paper">
      <div id="header">
        <h3 id="name">אוריאל פישר</h3>
        <input id="date" placeholder="תאריך:" :value="date"></input>
      </div>
      <div id="content">
        <span id="parts">
          <div id="electricity" v-if="final.electricity.reading">
            <h5 class="partTitle">חשמל</h5>
            <SumMajor class="partBody" type="electricity" />
          </div>
          <div id="water" v-if="final.water.reading">
            <h5 class="partTitle">מים</h5>
            <SumMajor class="partBody" type="water" />
          </div>
          <div class="part" id="gas" v-if="final.gas.amount !== 0">
            <h5 class="partTitle">גז</h5>
            <p class="partBody subTotal">{{final.gas.amount * final.gas.rate}} = {{final.gas.rate}} • {{final.gas.amount}}</p>
          </div>
          <div class="part" id="sewer" v-if="final.sewer?.months">
            <h5 class="partTitle">ביוב</h5>
            <p class="partBody">{{ sewerAmount.join("/") }}</p>
            <p class="partBody subTotal">{{sewerAmount.length * final.sewer.rate}} = {{final.sewer.rate}} • {{sewerAmount.length}}</p>
          </div>
        </span>
        <span id="sum">
          <div class="sumDiv">
            <p class="additive" v-for="i in Object.values(final).filter((x) => x.sum !== 0)">{{ i.sum }}</p>
            <p id="total">{{ total }}</p>
          </div>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
#paper {
  height: calc(100vw * 1.414);
}

#header {
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
  height: 10%;
  padding: 10px;
}

#name {
  text-decoration: underline;
}

#date {
  background-color: transparent;
  border: none;
  font-size: 1rem;
}

#content {
  height: 90%;
  padding: 0px 15px 15px;
  direction: rtl;
  display: flex;
}

.part {
}

.partTitle{
  width: fit-content;
  padding: 5px;
  font-weight: bold;
  border-radius: 50%;
  border: 1px solid black;
}

.partBody { margin-right: 10vw; }

:is(#gas, #sewer) .partBody {
  width: fit-content;
  margin-right: auto;
}

#sum {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: end;
  align-items: end;
}

.sumDiv {
  height: fit-content;
  width: fit-content;
}

.additive {
  border-bottom: 1px solid black;
}

#total{
  width: fit-content;
  border-top: 1px solid black;
  border-bottom: 3px double black;
}
</style>

<style>
.subTotal::after {
  content: "";
  display: block;
  position: relative;
  height: 3px;
  width: 20px;
  top: -0.3em;
  right: -0.8em;
  transform: rotate(-30deg);
  border-block: 1px solid black;
  z-index: 1;
}
</style>