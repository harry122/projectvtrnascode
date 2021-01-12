<template>
  <div class="delete-profile-wrapper">
    <MModal v-show="modalVisible" @close="modalVisible=false" class="modal-wrapper" :styles="styles">
      <div slot="body">
        <p class="modal-body">Are you sure to <span class="delete">Delete</span> the Profile for<br/>Id <span class="highlight">{{ deleteRow }}</span>?
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
  name: 'DeleteProfile',
  data () {
    return {
      modalVisible: false,
      styles: {},
      mButtonproperty: {},
      id: ''
    }
  },
  props: {
    isDeleteVisible: {
      type: Boolean,
      default: false
    },
    deleteRow: {
      type: [Number, String]
    }
  },
  components: {
    MModal,
    MButton
  },
  created () {
    this.id = this.deleteRow
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
    this.modalVisible = this.isDeleteVisible
  },
  watch: {
    modalVisible () {
      this.$emit('changeModal', this.modalVisible)
    },
    isDeleteVisible () {
      this.modalVisible = this.isDeleteVisible
    }
  },
  methods: {
    sendData () {
      this.modalVisible = false
    }
  }
}
</script>

<style scoped lang="scss">
  .delete-profile-wrapper {
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
