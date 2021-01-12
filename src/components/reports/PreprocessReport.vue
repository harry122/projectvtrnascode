<template>
  <div class="coupon-report-wrapper">
    <MTableHeader
      class="table-stripped"
      :mTableProperty="mTableProperty"
      :headerArray="preprocessReportHeader"
      :data="preprocessReportData"
      :offset="offset"
      @filters="preprocessReportFilter($event)"
    />
    <MPagination
      class="nw__pagination"
      :totalPages="pageCount"
      :currentPage="currentPage"
      @pagechanged="pageSelect"
      :hidePrevious="true"
    />
  </div>
</template>

<script>
import { MTableHeader, MPagination } from "mobiotics-dynamic-components-vue";
import * as apidata from "@/components/assets/couponReport.js";
import { mVMixin } from "@/mixins.js";
import { EventBus } from "@/event.js";
import { mapActions, mapMutations } from "vuex";

export default {
  name: "CouponReport",
  data() {
    return {
      preprocessReportHeader: [],
      preprocessReportData: [],
      offset: 0,
      couponFilter: [],
      currentPage: 1,
      mTableProperty: {},
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
  created() {
    // this.mTableProperty = {
    //   width: '95vw'
    // }
    this.getPreprocessData();
    this.preprocessReportHeader = [
      {
        type: "sm1",
        textHeader: "#",
        filterType: false,
        valueType: "index",
        value: 1
      },
      {
        type: "lg1",
        textHeader: "PREPROCESS ID",
        valueType: "column",
        value: "preprocessid",
        filterType: "search",
        filterData: {
          label: "Preprocess ID",
          showfilter: false,
          filterName: "preprocessQuery",
          default: ""
        }
      },
      {
        type: "lg3",
        textHeader: "ORIGINALFILENAME",
        valueType: "column",
        value: "originalfilename",
        filterType: "search",
        filterData: {
          label: "Filename",
          showfilter: false,
          filterName: "originalQuery",
          default: ""
        }
      },
      {
        type: "text",
        textHeader: "FILETYPE",
        valueType: "column",
        value: "filetype",
        filterType: "dropDown",
        filterData: {
          label: "Filetype",
          showfilter: false,
          filterName: "filterQuery",
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
        type: "text",
        textHeader: "JOB ID",
        valueType: "column",
        value: "jobid",
        filterType: "search",
        filterData: {
          label: "Job ID",
          showfilter: false,
          filterName: "jobQuery",
          default: ""
        }
      },
      {
        type: "text",
        textHeader: "SIZE",
        valueType: "column",
        value: "size",
        filterType: false
      },
      {
        type: "text",
        textHeader: "QUALITY",
        valueType: "column",
        value: "quality",
        filterType: "dropDown",
        filterData: {
          label: "Quailty",
          showfilter: false,
          filterName: "qualityQuery",
          default: "all",
          valueOption: [
            { text: "All", value: "all" },
            { text: "HD", value: "HD" },
            { text: "SD", value: "SD" },
            { text: "AUDIO", value: "AUDIO" }
          ]
        }
      },
      {
        type: "text",
        textHeader: "DURATION",
        valueType: "column",
        value: "duration",
        filterType: false
      },
      {
        type: "md2",
        textHeader: "MIME TYPE",
        valueType: "column",
        value: "mimetype",
        filterType: "dropDown",
        filterData: {
          label: "MIME Type",
          showfilter: false,
          filterName: "mimeTypeQuery",
          default: "all",
          valueOption: [
            { text: "All", value: "all" },
            { text: "video/mp4", value: "video/mp4" },
            { text: "audio/mp4", value: "audio/mp4" },
            { text: "image/png", value: "image/png" }
          ]
        }
      },
      {
        type: "md2",
        textHeader: "CONTENT TYPE",
        valueType: "column",
        value: "contenttype",
        filterType: "dropDown",
        filterData: {
          label: "Content Type",
          showfilter: false,
          filterName: "contentTypeQuery",
          default: "all",
          valueOption: [
            { text: "All", value: "all" },
              { text: "CONTENT", value: "CONTENT" },
              { text: "TRAILER", value: "TRAILER" }
          ]
        }
      },
      {
        type: "md2",
        textHeader: "CONVERTED",
        valueType: "column",
        value: "conversion",
        filterType: "dropDown",
        filterData: {
          label: "Converted",
          showfilter: false,
          filterName: "convertedQuery",
          default: "all",
          valueOption: [
            { text: "All", value: "all" },
            { text: "YES", value: "YES" },
            { text: "NO", value: "NO" }
          ]
        }
      },
      {
        type: "md2",
        textHeader: "DEFICIENT",
        valueType: "column",
        value: "deficient",
        filterType: "dropDown",
        filterData: {
          label: "Deficient",
          showfilter: false,
          filterName: "deficientQuery",
          default: "all",
          valueOption: [
            { text: "All", value: "all" },
            { text: "YES", value: "YES" },
            { text: "NO", value: "NO" }
          ]
        }
      },
      {
        type: "md2",
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
            { text: "ALL", value: "all" },
            { text: "SUCCESS", value: "SUCCESS" },
            { text: "INPROGRESS", value: "INPROGRESS" },
            { text: "FAILED", value: "FAILED" },
             { text: "DELETED", value: "DELETED" }
          ]
        },
        customClass: row => {
          if (row.couponstatus) {
            switch (row.couponstatus.toLowerCase()) {
              case "failed":
                return "danger";
              case "completed":
                return "success";
              case "created":
                return "";
              default:
                return "";
            }
          }
        }
      },
      {
        type: "sm2",
        textHeader: "ERROR",
        valueType: "column",
        value: "errorcode",
        filterType: false
      },
      {
        type: "sm2",
        textHeader: "REASON",
        valueType: "column",
        value: "reason",
        filterType: false
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
      },
      {
        type: "largeColumn",
        textHeader: "UPDATED",
        valueType: "dateTime",
        value: "updatedon",
        filterType: "dateYear",
        filterData: {
          label: "UPDATED",
          showfilter: false,
          filterName: "updatedQuery",
          default: "",
          dofilter: false
        }
      }
    ];
  },
  methods: {
    ...mapActions(["actGetReport"]),
    ...mapMutations(['setReportData']),

    onPageChange(val) {
      this.currentPage = val;
    },
    pageSelect(page = "") {
      if (page) {
        this.getPreprocessData(page);
      } else {
        let page = this.currentPage;
        this.getPreprocessData(page);
      }
    },
    preprocessReportFilter(data) {
      console.log(data);
      this.filterData = [
        data.preprocessid
          ? { name: "preprocessid", value: data.preprocessid }
          : "",
        data.jobid ? { name: "jobid", value: data.jobid } : "",
        data.originalfilename
          ? { name: "originalfilename", value: data.originalfilename }
          : "",
        data.filetype ? { name: "filetype", value: data.filetype } : "",
        data.mimetype ? { name: "mimetype", value: data.mimetype } : "",
        data.contenttype
          ? { name: "contenttype", value: data.contenttype }
          : "",
        data.preprocessstatus
          ? { name: "status", value: data.preprocessstatus }
          : "",
        data.conversion ? { name: "conversion", value: data.conversion } : "",
        data.deficient ? { name: "deficient", value: data.deficient } : "",
        data.quality ? { name: "quality", value: data.quality } : "",
        data.updatedon ? { name: "updatedon", value: this.apiDateFormat(data.updatedon) } : "",
      ];
      this.fromdate = data.fromDate ? data.fromDate : "";
      this.todate = data.toDate ? data.toDate : "";
      this.getPreprocessData();
    },
    getPreprocessData(page = 1) {
      this.currentPage = page;
      let data = {
        fromdate: this.apiDateFormat(this.fromdate),
        todate: this.apiDateFormat(this.todate),
        filter: this.filterData,
        pagesize: 10,
        page: page,
        reportid: "preprocess"
      };

      this.setReportData(data)

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

              this.preprocessReportData = res.data;
              EventBus.$emit("Loader", false);
            }
          } else {
            this.preprocessReportData = [];
            EventBus.$emit("Loader", false);
          }
        })
        .catch(error => {
          this.preprocessReportData = [];

          console.log("ERRORRRRR", error);
          if (error.status === 401) {
            console.log("error ====>", error);
          }
        });
    }
  }
};
</script>

<style scoped lang="scss">
.coupon-report-wrapper {
  .nw__pagination {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    padding: 10px 0 0;
    cursor: pointer;
  }
  /deep/ .table-wrapper {
    .flex-table {
      &.header {
        font-size: 14px;
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
