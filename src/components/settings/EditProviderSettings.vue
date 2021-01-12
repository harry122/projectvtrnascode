<template>
  <div class="ticket-provider-wrapper">
    <MModal v-show="modalVisible" @close="modalVisible=false" :class="['modal-wrapper', modalVisible ? 'show-modal': '']" :styles="styles">
      <div slot="header">
        <div class="header-text">
          UPDATE SETTINGS
        </div>
      </div>
      <div slot="body">
        <div class="form-group">
          <form>
            <div class="t-row form-container">
              <div class="t-col-12">
                <div class="t-form-group haserror">
                   <div class="label-wrapper">
                    <Mlabel class="label">GROUP ID</Mlabel>
                    <MToolTip title="Group ID" value="1"></MToolTip>
                  </div>
                  <MTextbox disabled :textboxInput="updateData.groupid" :placeholder="'Group ID'" required :mInputProperty="mTextboxDisabledProperty"/>
                </div>
              </div>
            </div>
            <div class="t-row form-container">
              <div class="t-col-12">
                <div class="t-form-group haserror">
                  <div class="label-wrapper">
                    <Mlabel class="label">SETTINGS ID</Mlabel>
                    <MToolTip title="Settings Id" value="2"></MToolTip>
                  </div>
                  <MTextbox disabled :textboxInput="updateData.settingid" :placeholder="'Settings Id'" required @on-change-value="providerData.settingid=$event" :mInputProperty="mTextboxDisabledProperty"/>
                </div>
              </div>
            </div>
            <div class="t-row form-container">
              <div class="t-col-12">
                <div class="t-form-group haserror">
                   <div class="label-wrapper">
                    <Mlabel class="label" isrequired>DEFAULT VALUE</Mlabel>
                    <MToolTip title="Default Value" value="1"></MToolTip>
                  </div>
                  <MTextbox :resetText="resetDefault" :class="[errorSetting? 'red': 'not-red']" :textboxInput="updateData.settingvalue" :placeholder="'Settings Value'" required @on-change-value="setProvider($event)" :mInputProperty="mTextboxProperty"/>
                  <p class="error-para" v-show="errorSetting">{{errors.setting}}</p>
                </div>
              </div>
            </div>
            <div class="t-row form-container">
              <div class="t-col-12">
                <div class="t-form-group haserror">
                   <div class="label-wrapper">
                    <Mlabel class="label">DESCRIPTION</Mlabel>
                    <MToolTip title="Description" value="1"></MToolTip>
                  </div>
                  <MTextarea disabled :placeholder="'Description'" :maxlength="256" :mTextareaProperty="mTextareaProperty" :textareaInput="updateData.description"/>
                </div>
              </div>
            </div>
            <div class="t-row form-container">
              <div class="t-col-12">
                <div class="t-form-group haserror">
                   <div class="label-wrapper">
                    <Mlabel class="label" isrequired>MANDATORY</Mlabel>
                    <MToolTip title="Mandatory" value="1"></MToolTip>
                  </div>
                  <div v-if="updateData.ismandatory">
                    <MToggle v-if="updateData.ismandatory.toLowerCase() === 'yes'" :leftLabel="updateData.ismandatory" :toggleCheckBox="true" />
                    <MToggle v-else-if="updateData.ismandatory.toLowerCase() === 'no'" :leftLabel="updateData.ismandatory" :toggleCheckBox="false" />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="t-col-12 button-wrapper">
          <MButton :class="['btn-wrap', updateDisabled? 'disabled': '']" :disabled="updateDisabled" primary :plus="false" @on-btn-click="sendData" :mButtonProperty="mButtonproperty">UPDATE</MButton>
          <MButton class="btn-wrap" secondary @on-btn-click="modalVisible=false" :mButtonProperty="mButtonproperty">CANCEL</MButton>
        </div>
      </div>
    </MModal>
  </div>
</template>

<script>
import { MModal, Mlabel, MTextbox, MButton, MToolTip, MTextarea, MToggle } from 'mobiotics-dynamic-components-vue'

