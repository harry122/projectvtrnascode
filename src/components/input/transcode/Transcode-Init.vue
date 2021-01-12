<template>
  <div v-if="getListFilteredJobTranscode.length">
    <sub-content-list v-if="isActivePopup"></sub-content-list>
    <div class="input-trancode-footer" >
      <div class="trancode-section-1">
        <div class="tr1-item1">
          Selected Items
        </div>
        <div class="tr-subsection">
          <div style="margin-right: 12px" class="tr1-item2" v-if="mimeList.video.length">
            Video({{mimeList.video.length}})
          </div>
          <div style="margin-right: 12px" class="tr1-item3" v-if="mimeList.audio.length">
            Audio({{mimeList.audio.length}})
          </div>
           <div style="margin-right: 12px" class="tr1-item4" v-if="mimeList.subtitle.length">
            SUBTITLE({{mimeList.subtitle.length}})
          </div>
           <div style="margin-right: 12px" class="tr1-item5" v-if="mimeList.poster.length">
            POSTER({{mimeList.poster.length}})
          </div>
          <div style="margin-left: 12px;margin-left: 12px; cursor: pointer;" @click="actIsActiveArrow()">
            <drop-svg v-if="isActiveArrow" style=" transform: rotate(180deg);"></drop-svg>
            <active-dropdown v-else ></active-dropdown>
          </div>
        </div>
      </div>
      <div class="trancode-section-2">
        <div style="flex: 1 0 50%;">
          <MTextbox required @on-change-value="actGetTranscodeValue" :mInputProperty="mTextboxProperty"  type="text" class="input-area" @keypress="onEnterService" :placeholder="'ENTER CONTENT ID'" v-if="isTranscodeButton"/>
        </div>
        <div style="flex: 1 0 50%; margin-left: 12px;">
          <MButton :plus="true" primary @on-btn-click="addToTranscode(true)" v-if="isTranscodeButton" >ADD TO TRANCECODE</MButton>
          <MButton :plus="false" primary @on-btn-click="actPreprocess(true)" v-else >PREPROCESS</MButton>

          <p v-if="errorCodeEnable" style="color: red; font-size: 12px;position: absolute;
    bottom: 8px;"> Enter Valid Data </p>
        </div>
        <div class="tr-cancel" @click="cancelTranscode()">
          CANCEL
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { MButton, MTextbox } from 'mobiotics-dynamic-components-vue'
import { EventBus } from '@/event';
import { mapGetters, mapMutations } from 'vuex'

export default {
  data () {
    return {
      mTextboxProperty: '',
      isActiveArrow: false,
      isActivePopup: false,
      mimeList: {},
      isTranscodeButton: false,
      isValidation: false,
      enterTranscodeItem: '',
      errorCodeEnable: ''
    }
  },
  computed: {
    ...mapGetters(['getListAllJobTranscode', 'getListFilteredJobTranscode'])
  },
  watch: {
    getListFilteredJobTranscode(val) {
      console.log("reached", val)
      this.setupMimeType(val)
    }
  },
  methods: {
    ...mapMutations(['setTranscodeProcessName', 'setListFilteredJobTranscode']),
    actGetTranscodeValue (payload) {
      console.log("payload >>>>>>", payload)
      this.enterTranscodeItem = payload
      this.setTranscodeProcessName(payload)
    },
    cancelTranscode () {
      console.log("cancel data")
      this.setListFilteredJobTranscode([])
    },
    closeSpecPopup () {
      console.log('ok')
    },
    actIsActiveArrow() {
      console.log('ok')
   
      EventBus.$emit("footer-transcode-item-enable", this.isActiveArrow = !this.isActiveArrow)
    },
    setupMimeType (jobList) {
       this.mimeList = {
        audio: [],
        video: [],
        subtitle: [],
        poster: []
       }
      for (let item of jobList) {
        if (item.filetype == "VIDEO") {
          this.mimeList.video.push(item)
        } else if (item.filetype == 'AUDIO') {
          this.mimeList.audio.push(item)
        } else if (item.filetype == 'SUBTITLE') {
          this.mimeList.subtitle.push(item)
        } else {
          this.mimeList.poster.push(item)
        }
      }
    },
    addToTranscode () {
      if (this.enterTranscodeItem) {
        if (this.enterTranscodeItem.length > 4 && this.enterTranscodeItem.length <= 24) {
          this.errorCodeEnable = false
          this.$emit('event-addToTranscode', true);
          return;
        } 
      }

      this.errorCodeEnable = true
      
    },
    actPreprocess () {
      this.$emit('event-actPreprocess', true)
      EventBus.$emit('preprocessInit',true)
    }

  },
  created () {
   console.log("routerName", this.$route.name)

   if (this.$route.name === 'Input') {
     this.isTranscodeButton = true
   }
    this.mTextboxProperty = {
      defaultProperty: {
        width: '100%',
        'margin-left': '-6px'
      }
    }
    EventBus.$on("footer-transcode-item-enable", (status) => {
      this.isActivePopup = status;
   })
  },
  components: {
    MButton,
    MTextbox,
    'sub-content-list': () => import('./DisplayContent.vue'),
    'drop-svg': () => import('@/svg/arrowSvg.vue'),
    'active-dropdown': () => import('@/svg/activeArrow.vue')
  }
}
</script>

<style lang="scss" scoped>
  /deep/ .m-button {
    width: 96% !important;
    font-family: var(--font-medium);
  }
  .input-trancode-footer {
    background-color: white;
    height: 90px;
    border-radius: 7px;
    position: fixed;
    bottom: 38px;
    width: 91.4%;
    margin: 9px 8.7px;
    display: flex;
    align-items: center;
    padding: 0px 56px;
    justify-content: space-around;
    justify-content: space-between;
    .trancode-section-1 {
      display: flex;
      // justify-content: flex-end;
      .tr-subsection {
        display: flex;
        justify-content: space-between;
        margin-left: 84px;
      }
      .tr1-item1 {
        color: #1F2631;
        font-family: var(--font-medium);
        font-size: 18px;
      }
      .tr1-item2 {
        color: #1F2631;
        font-family: "Helvetica Neue";
        font-size: 15px;
         &:before {
          content: "\A";
          background-color: #3286EA;
          width:10px;
          height:10px;
          border-radius:50%;
          display:inline-block;
          margin:0 10px;
        }
      }
       .tr1-item3 {
        color: #1F2631;
        font-family: "Helvetica Neue";
        font-size: 15px;
         &:before {
          content: "\A";
          background-color: #EA9432;
          width:10px;
          height:10px;
          border-radius:50%;
          display:inline-block;
          margin:0 10px;
        }
      }
      .tr1-item4 {
        color: #1F2631;
        font-family: "Helvetica Neue";
        font-size: 15px;
         &:before {
          content: "\A";
          background-color: #50D3A5;
          width:10px;
          height:10px;
          border-radius:50%;
          display:inline-block;
          margin:0 10px;
        }
      }
       .tr1-item5 {
        color: #1F2631;
        font-family: "Helvetica Neue Bold";
        font-size: 15px;
         &:before {
          content: "\A";
          background-color: #50D3A5;
          width:10px;
          height:10px;
          border-radius:50%;
          display:inline-block;
          margin:0 10px;
        }
      }
    }
    .trancode-section-2 {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-right: 66px;
      // justify-content: flex-end;
      .tr-cancel {
        opacity: 0.5;
        color: #1E1E1E;
        font-family: var(--font-medium);
        font-size: 12px;
        margin-left: 17px;
      }
    }
  }
</style>
