<template>
  <div>
    <MModal @close="closePopup">
      <div slot="header">
        <p class="popup-external">RETRANSCODE</p>
      </div>
      <div slot="body">
        <div class="label-name">
          CONTENT ID
          <!-- <span class="start-color">*</span> -->
          <span class="info-image">
            <img src="@/assets/images/info.svg" title="Please Enter Content ID Here" />
          </span>
        </div>
        <MTextbox
          required
          :textboxInput="content"
          @on-change-value="content=$event"
          :mInputProperty="mTextboxProperty"
          type="text"
          class="input-area"
          readonly
        />
        <br />
        <div class="chip-body">
          <div v-for="(list,index) in  trancodeData.jobData" :key="index">
            <div class="chip">
              <div class="detail">
                <p class="file-name">
                  {{list.filename}}
                  <span class="tooltiptext">{{ list.filename}}</span>
                </p>
                <p
                  class="file-format"
                >{{list.filetype}},{{list.quality}}, {{getFileSize(list.size)}}</p>
              </div>
              <div class="chkbx">
                <label class="container">
                  <input
                    type="checkbox"
                    :id="list.transcodingid"
                    :value="list.transcodingid"
                    v-model="checkedValue"
                    :title="list.transcodingid"
                  />
                  <span class="checkmark"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <MButton
          primary
          :plus="false"
          class="create-btn1"
          @on-btn-click="submit"
          type="submit"
        >RETRANSCODE</MButton>
        <MButton class="cancel-btn" @on-btn-click="closePopup">CANCEL</MButton>
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
  MToolTip
} from "mobiotics-dynamic-components-vue";
import "mobiotics-dynamic-components-vue/dist/mobiotics_dynamic_components_vue.css";
import Vue from "vue";
import { EventBus } from "@/event";
import { mapActions } from "vuex";
import { VTooltip, VPopover, VClosePopover } from "v-tooltip";
import { mVMixin } from "@/mixins.js";

// import 'vue-select/src/scss/vue-select.scss'
export default {
  name: "retranscode-popup",
  props: ["trancodeData"],
  data() {
    return {
      mTextboxProperty: {},
      content: "",
      checkedValue: []
    };
  },
  components: {
    MModal,
    MTextbox,
    MButton,
    MChip,
    MToolTip
  },
  watch: {
    checkedValue(value) {
      console.log("checked value||", value);
    }
  },
  created() {
    this.mTextboxProperty = {
      defaultProperty: {
        width: "82%"
      }
    };
  },
  mixins: [mVMixin],
  mounted() {
    this.content = this.trancodeData.contentId;
    this.defaultSelectAll();
  },
  methods: {
    ...mapActions(["reInitiateTranscoding"]),

    closePopup() {
      EventBus.$emit("closePopup", false);
    },

    getFileSize(size) {
      size = (parseInt(size) / (1024 * 1024)).toFixed(2);
      size = size + " " + "MB";
      return size;
    },

    defaultSelectAll() {
      this.checkedValue = this.trancodeData.jobData.map(item => {
        return item.transcodingid;
      });
      console.log("default||", this.checkedValue);
    },

    submit() {
      let data = {
        jobId: this.trancodeData.jobId,
        content: {
          contentid: this.trancodeData.contentId,
          transcodinglist: this.checkedValue
        }
      };
      this.reInitiateTranscoding(data).then(res => {
        console.log(res);
      });
      this.closePopup();
    }
  }
};
</script>
<style scoped lang="scss">
// @import '@/sass/main.scss';
// /deep/ .m-textboxarea {
//   margin-left: 11%;
// }
.input-area {
  color: #1f2631 !important;
  font-family: "Helvetica Neue";
  letter-spacing: 0.3px !important;
}
.popup-external {
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 0.4px;
  height: 50px;
  color: #1f2631;
}
.label-name {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0;
  line-height: 13px;
  opacity: 0.8;
  color: #7f8797;
  margin-bottom: 2%;
}
.info-image img {
  height: 10px;
  width: 10px;
  margin-left: 1%;
}
.create-btn1 {
  width: 100% !important;
  margin-top: 6%;
  height: 5%;
}
.cancel-btn {
  position: relative;
  box-sizing: border-box;
  background-color: white !important;
  border: 1px solid #818181 !important;
  color: #818181 !important;
  width: 100% !important;
  height: 5%;
  margin-top: 4%;
}
.chip {
  display: inline-block;
  padding: 0 25px;
  height: 50px;
  font-size: 16px;
  line-height: 50px;
  border-radius: 5px;
  background-color: #fdfdfd;
  box-shadow: 0 3px 7px 0 rgba(0, 0, 0, 0.16);
  margin-bottom: 10px;
  width: 100%;
}

/deep/ .m-modal {
  padding: 15px 35px 15px 35px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  flex-direction: column;
  width: 420px;
  height: 75%;
  max-height: none;
  border-radius: 2px;
  overflow: hidden !important;
  margin-top: 1%;
  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(235, 235, 235, 0.3);
    border-radius: 2.5px;
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background: #ebebeb;
    border-radius: 2.5px;
    width: 5px;
  }
}
/deep/ .m-textboxarea {
  font-family: inherit !important;
  font-size: 14px;
  color: #1f2631 !important;
}
/deep/ .md-header {
  display: inline !important;
  padding: 0px !important;
}
/deep/ .popup-external {
  text-align: left !important;
}
/deep/ .m-textbox {
  width: 100% !important;
  margin-bottom: 20px !important;
}
input[type="checkbox"] {
  border-radius: 2px;
  background-color: #1573e1;
}

.tooltiptext {
  visibility: hidden;
  background-color: #ffff;
  color: black;
  font-family: "Helvetica Neue";
  text-align: center;
  border-radius: 6px;
  padding: 0px 10px;
  position: absolute;
  border: 1px solid silver !important;
  line-height: 50px;
  z-index: 1;
  left: 31.5%;
  font-weight: 400;
  margin-top: 55px;
  opacity: 0;
  border: 1px;
  transition: opacity 0.5s;
  box-shadow: 0 3px 7px 0 rgba(0, 0, 0, 0.16);
}
.tooltiptext::after {
  content: "";
  position: absolute;
  bottom: 100%;
  left: 50%;
  border-width: 5px;
  border-style: solid;
  border-color: transparent transparent white transparent;
}
.file-name:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
}
.container {
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 22px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 15px;
  width: 15px;
  background-color: #1573e1;
  border-radius: 2px;
}
.container input:checked ~ .checkmark {
  background-color: #1573e1;
}
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}
.container input:checked ~ .checkmark:after {
  display: block;
}
.container .checkmark:after {
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}
.file-name {
  line-height: 35px;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 0;
  color: #303b4b;
  width: 250px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.file-format {
  font-size: 10px;
  letter-spacing: 0;
  line-height: 4px;
  opacity: 0.6;
  color: #303b4b;
}
.detail {
  display: inline-block;
  width: 95%;
}
.chkbx {
  width: 0%;
  height: 25px;
  display: inline-block;
}
.chip-body {
  padding: 5px;
  overflow-y: auto;
  max-height: 180px;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(235, 235, 235, 0.3);
    border-radius: 2.5px;
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background: #ebebeb;
    border-radius: 2.5px;
    width: 5px;
  }
}
</style>