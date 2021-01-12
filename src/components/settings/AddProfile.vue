<template>
  <div :class="['profile-wrapper', modalVisible ? 'show': '']">
    <MModal v-show="modalVisible" @close="modalVisible=false" class="modal-wrapper" :styles="styles">
      <div slot="header">
        <div class="header-text">
          CREATE A NEW PROFILE
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
                  <MTextbox :placeholder="'Profile Name'" required @on-change-value="setProfileId($event)" :mInputProperty="mTextboxProperty"/>
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
                  <MDropdown :selected="0" :itemList="typeList" :mSelectProperty="mDropdownProperty" :placeholder="'Select Profile'" @on-item-selected="profileData.profiletype=$event.name" @on-item-reset="profileData.profiletype=$event.name"/>
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
                  <MMultipleDropdown class="multiple-drop" :selected="0" :itemList="encodeList" :mSelectProperty="mMultipleProperty" :placeholder="'Select Encoding'" @on-item-selected="setEncoding($event)" @on-item-reset="setEncoding($event)"/>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="transcode-wrapper">
          <div class="watermark-wrapper transcode-div">
            <p v-show="isWatermark" class="watermark-para transcode-para" @click="addWatermark">+ ADD WATERMARK</p>
            <Watermark v-show="!isWatermark" :profileWatermark="watermarkData" @closeWaterMark="closeWaterMark()" @watermark="setWaterMark($event)"/>
          </div>
          <div :class="['trailer-wrapper', 'transcode-div', {'active': isTrailer}]">
            <div v-for="i in trailerkey" :key="i" v-show="isTrailer" class="trailerloop">
              <AddTrailer v-show="showTrailer(i)" :id="i" @closeTrailer="trailerClose($event)" @trailer="setTrailerData($event, i)" :formProfileData="getTrailerData(i)"/>
            </div>
            <p :class="['trailer-para', 'transcode-para', {'active': isTrailer}]" @click="addTrailer">+ ADD TRAILER</p>
          </div>
          <div :class="['poster-wrapper', 'transcode-div', {'active': isPoster}]">
            <div v-for="i in posterkey" :key="i" v-show="isPoster" class="posterloop">
              <AddPoster v-show="showPoster(i)" :id="i" @closePoster="posterClose($event)" :formPosterData="getPosterData(i)" @poster="setPosterData($event, i)" />
            </div>
            <p :class="['poster-para', 'transcode-para', {'active': isPoster}]" @click="addPoster">+ ADD POSTER</p>
          </div>
        </div>
        <div class="t-col-12 button-wrapper">
          <MButton class="btn-wrap" primary :plus="false" @on-btn-click="sendData" :mButtonProperty="mButtonproperty">CREATE</MButton>
          <MButton class="btn-wrap" secondary @on-btn-click="modalVisible=false" :mButtonProperty="mButtonproperty">CANCEL</MButton>
        </div>
      </div>
    </MModal>
  </div>
</template>

<script>
import { MModal, Mlabel, MTextbox, MButton, MToolTip, MDropdown, MMultipleDropdown } from 'mobiotics-dynamic-components-vue'

