<template>
  <div class="edit-default-wrapper">
    <MModal v-show="modalVisible" @close="modalVisible=false" class="modal-wrapper" :styles="styles">
      <div slot="body">
        <p class="modal-body">Are you sure to change <span class="delete">Default</span> Profile to<br/><span class="highlight">{{ defaultRow }}</span>?
        <div class="t-flex-wrapper button-wrapper">
          <MButton primary :plus="false" @on-btn-click="sendData" :mButtonProperty="mButtonproperty">YES</MButton>
          <MButton secondary @on-btn-click="modalVisible=false" :mButtonProperty="mButtonproperty">NOT NOW</MButton>
        </div>
      </div>
    </MModal>
  </div>
</template>

<script>
import { MModal, MButton } from 'mobiotics-dynamic-components-vue'

export default {
  name: 'EditDefault',
  data () {
    return {
      modalVisible: false,
      styles: {},
      mButtonproperty: {},
      id: ''
    }
  },
  props: {
    isEditVisible: {
      type: Boolean,
      default: false
    },
    defaultRow: {
      type: [Number, String]
    }
  },
  components: {
    MModal,
    MButton
  },
  created () {
    this.id = this.defaultRow
    this.styles = {
      width: '30%',
      height: 'auto',
      maxHeight: '95%',
      paddingBottom: '20px'
    }
    this.mButtonproperty = {
      defaultProperty: {
        height: '38px',
        margin: '0 9px'
      }
    }
  },
  mounted () {
    this.modalVisible = this.isEditVisible
  },
  watch: {
    modalVisible () {
      if (this.modalVisible) {
        document.documentElement.style.overflow = 'hidden'
        return
      } else {
        document.documentElement.style.overflow = 'auto'
      }
      this.$emit('changeModal', this.modalVisible)
    },
    isEditVisible () {
      this.modalVisible = this.isEditVisible
    }
  },
  methods: {
    sendData () {
      this.$emit('changeDefault', this.defaultRow)
    }
  }
}
</script>

<style scoped lang="scss">
  .edit-default-wrapper {
    .highlight {
      color: var(--primary-blue);
      font-family: var(--font-bold);
    }
    .modal-body {
      font: 1.2vw/1.7vw var(--font-regular);
      text-align: center;
      .delete {
        font-family: var(--font-medium);
      }
    }
  }
  .button-wrapper {
    width: 100%;
    padding: 30px 0 30px;
    justify-content: center;
  }
</style>
