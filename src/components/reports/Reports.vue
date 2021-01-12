<template>
  <div class="reports-wrapper">
    <div class="head-wrapper">
      <div class="drop-wrap">
        <MDropdown
          :selected="1"
          :itemList="reportList"
          :mSelectProperty="mDropdownProperty"
          @on-item-selected="dropdownSelection=$event"
          @on-item-reset="dropdownSelection=$event"
        />
        <MDropdown
          v-if="showDropDown"
          :selected="1"
          :itemList="reportList1"
          :mSelectProperty="mDropdownPropertySecond"
          @on-item-selected="secondDropdownSelection=$event"
          @on-item-reset="secondDropdownSelection=$event"
        />
      </div>
      <div v-if="checkReportType()" class="radioBtn-grp">
        <div v-for="(btn,index) in btnList" :key="index">
          <label class="container">
            <input type="radio" v-model="selectedInterval" :value="btn.value" />
            <span class="checkmark"></span>
          </label>
          <p :style="labelClass">{{btn.name}}</p>
        </div>
      </div>
      <MButton :plus="false" primary @on-btn-click="clickedDownload()">DOWNLOAD REPORT</MButton>

      <MDateRangeFilterPopup
        id="download-report"
        class="report-popup"
        :showDate="showReportFilter"
        labelName="DOWNLOAD"
        @changeDate="setDate"
        @cancelDate="closePopup($event)"
      ></MDateRangeFilterPopup>

      <!-- <MDateRangeFilterPopup
        class="report-popup"
        :showDate="getDateRange"
        :labelName="'REPORT DOWNLOAD'"
        @changeDate="tempChangeValue($event)"
        @changeFilter="commitTempFilter($event)"
        @cancelDate="closeSpecPopup($event)"
        :rangeDate="{'to': rangeDate.toDate, 'from': rangeDate.fromDate}"
      />-->
    </div>
    <div class="body-wrapper">
      <component :is="reportComponent"></component>
    </div>
    <Job-Report v-if="dropdownSelection.id === 1"></Job-Report>
    <Transcode-Report v-if="dropdownSelection.id === 2"></Transcode-Report>
    <Preprocess-Report v-if="dropdownSelection.id === 3"></Preprocess-Report>
    <Profile-Report v-if="dropdownSelection.id === 4"></Profile-Report>
    <Encoding-Report v-if="dropdownSelection.id === 5"></Encoding-Report>
    <Usage-Report v-if="dropdownSelection.id === 6"></Usage-Report>
    <Unprocess-Report v-if="dropdownSelection.id === 7"></Unprocess-Report>
  </div>
</template>

<script>
import {
  MDropdown,
  MLabel,
  MRadio,
  MButton,
  MDateRangeFilterPopup
} from "mobiotics-dynamic-components-vue";
import { mapActions, mapMutations } from "vuex";
import moment from "moment";

