<script>
import { mapState } from 'pinia';
import { useDataStore } from './../data.js'
import SumMajor from './../components/sumMajor.vue'
// delete sewer data before save if irrelevant
export default {
  name: "SumUp",
  components: {SumMajor},
  data() {
    return {
      inputData: {
        eReading: 12345,
        wReading: 678,
        gas: 1,
        sewer: true,
      },
    }
  },
  computed: {
    ...mapState(useDataStore, ['final']),
    date() {
      const d = new Date
      return `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`
    },
    total() {
      const t = this.final
      return t.electricity.sum + t.water.sum + (t.gas.amount * t.gas?.rate ?? 0) + (t?.sewer.months?.length ?? 0 * t?.sewer.rate ?? 0)
    },
    sewerAmount() {
      // check for time in months since last bill
      return [2, 3, 4]
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
          <div id="electricity">
            <h5 class="partTitle">חשמל</h5>
            <SumMajor class="partBody" type="electricity" />
          </div>
          <div id="water">
            <h5 class="partTitle">מים</h5>
            <SumMajor class="partBody" type="water" />
          </div>
          <div id="gas" v-if="inputData.gas !== 0">
            <h5 class="partTitle">גז</h5>
            <p class="partBody subTotal">{{inputData.gas}} • {{final.gas.rate}} = {{inputData.gas * final.gas.rate}}</p>
          </div>
          <div id="sewer" v-if="inputData.sewer">
            <h5 class="partTitle">ביוב</h5>
            <p class="partBody">{{ sewerAmount.join("/") }}</p>
            <p class="partBody subTotal">{{sewerAmount.length}} • {{final.sewer.rate}} = {{sewerAmount.length * final.sewer.rate}}</p>
          </div>
        </span>
        <span id="sum">
          <div class="sumDiv">
            <p class="additive" v-for="i in Object.values(final).filter((x) => x != 0)">{{ i.rate }}</p>
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

.partTitle{
  width: fit-content;
  padding: 5px;
  font-weight: bold;
  border-radius: 50%;
  border: 1px solid black;
}

.partBody { margin-right: 10vw; }

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