export default {
  name: 'UpdateProvider',
  data () {
    return {
      modalVisible: false,
      styles: {},
      mTextboxProperty: {},
      providerData: [],
      formNewData: {},
      mTextboxDisabledProperty: {},
      errors: {},
      errorSetting: false,
      updateDisabled: true,
      mTextareaProperty: {},
      mButtonproperty: {},
      resetDefault: false
    }
  },
  props: {
    isModalVisible: {
      type: Boolean,
      default: false
    },
    updateData: {
      type: [Array, Object, String]
    },
    groupData: {
      type: String
    }
  },
  components: {
    MModal,
    Mlabel,
    MTextbox,
    MButton,
    MToolTip,
    MTextarea,
    MToggle
  },
  watch: {
    modalVisible () {
      if (this.modalVisible) {
        document.documentElement.style.overflow = 'hidden'
        return
      } else {
        document.documentElement.style.overflow = 'auto'
      }
      this.resetData()
      this.$emit('changeModal', this.modalVisible)
      this.updateDisabled = true
    },
    isModalVisible () {
      this.modalVisible = this.isModalVisible
    }
  },
  methods: {
    sendData () {
      if (!this.providerData.provider) {
        this.errorSetting = true
        this.errors.setting = 'Please enter Setting value'
      }
      this.providerData.providerid = this.updateData.providerid
      if (!this.errorSetting) {
        this.$emit('providerData', this.providerData)
      }
    },
    resetData () {
      if (!this.resetDefault) {
        this.resetDefault = this.updateData.settingvalue
      } else {
        this.resetDefault = false
      }
    },
    setProvider (val) {
      this.providerData.provider = val
      this.errorSetting = false
      console.log(this.updateData)
      if (val !== this.updateData.settingvalue) {
        this.updateDisabled = false
      } else if (val === this.updateData.settingvalue) {
        this.updateDisabled = true
      }
    }
  },
  created () {
    this.formNewData = {...this.updateData}
    this.modalVisible = this.isModalVisible
    this.styles = {
      width: '31%',
      height: 'auto',
      maxHeight: '95%',
      paddingBottom: '40px'
    }
    this.mTextareaProperty = {
      defaultProperty: {
        width: '100%',
        height: '64px',
        color: '#1F2631',
        border: '1px solid rgba(212,218,228,0.7)',
        background: 'rgba(233, 236, 239, 0.5)'
      }
    }
    this.mTextboxProperty = {
      defaultProperty: {
        width: '100%',
        color: '#1F2631',
        border: '1px solid rgba(212,218,228,0.7)'
      }
    }
    this.mTextboxDisabledProperty = {
      defaultProperty: {
        width: '100%',
        color: '#1F2631',
        background: 'rgba(233, 236, 239, 0.5)',
        border: '1px solid rgba(212,218,228,0.7)'
      }
    }
    this.mButtonproperty = {
      defaultProperty: {
        height: '35px',
        width: '100%'
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .ticket-provider-wrapper {
    >>> .modal-wrapper {
      z-index: 1009;
      opacity: 0;
      transition: opacity .15s linear;
      &.show-modal {
        opacity: 1;
        .m-modal {
          transform: translate(0,0);
        }
      }
      .m-modal {
        transition: transform .3s ease-out,-webkit-transform .3s ease-out;
      }
      .md-header {
        padding-top: 5px;
        padding-bottom: 20px;
        .header-text {
          letter-spacing: 0.4px;
          color: var(--primary-grey);
          font-family: "Helvetica Neue Bold";
        }
      }
    }
  }
  .form-group {
    padding: 0 30px;
    .form-container {
      padding-top: 10px;
      .label-wrapper {
        padding-bottom: 3px;
        >>> .tooltip-div {
          cursor: pointer;
          .tooltip {
            .tooltiptext {
              font: 10px/15px var(--font-regular);
              color: rgba(0,0,0,0.7);
              width: auto;
              padding: 2px 25px 2px 8px;
              top: -18px;
              left: 8px;
              border-radius: 3px;
              white-space: nowrap;
            }
          }
        }
      }
      >>> .m-textbox {
        &.red {
          border: 1.2px solid var(--error)!important;
        }
      }
      >>> .toggle-button {
        width: 55px;
        padding-top: 10px;
        .toggle-text {
          color: var(--primary-grey) !important;
          opacity: 0.7;
        }
        .switch {
          pointer-events: none;
          .slider {
            background: var(--light-grey) !important;
            opacity: 0.5;
            &:before {
              border: .5px solid var(--light-grey);
            }
          }
        }
      }
    }
  }
  .button-wrapper {
    width: 100%;
    padding: 20px 40px 0;
    .btn-wrap {
      margin: 10px 0;
      &.disabled {
        background: rgba(255, 51, 102, 0.5) !important;
        border: none !important;
      }
    }
  }
  .t-upload {
    padding-top: 30px;
  }
  .error-para {
    background: var(--white);
    text-align: right;
    font: 12px/14px var(--font-regular);
    color: var(--error);
    letter-spacing: 0.3px;
    position: absolute;
    bottom: -15px;
    right: 15px;
    &.textarea {
      bottom: -2px;
    }
  }
</style>
