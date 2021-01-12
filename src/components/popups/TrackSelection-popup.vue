<template>
  <div>
    <MModal @close="closePopup">
      <div slot="header">
        <p class="popup-external">{{contentName()}}</p>
      </div>
      <div slot="body">
        <div class="popup-body">
          <div class="popup-dropdown">
            <div class="label-name">
              FILE TYPE
              <span class="start-color">*</span>
              <span class="info-image">
                <img src="@/assets/images/info.svg" title="Please select filetype here" />
              </span>
            </div>
            <MDropdown
              :itemList="fileList"
              @on-item-selected="fileSelected = $event"
              @on-item-reset="fileSelected = $event"
              :selected="select"
              style="width:276px"
            ></MDropdown>
            <br />
            <!-- <div class="label-name">
              CONTENT TYPE
              <span class="start-color">*</span>
              <span class="info-image">
                <img src="@/assets/images/info.svg" title="please Enter Content ID here" />
              </span>
            </div>
            <MDropdown
              :itemList="listArr"
              @on-item-selected="selection = $event"
              @on-item-reset="selection = $event"
            ></MDropdown>
            <br />-->
          </div>
          <div v-if="isAudio" class="track-body">
            <div v-for="(track,index) in trackList" :key="index">
              <div class="label-name list1">
                TRACK
                <!-- <span class="start-color">*</span> -->
                <span class="info-image">
                  <img src="@/assets/images/info.svg" title="Track ID" />
                </span>
              </div>
              <div class="label-name list2">
                LANGUAGE
                <!-- <span class="start-color">*</span> -->
                <span class="info-image">
                  <img src="@/assets/images/info.svg" title="Please select language" />
                </span>
              </div>
              <div class="track-list">
                <div class="list1">#{{index +1}}</div>
                <div class="list2">
                  <MDropdown
                    style="width:185px"
                    :itemList="language"
                    @on-item-selected="selectTrack($event,index)"
                    @on-item-reset="selectTrack($event,index)"
                    :selected="defaultLang"
                  ></MDropdown>
                </div>
              </div>
            </div>
          </div>
          <MButton v-if="isSubtitle" class="add-track" primary @on-btn-click="doPress">ADD TRACK</MButton>
          <div class="submit-btn">
            <MButton
              primary
              :plus="false"
              class="create-btn1"
              @on-btn-click="submit"
              type="submit"
            >{{buttontext}}</MButton>
            <MButton
              v-if="!(buttontext === 'SUBMIT')"
              class="cancel-btn"
              @on-btn-click="submit"
            >SKIP</MButton>
          </div>
        </div>
      </div>
    </MModal>
  </div>
