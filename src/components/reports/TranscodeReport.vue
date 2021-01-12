<template>
  <div class="notification-report-wrapper">
    <MTableHeader
      class="table-stripped"
      :headerArray="transcodeReporHeader"
      :data="transcodeReporData"
      :offset="offset"
      @filters="transcodeReportFilter($event)"
    />
    <MPagination
      class="nw__pagination"
      v-if="transcodeReporData.length"
      :totalPages="pageCount"
      :currentPage="currentPage"
      @pagechanged="pageSelect"
      :hidePrevious="true"
    />
  </div>
</template>

<script>
import { MTableHeader, MPagination } from "mobiotics-dynamic-components-vue";
import * as apidata from "@/components/assets/notificationReport.js";
import { mVMixin } from "@/mixins.js";
import { EventBus } from "@/event.js";
import { mapActions, mapMutations, mapGetters } from "vuex";

export default {
  name: "NotificationReport",
  data() {
    return {
      transcodeReporHeader: [],
      transcodeReporData: [],
      offset: 0,
      notificationFilter: [],
      currentPage: 1,
      maxVisibleButtons: 3,
      pageCount: 0,
      fromdate: "",
      todate: "",
      perPage: "",
      filterData: ""
    };
  },
  components: {
    MTableHeader,
    MPagination
  },
  mixins: [mVMixin],
  computed: {
    ...mapGetters(["getReportInitiatedBy"])
  },
  watch: {
    getReportInitiatedBy() {
      this.getTranscodeData();
    }
  },
  created() {
    this.getTranscodeData();
    this.transcodeReporHeader = [
      {
        type: "sm2",
        textHeader: "#",
        filterType: false,
        valueType: "index",
        value: 1
      },
      {
        type: "lg2",
        textHeader: "TRANSCODING ID",
        valueType: "column",
        value: "idtranscontent",
        filterType: "search",
        filterData: {
          label: "Transcoding ID",
          showfilter: false,
          filterName: "titleQuery",
          default: ""
        }
      },
      {
        type: "md5",
        textHeader: "SEGMENT ID",
        valueType: "column",
        value: "segmentid",
        filterType: "search",
        filterData: {
          label: "Segment ID",
          showfilter: false,
          filterName: "modeQuery",
          default: ""
        }
      },
      {
        type: "md3",
        textHeader: "CONTENT ID",
        valueType: "column",
        value: "contentid",
        filterType: "search",
        filterData: {
          label: "Content ID",
          showfilter: false,
          filterName: "channelTypeQuery",
          default: ""
        }
      },
      {
        type: "lg5",
        textHeader: "FILENAME",
        valueType: "column",
        value: "filename",
        filterType: "search",
        filterData: {
          label: "Filename",
          showfilter: false,
          filterName: "filename",
          default: ""
        }
      },
      {
        type: "md3",
        textHeader: "FILETYPE",
        valueType: "column",
        value: "filetype",
        filterType: "dropDown",
        filterData: {
          label: "filetype",
          showfilter: false,
          filterName: "filetypeQuery",
          default: "all",
          valueOption: [
            { text: "VIDEO", value: "VIDEO" },
            { text: "AUDIO", value: "AUDIO" },
            { text: "SUBTITLE", value: "SUBTITLE" },
            { text: "POSTER", value: "POSTER" }
          ]
        }
      },
      {
        type: "md3",
        textHeader: "MIMETYPE",
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
            { text: "video/vp9", value: "video/vp9" },
            { text: "audio/mp4", value: "audio/mp4" },
            { text: "image/png", value: "image/png" }
          ]
        }
      },
      {
        type: "md5",
        textHeader: "CONTENT TYPE",
        valueType: "column",
        value: "contenttype",
        filterType: "dropDown",
        filterData: {
          label: "Content Type",
          showfilter: false,
          filterName: "contenttype",
          default: "all",
          valueOption: [
            { text: "All", value: "all" },
            { text: "CONTENT", value: "CONTENT" },
            { text: "TRAILER", value: "TRAILER" }
          ]
        },
        customClass: row => {
          if (row.notifystatus) {
            switch (row.notifystatus.toLowerCase()) {
              case "failed":
                return "failed";
              case "success":
                return "success";
              case "pending":
                return "notify";
              default:
                return "";
            }
          }
        }
      },
      {
        type: "md4",
        textHeader: "PROFILE ID",
        valueType: "column",
        value: "profileid",
        filterType: "search",
        filterData: {
          label: "Profile ID",
          showfilter: false,
          filterName: "modeQuery",
          default: ""
        }
      },
      {
        type: "md5",
        textHeader: "ENCODING ID",
        valueType: "column",
        value: "encodingid",
        filterType: "search",
        filterData: {
          label: "Encoding ID",
          showfilter: false,
          filterName: "modeQuery",
          default: ""
        }
      },
      {
        type: "md3",
        textHeader: "QUALITY",
        valueType: "column",
        value: "quality",
        filterType: "dropDown",
        filterData: {
          label: "Quality",
          showfilter: false,
          filterName: "qualityQuery",
          default: "all",
          valueOption: [
            { text: "All", value: "all" },
            { text: "HD", value: "HD" },
            { text: "SD", value: "SD" },
            { text: "AUDIO1", value: "AUDIO1" }
          ]
        }
      },
      {
        type: "md",
        textHeader: "SIZE",
        valueType: "column",
        value: "size"
      },
      {
        type: "md2",
        textHeader: "DURATION",
        filterType: false,
        valueType: "column",
        value: "duration"
      },
      {
        type: "md5",
        textHeader: "INTIATED BY",
        filterType: false,
        valueType: "column",
        value: "inititatedby"
      },
      {
        type: "largeColumn",
        textHeader: "CREATED",
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
      }
    ];
  },
  methods: {
    ...mapActions(["actGetReport"]),
    ...mapMutations(["setReportData"]),

    onPageChange(val) {
      this.currentPage = val;
    },
    pageSelect(page = "") {
      if (page) {
        this.getTranscodeData(page);
      } else {
        let page = this.currentPage;
        this.getTranscodeData(page);
      }
    },
    transcodeReportFilter(data) {
      console.log(data);
      this.filterData = [
        data.idtranscontent
          ? { name: "transcodeid", value: data.idtranscontent }
          : "",
        data.segmentid ? { name: "segmentid", value: data.segmentid } : "",
        data.contentid ? { name: "contentid", value: data.contentid } : "",
        data.filename ? { name: "filename", value: data.filename } : "",
        data.filetype ? { name: "filetype", value: data.filetype } : "",
        data.mimetype ? { name: "mimetype", value: data.mimetype } : "",
        data.contenttype
          ? { name: "contenttype", value: data.contenttype }
          : "",
        data.profileid ? { name: "profileid", value: data.profileid } : "",
        data.encodingid ? { name: "encodingid", value: data.encodingid } : "",
        data.quality ? { name: "quality", value: data.quality } : ""
      ];
      this.fromdate = data.fromDate ? data.fromDate : "";
      this.todate = data.toDate ? data.toDate : "";
      this.getTranscodeData();
    },
    getTranscodeData(page = 1) {
      this.currentPage = page;
      let data = {
        fromdate: this.apiDateFormat(this.fromdate),
        todate: this.apiDateFormat(this.todate),
        filter: this.filterData,
        pagesize: 10,
        page: page,
        reportid: "transcode"
      };

      // this.setReportData(data);

      this.actGetReport(data)
        .then(res => {
          if (res.totalcount) {
            if (res.totalcount <= 5) {
              this.currentPage = 1;
            }
            this.totalCount = [];
            if (res.totalcount) {
              this.totalCount = res.totalcount;
              this.offset = (page - 1) * 10;
              this.pageCount = Math.ceil(this.totalCount / 10);

              this.transcodeReporData = res.data;
              EventBus.$emit("Loader", false);
            }
          } else {
            this.transcodeReporData = [];
            EventBus.$emit("Loader", false);
          }
        })
        .catch(error => {
          this.transcodeReporData = [];
          console.log("ERRORRRRR", error);
          if (error.status === 1009) {
            console.log("error ====>", error);
          }
        });
    }
  }
};
</script>

<style scoped lang="scss">
.notification-report-wrapper {
  .nw__pagination {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    padding: 10px 0 0;
    cursor: pointer;
  }
  /deep/ .table-wrapper {
    .flex-table {
      font-size: 14px;
      &.header {
        font-weight: inherit;
        div {
          font-family: var(--font-medium);
        }
      }
    }
  }
}
>>> .data-found-wrapper {
  height: 100%;
  min-height: 100vh;
}
</style>
