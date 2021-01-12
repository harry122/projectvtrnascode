<template>
  <div class="process-wrapper">
    <div class="provider-header">
      <div class="page-header">
        <MPageHeader class="custom-header" :title="pageTitle" :count="totalCount" />
      </div>
    </div>
    <MTableHeader
      class="table-stripped"
      :headerArray="unprocessedHeader"
      :data="unprocessedData"
      :offset="offset"
      @filters="unprocessedFilter($event)"
    />
    <MPagination
      class="pagination"
      :totalPages="pageCount"
      v-if="totalCount>10"
      :currentPage="currentPage"
      @pagechanged="pageSelect"
      :hidePrevious="true"
    />
    <Preprocess-Selected></Preprocess-Selected>
    <Track-Preprocess v-if="showTrack" :fileData="selectedFile"></Track-Preprocess>
  </div>
</template>  
<script>
/* eslint-disable */
import {
  MPageHeader,
  MButton,
  MTableHeader,
  MPagination
} from "mobiotics-dynamic-components-vue";
import "mobiotics-dynamic-components-vue/dist/mobiotics_dynamic_components_vue.css";
import { EventBus } from "@/event.js";
import { mapActions, mapMutations } from "vuex";
import { mVMixin } from "@/mixins.js";
export default {
  name: "vtrancode-unprocessed",
  data() {
    return {
      header_data: [
        { name: "VIDEO", status: "active" },
        { name: "AUDIO", status: "deactive" }
      ],
      pageTitle: "UNPROCESSED",
      unprocessedHeader: [],
      unprocessedData: [],
      offset: 0,
      totalCount: 0,
      perPage: 10,
      pageCount: 1,
      currentPage: 1,
      token: localStorage.getItem("token"),
      filename: "",
      filetype: "",
      selectedFile: [],
      showTrack: false,
      contenttype: "",
      created: ""
    };
  },
  components: {
    MPageHeader,
    MButton,
    MTableHeader,
    MPagination,
    // "Preprocess-Selected": () => import("./Preprocess-Opt"),
    "Track-Preprocess": () =>
      import("@/components/popups/TrackSelection-popup.vue"),
    "Preprocess-Selected": () =>
      import("@/components/input/transcode/Transcode-Init.vue")
  },
  mixins: [mVMixin],
  created() {
    this.tableInit();
    this.listAPI();
    EventBus.$on("closePopup", val => {
      this.showTrack = val;
    });
    EventBus.$on("preprocessInit", this.preprocessFile);
  },
  methods: {
    ...mapActions(["getUnprocessedList", "preprocessFiles"]),
    ...mapMutations(["setListFilteredJobTranscode"]),

    pageSelect(page) {
      if (page) {
        this.offset = (page - 1) * 10;
        this.listAPI(page);
      } else {
        let page = this.currentPage;
        this.listAPI(page);
      }
    },
    preprocessFile(value) {
      if (value) {
        console.log("file", this.selectedFile);
        this.selectedFile.forEach((file, index) => {
          let preprocessData = [
            {
              filetype: file.data.filetype ? file.data.filetype : "",
              filelink: file.data.filelink ? file.data.filelink : "",
              drivetype: "FOLDER",
              filename: file.data.filename ? file.data.filename : ""
              // report: this.getReport(index)
            }
          ];
          let formData = new FormData();
          formData.append("preprocessdata", JSON.stringify(preprocessData));
          this.preprocessFiles(formData);
        });
      }
      setTimeout(() => {
        this.listAPI();
      }, 2000);
    },
    getReport(id) {
      if (this.reportFiles.includes(this.content[id].filetype)) {
        let report = {};
        if (this.content[id].filetype === "AUDIO") {
          report.AUDIO = [...this.trackList];
        } else if (this.content[id].filetype === "SUBTITLE") {
          report.SUBTITLE = [{ language: this.trackList[0].language }];
        }
        return report;
      } else {
        return "";
      }
    },
    unprocessedFilter(data) {
      console.log("data>>", data);
      this.filename = data.filename ? data.filename : "";
      this.filetype = data.filetype ? data.filetype : "";
      this.contenttype = data.contenttype ? data.contenttype : "";
      this.created = data.created ? data.created : "";
      this.listAPI();
    },
    listAPI(page = 1) {
      this.currentPage = page;
      let data = {
        originalfilename: this.filename,
        filetype: this.filetype,
        contenttype: this.contenttype,
        created: this.apiDateFormat(this.created),
        pagesize: 10,
        page: page
      };
      this.getUnprocessedList(data)
        .then(res => {
          if (!res.errorcode) {
            if (res.totalcount <= 10) {
              this.currentPage = 1;
            }
            this.totalCount = 0;
            if (res.totalcount) {
              this.totalCount = res.totalcount;
            }
            this.pageCount = Math.ceil(this.totalCount / 10);
            if (res.data.length) {
              this.setvalue(this.actMakeSizeConversion(res.data));
            } else {
              this.unprocessedData = [];
            }
          }
        })
        .catch(err => {
          this.unprocessedData = [];
          console.log("err>>", err);
        });
    },
    setvalue(value) {
      let res = {};
      this.unprocessedData = value.map((ele, index) => {
        res = {
          // data: [
          //   ele.filename,
          //   ele.filetype,
          //   ele.size,
          //   ele.created,
          //   ele.contenttype
          // ],
          data: ele,
          contenttype: ele.contenttype ? ele.contenttype : "",
          filename: ele.filename,
          filetype: ele.filetype,
          size: ele.size,
          created: ele.created,
          preprocessid: index
        };
        return res;
      });
      console.log(this.unprocessedData);
    },
    tableInit() {
      this.unprocessedHeader = [
        {
          type: "sm1",
          textHeader: "#",
          filterType: false,
          valueType: "index",
          value: 1
        },
        {
          type: "text",
          textHeader: "FILENAME",
          valueType: "column",
          value: "filename",
          filterType: "search",
          filterData: {
            label: "FilenameQuery",
            showfilter: false,
            filterName: "filename",
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
            label: "filetype",
            showfilter: false,
            filterName: "filetypeQuery",
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
          type: "text",
          textHeader: "CONTENT TYPE",
          valueType: "column",
          value: "contenttype",
          filterType: "dropDown",
          filterData: {
            label: "Content Type",
            showfilter: false,
            filterName: "contentQuery",
            default: "all",
            valueOption: [
              { text: "CONTENT", value: "CONTENT" },
              { text: "TRAILER", value: "TRAILER" }
            ]
          }
        },
        {
          type: "text",
          textHeader: "SIZE",
          valueType: "column",
          value: "size"
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
            filterName2: "createdToQuery",
            default: "",
            dofilter: false
          }
        },
        {
          type: "text",
          valueType: "checkbox",
          textHeader: "SELECT",
          value: "data",
          checkArr: {
            checked: checkedArr => {
              this.selectedFile = checkedArr;
              this.setListFilteredJobTranscode(this.selectedFile);
              console.log(this.selectedFile);
            }
          }
        }
      ];
    }
  }
};
</script>

<style scoped lang="scss">
// @import '@/sass/main.scss';
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
.process-wrapper {
  padding: 10px 20px;
}
.provider-header {
  display: flex;
  margin-top: 3%;
}
.custom-header {
  width: 80%;
}
.page-header {
  display: flex;
  flex: 1;
}
.create-btn1 {
  height: 5%;
  margin-left: 1%;
}
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
