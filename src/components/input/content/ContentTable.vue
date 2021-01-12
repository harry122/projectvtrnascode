<template>
  <div class="ticket-report-wrapper">
    <MTableHeader class="table-stripped" :mTableProperty="mTableProperty" :headerArray="ticketReportHeader" :data="datasetContentVideo" :offset="offset" @filters="actDataFilter($event)"/>
    <!-- <MPagination class="tw__pagination"
      :totalPages="3"
      :per-page="3"
      :currentPage="currentPage"
      @pagechanged="onPageChange"
      :hidePrevious="true"/> -->
  </div>
</template>

<script>
import {MTableHeader, MPagination} from 'mobiotics-dynamic-components-vue'
import * as apidata from '@/components/assets/ticketReport.js'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { mVMixin } from '@/mixins.js'

export default {
  name: 'TicketReport',
  data () {
    return {
      ticketReportHeader: [],
      offset: 0,
      ticketFilter: [],
      currentPage: 1,
      mTableProperty: {},
      datasetContentVideo: []
    }
  },
  computed: {
    ...mapGetters(['getListAllJobTranscode', 'getListFilteredJobTranscode'])
  },
  watch: {
    getListAllJobTranscode() {
      console.log('getListAllJobTranscode', this.getListAllJobTranscode)
      this.getContentVideoTranscodeData();
    }
  },
  methods: {
    ...mapMutations(['setListFilteredJobTranscode']),
    ...mapActions(['actTranscodeData']),
    actDataFilter (data) {
      let obj = {};
      let dataset = []
      if (data.createdFromQuery) {
         data.createdFromQuery = this.apiDateFormat(data.createdFromQuery)
      }
      obj = this.actMakeObjectToParams(data)
      this.actTranscodeData(obj).then((res) => {
        if (res && res.data) {
            dataset = this.actMakeSizeConversion(res.data);
        } 

     this.getContentVideoTranscodeData(dataset);
    }, (error) => {
      console.log(error);
    })
    },
    getContentVideoTranscodeData(database=null) {
      if (!database) {
        database = this.getListAllJobTranscode
      }
      this.datasetContentVideo = database.filter((transcodeItem) => {
        if (transcodeItem.contenttype == 'CONTENT' && transcodeItem.filetype == 'VIDEO') {
           return transcodeItem;
        }
      })
    },
    actSetupTable(filterDataset) {
      this.datasetContentVideo = filterDataset.forEach((item) => {
        
        let singleItem = {};
        singleItem.processID = item.preprocessid
        singleItem.originalfilename = item.originalfilename
        singleItem.mimetype = item.mimetype
        singleItem.size = item.size
        singleItem.quality = item.quality
        singleItem.duaration = item.duration
        singleItem.report = item.report
        singleItem.status = item.status
        singleItem.created = item.starttime

       // this.datasetContentVideo.push()

      })
    },
    onPageChange (val) {
      this.currentPage = val
    },
    filterVideoContentType (item, status) {
      let localCollectItems = []
      localCollectItems = this.getListFilteredJobTranscode.filter((jobItem) => {
        if (!(jobItem.filetype == 'VIDEO' && jobItem.contenttype == 'CONTENT')) {
          return jobItem;
        }
      })
      if (status) {
        localCollectItems.push(item);
      }
      this.setListFilteredJobTranscode(localCollectItems);
    }
  },
  components: {
    MTableHeader,
    MPagination
  },
  created () {
    this.ticketReportHeader = [
      {
        type: 'sm1',
        textHeader: '#',
        filterType: false,
        valueType: 'index',
        value: 1
      },
      {
        type: 'md4',
        textHeader: 'PREPROCESS ID',
        valueType: 'column',
        value: 'preprocessid',
        filterType: 'search',
        filterData: {
          label: 'preprocess id',
          showfilter: false,
          filterName: 'idQuery',
          default: ''
        }
      },
      {
        type: 'lg5',
        textHeader: 'ORIGINALFILENAME',
        valueType: 'column',
        value: 'originalfilename',
        filterType: 'search',
        filterData: {
          label: 'originalfile name',
          showfilter: false,
          filterName: 'titleQuery',
          default: ''
        }
      },
      {
        type: 'lg1',
        textHeader: 'MIME TYPE',
        valueType: 'column',
        value: 'mimetype',
        filterType: 'dropDown',
        filterData: {
          label: 'MIME type',
          showfilter: false,
          filterName: 'MIME type',
          default: 'all',
          valueOption: [
            {text: 'All', value: 'all'},
            {text: 'video/mp4', value: 'video/mp4'},
            {text: 'image/png', value: 'image/png'}
          ]
        }
      },
      {
        type: 'md2',
        textHeader: 'SIZE',
        valueType: 'column',
        value: 'size',
      },
      {
        type: 'md1',
        textHeader: 'QUALITY',
        valueType: 'column',
        value: 'quality',
        filterType: 'dropDown',
        filterData: {
          label: 'quality',
          showfilter: false,
          filterName: 'priorityQuery',
          default: 'all',
          valueOption: [
            {text: 'All', value: 'all'},
            {text: 'SD', value: 'SD'},
            {text: 'HD', value: 'HD'}
          ]
        }
      },
      {
        type: 'md1',
        textHeader: 'DUARATION',
        valueType: 'column',
        value: 'duaration'
      },
      {
        type: "md1",
        textHeader: "REPORT",
        valueType: "column",
        value: (row, index) => {
          // console.log("dataContent", this.datasetContentVideo[index]);

          let fileList = this.datasetContentVideo[index].report
            ? JSON.parse(this.datasetContentVideo[index].report)
            : null;

          if (fileList && fileList.AUDIO && fileList.AUDIO.length) {
            fileList =
              fileList.AUDIO.length === 1
                ? `${fileList.AUDIO.length} TRACK`
                : `${fileList.AUDIO.length} TRACKS`;
          } else {
            return null;
          }

          return fileList;
        },
      },
      {
        type: 'largeColumn',
        textHeader: 'CREATE ON',
        valueType: 'dateTime',
        value: 'starttime',
        filterType: 'dateRange',
        filterData: {
          label: 'Created',
          showfilter: false,
          filterName: 'createdFromQuery',
          filterName2: 'createdToQuery',
          default: '',
          dofilter: false
        }
      },
      {
        type: 'md1',
        textHeader: 'SELECT',
        valueType: 'radio',
        value: 'preprocessid',
        name: 'age',
        radioAction: {
        radioRow: (row, status) => {
          this.filterVideoContentType(row, status)
        },
        },
      customClass: (row) => {
        console.log("row", row)
     
      }
    },
    ]
    this.getContentVideoTranscodeData();
  },
   mixins: [mVMixin]
}
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
          div {
            font-family: var(--font-medium);
          }
        }
      }
    }
  }
</style>
