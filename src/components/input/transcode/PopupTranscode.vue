<template>
  <div class="popup-transcode">
    <MModal @close="closePopup">
      <div slot="header">
        <p class="header-text">Select Transcoding Options</p>
      </div>
      <div slot="body" class="popup-content-body">
          <div style="display:flex; font-size: 13px;">
              <p style="flex: 0 0 15%; color:blue">#03</p>
              <p>Size: {{size}} MB</p>
          </div>
          <div style="margin-top: 20px">
              <Mlabel isrequired class="label">SELECT PROFILE</Mlabel>
              <MToolTip title="SELECT PROFILE" value="3"></MToolTip>
              <MDropdown :selected="1" :itemList="getAllProfileList" @on-item-selected="dropdownSelection($event)"/>
          </div>
          <div style="margin-bottom: 25px;margin-top: 11px;">
              <div style="display: flex; align-items: center; position: relative ">
                    <MToolTip title="POSTER" value="1"></MToolTip>
                    <Mlabel isrequired class="label" style="margin-left: 10px">POSTER</Mlabel>
                    <MToggle class="toggle-status settings-toggle" :toggleCheckBox="posterToggle" @changetoggle="actLabel3" style="position: absolute;left: 33%;"/>
              </div>
                <div style="display: flex; align-items: center;position: relative ">
                    <MToolTip title="TRAILER" value="1"></MToolTip>
                    <Mlabel isrequired class="label" style="margin-left: 10px">TRAILER</Mlabel>
                    <MToggle class="toggle-status settings-toggle" :toggleCheckBox="trailerToggle" @changetoggle="actLabel2" style="position: absolute;left: 33%;"/>
              </div>
               <div style="display: flex; align-items: center;position: relative ">
                    <MToolTip title="WATERMARK" value="1"></MToolTip>
                    <Mlabel isrequired class="label" style="margin-left: 10px">WATERMARK</Mlabel>
                    <MToggle class="toggle-status settings-toggle" :toggleCheckBox="watermarkToggle" @changetoggle="actLabel1" style="position: absolute;left: 33%;"/>
              </div>
              <item-list></item-list>
          </div>

        <MButton :plus="false"  primary @on-btn-click="actCreateInitTranscode(true)" class="transcode-button"> TRANSCODE
</MButton>
        <MButton :plus="false" secondary  @on-btn-click="closePopup(true)" class="transcode-button">CANCEL
</MButton>
      </div>
    </MModal>
  </div>
</template>
<script>
/* eslint-disable */
import {
  MModal,
  MButton,
  MTextbox,
  MChip,
  MDropdown,
  MToolTip,
  Mlabel,
  MToggle
} from "mobiotics-dynamic-components-vue";
import "mobiotics-dynamic-components-vue/dist/mobiotics_dynamic_components_vue.css";
import Vue from "vue";
import { EventBus } from "@/event";
import { mapGetters, mapActions, mapMutations } from "vuex";

export default {
  name: "retranscode-popup",
  data() {
    return {
      mTextboxProperty: {},
      content: "",
      errorMessage: false,
      property: "helloe",
      status: "status222",
      active: "inactive",
      reportList: [],
      watermarkToggle: false,
      trailerToggle: false,
      posterToggle: false,
      size: 0,
      transprofileid: ''
    };
  },
   computed: {
    ...mapGetters(['getListAllJobTranscode', 'getListFilteredJobTranscode', 'getIsTrancodeEnable', 'getTranscodeProcessName', 'getAllProfileList'])
  },
  components: {
    MModal,
    MTextbox,
    MButton,
    MChip,
    MDropdown,
    MToolTip,
    Mlabel,
    MToggle,
    'cart-single': () => import('./SingleItem.vue'),
    'item-list': () => import('./TranscodeItemListPopupInside.vue')
  },
  methods: {
    ...mapActions(['actInititedTranscode', 'listProfileList']),
    ...mapMutations(['setListFilteredJobTranscode']),
    actLabel1 () {
      this.watermarkToggle = !this.watermarkToggle;
    },
     actLabel2 () {
      this.trailerToggle = !this.trailerToggle;
    },
     actLabel3 () {
      this.posterToggle = !this.posterToggle;
    },
    dropdownSelection (data) {
      console.log(data)
      this.transprofileid = data.name

    },
    closePopup() {
      this.$emit("closePopup-transcode", false);
    },
    makeFormData (payload) {
      let newFormData = new FormData();
      for (let i in payload) {
          newFormData.append(i, JSON.stringify(payload[i]))
      }
      return newFormData;
    },
    actCreateInitTranscode () {
      let payload = {};
      let audioVideoArray = []
      payload.contentid = this.getTranscodeProcessName;
      payload.transcodedata = [];
      payload.watermark =  this.watermarkToggle ?'YES':'NO'
      payload.poster =  this.posterToggle ?'YES':'NO'
      payload.trailer =  this.trailerToggle ?'YES':'NO'
      payload.transprofileid = this.transprofileid

       this.getListFilteredJobTranscode.forEach((item) => {
         let obj = {}
         if (item.filetype == 'VIDEO') {
           obj.video = item.originalfilename;
         } else if (item.filetype == 'AUDIO') {
            obj.audio = item.originalfilename;
         }
        audioVideoArray.push(obj)
       })

       payload.transcodedata = audioVideoArray;

       let formpayloadData = this.makeFormData (payload)

      this.actInititedTranscode(formpayloadData).then((success) => {
        this.setListFilteredJobTranscode([])
         this.$emit("closePopup-transcode", false);
      }, (error) => {
         this.setListFilteredJobTranscode([])
         this.$emit("closePopup-transcode", false);
          console.log("error", error)
      })
     
    }
  },
  mounted() {
    this.size = 0;
     this.getListFilteredJobTranscode.forEach((item) => {
         this.size  += parseFloat(item.size) 
         console.log(parseInt(item.size) )
     })
     console.log("size", this.size)
  }
};
</script>
<style scoped lang="scss">
    .popup-transcode {
       .transcode-button {
            position: relative;
            width: 105% !important;
            height: 40px !important;
            left: 0px;
            margin: 16px 0px;
        }
        >>>.m-dropdown .md__input input {
            width: 24.5vw !important;
            margin: 10px 0px;
        }
        >>>.m-modal {
            width: 33%;
            height: auto !important;
            max-height: none !important;
        }
        .popup-content-body {
            margin: 14px 70px;
            
        }
        .header-text {
            font-family: 'Helvetica Neue Bold';
            font-size: 20px;
            text-transform: uppercase;
        }
        >>>.md__list {
          width: 24.5vw;
        }
        >>> .tooltip-div .tooltip .tooltiptext {
          font-size: 10px !important;
        }
    }
</style>