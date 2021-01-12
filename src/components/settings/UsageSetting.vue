<template>
  <div class="usage-wrapper">
    <p class="usage-header">USAGE SETTINGS</p>
    <MTableHeader tableSecondary class="table-stripped" :mTableProperty="mTableProperty" :headerArray="usageHeader" :data="usageData" :offset="offset" />
    <MPagination class="nw__pagination" v-if="usageData.length > 10"
      :totalPages="perPage"
      :maxVisibleButtons="perPage > 3 ? 3 : perPage"
      :currentPage="currentPage"
      @pagechanged="onPageChange"
      :hidePrevious="true"/>
  </div>
</template>

<script>
import { MTableHeader } from 'mobiotics-dynamic-components-vue'
import { mapActions } from 'vuex'

export default {
  name: 'UsageSetting',
  data () {
    return {
      usageHeader: [],
      usageData: [],
      offset: 0,
      currentPage: 1,
      perPage: 0,
      usageEnv: '',
      mTableProperty: {}
    }
  },
  props: {
    environment: {
      type: String
    }
  },
  components: {
    MTableHeader
  },
  watch: {
    usageEnv () {
      this.usageList()
    }
  },
  created () {
    this.usageEnv = this.environment
    this.$eventHub.$on('environment', (state) => {
      this.usageEnv = state
    })
    this.mTableProperty = {
      width: '85vw'
    }
    this.usageHeader = [
      {
        type: 'sm1',
        textHeader: '#',
        filterType: false,
        valueType: 'index',
        value: 1
      },
      {
        type: 'md5',
        textHeader: 'USAGE ID',
        filterType: false,
        valueType: 'column',
        value: 'usageid'
      },
      {
        type: 'md5',
        textHeader: 'USAGE TYPE',
        filterType: false,
        valueType: 'column',
        value: 'usagetype'
      },
      {
        type: 'md5',
        textHeader: 'USAGE PARAM',
        filterType: false,
        valueType: 'column',
        value: 'usageparam'
      },
      {
        type: 'md5',
        textHeader: 'USAGE UNIT',
        filterType: false,
        valueType: 'column',
        value: 'usageunit'
      },
      {
        type: 'md5',
        textHeader: 'USAGE LIMIT',
        filterType: false,
        valueType: 'column',
        value: 'usagelimit'
      },
      {
        type: 'md5',
        textHeader: 'DESCRIPTION',
        filterType: false,
        valueType: 'column',
        value: 'description'
      }
    ]
    // this.usageData = [
    //   {
    //     usagetype: 'SPECIFIC',
    //     usagevalue: '100K',
    //     usageunit: 'HOURS',
    //     providername: 'HOTSTAR'
    //   },
    //   {
    //     usagetype: 'GENERAL',
    //     usagevalue: '100K',
    //     usageunit: 'HOURS',
    //     providername: ''
    //   },
    //   {
    //     usagetype: 'GENERAL',
    //     usagevalue: '100K',
    //     usageunit: 'HOURS',
    //     providername: ''
    //   },
    //   {
    //     usagetype: 'SPECIFIC',
    //     usagevalue: '100K',
    //     usageunit: 'HOURS',
    //     providername: null
    //   },
    //   {
    //     usagetype: 'GENERAL',
    //     usagevalue: '100K',
    //     usageunit: 'HOURS',
    //     providername: ''
    //   },
    //   {
    //     usagetype: 'GENERAL',
    //     usagevalue: '100K',
    //     usageunit: 'HOURS',
    //     providername: ''
    //   }
    // ]
    this.usageList()
  },
  methods: {
    ...mapActions(['listSettingList']),
    onPageChange (page = '') {
      if (page) {
        this.offset = (page - 1) * 10
        this.usageList(page)
      } else {
        let page = this.currentPage
        this.usageList(page)
      }
    }
    // usageList (page = 1) {
    //   this.currentPage = page
    //   let data = {}
    //   data.environment = this.usageEnv
    //   data.settingtype = 'USAGE'
    //   this.$eventHub.$emit('Loader', true)
    //   this.listSettingList(data).then((res) => {
    //     if (res.errorcode === 7007) {
    //       this.usageData = []
    //     } else {
    //       this.usageData = res.serviceusagelist
    //     }
    //     this.perPage = []
    //     this.perPage = Math.ceil(this.usageData.length / 10)
    //     this.$eventHub.$emit('Loader', false)
    //   }).catch((error) => {
    //     this.$eventHub.$emit('Loader', false)
    //     if (error.status === 401) {
    //       console.log(error)
    //     }
    //   })
    // }
  }
}
</script>

<style scpoed lang="scss">
  .usage-wrapper {
    padding: 40px 30px;
    .usage-header {
      font: 1.3vw/1.7vw var(--font-bold);
      color: var(--primary-grey);
    }
    .table-stripped {
      .table-wrapper {
        .tablebody {
          border: 1px solid rgba(0,0,0,0.75);
          border-top: 0;
        }
        .flex-table {
          height: 60px;
          &.header {
            font-weight: inherit;
            border: 1px solid rgba(0,0,0,0.75);
            border-bottom: 0;
            div {
              font-family: var(--font-bold);
            }
          }
          div {
            &.m-sm-1 {
              color: var(--light-grey);
            }
            &.m-md-1 {
              color: var(--dark-grey);
              letter-spacing: 0.2px;
            }
          }
        }
      }
    }
  }
</style>
