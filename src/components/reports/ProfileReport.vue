<template>
  <div class="coupon-report-wrapper">
    <MTableHeader
      class="table-stripped"
      :mTableProperty="mTableProperty"
      :headerArray="profileReporHeader"
      :data="profileReporData"
      :offset="offset"
      @filters="profileReportFilter($event)"
    />
    <MPagination
      class="nw__pagination"
      v-if="profileReporData.length"
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
      profileReporHeader: [],
      profileReporData: [],
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
    this.getProfileData();

    this.profileReporHeader = [
      {
        type: "sm2",
        textHeader: "#",
        filterType: false,
        valueType: "index",
        value: 1
      },
      {
        type: "md5",
        textHeader: "PROFILE ID",
        valueType: "column",
        value: "profileid",
        filterType: "search",
        filterData: {
          label: "Profile ID",
          showfilter: false,
          filterName: "preprocessQuery",
          default: ""
        }
      },
      {
        type: "lg1",
        textHeader: "PROFILE TYPE",
        valueType: "column",
        value: "profiletype",
        filterType: "dropDown",
        filterData: {
          label: "Profile Type",
          showfilter: false,
          filterName: "filterQuery",
          default: "all",
          valueOption: [
            { text: "VIDEO", value: "VIDEO" },
            { text: "AUDIO", value: "AUDIO" },
            { text: "AUDIO_VIDEO", value: "AUDIO_VIDEO" }
          ]
        }
      },
      {
        type: "lg3",
        textHeader: "ENCODING LIST",
        valueType: "column",
        value: "encoding",
        filterType: "search",
        filterData: {
          label: "Encoding List",
          showfilter: false,
          filterName: "jobQuery",
          default: ""
        }
      },
      {
        type: "md3",
        textHeader: "DEFAULT",
        valueType: "column",
        value: "defaultprofile",
        filterType: "dropDown",
        filterData: {
          label: "Default",
          showfilter: false,
          filterName: "qualityQuery",
          default: "all",
          valueOption: [
            { text: "All", value: "all" },
            { text: "YES", value: "YES" },
            { text: "NO", value: "NO" }
          ]
        }
      },
      {
        type: "lg5",
        textHeader: "WATERMARK SETTING",
        valueType: "column",
        value: "watermarksetting",
        filterType: "dropDown",
        filterData: {
          label: "Watermark Setting",
          showfilter: false,
          filterName: "mimeTypeQuery",
          default: "all",
          valueOption: [
            { text: "All", value: "all" },
            { text: "YES", value: "YES" },
            { text: "NO", value: "NO" }
          ]
        }
      },
      {
        type: "lg5",
        textHeader: "TRAILER SETTING",
        valueType: "column",
        value: "trailersetting",
        filterType: false
      },
      {
        type: "lg3",
        textHeader: "POSTER SETTING",
        valueType: "column",
        value: "postersetting",
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
        this.getProfileData(page);
      } else {
        let page = this.currentPage;
        this.getProfileData(page);
      }
    },
    profileReportFilter(data) {
      console.log(data);
      this.filterData = [
        data.profileid ? { name: "profileid", value: data.profileid } : "",
        data.profiletype
          ? { name: "profiletype", value: data.profiletype }
          : "",
        data.defaultprofile
          ? { name: "default", value: data.defaultprofile }
          : "",
        data.watermarksetting
          ? { name: "watermark", value: data.watermarksetting }
          : "",
        data.updatedon
          ? { name: "updatedon", value: this.apiDateFormat(data.updatedon) }
          : ""
      ];
      this.fromdate = data.fromDate ? data.fromDate : "";
      this.todate = data.toDate ? data.toDate : "";
      this.getProfileData();
    },
    getProfileData(page = 1) {
      this.currentPage = page;
      let data = {
        fromdate: this.apiDateFormat(this.fromdate),
        todate: this.apiDateFormat(this.todate),
        filter: this.filterData,
        pagesize: 10,
        page: page,
        reportid: "transprofile"
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

              this.profileReporData = res.data;
              EventBus.$emit("Loader", false);
            }
          } else {
            this.profileReporData = [];
            EventBus.$emit("Loader", false);
          }
        })
        .catch(error => {
          this.profileReporData = [];
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