export default {
  name: 'AddProfile',
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
      closePosterIndex: null,
      watermarkData: {},
      trailerData: [],
      fullTime: 0,
      posterData: [],
      idError: false,
      encodingError: false,
      errors: [],
      mMultipleProperty: {}
    }
  },
  props: {
    isModalVisible: {
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
      if (this.modalVisible) {
        document.documentElement.style.overflow = 'hidden'
      } else {
        document.documentElement.style.overflow = 'auto'
      }
      this.$emit('changeModal', this.modalVisible)
    },
    isModalVisible () {
      this.modalVisible = this.isModalVisible
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
      if (!this.profileData.profileid) {
        this.idError = true
        this.errors.id = 'Please Enter Profile Id'
      }
      if (!this.profileData.profileEncoding) {
        this.encodingError = true
        this.errors.encoding = 'Please Select Encoding'
      }
      if (this.profileData.profileEncoding) {
        this.profileData.encoding = []
        for (let i = 0; i < this.profileData.profileEncoding.length; i++) {
          this.profileData.encoding.push(this.profileData.profileEncoding[i].name)
        }
      }
      if (this.profileData.profiletype) {
        this.profileData.profiletype = this.profileData.profiletype.toUpperCase()
      }
      if (!this.isWatermark) {
        if (!this.watermarkData.filename) {
          this.watermarkError = true
          this.errors.watermark = 'Please add one Watermark file'
        } else {
          this.profileData.watermarkdetails = {}
          this.profileData.watermarkdetails.filename = this.watermarkData.filename
          this.profileData.watermarkdetails.size = this.watermarkData.size
          this.profileData.watermarkdetails.position = []
          if (this.watermarkData.top) {
            this.profileData.watermarkdetails.position.push(this.watermarkData.top)
          }
          if (this.watermarkData.left) {
            this.profileData.watermarkdetails.position.push(this.watermarkData.left)
          }
          if (this.profileData.watermarkdetails.position) {
            this.profileData.watermarkdetails.position = this.profileData.watermarkdetails.position.join()
          }
          // to be removed
          this.profileData.watermarkdetails.folder="abc"
          this.profileData.watermarkdetails.transparency = this.watermarkData.transparency
        }
      }
      if (this.isTrailer) {
        this.profileData.trailerdetails = this.trailerData
      }
      if (this.isPoster) {
        this.profileData.posterdetails = this.posterData
      }
      this.$emit('profileData', this.profileData)
      this.modalVisible = false
    },
    setProfileId (val) {
      this.profileData.profileid = val
    },
    setEncoding (val) {
      this.profileData.profileEncoding = val
    },
    setTrailerData (data, id) {
      if (data) {
        if (data.forVal === 'prefix') {
          this.trailerData[id-1].prefix = data.val.prefix
        } else if (data.forVal === 'quality') {
          this.trailerData[id-1].quality = data.val.quality
        } else if (data.forVal === 'start') {
          this.trailerData[id-1].start = data.val.start
        } else if (data.forVal === 'duration') {
          this.trailerData[id-1].duration = data.val.duration
        }
      }
    },
    getTrailerData (id) {
      if (!this.trailerData[id-1]) {
        this.trailerData[id-1] = {
          'prefix': '',
          'quality': 'hd',
          'start': this.fullTime,
          'duration': 0,
          'folder': 'abc'
        }
      }
      return this.trailerData[id-1]
    },
    setPosterData (data, id) {
      if (data) {
        if (data.forVal === 'prefix') {
          this.posterData[id-1].prefix = data.val.prefix
        } else if (data.forVal === 'quality') {
          this.posterData[id-1].quality = data.val.quality
        } else if (data.forVal === 'count') {
          this.posterData[id-1].count = data.val.count
        }
      }
    },
    getPosterData (id) {
      if (!this.posterData[id-1]) {
        this.posterData[id-1] = {
          'prefix': '',
          'quality': 'hd',
          'count': '0',
          'folder': 'abc'
        }
      }
      return this.posterData[id-1]
    },
    showTrailer (val) {
      if (val === this.closeTrailerIndex) {
        return false
      } else {
        return true
      }
    },
    setWaterMark (value) {
      if (value.forVal === 'size') {
        this.watermarkData.size = value.val.size
      } else if (value.forVal === 'top') {
        this.watermarkData.top = value.val.top
      } else if (value.forVal === 'left') {
        this.watermarkData.left = value.val.left
      } else if (value.forVal === 'transparency') {
        this.watermarkData.transparency = value.val.transparency
      } else if (value.forVal === 'filename') {
        this.watermarkData.filename = value.val.filename
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
      this.watermarkData = {
        size: '10',
        left: '90',
        top: '90',
        transparency: '30'
      }
      this.isWatermark = false
    },
    addTrailer () {
      this.isTrailer = true
      this.trailerkey += 1
    },
    trailerClose (val) {
      this.closeTrailerIndex = val
      let attachment = this.trailerData.splice(val-1, 1)
      console.log(this.trailerData)
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
      let attachment = this.posterData.splice(val-1, 1)
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
    this.modalVisible = this.isModalVisible
    let newTime = new Date().setHours(24, 0, 0, 0)
    this.fullTime = new Date(new Date(newTime).getTime()).toLocaleTimeString()
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
        border: '1px solid rgba(212,218,228,0.7)',
        color: '#1F2631'
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
        width: '100%'
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
      { name: 'Encod4', id: 4 },
      { name: 'H2644000K', id: 5}
    ]
  }
}
</script>

<style scoped lang="scss">
  .profile-wrapper {
   overflow-x: hidden;
    overflow-y: auto;
    opacity: 0;
    display: none;
    z-index: 1072;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    outline: 0;
    transition: opacity .15s linear;
    background-color: rgba(0,0,0,.3);
    &.show {
      opacity: 1;
      display: block;
      padding-right: 15px;
      >>> .modal-wrapper {
        transform: translate(0,0);
        opacity: 1;
      }
    }
    >>> .modal-wrapper {
      transition: transform .3s ease-out,-webkit-transform .3s ease-out;
      position: relative;
      margin: 55px auto;
      width: auto;
      max-width: 652px;
      height: auto;
      pointer-events: none;
      background: transparent;
      overflow: hidden;
      .m-modal {
        position: relative;
        display: flex;
        flex-direction: column;
        width: 100%;
        pointer-events: auto;
        background-clip: padding-box;
        outline: 0;
      }
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
          .md__list__div {
            max-height: 115px;
          }
        }
      }
      .multiple-drop {
        >>> &.m-dropdown {
          .md__search {
            min-width: 82%;
          }
          .placeholder {
            font-size: 12px;
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
        font: 12px var(--font-medium);
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