export default {
  name: "Reports",
  data() {
    return {
      showInterval: ["usage", "unprocess"],
      selectedInterval: "",
      showReportFilter: false,
      reportList: [],
      reportList1: [],
      btnList: [],
      today: "",
      lastmonth: "",
      lastweek: "",
      all: "",
      showDropDown: "",
      secondDropdownSelection: {},
      mDropdownProperty: {},
      mDropdownPropertySecond: {},
      dropdownSelection: {},
      isDateRange: false,
      rangeDate: {},
      doFilter: false,
      reportComponent: "",
      reportComponent1: "",
      labelClass: {
        paddingRight: "20px",
        lineHeight: "0px",
        paddingLeft: "25px"
      }
    };
  },
  components: {
    MDropdown,
    MLabel,
    MButton,
    MRadio,
    MDateRangeFilterPopup,
    "Job-Report": () => import("@/components/reports/JobReport.vue"),
    "Transcode-Report": () =>
      import("@/components/reports/TranscodeReport.vue"),
    "Preprocess-Report": () =>
      import("@/components/reports/PreprocessReport.vue"),
    "Profile-Report": () => import("@/components/reports/ProfileReport.vue"),
    "Encoding-Report": () => import("@/components/reports/EncodingReport.vue"),
    "Usage-Report": () => import("@/components/reports/UsageReport.vue"),
    "Unprocess-Report": () => import("@/components/reports/UnprocessReport.vue")
  },
  computed: {
    getDateRange() {
      return this.isDateRange;
    }
  },
  watch: {
    dropdownSelection(value) {
      this.dropdownSelection = value;
    },
    selectedInterval(value) {
      this.setReportInterval(value);
    },
    secondDropdownSelection (data) {
      this.setReportInitiateBy(data.value)
    }
  },
  methods: {
    ...mapActions(["actReportDownload"]),
    ...mapMutations(["setReportInterval","setReportInitiateBy"]),

    closeSpecPopup(event) {
      this.isDateRange = event;
    },
    tempChangeValue(event) {
      this.rangeDate.fromDate = event.from;
      this.rangeDate.toDate = event.to;
    },
    commitTempFilter(event) {
      this.doFilter = event;
    },
    checkReportType() {
      if (this.dropdownSelection && this.dropdownSelection.reportId)
        if (this.showInterval.includes(this.dropdownSelection.reportId)) {
          return true;
        } else {
          return false;
        }
    },
    setDate(data) {
      console.log("data", data);
      this.showReportFilter = false;
      let fromDate = moment(data.from).format("YYYY-MM-DD");
      let toDate = moment(data.to).format("YYYY-MM-DD");
      let dates = {
        fromDate: fromDate,
        toDate: toDate
      };
      this.downloadReport(dates);
    },
    closePopup(event) {
      this.showReportFilter = event;
    },
    clickedDownload() {
      this.showReportFilter = !this.showReportFilter;
    },
    downloadReport(dates) {
      let payload = {
        id: this.dropdownSelection.reportId,
        dates
      };
      this.actReportDownload(payload).then(response => {
        let link = document.createElement("a");
        link.setAttribute(
          "href",
          "data:text/csv;charset=utf-8," + encodeURIComponent(response)
        );
        link.setAttribute("download", "Results.csv");
        link.click();
      });
    },
    showDropDwon() {
      if (this.dropdownSelection.id === 1 || this.dropdownSelection.id === 2) {
        this.showDropDown = true;
      } else {
        this.showDropDown = false;
      }
    }
  },
  created() {
    this.reportList = [
      { name: "JOB REPORT", id: 1, reportId: "job" },
      { name: "TRANSCODING REPORT", id: 2, reportId: "transcode" },
      { name: "PREPROCESS REPORT", id: 3, reportId: "preprocess" },
      { name: "PROFILE REPORT", id: 4, reportId: "transprofile" },
      { name: "ENCODING REPORT", id: 5, reportId: "encoding" },
      { name: "USAGE REPORT", id: 6, reportId: "usage" },
      { name: "UNPROCESSED REPORT", id: 7, reportId: "unprocess" }
    ];
    this.reportList1 = [
      { name: "MASTER", id: 1, value: "MASTER" }
    ];
    this.btnList = [
      { name: "Today", value: "TODAY" },
      { name: "Last Week", value: "WEEK" },
      { name: "Last Month", value: "MONTH" },
      { name: "All", value: "ALL" }
    ];
    this.selectedInterval = "ALL";
    this.mDropdownProperty = {
      defaultProperty: {
        width: "inherit"
        // fontSize: '14px'
      },
      listProperty: {
        position: "absolute",
        zIndex: "10"
      }
    };
    this.mDropdownPropertySecond = {
      defaultProperty: {
        width: "inherit"
        // fontSize: '14px'
      },
      listProperty: {
        position: "absolute",
        zIndex: "10"
      }
    };
    this.rangeDate = {
      toDate: "",
      fromDate: ""
    };
  },
  updated() {
    this.showDropDwon();
  }
};
</script>

<style scoped lang="scss">
.reports-wrapper {
  .head-wrapper {
    margin-top: 20px;
    display: flex;
    .drop-wrap {
      display: flex;
      flex: 1;
    }
  }
  /deep/.content-route {
    padding: 10px 25px !important;
  }
  /deep/ .m-dropdown {
    .md__input-box {
      min-width: 200px;
      .dropdown-selected,
      .md__search {
        width: 210px !important;
        // font: 1vw/1.1vw var(--font-bold);
        font-weight: bold;
        letter-spacing: 0.4px;
        color: var(--primary-grey);
        text-indent: 10px;
      }
    }
    .md__list {
      width: 209px !important;
      position: absolute;
      max-height: 350px !important;
      z-index: 1;
      font: 1vw/1.2vw var(--font-regular);
      letter-spacing: 0.4px;
      .md__list__item {
        text-indent: 10px;
      }
    }
  }
}
.drop-down-list {
  display: flex;
  flex: 1;
}
.radio- {
  display: flex;
  flex: 2;
  // padding-left: 12%;
  margin-left: 8%;
  margin-right: 9%;
  padding-top: 0.5%;
  justify-content: space-around;
}

.radioBtn-grp {
  display: inline-flex;
  width: 55%;
}
.container {
  display: block;
  position: relative;
  margin-top: 5px;
  margin-bottom: 12px;
  cursor: pointer;
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
  left: 0px;
  height: 15px;
  width: 15px;
  border: 2px solid #d0d3d7;
  border-radius: 50%;
}
.container input:checked ~ .checkmark {
  border: 2px solid #579fff;
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
  left: 2px;
  top: 2px;
  width: 7px;
  height: 7px;
  background-color: #579fff;
  border-radius: 50%;
}
</style>