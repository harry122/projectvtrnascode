<template>
  <div class="coupon-report-wrapper">
    <MTableHeader
      class="table-stripped"
      :mTableProperty="mTableProperty"
      :headerArray="usageReporHeader"
      :data="usageReporData"
      :offset="offset"
      @filters="usageReportFilter($event)"
    />
    <MPagination
      class="nw__pagination"
      v-if="usageReporData.length"
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
      usageReporHeader: [],
      usageReporData: [],
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
    this.getUsageData();
    // this.mTableProperty = {
    //   width: '95vw'
    // }
    this.usageReporHeader = [
      {
        type: "sm2",
        textHeader: "#",
        filterType: false,
        valueType: "index",
        value: 1
      },
      {
        type: "lg3",
        textHeader: "USAGE ID",
        valueType: "column",
        value: "usageid",
        filterType: "search",
        filterData: {
          label: "Usage ID",
          showfilter: false,
          filterName: "preprocessQuery",
          default: ""
        }
      },
      {
        type: "lg5",
        textHeader: "USAGE TYPE",
        valueType: "column",
        value: "usagetype",
        filterType: "dropDown",
        filterData: {
          label: "Usage Type",
          showfilter: false,
          filterName: "filterQuery",
          default: "all",
          valueOption: [
            { text: "All", value: "all" },
            { text: "GENERAL", value: "GENERAL" },
            { text: "SPECIFIC", value: "SPECIFIC" },
          ]
        }
      },
      {
        type: "lg5",
        textHeader: "USAGE PARAM",
        valueType: "column",
        value: "usageparam",
        filterType: "search",
        filterData: {
          label: "Usage Param",
          showfilter: false,
          filterName: "paramQuery",
          default: "",
        }
      },
      {
        type: "lg5",
        textHeader: "USAGE UNIT",
        valueType: "column",
        value: "usageunit",
        filterType: "dropDown",
        filterData: {
          label: "Usage Unit",
          showfilter: false,
          filterName: "qualityQuery",
          default: "all",
          valueOption: [
            { text: "All", value: "all" },
            { text: "HOUR", value: "HOUR" },

          ]
        }
      },
      {
        type: "lg5",
        textHeader: "USAGE VALUE",
        valueType: "column",
        value: "usageval",
        filterType: false
      },
      {
        type: "lg5",
        textHeader: "USAGE LIMIT",
        valueType: "column",
        value: "usagelimit",
        filterType: false
      },
      {
        type: "lg5",
        textHeader: "FROM DATE",
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
        textHeader: "TO DATE",
        valueType: "dateTime",
        value: "expiry",
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
  computed:{
    ...mapGetters(['getReportInterval'])
  },
  watch:{
    getReportInterval(){
       this.getUsageData();
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
        this.getUsageData(page);
      } else {
        let page = this.currentPage;
        this.getUsageData(page);
      }
    },
    usageReportFilter(data) {
      console.log(data);
      this.filterData = [
        data.usuageid ? { name: "usuageid", value: data.usuageid } : "",
        data.encodingtype
          ? { name: "encodingtype", value: data.encodingtype }
          : "",
        data.codec ? { name: "codec", value: data.codec } : "",
        data.quality ? { name: "quality", value: data.quality } : "",
        data.starttime
          ? { name: "starttime", value: this.apiDateFormat(data.starttime) }
          : "",
        data.endtime
          ? { name: "endtime", value: this.apiDateFormat(data.endtime) }
          : ""
      ];
      this.fromdate = data.fromDate ? data.fromDate : "";
      this.todate = data.toDate ? data.toDate : "";
      this.getUsageData();
    },
    getUsageData(page = 1) {
      this.currentPage = page;
      let data = {
        fromdate: this.apiDateFormat(this.fromdate),
        todate: this.apiDateFormat(this.todate),
        filter: this.filterData,
        pagesize: 10,
        page: page,
        reportid: "usage"
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

              this.usageReporData = res.data;
              EventBus.$emit("Loader", false);
            }
          } else {
            this.usageReporData = [];
            EventBus.$emit("Loader", false);
          }
        })
        .catch(error => {
          this.usageReporData = [];
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
