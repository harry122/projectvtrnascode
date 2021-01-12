<template>
  <div class="feature-wrapper">
    <p class="feature-header">FEATURES</p>
    <div v-if="groupArr.length">
      <div class="table-div" v-for="(i, index) in groupArr" :key="index">
        <p class="group-para">{{i}}</p>
        <MTableHeader v-if="featureData[index]" tableSecondary class="table-stripped" :headerArray="featureHeader" :data="featureData[index]" :offset="offset" />
        <MPagination class="nw__pagination" v-if="featureData.length > 10"
          :totalPages="perPage"
          :maxVisibleButtons="perPage > 3 ? 3 : perPage"
          :currentPage="currentPage"
          @pagechanged="onPageChange"
          :hidePrevious="true"/>
      </div>
    </div>
    <div v-else>
      <div class="table-div">
        <MTableHeader tableSecondary class="table-stripped" :headerArray="featureHeader" :data="featureData" :offset="offset" />
        <MPagination class="nw__pagination" v-if="featureData.length > 10"
          :totalPages="perPage"
          :maxVisibleButtons="perPage"
          :currentPage="currentPage"
          @pagechanged="onPageChange"
          :hidePrevious="true"/>
      </div>
    </div>
  </div>
</template>

<script>
import { MTableHeader } from 'mobiotics-dynamic-components-vue'
import { mapActions } from 'vuex'

export default {
  name: 'FeatureSetting',
  data () {
    return {
      featureHeader: [],
      featureData: [],
      offset: 0,
      perPage: 0,
      currentPage: 1,
      featureEnv: '',
      groupArr: [],
      groupId: ''
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
    featureEnv () {
      this.featureList()
    }
  },
  created () {
    this.featureEnv = this.environment
    this.$eventHub.$on('environment', (state) => {
      this.featureEnv = state
    })
    this.featureHeader = [
      {
        type: 'sm1',
        textHeader: '#',
        filterType: false,
        valueType: 'index',
        value: 1
      },
      {
        type: 'lg5',
        textHeader: 'FEATURE ID',
        filterType: false,
        valueType: 'column',
        value: 'idfeature'
      },
      {
        type: 'md2',
        textHeader: 'DEFAULT STATUS',
        filterType: false,
        valueType: 'column',
        value: 'featurestatus'
      },
      {
        type: 'md1',
        textHeader: 'DESCRIPTION',
        filterType: false,
        valueType: 'column',
        value: 'description'
      }
    ]
    // this.featureData = [
    //   {
    //     featurename: 'FEATURE 1'
    //   },
    //   {
    //     featurename: 'FEATURE 2'
    //   },
    //   {
    //     featurename: 'FEATURE 3'
    //   }
    // ]
    this.featureList()
  },
  methods: {
    ...mapActions(['listSettingList']),
    onPageChange (page = '') {
      if (page) {
        this.offset = (page - 1) * 10
        this.featureList(page)
      } else {
        let page = this.currentPage
        this.featureList(page)
      }
    },
    featureList (page = 1) {
      console.log('enter')
      this.currentPage = page
      let data = {}
      data.environment = this.featureEnv
      data.settingtype = 'FEATURE'
      this.groupArr = []
      this.$eventHub.$emit('Loader', true)
      this.listSettingList(data).then((res) => {
        if (res.errorcode === 7007) {
          this.featureData = []
          this.$eventHub.$emit('Loader', false)
        } else {
          for (let i in res.featurelist) {
            let found = this.groupArr.some(e1 => e1 === res.featurelist[i].groupid)
            if (!found) {
              this.groupArr.push(res.featurelist[i].groupid)
            }
          }
          for (let i in this.groupArr) {
            this.groupId = this.groupArr[i]
            this.featureGroupList()
          }
        }
        this.perPage = []
        this.perPage = Math.ceil(this.featureData.length / 10)
      }).catch((error) => {
        this.$eventHub.$emit('Loader', false)
        if (error.status === 401) {
          console.log(error)
        }
      })
    },
    featureGroupList (page = 1) {
      this.currentPage = page
      let data = {}
      data.environment = this.featureEnv
      data.settingtype = 'FEATURE'
      data.groupid = this.groupId
      this.$eventHub.$emit('Loader', true)
      this.listSettingList(data).then((res) => {
        if (res.errorcode === 7007) {
          this.featureData = []
        } else {
          for (let i in this.groupArr) {
            this.featureData.push(res.featurelist)
            console.log(i)
          }
        }
        this.perPage = []
        this.perPage = Math.ceil(this.featureData.length / 10)
        this.$eventHub.$emit('Loader', false)
      }).catch((error) => {
        this.$eventHub.$emit('Loader', false)
        if (error.status === 401) {
          console.log(error)
        }
      })
    }
  }
}
</script>

<style scpoed lang="scss">
  .feature-wrapper {
    padding: 40px 30px;
    .feature-header {
      font: 1.3vw/1.7vw var(--font-bold);
      color: var(--primary-grey);
    }
    .table-div {
      position: relative;
      padding: 40px 0 15px;
    }
    .group-para {
      color: var(--light-grey);
      font: 1vw/1vw var(--font-bold);
      position: absolute;
      top: 30px;
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
            &.m-md-1,
            &.m-lg-5 {
              color: var(--dark-grey);
              letter-spacing: 0.2px;
            }
            &.m-lg-5,
            &.m-md-2 {
              flex: 1;
            }
          }
        }
      }
    }
  }
</style>
