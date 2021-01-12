<template>
  <div class="transcode-input-body">
    <div class="import-button">
      <MButton
        secondary
        :plus="false"
        type="submit"
        class="create-btn1"
        id="import-btn1"
        @on-btn-click="importFile"
      >IMPORT FILES</MButton>
      <MButton
        primary
        :plus="false"
        class="create-btn1"
        @on-btn-click="submit"
        type="submit"
      >BULK PREPROCESS</MButton>
    </div>
    <MTabMenu :tabNames="tabNames" @tabNameCB="getTabComponent" :tabStyle="tabStyles">
      <component :is="preProcessComponent"></component>
    </MTabMenu>
    <div>
      <Bulk-Process v-if="showBulkProcess"></Bulk-Process>
      <Track-Preprocess v-if="showTrack"></Track-Preprocess>
      <File-Import v-if="showImport"></File-Import>
    </div>
  </div>
</template>

<script>
import { MTabMenu, MButton } from "mobiotics-dynamic-components-vue";
import { EventBus } from "@/event.js";
import { mapActions, mapGetters } from "vuex";
import { mVMixin } from "@/mixins.js";
import VIDEO from "./ProcessContentTable.vue";
import AUDIO from "./AudioContentTable.vue";
import SUBTITLE from "./SubtitleContentTable.vue";
import POSTER from "./PosterContentTable.vue";
export default {
  data() {
    return {
      tabNames: [],
      tabStyles: {},
      showImport: false,
      showBulkProcess: false,
      showTrack: false,
      preProcessComponent: VIDEO
    };
  },
  components: {
    MTabMenu,
    MButton,
    "Bulk-Process": () =>
      import("@/components/popups/Preprocess-BulkUpload.vue"),
    "Track-Preprocess": () =>
      import("@/components/popups/TrackSelection-popup.vue"),
    "File-Import": () => import("@/components/popups/FileImport.vue"),
    "content-table": () => import("./ProcessContentTable.vue")
  },
  methods: {
    ...mapActions(["listPreProcessJobs"]),
    closeSpecPopup() {
      console.log("ok");
    },
    importFile() {
      this.showImport = true;
    },
    submit() {
      this.showBulkProcess = true;
    },
    getTabComponent(val) {
      if (val.includes("VIDEO")) {
        this.preProcessComponent = VIDEO;
      } else if (val.includes("AUDIO")) {
        this.preProcessComponent = AUDIO;
      } else if (val.includes("SUBTITLE")) {
        this.preProcessComponent = SUBTITLE;
      } else if (val.includes("POSTER")) {
        this.preProcessComponent = POSTER;
      }
    },
    enableTrack() {
      if (this.getImportFiles.length) {
        this.showTrack = true;
      }
    },
    preProcessInit() {
      this.tabNames = ["VIDEO", "AUDIO", "SUBTITLE", "POSTER"];
      let promiseList = [];
      for (let i of this.tabNames) {
        let data = {
          filetype: i,
          contenttype: "",
          preprocessstatus: "",
          deficient: "",
          jobid: "",
          originalfilename: "",
          fromdate: "",
          todate: "",
          quality: "",
          mimetype: "",
          preprocessid: "",
          page: "",
          pagesize: 1
        };
        promiseList.push(this.listPreProcessJobs(data));
      }

      Promise.all(promiseList).then(data => {
        console.log("data ===>", data);
        this.tabNames = this.tabNames.map((item, index) => {
          return item + " | " + data[index].totalcount;
        });
      });
    },
    reloadData() {
      this.preProcessInit();
    }
  },
  watch: {
    getImportFiles() {
      this.enableTrack();
    }
  },
  computed: {
    ...mapGetters(["getImportFiles"])
  },
  created() {
    EventBus.$on("closePopup", val => {
      this.showImport = val;
      this.showBulkProcess = val;
    });
    EventBus.$on("closeTrackPopup", value => {
      this.showTrack = value;
    });
    EventBus.$on("reloadPreProcess", this.reloadData);
    this.tabStyles = {
      height: "100%",
      minHeight: "100vh"
    };
  },
  mounted() {
    this.preProcessInit();
  },
  mixins: [mVMixin]
};
</script>

<style lang="scss" scoped>
.transcode-input-body {
  margin-top: 50px;
  position: relative;
}
#import-btn1 {
  background-color: transparent !important;
}
.create-btn1 {
  height: 5%;
  margin-left: 1%;
  display: inline-block;
  height: 35px !important;
}
.import-button {
  height: 0px;
  text-align: end;
  padding-right: 1%;
}
/deep/ .m-tab-init .m-tab-header div {
  height: 36px;
  padding: 10px 29px;
  font-family: "Helvetica Neue Medium";
}
/deep/ .m-tab-init .m-tab-header .active {
  height: 39px;
}
</style>
