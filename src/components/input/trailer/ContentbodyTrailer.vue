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
      ticketReportData: [],
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
      console.log("data====>", data)
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
       console.log("1", database)
      if (!database) {
        database = this.getListAllJobTranscode
      }
      this.datasetContentVideo = database.filter((transcodeItem) => {
        if (transcodeItem.contenttype == 'TRAILER' && transcodeItem.filetype == 'VIDEO') {
           return transcodeItem;
        }
      })
    },
    onPageChange (val) {
      this.currentPage = val
    },
    filterDataset (arr) {
      let localJobs = this.getListFilteredJobTranscode.filter((item) => {
        if (item.contenttype !== 'TRAILER') {
            return item;
        }
      });
      localJobs = [...localJobs, ...arr]
      this.setListFilteredJobTranscode(localJobs);       
    }
  },
  components: {
    MTableHeader,
    MPagination
  },
  mounted () {
    this.getContentVideoTranscodeData();
  },
  created () {
    this.ticketReportData = apidata.ticketReport
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
          filterName: 'preprocessid',
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
          label: 'originalfilename',
          showfilter: false,
          filterName: 'originalfilename',
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
        value: 'size'
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
          filterName: 'quality',
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
        type: 'md1',
        textHeader: 'REPORT',
        valueType: 'column',
        value: 'report'
      },
      {
        type: 'lg5',
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
      valueType: 'checkbox',
      value: 'id',
      checkArr: {
      checked: (checkedArr, status) => {
         console.log(checkedArr, status)
         this.filterDataset(checkedArr);
      }
    }
    }
    ]
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
