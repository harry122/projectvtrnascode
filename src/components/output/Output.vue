<template>
  <div id="service-wrapper">
    <div class="provider-header"> 
      <div class="page-header">
        <MPageHeader :title="pageTitle" :count="totalCount" />
      </div>
    </div>
    <MTableHeader
      class="table-stripped"
      :headerArray="outputHeader"
      :data="transcodeData"
      :offset="offset"
      @filters="outputFilter($event)"
    />

    <Retranscode-popup v-if="updateProvider" :trancodeData="transcodeJobData"></Retranscode-popup>
    <error-popup v-if="showErrorPopup" :message="reason"></error-popup>
    <MPagination
      class="pagination"
      :totalPages="pageCount"
      v-if="transcodeData.length"
      :currentPage="currentPage"
      @pagechanged="pageSelect"
      :hidePrevious="true"
    />
  </div>
</template>
<script>
/* eslint-disable */
import {
  MPageHeader,
  MButton,
  MTableHeader,
  MPagination,
  MModal
} from "mobiotics-dynamic-components-vue";
import "mobiotics-dynamic-components-vue/dist/mobiotics_dynamic_components_vue.css";
import { EventBus } from "@/event.js";
import { mapActions } from "vuex";
import { mVMixin } from "@/mixins.js";
export default {
  name: "vtranscode-output",
  data() {
    return {
      transcodeData: [],
      pageTitle: "TRANSCODED",
      outputHeader: [],
      totalCount: 0,
      perPage: 10,
      results: [],
      offset: 0,
      pageCount: 1,
      contentId: "",
      endtime: "",
      starttime: "",
      currentPage: 1,
      updateProvider: false,
      token: localStorage.getItem("token"),
      transcodeJobData: "",
      profileid: "",
      jobId: "",
      status,
      created: "",
      reason: "",
      showErrorPopup: false
    };
  },

  mixins: [mVMixin],
  created() {
    this.tableInit();
    this.listTranscode();
    EventBus.$on("closePopup", this.closePopupFunc);
  },
  components: {
    "Retranscode-popup": () =>
      import("@/components/popups/RetranscodePopup.vue"),
    "error-popup": () => import("@/components/popups/ErrorPopup.vue"),
    MPageHeader,
    MButton,
    MTableHeader,
    MPagination,
    MModal
  },
  methods: {
    ...mapActions([
      "getTranscodedList",
      "actDeleteTranscoder",
      "getTranscodJobById"
    ]),
    pageSelect(page) {
      if (page) {
        this.offset = (page - 1) * 10;
        this.listTranscode(page);
      } else {
        let page = this.currentPage;
        this.listTranscode(page);
      }
    },
    closePopupFunc(val) {
      this.updateProvider = val;
      this.showErrorPopup = val;
    },
    outputFilter(data) {
      console.log("data>>", data);
      this.contentId = data.contentid ? data.contentid : "";
      this.status = data.jobstatus ? data.jobstatus : "";
      this.profileid = data.profileid ? data.profileid : "";
      this.endtime = data.endtime ? data.endtime : "";
      this.starttime = data.starttime ? data.starttime : "";
      this.jobId = data.jobid ? data.jobid : "";
      this.created = data.created ? data.created : "";
      this.listTranscode();
    },
    listTranscode(page = 1) {
      this.currentPage = page;
      let data = {
        contentid: this.contentId,
        status: this.status,
        starttime: this.apiDateFormat(this.starttime),
        endtime: this.apiDateFormat(this.endtime),
        pagesize: 10,
        page: page,
        jobid: this.jobId,
        created: this.apiDateFormat(this.created)
      };
      this.getTranscodedList(data)
        .then(res => {
          if (res.totalcount <= 10) {
            this.currentPage = 1;
          }
          this.totalCount = 0;
          if (res.totalcount) {
            this.totalCount = res.totalcount;
          }
          this.pageCount = Math.ceil(this.totalCount / 10);
          this.transcodeData = res.data ? res.data : [];
        })
        .catch(error => {
          this.transcodeData = [];
          if (error.status === 401) {
          } else {
            // localStorage.removeItem('token')
            // this.$router.push('/')
          }
        });
    },

    tableInit() {
      this.outputHeader = [
        {
          type: "sm1",
          textHeader: "#",
          filterType: false,
          valueType: "index",
          value: 1
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
            filterName: "jobidQuery",
            default: ""
          }
        },
        {
          type: "text",
          textHeader: "CONTENT ID",
          valueType: "column",
          value: "contentid",
          filterType: "search",
          filterData: {
            label: "Content ID",
            showfilter: false,
            filterName: "contentidQuery",
            default: ""
          }
        },
        {
          type: "text",
          textHeader: "PROFILE ID",
          valueType: "column",
          value: "profileid",
          filterType: "search",
          filterData: {
            label: "Profile ID",
            showfilter: false,
            filterName: "profileidQuery",
            default: ""
          }
        },
        {
          type: "largeColumn",
          textHeader: "INPUTFILELIST",
          filterType: false,
          valueType: "column",
          value: "originalfilelist"
        },
        {
          type: "text",
          textHeader: "STATUS",
          valueType: "column",
          value: "jobstatus",
          filterType: "dropDown",
          filterData: {
            label: "Job Status",
            showfilter: false,
            filterName: "statusQuery",
            default: "all",
            valueOption: [
              { text: "DOWNLOADING", value: "DOWNLOADING" },
              { text: "FINALIZING", value: "FINALIZING" },
              { text: "COMPLETED", value: "COMPLETED" },
              { text: "FAILED", value: "FAILED" }
            ]
          }
        },
        {
          type: "text",
          textHeader: "ERRORCODE",
          filterType: false,
          valueType: "column",
          value: "errorcode"
        },
        {
          type: "text",
          textHeader: "REASON",
          filterType: false,
          valueType: "column",
          value: "reason"
        },
        {
          type: "largeColumn",
          textHeader: "START TIME",
          valueType: "dateTime",
          value: "starttime",
          filterType: "dateYear",
          filterData: {
            label: "startdate",
            showfilter: false,
            filterName: "startdateFromQuery",
            default: "",
            dofilter: false
          }
        },
        {
          type: "largeColumn",
          textHeader: "END TIME",
          valueType: "dateTime",
          value: "endtime",
          filterType: "dateYear",
          filterData: {
            label: "enddate",
            showfilter: false,
            filterName: "enddateFromQuery",
            default: "",
            dofilter: false
          }
        },
        {
          type: "text",
          textHeader: "TRAILER",
          filterType: false,
          valueType: "column",
          value: "trailer"
        },
        {
          type: "text",
          textHeader: "POSTER",
          filterType: false,
          valueType: "column",
          value: "poster"
        },
        {
          type: "largeColumn",
          textHeader: "CREATED",
          valueType: "dateTime",
          value: "created",
          filterType: "dateYear",
          filterData: {
            label: "Created",
            showfilter: false,
            filterName: "createdFromQuery",
            default: "",
            dofilter: false
          }
        },
        {
          type: "text",
          textHeader: "ACTIONS",
          filterType: false,
          valueType: "action",
          value: valueRow => {
            return {
              retranscode: row => {
                this.getTranscodJobById(row.jobid)
                  .then(res => {
                    if (!res.errorcode) {
                      this.transcodeJobData = {
                        contentId: row.contentid,
                        jobId: row.jobid,
                        jobData: res.data
                      };
                      this.updateProvider = true;
                    } else {
                      this.showErrorPopup = true;
                      this.reason = "There is no job to show";
                    }
                  })
                  .catch(err => {
                    console.log("error", err);
                  });
              },
              delete: row => {
                this.actDeleteTranscoder(row.jobid).then(res => {
                  this.listTranscode();
                });
              }
            };
          }
        }
      ];
    }
  }
};
</script>

<style scoped lang="scss">
// @import '@/sass/main.scss';
#service-wrapper {
  padding: 0px 20px;
}
>>> .pagination {
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
// >>> .m-table-body-wrapper  {
//     height: 100vh;

// }
.provider-header {
  display: flex;
  margin-top: 3%;
}

.page-header {
  display: flex;
  flex: 1;
}
// .large-column {
//   font-family: 'Helvetica Neue Medium';
// }
/deep/.header {
  font-weight: bold !important;
}
/deep/ .action-column .action-btn {
  padding: 4px;
}
/deep/ .table-wrapper {
  overflow-x: auto !important;
}

>>> .data-count {
  font-family: "Helvetica Neue Bold";
}
>>> .data-found-wrapper {
  height: 100%;
  min-height: 100vh;
}
</style>
