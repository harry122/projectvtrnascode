<template>
  <div class="popup-transcode">
    <MModal @close="closePopup">
      <div slot="header">
        <p class="header-text">Update Content</p>
      </div>
      <div slot="body" class="popup-content-body">
        <div>
              <Mlabel isrequired class="label">FILE NAME</Mlabel>
              <MToolTip title="FILE NAME" value="3"></MToolTip>
              <MTextbox :textboxInput="contentTitle"  @on-change-value="actGetTranscodeValue" :mInputProperty="mTextboxProperty"  type="text"  />
        </div>
        <div style="margin-top: 20px">
              <Mlabel isrequired class="label">BURN SUBTITLES</Mlabel>
              <MToolTip title="BURN SUBTITLES" value="3"></MToolTip>
              <MDropdown :selected="1" :itemList="reportList" :mSelectProperty="mDropdownProperty" @on-item-selected="dropdownSelection=$event" @on-item-reset="dropdownSelection=$event"/>
        </div>

          <language-track></language-track>

        <MButton :plus="false"  primary @on-btn-click="actUpdatedTranscode(true)" class="transcode-button">UPDATE</MButton>
        <MButton :plus="false" secondary  @on-btn-click="closePopup(true)" class="transcode-button">CANCEL</MButton>
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

import Vue from "vue";
import { EventBus } from "@/event";
import { mapActions } from "vuex";

export default {
  name: "retranscode-popup",
  data() {
    return {
      mTextboxProperty: {},
      contentTitle: "",
      errorMessage: false,
      property: "helloe",
      status: "status222",
      active: "inactive",
      reportList: []
    };
  },
  props: ['editTranscodePayload'],
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
    'language-track': () => import('./LanguageTrackSetup.vue'),
  },
  created() {
    this.reportList = [
      { name: 'ABCD.SRT', id: 1 },
      { name: 'TEST.SRT', id: 2 },
    ]

    console.log("payload", this.editTranscodePayload)
    this.contentTitle = this.editTranscodePayload.filename;
     this.mTextboxProperty = {
      defaultProperty: {
        width: "104%"
      }
    };
  },
  methods: {
    ...mapActions(['actUpdateTranscodeData']),
    actUpdatedTranscode () {
      let dataset = {};
      dataset.id = this.editTranscodePayload.preprocessid
      dataset.payload = {}
      dataset.payload = {"action":"UPDATE","report": {"AUDIO": []}};

      this.actUpdateTranscodeData(dataset).then(() => {
         this.$emit("closePopup-transcode-editpopup", false);
      }, (error) => {
         this.$emit("closePopup-transcode-editpopup", false);
      })
      console.log("transcodeItemedit")
    },
    closePopup() {
      this.$emit("closePopup-transcode-editpopup", false);
    },
  }
};
</script>
<style scoped lang="scss">
    .popup-transcode {
       .transcode-button {
            position: relative;
            width: 102% !important;
            height: 40px !important;
            left: 5px;
            margin: 12px 0px;
        }
        >>>.m-dropdown .md__input input {
            width: 348px !important;
            margin: 10px 0px;
        }
        >>>.m-modal {
            width: 33%;
            margin-top: -90px;
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
            width: 348px;
        }
        >>> .tooltip-div .tooltip .tooltiptext {
          font-size: 10px !important;
        }
    }
</style>