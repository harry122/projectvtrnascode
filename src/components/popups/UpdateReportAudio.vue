<template>
  <MModal :styles="updateReportModalStyles" @close="closeUpdateReportModal">
    <div slot="header">
      <p class="modal-title">UPDATE REPORT</p>
    </div>
    <div slot="body" class="modal-body-slot">
      <div class="input-title">
        <Mlabel :style="labelClass">FILE NAME</Mlabel>
        <MToolTip title="FILE NAME" value="3"></MToolTip>
        <MTextbox type="text" :mInputProperty="fileProperty" :textboxInput="originalnameoffile" readonly></MTextbox>
      </div>
      <div class="language-track-form" v-for="(audio, index) in rowReport" :key="index">
        <div class="track-number">
          <Mlabel :style="labelClass">TRACK</Mlabel>
          <MToolTip title="TRACK ID" value="3"></MToolTip>
          <p>#{{index+1}}</p>
        </div>
        <div class="track-language">
          <Mlabel :style="labelClass" isrequired>LANGUAGE</Mlabel>
          <MToolTip title="LANGUAGE" value="3"></MToolTip>
          <MDropdown
            :itemList="itemList"
            :mSelectProperty="mSelectProperty"
            :selected="audioType(audio.language)"
            @on-item-reset="selectTrack($event,index)"
            @on-item-selected="selectTrack($event,index)"
          />
        </div>
      </div>
      <div class="submit-buttons">
        <MButton
          primary
          :plus="false"
          @on-btn-click="updateReportModal"
          :mButtonProperty="mButtonProperty"
        >UPDATE</MButton>
        <MButton
          secondary
          @on-btn-click="closeUpdateReportModal"
          :mButtonProperty="mButtonProperty"
        >CANCEL</MButton>
      </div>
    </div>
  </MModal>
</template>

<script>
import {
  MModal,
  Mlabel,
  MTextbox,
  MDropdown,
  MButton,
  MToolTip
} from "mobiotics-dynamic-components-vue";
import { mapActions } from "vuex";
import languages from "@/assets/JSFiles/Languages.json";
import { EventBus } from "@/event";
export default {
  name: "UpdateReportAudio",
  props: ["row"],
  data() {
    return {
      originalnameoffile: "",
      rowReport: [],
      trackList: [],
      fileProperty: {
        defaultProperty: {
          height: "33px",
          width: "360px",
          borderRadius: "2px",
          backgroundColor: "rgba(233,236,239,0.5)",
          outline: "none !important",
          color: "#1F2631",
          fontfamily: "Helvetica Neue",
          fontsize: "12px",
          letterspacing: "0.3px",
          display: "block"
        }
      },
      updateReportModalStyles: {
        height: "60%",
        width: "35%",
        borderRadius: "2px",
        backgroundColor: "#FFFFFF",
        boxShadow: "0 12px 61px 0 rgba(0,0,0,0.2)"
      },
      labelClass: {
        fontSize: "11px",
        color: "#7F8797",
        opacity: "0.8",
        lineHeight: "20px"
      },
      itemList: [],
      mSelectProperty: {
        defaultProperty: {
          height: "33px",
          width: "271px"
        }
      },
      mButtonProperty: {
        defaultProperty: {
          height: "38px",
          width: "359.36px",
          borderRadius: "2px",
          marginTop: "10px"
        }
      }
    };
  },
  components: {
    MModal,
    Mlabel,
    MTextbox,
    MDropdown,
    MButton,
    MToolTip
  },
  methods: {
    ...mapActions(["updatePreProcessFiles"]),
    displayReProcessPopup(rowdata) {
      console.log(rowdata);
    },
    audioType(lang){
      if(lang === "und"){
        return ""
      }
      else{
        return lang
      }
    },
    listLangauges() {
      const listlanguages = languages.map(lang => {
        return { id: lang["alpha3-b"], name: lang["English"] };
      });
      console.log(listlanguages);
      this.itemList = [...listlanguages];
    },
    selectTrack(value, index) {
      this.trackList[index] = {
        track: index + 1,
        language: value.id
      };
      console.log("track||", this.trackList[index].language);
    },
    displayUpdateReport(row) {
      this.originalnameoffile = row.filename ? row.filename : "";
      if (row.report && JSON.parse(row.report)[row.filetype]) {
        this.rowReport = [JSON.parse(row.report)[row.filetype]];
      }
      console.log("report>>", this.rowReport);
    },
    updateReportModal() {
      let data = {
        preprocessid: this.row.preprocessid,
        formdata: {
          action: "UPDATE",
          report: this.getReport()
        }
      };
      this.updatePreProcessFiles(data).then(res => {
        console.log("updated", res);
        EventBus.$emit("reloadPreProcess");
        this.closeUpdateReportModal();
      });
    },
    getReport() {
      if (this.row.report && JSON.parse(this.row.report)[this.row.filetype]) {
        let report = {};
        if (this.row.filetype === "AUDIO") {
          report.AUDIO = [...this.trackList];
        } else if (this.row.filetype === "SUBTITLE") {
          report.SUBTITLE = { language: this.trackList[0].language };
        }
        return report;
      } else {
        return "";
      }
    },
    closeUpdateReportModal() {
      EventBus.$emit("closePopup", false);
    }
  },
  created() {
    this.displayUpdateReport(this.row);
    this.listLangauges();
  }
};
</script>

<style lang="scss" scoped>
.modal-body-slot {
  margin: 0 auto;
}
.input-title {
  margin-top: 40px;
}
.modal-title {
  color: #1f2631;
  font-family: "Helvetica Neue Bold";
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 0.4px;
  line-height: 25px;
  text-align: center;
}
.language-track-form {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}
.submit-buttons {
  display: flex;
  margin-top: 50px;
  flex-direction: column;
}
</style>