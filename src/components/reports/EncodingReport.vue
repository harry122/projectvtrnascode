<template>
  <div class="coupon-report-wrapper">
    <MTableHeader
      class="table-stripped"
      :mTableProperty="mTableProperty"
      :headerArray="encodingReporHeader"
      :data="encodingReporData"
      :offset="offset"
      @filters="encodingReportFilter($event)"
    />
    <MPagination
      class="nw__pagination"
      v-if="encodingReporData.length"
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
      encodingReporHeader: [],
      encodingReporData: [],
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
    this.getEncodingData();
    this.mTableProperty = {
      width: "120vw"
    };
    this.encodingReporHeader = [
      {
        type: "sm2",
        textHeader: "#",
        filterType: false,
        valueType: "index",
        value: 1
      },
      {
        type: "lg3",
        textHeader: "ENCODING ID",
        valueType: "column",
        value: "encodingid",
        filterType: "search",
        filterData: {
          label: "Encoding ID",
          showfilter: false,
          filterName: "preprocessQuery",
          default: ""
        }
      },
      {
        type: "lg4",
        textHeader: "ENCODING TYPE",
        valueType: "column",
        value: "encodingtype",
        filterType: "dropDown",
        filterData: {
          label: "Encoding Type",
          showfilter: false,
          filterName: "filterQuery",
          default: "all",
          valueOption: [
            { text: "All", value: "all" },
            { text: "VIDEO", value: "VIDEO" },
            { text: "AUDIO", value: "AUDIO" },
            { text: "AUDIO_VIDEO", value: "AUDIO_VIDEO" }
          ]
        }
      },
      {
        type: "lg3",
        textHeader: "CODEC",
        valueType: "column",
        value: "codec",
        filterType: "dropDown",
        filterData: {
          label: "CODEC",
          showfilter: false,
          filterName: "jobQuery",
          default: "all",
          valueOption: [
            { text: "All", value: "all" },
            { text: "AC3", value: "AC3" },
            { text: "AAC", value: "AAC" },
            { text: "H.264", value: "H.264" },
            { text: "H.265", value: "H.265" },
            { text: "AV1", value: "AV1" },
            { text: "VP9", value: "VP9" },
            { text: "AMR", value: "AMR" }
          ]
        }
      },
      {
        type: "lg5",
        textHeader: "QUALITY",
        valueType: "column",
        value: "quality",
        filterType: "dropDown",
        filterData: {
          label: "QUALITY",
          showfilter: false,
          filterName: "qualityQuery",
          default: "all",
          valueOption: [
            { text: "All", value: "all" },
            { text: "HD", value: "HD" },
            { text: "SD", value: "SD" },
            { text: "UHD1", value: "UHD1" },
            { text: "UHD2", value: "UHD2" },
            { text: "AUDIO1", value: "AUDIO1" },
            { text: "AUDIO2", value: "AUDIO2" }
          ]
        }
      },
      {
        type: "lg5",
        textHeader: "PRESET DETAILS",
        valueType: "column",
        value: "presetdetails",
        filterType: false
      },
      {
        type: "lg5",
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
    ...mapMutations(["setReportData"]),
    onPageChange(val) {
      this.currentPage = val;
    },
    pageSelect(page = "") {
      if (page) {
        this.getEncodingData(page);
      } else {
        let page = this.currentPage;
        this.getEncodingData(page);
      }
    },
    encodingReportFilter(data) {
      console.log(data);
      this.filterData = [
        data.encodingid ? { name: "encodingid", value: data.encodingid } : "",
        data.encodingtype
          ? { name: "encodingtype", value: data.encodingtype }
          : "",
        data.codec ? { name: "codec", value: data.codec } : "",
        data.quality ? { name: "quality", value: data.quality } : "",
        data.updatedon ? { name: "updatedon", value: this.apiDateFormat(data.updatedon) } : "",
      ];
      this.fromdate = data.fromDate ? data.fromDate : "";
      this.todate = data.toDate ? data.toDate : "";
      this.getEncodingData();
    },
    getEncodingData(page = 1) {
      this.currentPage = page;
      let data = {
        fromdate: this.apiDateFormat(this.fromdate),
        todate: this.apiDateFormat(this.todate),
        filter: this.filterData,
        pagesize: 10,
        page: page,
        reportid: "encoding"
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
              this.encodingReporData = res.data;
              EventBus.$emit("Loader", false);
            }
          } else {
            this.encodingReporData = [];
            EventBus.$emit("Loader", false);
          }
        })
        .catch(error => {
          this.encodingReporData = [];
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
