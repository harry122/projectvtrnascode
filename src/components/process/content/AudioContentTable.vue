<template>
  <div class="process-wrapper">
    <MTableHeader
      class="table-stripped"
      :mTableProperty="mTableProperty"
      :headerArray="processHeader"
      :data="processVideoData"
      :offset="offset"
      @filters="processFilter($event)"
    />
    <MPagination
      class="tw__pagination"
      :totalPages="pageCount"
      :currentPage="currentPage"
      @pagechanged="onPageChange"
      v-if="processVideoData.length"
      :hidePrevious="true"
    />
    <UpdateReportAudio :row="rowDetails" v-if="showUpdateReport"></UpdateReportAudio>
    <ReprocessContent></ReprocessContent>
  </div>
</template>

<script>
import { MTableHeader, MPagination } from "mobiotics-dynamic-components-vue";
import UpdateReportAudio from "@/components/popups/UpdateReportAudio.vue";
import ReprocessContent from "@/components/popups/ReprocessContent.vue";
import { mapActions } from "vuex";
import { EventBus } from "@/event";
import { mVMixin } from "@/mixins.js";
export default {
  name: "ProcessContent",
  data() {
    return {
      processHeader: [],
      processVideoData: [],
      offset: 0,
      ticketFilter: [],
      currentPage: 1,
      mTableProperty: {},
      currentPage: 1,
      pageCount: 1,
      showUpdateReport: false,
      rowDetails: "",
      contenttype: "",
      preprocessstatus: "",
      deficient: "",
      jobid: "",
      originalfilename: "",
      fromdate: "",
      todate: "",
      page: "",
      pagesize: "",
      quality: "",
      mimetype: "",
      preprocessid: ""
    };
  },
  components: {
    MTableHeader,
    MPagination,
    UpdateReportAudio,
    ReprocessContent
  },
  mixins: [mVMixin],
  methods: {
    ...mapActions(["listPreProcessJobs"]),
    onPageChange(page) {
      if (page) {
        this.offset = (page - 1) * 10;
        this.listpreProcess(page);
      } else {
        let page = this.currentPage;
        this.listpreProcess(page);
      }
    },
    reloadData() {
      this.listpreProcess();
    },
    displayUpdateReport(row) {
      this.rowDetails = row;
      this.showUpdateReport = true;
    },
    processFilter(data) {
      console.log("data>>", data);
      this.contenttype = data.contenttype ? data.contenttype : "";
      this.preprocessstatus = data.preprocessstatus
        ? data.preprocessstatus
        : "";
      this.deficient = data.deficient ? data.deficient : "";
      this.jobid = data.jobid ? data.jobid : "";
      this.originalfilename = data.originalfilename
        ? data.originalfilename
        : "";
      this.fromdate = data.fromDate ? data.fromDate : "";
      this.todate = data.toDate ? data.toDate : "";
      this.quality = data.quality ? data.quality : "";
      this.mimetype = data.mimetype ? data.mimetype : "";
      this.preprocessid = data.preprocessid ? data.preprocessid : "";
      this.listpreProcess();
    },
    displayReProcessPopup(row) {
      EventBus.$emit("OpenReProcessModal", row);
    },
    listpreProcess(page = 1) {
      this.currentPage = page;
      let data = {
        filetype: "AUDIO",
        contenttype: this.contenttype,
        preprocessstatus: this.preprocessstatus,
        deficient: this.deficient,
        jobid: this.jobid,
        originalfilename: this.originalfilename,
        fromdate: this.apiDateFormat(this.fromdate),
        todate: this.apiDateFormat(this.todate),
        quality: this.quality,
        mimetype: this.mimetype,
        preprocessid: this.preprocessid,
        page: page,
        pagesize: 10
      };
      this.listPreProcessJobs(data)
        .then(res => {
          console.log("response", res.data);
          if (res.totalcount <= 10) {
            this.currentPage = 1;
          }
          if (res.totalcount) {
            this.pageCount = Math.ceil(res.totalcount / 10);

            console.log("video data", res.data);
            this.processVideoData = this.actMakeSizeConversion(res.data);
          } else {
            this.processVideoData = [];
          }
        })
        .catch(error => {
          this.processVideoData = [];
          console.log("error", error);
          if (error.status === 401) {
            console.log("ERROR 401", error);
          }
        });
    }
  },
  created() {
    EventBus.$on("closePopup", val => {
      this.showUpdateReport = val;
    });
    EventBus.$on("reloadPreProcess", this.reloadData);
    this.mTableProperty = {
      width: "100vw"
    };
    // this.ticketReportData = apidata.preprocessData
    this.processHeader = [
      {
        type: "md1",
        textHeader: "#",
        filterType: false,
        valueType: "index",
        value: 1
      },
      {
        type: "lg5",
        textHeader: "PREPROCESS ID",
        valueType: "column",
        value: "preprocessid",
        filterType: "search",
        filterData: {
          label: "PREPROCESS ID",
          showfilter: false,
          filterName: "ID",
          default: ""
        }
      },
      {
        type: "lg5",
        textHeader: "ORIGINALFILENAME",
        valueType: "column",
        value: "originalfilename",
        filterType: "search",
        filterData: {
          label: "FILE NAME",
          showfilter: false,
          filterName: "FILE",
          default: ""
        }
      },
      {
        type: "lg5",
        textHeader: "MIME TYPE",
        valueType: "column",
        value: "mimetype",
        filterType: "dropDown",
        filterData: {
          label: "MIME type",
          showfilter: false,
          filterName: "MIME type",
          default: "all",
          valueOption: [
            { text: "All", value: "all" },
            { text: "video/mp4", value: "video/mp4" },
            { text: "image/png", value: "image/png" }
          ]
        }
      },
      {
        type: "text",
        textHeader: "SIZE",
        valueType: "column",
        value: "size"
      },
      // {
      //   type: 'largeColumn',
      //   textHeader: 'QUALITY',
      //   valueType: 'column',
      //   value: 'quality',
      //   filterType: 'dropDown',
      //   filterData: {
      //     label: 'QUALITY',
      //     showfilter: false,
      //     filterName: 'QUALITY',
      //     default: 'all',
      //     valueOption: [
      //       {text: 'All', value: 'all'},
      //       {text: 'HD', value: 'HD'},
      //       {text: 'SD', value: 'SD'}
      //     ]
      //   }
      // },
      {
        type: "largeColumn",
        textHeader: "DURATION",
        valueType: "column",
        value: "duration"
      },
      {
        type: "md5",
        textHeader: "STATUS",
        valueType: "column",
        value: "preprocessstatus",
        filterType: "dropDown",
        filterData: {
          label: "Status",
          showfilter: false,
          filterName: "statusQuery",
          default: "all",
          valueOption: [
            { text: "All", value: "all" },
            { text: "SUCCESS", value: "SUCCESS" },
            { text: "FAILED", value: "FAILED" }
          ]
        },
        customClass: row => {
          if (row.preprocessstatus) {
            switch (row.preprocessstatus.toLowerCase()) {
              case "failed":
                return "danger";
              case "success":
                return "success";
              default:
                return "";
            }
          }
        }
      },
      {
        type: "md5",
        textHeader: "ERROR",
        valueType: "column",
        value: "errorcode"
      },
      {
        type: "largeColumn",
        textHeader: "REASON",
        valueType: "column",
        value: "reason"
      },
      {
        type: "lg5",
        textHeader: "CREATE ON",
        valueType: "dateTime",
        value: "created",
        filterType: "dateRange",
        filterData: {
          label: "Created",
          showfilter: false,
          filterName: "createdFromQuery",
          filterName2: "createdToQuery",
          default: "",
          dofilter: false
        }
      },
      {
        type: "lg5",
        textHeader: "ACTIONS",
        filterType: false,
        valueType: "action",
        value: (row, index) => {
          if (row.preprocessstatus === "SUCCESS" && row.deficient == "YES") {
            return {
              "retranscode-error": row => {
                this.displayUpdateReport(row);
              },
              reprocess: row => {
                this.displayReProcessPopup(row);
              }
            };
          } else {
            return {
              retranscode: row => {},
              reprocess: row => {
                this.displayReProcessPopup(row);
              }
            };
          }
        }
      }
    ];
    this.listpreProcess();
  }
};
</script>

<style scoped lang="scss">
.process-wrapper {
  .tw__pagination {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    padding: 10px 0 0;
  }
  /deep/ .table-wrapper {
    .flex-table {
      &.header {
        font-weight: inherit;
        div {
          font-family: var(--font-medium);
        }
      }
    }
  }
  >>> .table-wrapper.data-table {
    height: 100vh;
  }
}
>>> span.action-btn:nth-child(2) {
  bottom: 5px;
  padding-left: 10px;
}
</style>
