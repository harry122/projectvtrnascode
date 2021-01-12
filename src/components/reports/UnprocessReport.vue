<template>
  <div class="coupon-report-wrapper">
    <MTableHeader
      class="table-stripped"
      :mTableProperty="mTableProperty"
      :headerArray="unprocessReporHeader"
      :data="unprocessReporData"
      :offset="offset"
      @filters="unprocessReportFilter($event)"
    />
    <MPagination
      class="nw__pagination"
      v-if="unprocessReporData.length"
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
import { mapActions, mapMutations, mapGetters } from "vuex";

export default {
  name: "CouponReport",
  data() {
    return {
      unprocessReporHeader: [],
      unprocessReporData: [],
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
    this.getUnprocessData();
    this.mTableProperty = {
      width: "95vw"
    };
    this.getTableHeader();
  },
  computed: {
    ...mapGetters(["getReportInterval"])
  },
  watch: {
    getReportInterval() {
      this.getUnprocessData();
    }
  },
  methods: {
    ...mapActions(["actGetReport"]),
    ...mapMutations(["setReportData"]),

    onPageChange(val) {
      this.currentPage = val;
    },
    pageSelect(page = "") {
      if (page) {
        this.getUnprocessData(page);
      } else {
        let page = this.currentPage;
        this.getUnprocessData(page);
      }
    },
    unprocessReportFilter(data) {
      console.log(data);
      this.filterData = {
        filename: data.filename ? data.filename : "",
        filetype: data.filetype ? data.filetype : ""
      };
      this.fromdate = data.fromDate ? data.fromDate : "";
      this.todate = data.toDate ? data.toDate : "";
      this.getUnprocessData();
    },
    getUnprocessData(page = 1) {
      this.currentPage = page;
      let data = {
        fromdate: this.apiDateFormat(this.fromdate),
        todate: this.apiDateFormat(this.todate),
        filter: this.filterData,
        pagesize: 10,
        page: page,
        reportid: "unprocess"
      };
      this.setReportData(data);
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

              this.unprocessReporData = res.data;
            }
          } else {
            this.unprocessReporData = [];
          }
        })
        .catch(error => {
          this.unprocessReporData = [];
          console.log("ERRORRRRR", error);
          if (error.status === 1009) {
            console.log("error ====>", error);
          }
        });
    },
    getTableHeader() {
      this.unprocessReporHeader = [
        {
          type: "sm2",
          textHeader: "#",
          filterType: false,
          valueType: "index",
          value: 1
        },
        {
          type: "text",
          textHeader: "FILE NAME",
          valueType: "column",
          value: "filename",
          filterType: "search",
          filterData: {
            label: "Filename",
            showfilter: false,
            filterName: "preprocessQuery",
            default: ""
          }
        },
        {
          type: "lg1",
          textHeader: "FILE TYPE",
          valueType: "column",
          value: "filetype",
          filterType: "dropDown",
          filterData: {
            label: "Filetype",
            showfilter: false,
            filterName: "filterQuery",
            default: "all",
            valueOption: [
              { text: "CONTENT", value: "CONTENT" },
              { text: "AUDIO", value: "AUDIO" },
              { text: "TRAILER", value: "TRAILER" },
              { text: "SUBTITLE", value: "SUBTITLE" },
              { text: "POSTER", value: "POSTER" }
            ]
          }
        },
        {
          type: "lg5",
          textHeader: "SIZE",
          valueType: "column",
          value: "size"
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
