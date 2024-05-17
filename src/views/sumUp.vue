<script>
export default {
  name: "SumUp",
  data() {
    return {
      inputData: {
        eReading: 12345,
        wReading: 678,
        gas: 0,
        sewer: false,
      },
      rates: {
        eRate: 0.5252,
        wRate: 9.86,
        gRate: 202,
        sRate: 67.5,
      },
      historyJSON: {
        electricity: {
          reading: null,
          rate: null,
          sum: null,
        },
        water: {
          reading: null,
          rate: null,
          sum: null,
        },
        gas: {
          rate: null,
          amount: null,
        },
        sewer: {
          rate: null,
          months: null,
        },
      },
      eSubtract: 1000,
      wSubtract: 1000,
    }
  },
  mounted() {
    this.fillGivenData()
    console.log(this.historyJSON);
  },
  computed: {
    date() {
      const d = new Date
      return `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`
    },
    sewerAmount() {
      // check for time in months since last bill
      return [2, 3, 4]
    },
  },
  methods: {
    fillGivenData() {
      this.fromReading("electricity")
      this.fromReading("water")
      this.historyJSON.gas.amount = this.inputData.gas
      this.historyJSON.gas.rate = this.rates.gRate
      if(this.inputData.sewer) {
        this.historyJSON.sewer.rate = this.rates.sRate
        this.historyJSON.sewer.months = this.sewerAmount
      } else {
        delete this.historyJSON.sewer
      }
    },
    fromReading(type) {
      this.historyJSON[type].reading = this.inputData[type[0] + 'Reading']
      this.historyJSON[type].rate = this.rates[type[0] + 'Rate']
      this.historyJSON[type].sum = this.inputData[type[0] + 'Reading']
    },
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
          <div class="part" id="electricity">
            <p class="hint">ק. נוכחית</p>
            <p class="data">{{historyJSON.electricity.reading}}</p>
            <p class="hint">ק. קודמת</p>
            <p class="data">previous</p>
            <div class="line"></div>
            <p class="data">{{eSubtract}}</p>
            <label class="hint">
              לפי
              <input type="number" v-model="rates.eRate" style="width: 50px;">
            </label>
            <p class="data">{{eSubtract * rates.eRate}}</p>
            <p class="hint">17%+</p>
            <p class="data">{{eSubtract * rates.eRate * 0.17}}</p>
            <div class="line"></div>
            <p class="data subTotal">{{eSubtract * rates.eRate * 1.17}}</p>
          </div>
          <div id="water"></div>
          <div id="gas" v-if="inputData.gas !== 0">
            <p class="subTotal">{{inputData.gas}} • {{rates.gRate}} = {{inputData.gas*rates.gRate}}</p>
          </div>
          <div id="sewer" v-if="inputData.sewer">
            <p>{{ sewerAmount.join("/") }}</p>
            <p class="subTotal">{{sewerAmount.length}} • {{rates.sRate}} = {{sewerAmount.length*rates.sRate}}</p>
          </div>
        </span>
        <span id="sum">
          <div class="sumDiv">
            <p class="additive" v-for="i in Object.values(inputData).filter((x) => x != 0)"></p>
            <p id="total"></p>
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
}

.line {
  height: 1px;
  width: 100px;
  background-color: black;
}

.part {
  display: grid;
  grid-auto-columns: 85px;
  grid-auto-rows: 1.5em;
  width: fit-content;
  direction: rtl;
}

.data {
  grid-column: 2;
}

.hint {
  grid-column: 1;
}
</style>