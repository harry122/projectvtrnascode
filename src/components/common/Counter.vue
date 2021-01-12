<template>
  <div class="m-vauth-counter">
    <div :class="['decrement', inputValue < 0 ? 'disable': 'enable']" @click="decrementValue">-</div>
    <MTextbox class="text-counter" :resetText="resetValue" :type="type" :textboxInput="inputValue" @on-change-value="setInputValue($event)" :placeholder="placeholder" :mInputProperty="mTextboxProperty" />
    <div :class="['increment', inputValue > maxValue ? 'disable': 'enable']" @click="incrementValue">+</div>
  </div>
</template>

<script>
import { MTextbox } from 'mobiotics-dynamic-components-vue'

export default {
  name: 'Counter',
  data () {
    return {
      inputValue: '',
      mTextboxProperty: {},
      resetValue: false,
      timeVal: 0
    }
  },
  props: {
    placeholder: {
      type: String,
      default: ''
    },
    defaultValue: {
      default: null
    },
    maxValue: {
      type: [Number, Boolean],
      default: null
    },
    type: {
      type: String,
      default: 'text'
    },
    isTime: {
      type: Boolean,
      default: false
    }
  },
  components: {
    MTextbox
  },
  methods: {
    // sendValue (data) {
    //   if (typeof this.maxValue === 'number') {
    //     if (data < this.maxValue || data > 0) {
    //       this.inputValue = data
    //       this.$emit('changedCounter', this.inputValue)
    //     }
    //   }
    // },
    decrementValue () {
      if (this.maxValue) {
        if (this.inputValue > 0) {
          this.inputValue -= 1
          this.setInputValue(this.inputValue)
        }
      } else if (this.isTime) {
        this.timeVal -=1
        let newTime = new Date().setHours(24, this.timeVal, 0, 0)
        this.inputValue = new Date(new Date(newTime).getTime()).toLocaleTimeString()
      }
    },
    setInputValue (val) {
      if (this.maxValue) {
        if (val <= this.maxValue) {
          this.inputValue = parseInt(val)
          this.$emit('changedCounter', this.inputValue)
        } else if (val > this.maxValue){
          this.inputValue = 0
          this.$emit('changedCounter', this.inputValue)
        } else if (val.length > 3) {
          this.inputValue = 0
          this.$emit('changedCounter', this.inputValue)
        }
      } else if (this.isTime){
        if (val) {
          let isValid = /^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/.test(val)
          let valueSplit = val.split(':')[1]
          let hourSplit = val.split(':')[0]
          if (parseInt(hourSplit)) {
            hourSplit = hourSplit*60
          } else {
            hourSplit = 0
          }
          if (valueSplit < 10) {
            this.timeVal = hourSplit + parseInt(valueSplit.split('')[1])
          } else if (valueSplit >= 10) {
            this.timeVal = hourSplit + parseInt(valueSplit)
          } else {
            this.timeVal = hourSplit + 0
          }
          if (isValid) {
            this.inputValue = val
            this.$emit('changedCounter', this.inputValue)
          }
        }
      }
    },
    incrementValue () {
      if (this.maxValue) {
        if (typeof this.maxValue === 'number') {
          if (this.inputValue < this.maxValue) {
            this.inputValue += 1
            this.setInputValue(this.inputValue)
          }
        } else if (typeof this.maxValue === 'boolean') {
          this.inputValue += 1
          this.setInputValue(this.inputValue)
        }
      } else if (this.isTime) {
        this.timeVal +=1
        let newTime = new Date().setHours(24, this.timeVal, 0, 0)
        this.inputValue = new Date(new Date(newTime).getTime()).toLocaleTimeString()
      }
    }
  },
  watch: {
    defaultValue () {
      this.inputValue = this.defaultValue
    }
  },
  created () {
    this.inputValue = this.defaultValue
    this.mTextboxProperty = {
      defaultProperty: {
        width: '69px',
        height: '21px',
        marginTop: '4px',
        border: '1px solid rgba(212,218,228,0.7)',
        borderRadius: 0,
        textAlign: 'center',
        color: '#1F2631'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .m-vauth-counter {
    display: flex;
    .decrement,
    .increment {
      border: 1px solid rgba(212,218,228,0.7);
      height: 21px;
      width: 27.5px;
      margin-top: 4px;
      display: flex;
      justify-content: center;
      font-size: 12px;
      color: var(--fade-grey);
      background: var(--white);
      cursor: pointer;
      font-family: var(--font-medium);
    }
    >>> .m-textbox::-webkit-outer-spin-button,
      .m-textbox::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    >>> input[type=number] {
      -moz-appearance: textfield;
    }
    .increment {
      border-left: 0;
      padding-top: 2px;
    }
    .decrement {
      border-right: 0;
      padding-top: 2px;
    }
    .text-counter {
      cursor: default;
    }
  }
</style>
