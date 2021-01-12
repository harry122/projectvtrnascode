<template>
  <div class="m-dropdown" @click="showBlur" :style="cssVars.defaultProperty">
    <div class="md__input">
      <div class="md__input-box" @click="stopClose">
        <slot name="search">
          <!-- <input :style="inputVars" class="md__search" v-if="showList" ref="inputsearch" tabindex="0" v-model.trim="inputValue" :placeholder="placeholderText" v-on="{click: showClick}"> -->
          <div :style="inputVars" v-on="{click: showClick}">
            <div class="multi" v-if="selectedItem.name || placeholder">
              <span class="multiple-item-list dropdown-selected" ref="dropdowninput" :value="getSelectedName" v-if="selectedItem.name">{{ selectedItem.name }}</span>
              <span v-else-if="placeholder" class="placeholder-text">{{ placeholder }} </span>
              <span class="close" @click="resetSelection()" v-if="selectedItem.name">
                <svg width="11.5px" height="12.5px" viewBox="0 0 31 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                  <!-- Generator: sketchtool 63.1 (101010) - https://sketch.com -->
                  <title>Remove</title>
                  <desc>Created with sketchtool.</desc>
                  <g id="Components" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                      <g id="Place-holders" transform="translate(-305.000000, -133.000000)" fill="#A7B1C6">
                          <g id="Ic_edit1-Copy-23" transform="translate(304.000000, 133.000000)">
                              <g id="Ic_close">
                                  <path d="M16.140989,0.844615857 C24.4863451,0.844615857 31.2515929,7.60986365 31.2515929,15.9552197 C31.2515929,24.3005758 24.4863451,31.0658236 16.140989,31.0658236 C7.79563295,31.0658236 1.03038515,24.3005758 1.03038515,15.9552197 C1.03038515,7.60986365 7.79563295,0.844615857 16.140989,0.844615857 Z M16.140989,3.84461586 C9.4524872,3.84461586 4.03038515,9.2667179 4.03038515,15.9552197 C4.03038515,22.6437216 9.4524872,28.0658236 16.140989,28.0658236 C22.8294909,28.0658236 28.2515929,22.6437216 28.2515929,15.9552197 C28.2515929,9.2667179 22.8294909,3.84461586 16.140989,3.84461586 Z M12.674343,10.7077814 L16.140989,14.1744274 L19.6076351,10.7077814 C20.0993873,10.2160292 20.8966752,10.2160292 21.3884274,10.7077814 C21.8801796,11.1995336 21.8801796,11.9968215 21.3884274,12.4885737 L17.9217813,15.9552197 L21.3884274,19.4218658 C21.8801796,19.913618 21.8801796,20.7109059 21.3884274,21.2026581 C20.8966752,21.6944103 20.0993873,21.6944103 19.6076351,21.2026581 L16.140989,17.736012 L12.674343,21.2026581 C12.1825908,21.6944103 11.3853029,21.6944103 10.8935507,21.2026581 C10.4017985,20.7109059 10.4017985,19.913618 10.8935507,19.4218658 L14.3601967,15.9552197 L10.8935507,12.4885737 C10.4017985,11.9968215 10.4017985,11.1995336 10.8935507,10.7077814 C11.3853029,10.2160292 12.1825908,10.2160292 12.674343,10.7077814 Z" id="Combined-Shape"></path>
                              </g>
                          </g>
                      </g>
                  </g>
                </svg>
              </span>
            </div>
          </div>
        </slot>
      </div>
      <div class="md__arrow" @click="showDrop">
        <slot name="arrow">
          <svg :class="showList? 'arrow__up': 'arrow__down'" width="11px" height="7px" viewBox="0 0 32 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <title></title>
            <desc>Created with sketchtool.</desc>
            <g id="Components" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="Place-holders" transform="translate(-158.000000, -139.000000)" fill="#A7B1C6">
                    <path d="M173.822147,158.422246 C173.245796,158.409504 172.667443,158.226091 172.167037,157.859651 C172.048839,157.773096 171.937335,157.677754 171.833472,157.574433 L158.850427,144.659195 C157.715241,143.520375 157.716713,141.677381 158.853718,140.540377 L158.964106,140.429989 C160.102396,139.291698 161.947929,139.291698 163.08622,140.429989 L173.993671,151.33744 L184.916888,140.414224 C186.055178,139.275933 187.900712,139.275933 189.039002,140.414224 L189.1461,140.521321 C190.284599,141.659403 190.284599,143.504936 189.146308,144.643227 L176.200548,157.586013 C175.550516,158.235896 174.669939,158.514631 173.822147,158.422246 L173.822147,158.422246 Z" id="Path"></path>
                </g>
            </g>
          </svg>
        </slot>
      </div>
    </div>
    <div class="md__list" ref="list" @mouseover="listHovering=true" @mouseleave="listHovering=false"  v-show="showList" @click="showBlur" :style="cssVars.listProperty">
      <div class="add-wrapper" @click="stopClose" >
        <input type="text" class="list-add" :placeholder="placeValue" v-model="addValue"/>
        <p class="plus-para" @click="addItem"><span class="plus-sign">+</span> ADD</p>
      </div>
      <div @click="selectItem(item)" ref="listitem" v-show="itemVisible(item)" v-for="(item,index) in itemList" @mouseover="hoverIndex=index" @mouseleave="hoverIndex=null" :key="item.name" :class="['md__list__item', {'active': getClass(item)}]" :style="getStyle(getClass(item),index)">
        {{ item.name }}
        <div class="check" @click="selectItem(item)"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dropdown',
  data () {
    return {
      inputValue: '',
      showList: false,
      selectedItem: {},
      resetItem: {},
      selectProperty: {},
      placeholderText: '',
      listHovering: false,
      hoverIndex: null,
      placeValue: 'New Group',
      addValue: ''
    }
  },
  props: {
    itemList: {
      type: Array,
      default: () => [
        { name: 'Content1', id: 1 },
        { name: 'Content2', id: 2 }
      ]
    },
    placeholder: {
      type: String,
      default: () => ''
    },
    selected: {
      type: Number,
      default: null
    },
    mSelectProperty: {
      type: [Object, Array, String]
    }
  },
  computed: {
    cssVars () {
      return this.selectProperty
    },
    inputVars () {
      let styleProp = {
        width: parseInt(this.selectProperty.defaultProperty.width, 10) + 'px'
      }
      return {...this.selectProperty.inputProperty, ...styleProp}
    },
    getSelectedName () {
      let val = ''
      if (this.selectedItem.name) {
        val = this.selectedItem.name
      } else if (this.resetItem.name) {
        val = this.resetItem.name
      }
      return val
    },
    getMouseLeave () {
      return false
    },
    getMouseHover () {
      return true
    },
    getLength () {
      return Object.keys(this.selectedItem).length === 0
    }
  },
  created () {
    this.selectProperty = {
      defaultProperty: {
        width: '300px',
        fontSize: '14px',
        lineHeight: '17px',
        color: '#1F2631'
      },
      inputProperty: {
        background: '#fff',
        height: '30px',
        borderRadius: '3px',
        border: '1px solid #D4DAE4',
        boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)'
      },
      listProperty: {
        borderRadius: '3px'
      },
      selectedProperty: {
        color: '#0978FC'
      },
      hoverProperty: {
        background: '#F9F9F9',
        letterSpacing: '0.5px'
      },
      unSelectedProperty: {
        background: '#fff',
        height: '40px'
      }
    }
    this.placeholderText = this.placeholder
    if (this.selected) {
      this.selectItem(this.itemList.find(i => i.id === this.selected))
    }
  },
  mounted () {
    if (this.mSelectProperty) {
      if (this.mSelectProperty.defaultProperty && this.mSelectProperty.defaultProperty.constructor === Object) {
        let defaultProp = {...this.selectProperty.defaultProperty, ...this.mSelectProperty.defaultProperty}
        this.selectProperty.defaultProperty = defaultProp
      }
      if (this.mSelectProperty.inputProperty && this.mSelectProperty.inputProperty.constructor === Object) {
        let inputProp = {...this.selectProperty.inputProperty, ...this.mSelectProperty.inputProperty}
        this.selectProperty.inputProperty = inputProp
      }
      if (this.mSelectProperty.selectedProperty && this.mSelectProperty.selectedProperty.constructor === Object) {
        let selectProp = {...this.selectProperty.selectedProperty, ...this.mSelectProperty.selectedProperty}
        this.selectProperty.selectedProperty = selectProp
      }
      if (this.mSelectProperty.hoverProperty && this.mSelectProperty.hoverProperty.constructor === Object) {
        let hoverProp = {...this.selectProperty.hoverProperty, ...this.mSelectProperty.hoverProperty}
        this.selectProperty.hoverProperty = hoverProp
      }
      if (this.mSelectProperty.unSelectedProperty && this.mSelectProperty.unSelectedProperty.constructor === Object) {
        let selectProp = {...this.selectProperty.unSelectedProperty, ...this.mSelectProperty.unSelectedProperty}
        this.selectProperty.unSelectedProperty = selectProp
      }
      if (this.mSelectProperty.listProperty && this.mSelectProperty.listProperty.constructor === Object) {
        let selectProp = {...this.selectProperty.listProperty, ...this.mSelectProperty.listProperty}
        this.selectProperty.listProperty = selectProp
      }
    }
  },
  methods: {
    itemVisible (item) {
      if (this.inputValue === '') {
        return true
      } else {
        let currentName = item.name.toLowerCase()
        let currentInput = this.inputValue.toLowerCase()
        return currentName.includes(currentInput)
      }
    },
    addItem () {
      this.stopClose()
      if (this.addValue) {
        let newItem = { 'name': this.addValue }
        this.selectItem(newItem)
      }
      this.addValue = ''
      this.showList = false
    },
    showAddFocus () {
      event.target.blur()
    },
    getClass (item) {
      if (item.name === this.placeholderText) {
        return true
      } else {
        return false
      }
    },
    handleFocusOut () {
      this.showList = false
      console.log(event.target)
    },
    handleAddFocusOut () {
      this.showList = true
    },
    getStyle (val, index) {
      let styl = ''
      if (this.listHovering) {
        if (this.hoverIndex === index) {
          styl = {...this.selectProperty.unSelectedProperty, ...this.selectProperty.hoverProperty}
        } else {
          styl = this.selectProperty.unSelectedProperty
        }
        if (val && !this.hoverIndex === index) {
          styl = this.selectProperty.unSelectedProperty
        }
      } else if (val) {
        styl = {...this.selectProperty.unSelectedProperty, ...this.selectProperty.selectedProperty}
      } else {
        styl = this.selectProperty.unSelectedProperty
      }
      return styl
    },
    showDrop () {
      this.showClick()
      this.stopClose()
    },
    selectItem (theItem) {
      this.selectedItem = theItem
      if (this.selectedItem.name) {
        this.placeholderText = this.selectedItem.name
      }
      this.inputValue = ''
      this.$emit('on-item-selected', theItem)
      // this.$nextTick(() => this.$refs.inputsearch.focus())
      this.getClass(theItem)
    },
    resetSelection () {
      this.stopClose()
      this.placeholderText = ''
      this.selectedItem = {}
      this.resetItem = this.selectedItem
      // this.$nextTick(() => this.$refs.inputsearch.focus())
      this.$emit('on-item-reset', this.resetItem)
    },
    stopClose () {
      event.stopPropagation()
    },
    showClick () {
      this.showList = !this.showList
    },
    showBlur () {
      this.showList = false
    }
  }
}
</script>