</template>
<script>
/* eslint-disable */
import { MModal, MButton, MDropdown } from "mobiotics-dynamic-components-vue";
import "mobiotics-dynamic-components-vue/dist/mobiotics_dynamic_components_vue.css";
import Vue from "vue";
import { EventBus } from "@/event";
import { mapActions, mapGetters } from "vuex";
import lang from "@/assets/JSFiles/Languages";
export default {
  name: "retranscode-popup",
  data() {
    return {
      fileList: {},
      content: "",
      errorMessage: false,
      checkedValue: [],
      trackList: [],
      clickCount: 0,
      buttontext: "SUBMIT",
      fileSelected: "",
      count: 0,
      select: 1,
      language: "",
      audioFormat: ["MP3", "AAC", "OGG", "WAV", "webm"],
      audioType: ["AUDIO", "CONTENT"],
      isAudio: true,
      isSubtitle: true,
      file: "",
      defaultLang: "eng",
      reportFiles: ["AUDIO", "SUBTITLE", "CONTENT"]
    };
  },
  components: {
    MModal,
    MDropdown,
    MButton
  },
  watch: {
    fileSelected(value) {
      console.log("fileselected||", value);
      this.content[this.clickCount].filetype = value.name ? value.name : value;
      this.checkForAudioSubtitle();
      this.trackList.splice(1, this.trackList.length);
    }
  },
  created() {
    this.fileList = [
      { name: "CONTENT", id: 1 },
      { name: "AUDIO", id: 2 },
      { name: "TRAILER", id: 3 },
      { name: "SUBTITLE", id: 4 },
      { name: "POSTER", id: 5 }
    ];
    let arr = [];
    this.language = lang.map((ele, index) => {
      arr = {
        name: ele.English,
        id: ele["alpha3-b"]
      };
      return arr;
    });
    this.content = this.getImportFiles.length ? this.getImportFiles : "";
    this.doPress();
  },
  computed: {
    ...mapGetters(["getImportFiles"])
  },
  mounted() {},
  methods: {
    ...mapActions(["preprocessFiles"]),
    closePopup() {
      EventBus.$emit("closeTrackPopup", false);
    },
    // checkForAudio() {
    //   this.isAudio = this.audioFormat.includes(this.file);
    // },
    checkForAudioSubtitle() {
      this.isAudio = this.reportFiles.includes(
        this.content[this.clickCount].filetype
      );
      this.isSubtitle = this.audioType.includes(
        this.content[this.clickCount].filetype
      );
    },
    doPress() {
      console.log("importData||", this.content);
      this.trackList.push(1);
      let length = this.trackList.length;
      this.trackList[length - 1] = {
        track: length,
        language: this.defaultLang
      };
      console.log("Nexttrack||", ...this.trackList);
    },
    contentName(index = this.clickCount) {
      if (this.content) {
        // this.file =
        //   this.content[this.clickCount].fileName.split(".")[1] &&
        //   this.content[this.clickCount].fileName.split(".")[1].toUpperCase();
        // this.checkForAudio();
        // this.checkForSubtitle();
        if (this.content.length > 1) {
          this.buttontext = index + 1 < this.content.length ? "NEXT" : "SUBMIT";
          return (
            this.content[index].fileName +
            " " +
            "(" +
            (index + 1) +
            "/" +
            this.content.length +
            ")"
          );
        } else {
          this.buttontext = "SUBMIT";
          return this.content[index].fileName;
        }
      }
    },
    getReport(id) {
      if (this.reportFiles.includes(this.content[id].filetype)) {
        let report = {};
        if (this.audioType.includes(this.content[id].filetype)) {
          report.AUDIO = [...this.trackList];
        } else if (this.content[id].filetype === "SUBTITLE") {
          report.SUBTITLE = [{ language: this.trackList[0].language }];
        }
        return report;
      } else {
        return "";
      }
    },
    getData(index = 0) {
      if (this.count < this.content.length) {
        let data = [
          {
            filetype: this.content[index].filetype
              ? this.content[index].filetype
              : "",
            filelink: this.content[index].URL ? this.content[index].URL : "",
            drivetype: this.content[index].drivetype
              ? this.content[index].drivetype
              : "",
            authtoken: this.content.authtoken ? this.content.authtoken : "",
            filename: this.content[index].fileName
              ? this.content[index].fileName
              : "",
            report: this.getReport(index)
          }
        ];
        let formData = new FormData();
        formData.append("preprocessdata", JSON.stringify(data));
        console.log("data", data);
        this.preprocessAPI(formData);
      } else {
        EventBus.$emit("reloadPreProcess");
        this.closePopup();
      }
    },
    preprocessAPI(data) {
      console.log("sendData>>", data);

      this.count++;
      this.preprocessFiles(data)
        .then(
          res => {
            console.log(res, "actDeleteServices");
            this.getData(this.count);
          },
          err => {
            this.getData(this.count);
          }
        )
        .catch(err => {
          this.getData(this.count);
        });
    },
    selectTrack(value, index) {
      this.trackList[index] = {
        track: index + 1,
        language: value.id
      };
      console.log("track||", this.trackList[index].language);
    },
    submit() {
      if (this.buttontext.includes("SUBMIT")) {
        this.getData();
      } else {
        this.trackList = [];
        this.trackList.push(1);
        this.fileSelected = this.content[this.clickCount].filetype;
        this.clickCount++;
        this.contentName(this.clickCount);
      }
    }
  }
};
</script>
<style scoped lang="scss">
/deep/.popup-dropdown > .m-dropdown .md__input input {
  width: 280px !important;
}
// /deep/ .m-dropdown{
//   width:276px!important;
// }
>>> .md__list {
  height: 88px;
}
.popup-external {
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0.4px;
  height: 40px;
  color: #1f2631;
}
.popup-body {
  padding: 15px 35px 15px 35px;
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
  border: 1px solid #818181;
  color: #818181 !important;
  width: 100% !important;
  height: 5%;
  margin-top: 4%;
}

/deep/ .m-modal {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  flex-direction: column;
  width: 350px;
  min-height: 50%;
  height: auto;
  max-height: 100vh;
  border-radius: 2px;
  margin-top: 1%;
  overflow: hidden !important;
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
/deep/ .md-header {
  padding: 0px 10px !important;
  margin-top: 5%;
}
/deep/ .popup-external {
  text-align: center !important;
}
/deep/ .m-textbox {
  width: 100% !important;
  margin-bottom: 20px !important;
}

.file-name {
  line-height: 35px;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 0;
  color: #303b4b;
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
.list1 {
  width: 30%;
  display: inline-block;
}
.list2 {
  display: inline;
}
.track-list {
  padding: 2% 0% 5% 0%;
  display: flex;
}
.add-track {
  height: 15px;
  width: 148% !important;
  background: #fff !important;
  color: #0978fc !important;
  font-family: "Helvetica Neue";
  border: none !important;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0;
  line-height: 15px;
}
.track-body {
  padding: 5px;
  overflow-y: auto;
  max-height: 140px;
  height: 140px;
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
.submit-btn {
  // position: absolute;
  // width: 22%;
  // bottom: 20%;
}
</style>