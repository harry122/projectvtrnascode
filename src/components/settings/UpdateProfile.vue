<template>
  <div class="profile-wrapper">
    <MModal v-show="modalVisible" @close="modalVisible=false" class="modal-wrapper" :styles="styles">
      <div slot="header">
        <div class="header-text">
          UPDATE PROFILE
        </div>
      </div>
      <div slot="body">
        <div class="form-group">
          <form>
            <div class="t-row form-container">
              <div class="t-col-12">
                <div class="t-form-group haserror">
                  <div class="label-wrapper">
                    <Mlabel class="label" isrequired>PROFILE NAME</Mlabel>
                    <MToolTip title="Profile Name" value="1"></MToolTip>
                  </div>
                  <MTextbox :placeholder="'Profile Name'" required @on-change-value="profileData.name=$event" :mInputProperty="mTextboxProperty"/>
                </div>
              </div>
            </div>
            <div class="t-row form-container">
              <div class="t-col-12">
                <div class="t-form-group haserror">
                   <div class="label-wrapper">
                    <Mlabel class="label" isrequired>PROFILE TYPE</Mlabel>
                    <MToolTip title="Profile Type" value="2"></MToolTip>
                  </div>
                  <MDropdown :selected="0" :itemList="typeList" :mSelectProperty="mDropdownProperty" :placeholder="'Select Profile'" @on-item-selected="profileData.type=$event.name" @on-item-reset="profileData.type=$event.name"/>
                </div>
              </div>
            </div>
            <div class="t-row form-container">
              <div class="t-col-12">
                <div class="t-form-group haserror">
                   <div class="label-wrapper">
                    <Mlabel class="label" isrequired>ENCODING</Mlabel>
                    <MToolTip title="Encoding" value="1"></MToolTip>
                  </div>
                  <MMultipleDropdown class="multiple-drop" :selected="0" :itemList="encodeList" :mSelectProperty="mMultipleProperty" :placeholder="'Select Country'" @on-item-selected="formData.country=$event" @on-item-reset="formData.country=$event"/>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="transcode-wrapper">
          <div class="watermark-wrapper transcode-div">
            <p v-show="isWatermark" class="watermark-para transcode-para" @click="addWatermark">+ ADD WATERMARK</p>
            <Watermark v-show="!isWatermark" @closeWaterMark="isWatermark=true"/>
          </div>
          <div :class="['trailer-wrapper', 'transcode-div', {'active': isTrailer}]">
            <div v-for="i in trailerkey" :key="i" v-show="isTrailer" class="trailerloop">
              <AddTrailer v-show="showTrailer(i)" :id="i" @closeTrailer="trailerClose($event)"/>
            </div>
            <p :class="['trailer-para', 'transcode-para', {'active': isTrailer}]" @click="addTrailer">+ ADD TRAILER</p>
          </div>
          <div :class="['poster-wrapper', 'transcode-div', {'active': isPoster}]">
            <div v-for="i in posterkey" :key="i" v-show="isPoster" class="posterloop">
              <AddPoster v-show="showPoster(i)" :id="i" @closePoster="posterClose($event)"/>
            </div>
            <p :class="['poster-para', 'transcode-para', {'active': isPoster}]" @click="addPoster">+ ADD POSTER</p>
          </div>
        </div>
        <div class="t-col-12 button-wrapper">
          <MButton class="btn-wrap" primary :plus="false" @on-btn-click="sendData" :mButtonProperty="mButtonproperty">SUBMIT</MButton>
          <MButton class="btn-wrap" secondary @on-btn-click="modalVisible=false" :mButtonProperty="mButtonproperty">CANCEL</MButton>
        </div>
      </div>
    </MModal>
  </div>
</template>

<script>
import { MModal, Mlabel, MTextbox, MButton, MToolTip, MDropdown, MMultipleDropdown } from 'mobiotics-dynamic-components-vue'

