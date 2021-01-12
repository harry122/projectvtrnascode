<template>
  <div class="ticket-report-wrapper">
    <MTableHeader
      class="table-stripped"
      :mTableProperty="mTableProperty"
      :headerArray="jobReportHeader"
      :data="serviceauthReportData"
      :offset="offset"
      @filters="jobReportFilter($event)"
    />
    <MPagination
      v-if="serviceauthReportData.length"
      class="tw__pagination"
      :totalPages="pageCount"
      :maxVisibleButtons="maxVisibleButtons"
      :currentPage="currentPage"
      @pagechanged="pageSelect"
      :hidePrevious="true"
    />
  </div>
</template>

<script>
import { MTableHeader, MPagination } from "mobiotics-dynamic-components-vue";
import * as apidata from "@/components/assets/ticketReport.js";
import { mVMixin } from "@/mixins.js";
import { EventBus } from "@/event.js";
import { mapActions, mapMutations, mapGetters } from "vuex";

export default {
  name: "TicketReport",
  data() {
    return {
      jobReportHeader: [],
      offset: 0,
      ticketFilter: [],
      currentPage: 1,
      mTableProperty: {},
      maxVisibleButtons: 3,
      pageCount: 0,
      fromdate: "",
      todate: "",
      perPage: "",
      serviceauthReportData: [],
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
      this.getjobData();
    }
  },
  created() {
    // this.mTableProperty = {
    //   width: '120vw'
    // }
    this.jobReportHeader = [
      {
        type: "md1",
        textHeader: "#",
        filterType: false,
        valueType: "index",
        value: 1
      },
      {
        type: "md2",
        textHeader: "JOB ID",
        valueType: "column",
        value: "jobid",
        filterType: "search",
        filterData: {
          label: "Job ID",
          showfilter: false,
          filterName: "idQuery",
          default: ""
        }
      },
      {
        type: "md4",
        textHeader: "CONTENT ID",
        valueType: "column",
        value: "contentid",
        filterType: "search",
        filterData: {
          label: "Content ID",
          showfilter: false,
          filterName: "titleQuery",
          default: ""
        }
      },
      {
        type: "lg5",
        textHeader: "PROFILE ID",
        valueType: "column",
        value: "profileid",
        filterType: "search",
        filterData: {
          label: "Profile ID",
          showfilter: false,
          filterName: "categoryQuery",
          default: ""
        }
      },
      {
        type: "lg4",
        textHeader: "INPUT FILE LIST",
        valueType: "column",
        value: "originalfilelist"
      },
      // {
      //   type: 'md1',
      //   textHeader: 'ASSIGNEE',
      //   valueType: 'column',
      //   value: 'assigneename',
      //   filterType: 'dropDown',
      //   filterData: {
      //     label: 'Assignee',
      //     showfilter: false,
      //     filterName: 'assigneeQuery',
      //     default: 'all',
      //     valueOption: [
      //       {text: 'All', value: 'all'},
      //       {text: 'Staff1', value: 'staff1'},
      //       {text: 'Staff2', value: 'staff2'}
      //     ]
      //   }
      // },
      {
        type: "md3",
        textHeader: "STATUS",
        valueType: "column",
        value: "jobstatus",
        filterType: "dropDown",
        filterData: {
          label: "Status",
          showfilter: false,
          filterName: "statusQuery",
          default: "all",
          valueOption: [
            { text: "ALL", value: "all" },
            { text: "PENDING", value: "PENDING" },
            { text: "TRANSCODING", value: "TRANSCODING" },
            { text: "DOWNLOADING", value: "DOWNLOADING" },
            { text: "FINALIZING", value: "FINALIZING" },
            { text: "COMPLETED", value: "COMPLETED" },
            { text: "DELETED", value: "DELETED" },
            { text: "FAILED", value: "FAILED" }
          ]
        },
        customClass: row => {
          if (row.requeststatus) {
            switch (row.requeststatus.toLowerCase()) {
              case "failed":
                return "danger";
              case "success":
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
        type: "md3",
        textHeader: "ERROR CODE",
        filterType: false,
        valueType: "column",
        value: "errorcode"
      },
      {
        type: "lg1",
        textHeader: "REASON",
        filterType: false,
        valueType: "column",
        value: "reason"
      },
      {
        type: "lg2",
        textHeader: "INITIATED BY",
        valueType: "column",
        value: "initiatorid"
      },
      {
        type: "lg3",
        textHeader: "START TIME",
        valueType: "dateTime",
        value: "starttime",
        filterType: "dateYear",
        filterData: {
          label: "fromDate",
          showfilter: false,
          filterName: "fromDateQuery",
          default: "",
          dofilter: false
        }
      },
      {
        type: "lg5",
        textHeader: "END TIME",
        valueType: "dateTime",
        value: "endtime",
        filterType: "dateYear",
        filterData: {
          label: "toDate",
          showfilter: false,
          filterName: "toDateQuery",
          default: "",
          dofilter: false
        }
      },
      {
        type: "lg2",
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
          label: "Updated",
          showfilter: false,
          filterName: "updatedQuery",
          default: "",
          dofilter: false
        }
      }
    ];
    this.getjobData();
  },
  methods: {
    ...mapActions(["actGetReport"]),
    ...mapMutations(["setReportData"]),

    pageSelect(page = "") {
      if (page) {
        this.getjobData(page);
      } else {
        let page = this.currentPage;
        this.getjobData(page);
      }
    },
    jobReportFilter(data) {
      console.log("dtata>>", data);
      this.filterData = [
        data.jobid ? { name: "jobid", value: data.jobid } : "",
        data.profileid ? { name: "profileid", value: data.profileid } : "",
        data.contentid ? { name: "contentid", value: data.contentid } : "",
        data.jobstatus ? { name: "jobstatus", value: data.jobstatus } : "",
        data.updatedon
          ? { name: "updatedon", value: this.apiDateFormat(data.updatedon) }
          : "",
        data.starttime
          ? { name: "starttime", value: this.apiDateFormat(data.starttime) }
          : "",
        data.endtime
          ? { name: "endtime", value: this.apiDateFormat(data.endtime) }
          : ""
      ];

      this.fromdate = data.fromDate ? data.fromDate : "";
      this.todate = data.toDate ? data.toDate : "";
      this.getjobData();
    },
    getjobData(page = 1) {
      this.currentPage = page;
      let data = {
        fromdate: this.apiDateFormat(this.fromdate),
        todate: this.apiDateFormat(this.todate),
        filter: this.filterData,
        pagesize: 10,
        page: page,
        reportid: "job"
      };

      this.setReportData(data);

      this.actGetReport(data)
        .then(res => {
          if (res.totalcount) {
            if (res.totalcount <= 10) {
              this.currentPage = 1;
            }
            this.totalCount = [];
            if (res.totalcount) {
              this.totalCount = res.totalcount;
              this.offset = (page - 1) * 10;
              this.pageCount = Math.ceil(this.totalCount / 10);
            }
            this.serviceauthReportData = res.data;
          } else {
            this.serviceauthReportData = [];
          }
        })
        .catch(error => {
          this.serviceauthReportData = [];
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
.ticket-report-wrapper {
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
        font-size: 14px;
        div {
          font-family: "Helvetica Neue Medium";
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
