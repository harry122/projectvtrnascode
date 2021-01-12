<template>
  <div class="access-wrapper">
    <p class="access-header">ACCESS LIST</p>
    <div class="table-div">
      <p class="group-para">API ACCESS</p>
      <MTableHeader tableSecondary class="table-stripped" :headerArray="accessHeader" :data="accessDataApi" :offset="offset" />
      <MPagination class="nw__pagination" v-if="accessData.length > 10"
      :totalPages="perPage"
      :maxVisibleButtons="perPage > 3 ? 3 : perPage"
      :currentPage="currentPage"
      @pagechanged="onPageChange"
      :hidePrevious="true"/>
    </div>
    <div class="table-div">
      <p class="group-para">UI ACCESS</p>
      <MTableHeader tableSecondary class="table-stripped" :headerArray="accessHeader" :data="accessDataUi" :offset="offset" />
      <MPagination class="nw__pagination" v-if="accessData.length > 10"
      :totalPages="perPage"
      :maxVisibleButtons="perPage > 3 ? 3 : perPage"
      :currentPage="currentPage"
      @pagechanged="onPageChange"
      :hidePrevious="true"/>
    </div>
  </div>
</template>

<script>
import { MTableHeader, MPagination } from 'mobiotics-dynamic-components-vue'
import { mapActions } from 'vuex'

export default {
  name: 'AccessSetting',
  data () {
    return {
      accessHeader: [],
      accessData: [],
      offset: 0,
      accessEnv: '',
      currentPage: 1,
      perPage: 0,
      accessDataUi: [],
      accessDataApi: []
    }
  },
  props: {
    environment: {
      type: String
    }
  },
  components: {
    MTableHeader,
    MPagination
  },
  watch: {
    accessEnv () {
      this.accessList()
    }
  },
  created () {
    this.accessEnv = this.environment
    this.$eventHub.$on('environment', (state) => {
      this.accessEnv = state
    })
    this.accessList()
    this.accessHeader = [
      {
        type: 'sm1',
        textHeader: '#',
        filterType: false,
        valueType: 'index',
        value: 1
      },
      {
        type: 'md3',
        textHeader: 'ACCESS NAME',
        filterType: false,
        valueType: 'column',
        value: 'access'
      },
      {
        type: 'lg5',
        textHeader: 'SUB ACCESS',
        filterType: false,
        valueType: 'column',
        value: 'sub'
      }
    ]
    // this.accessData = [
    //   {
    //     accessname: 'ACCESS1'
    //   },
    //   {
    //     accessname: 'ACCESS2'
    //   },
    //   {
    //     accessname: 'ACCESS3'
    //   }
    // ]
  },
  methods: {
    ...mapActions(['listAccessList']),
    onPageChange (page = '') {
      if (page) {
        this.offset = (page - 1) * 10
        this.accessList(page)
      } else {
        let page = this.currentPage
        this.accessList(page)
      }
    },
    accessList (page = 1) {
      this.currentPage = page
      let data = {}
      data.environment = this.accessEnv
      this.$eventHub.$emit('Loader', true)
      this.listAccessList(data).then((res) => {
        if (res.errorcode === 7007) {
          this.accessData = []
          this.accessDataUi = []
          this.accessDataApi = []
        } else {
          this.accessData = res.access
          if (this.accessData.UI) {
            this.accessDataUi = this.accessData.UI
          } else {
            this.accessDataUi = []
          }
          if (this.accessData.API) {
            this.accessDataApi = this.accessData.API
          } else {
            this.accessDataApi = []
          }
        }
        this.perPage = []
        this.perPage = Math.ceil(this.accessData.length / 10)
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
  .access-wrapper {
    padding: 40px 30px;
    .access-header {
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
          justify-content: inherit;
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