export default {
  name: 'UpdateProfile',
  data () {
    return {
      modalVisible: false,
      styles: {},
      mTextboxProperty: {},
      profileData: [],
      mDropdownProperty: {},
      typeList: {},
      encodeList: {},
      mMultipleProperty: {},
      isWatermark: true,
      isTrailer: false,
      isPoster: false,
      trailerkey: 0,
      closeTrailerIndex: null,
      posterkey: 0,
      closePosterIndex: null
    }
  },
  props: {
    isUpdateVisible: {
      type: Boolean,
      default: false
    }
  },
  components: {
    MModal,
    Mlabel,
    MTextbox,
    MButton,
    MToolTip,
    MDropdown,
    MMultipleDropdown,
    Watermark: () => import('@/components/settings/Watermark.vue'),
    AddTrailer: () => import('@/components/settings/AddTrailer.vue'),
    AddPoster: () => import('@/components/settings/AddPoster.vue')
  },
  watch: {
    modalVisible () {
      this.$emit('changeModal', this.modalVisible)
    },
    isUpdateVisible () {
      this.modalVisible = this.isUpdateVisible
    },
    trailerkey () {
      if (this.trailerkey === 0) {
        this.isTrailer = false
      }
    },
    posterkey () {
      if (this.posterkey === 0) {
        this.isPoster = false
      }
    }
  },
  methods: {
    sendData () {
      this.$emit('providerData', this.providerData)
      this.modalVisible = false
    },
    showTrailer (val) {
      if (val === this.closeTrailerIndex) {
        return false
      } else {
        return true
      }
    },
    showPoster (val) {
      if (val === this.closePosterIndex) {
        return false
      } else {
        return true
      }
    },
    addWatermark () {
      this.isWatermark = false
    },
    addTrailer () {
      this.isTrailer = true
      this.trailerkey += 1
    },
    trailerClose (val) {
      this.closeTrailerIndex = val
      if (this.trailerkey) {
        this.trailerkey -= 1
      }
      this.closeTrailerIndex = null
    },
    addPoster () {
      this.isPoster = true
      this.posterkey += 1
    },
    posterClose (val) {
      this.closePosterIndex = val
      if (this.posterkey) {
        this.posterkey -= 1
      }
      this.closePosterIndex = null
    },
    closeWaterMark () {
      this.isWatermark = true
    }
  },
  created () {
    this.modalVisible = this.isUpdateVisible
    this.styles = {
      width: '652px',
      height: 'auto',
      maxHeight: '95%',
      paddingBottom: '25px'
    }
    this.mMultipleProperty = {
      height: '30'
    }
    this.mTextboxProperty = {
      defaultProperty: {
        width: '100%',
        border: '1px solid rgba(212,218,228,0.7)'
      }
    }
    this.mButtonproperty = {
      defaultProperty: {
        height: '35px',
        width: '150px'
      }
    }
    this.mDropdownProperty = {
      defaultProperty: {
        width: 'inherit'
      },
      listProperty: {
        width: 'calc(100%)'
      }
    }
    this.typeList = [
      { name: 'Audio', id: 1 },
      { name: 'Video', id: 2 },
      { name: 'Audio_Video', id: 3 }
    ]
    this.encodeList = [
      { name: 'Encod1', id: 1 },
      { name: 'Encod2', id: 2 },
      { name: 'Encod3', id: 3 },
      { name: 'Encod4', id: 4 }
    ]
  }
}
</script>

<style scoped lang="scss">
  .profile-wrapper {
    >>> .modal-wrapper {
      .md-header {
        padding-top: 5px;
        padding-bottom: 35px;
        justify-content: inherit;
        padding-left: 40px;
        .header-text {
          letter-spacing: 0.4px;
          color: var(--primary-grey);
          font-family: "Helvetica Neue Bold";
        }
      }
    }
  }
  .form-group {
    padding: 0 22px 0 25px;
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
      >>> .m-dropdown {
        .md__search,
        .md__input-box,
        .dropdown-selected {
          min-width: 100%;
        }
        .md__list {
          width: calc(100%)!important;
        }
      }
      .multiple-drop {
        >>> &.m-dropdown {
          .md__search {
            min-width: 82%;
          }
        }
      }
    }
  }
  .button-wrapper {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    padding-right: 31px;
    .btn-wrap {
      margin: 0 6px;
      width: 150px;
    }
  }
  .transcode-wrapper {
    padding: 15px 37px 0 40px;
    .transcode-div {
      padding: 10px 0;
      .transcode-para {
        color: var(--primary-blue);
        font: 1vw/1.2vw var(--font-medium);
        cursor: pointer;
        &.trailer-para,
        &.poster-para {
          &.active {
            padding-top: 16px;
          }
        }
      }
      &.trailer-wrapper,
      &.poster-wrapper {
        &.active {
          padding-top: 16px;
        }
      }
    }
  }
</style>