<style lang="scss" scoped>
.m-dropdown {
  font-size: inherit;
  font-family: inherit;
  width: var(--width);
  .md__input {
    display: flex;
    flex-direction: row;
    input {
      padding: 0 5px;
      color: inherit;
      &:focus {
        outline: none;
      }
    }
    .md__arrow {
      position: relative;
      right: 18px;
      cursor: pointer;
      display: flex;
      align-items: center;
      svg {
        path {
          fill: rgba(60,60,60,.5);
        }
        transition: transform .15s cubic-bezier(1,-.115,.975,.855),-webkit-transform .15s cubic-bezier(1,-.115,.975,.855);
        transition-timing-function: cubic-bezier(1,-.115,.975,.855);
        &.arrow__up {
          transform: rotate(180deg) scale(1);
          path {
            fill: #0978FC;
          }
        }
      }
    }
  }
  .md__list {
    box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, .15);
    width: inherit;
    cursor: pointer;
    overflow: auto;
    max-height: 170px;
    background: #fff;
    z-index: 1000;
    position: absolute;
    .add-wrapper {
      position: relative;
      .plus-para {
        position: absolute;
        top: 27px;
        right: 20px;
        color: #0978FC;
        font-size: 12px;
        font-family: inherit;
        .plus-sign {
          font-family: inherit;
          font-size: 12px;
          cursor: pointer;
        }
      }
    }
    .list-add {
      border: none;
      border-bottom: 1px solid #d8d8d8;
      padding: 5px 5px;
      width: calc(100% - 40px);
      margin-left: 20px;
      margin-bottom: 20px;
      margin-top: 20px;
      &:focus {
        outline: none;
      }
      &::placeholder {
        opacity: .5;
        color: #4E617B;
      }
    }
    &::-webkit-scrollbar {
      width: 5px;
    }
    &::-webkit-scrollbar-track {
      background : rgba(235, 235, 235, .3);
      border-radius: 2.5px;
      width: 5px;
    }
    &::-webkit-scrollbar-thumb {
      background : #EBEBEB;
      border-radius: 2.5px;
      width: 5px;
    }
    .md__list__item {
      padding: 0 5px;
      display: flex;
      align-items: center;
      position: relative;
      padding-left: 55px;
      &:hover {
        .check {
          border: 2px solid #579FFF;
        }
      }
      &.active {
        .check {
          border: 2px solid #579FFF;
          &:before {
            background: #579FFF;
          }
        }
      }
    }
    .check {
      display: block;
      position: absolute;
      border: 2px solid #D0D3D7;
      border-radius: 100%;
      height: 14px;
      width: 14px;
      top: 48%;
      transform: translateY(-48%);
      left: 20px;
      z-index: 5;
      transition: border .25s linear;
      -webkit-transition: border .25s linear;
      &:before {
        display: block;
        position: absolute;
        content: '';
        border-radius: 100%;
        height: 7px;
        width: 7px;
        top: 50%;
        transform: translate(-50%, -50%);
        left: 50%;
        margin: auto;
        transition: background 0.25s linear;
        -webkit-transition: background 0.25s linear;
      }
    }
  }
  .multiple-item-list {
    margin-left: 5px;
    padding: 0 5px;
    height: 22px;
    width: auto;
    font-size: 12px;
    display: flex;
    align-items: center;
    background:  #F5F5F5;
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
  }
  .close {
    cursor: pointer;
    background:  #F5F5F5;
    position: relative;
    height: 22px;
    display: flex;
    align-items: center;
    padding-right: 5px;
    border-bottom-right-radius: 2px;
    border-top-right-radius: 2px;
  }
  .multi {
    display: flex;
    align-items: center;
    height: 100%;
  }
  .placeholder-text {
    opacity: .5;
    color: #4E617B;
    padding-left: 5px;
    font-size: 12px;
  }
}
</style>
