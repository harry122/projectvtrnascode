<template>
  <div class="billing-wrapper">
    <MPageHeader class="billing-header" :title="billingTitle" :count="billingCount" />
    <MTableHeader tableSecondary class="table-stripped" :mTableProperty="mTableProperty" :headerArray="billingHeader" :data="billingData" :offset="offset" />
    <MPagination class="nw__pagination" v-if="billingData.length > 10"
      :totalPages="perPage"
      :maxVisibleButtons="perPage > 3 ? 3 : perPage"
      :currentPage="currentPage"
      @pagechanged="onPageChange"
      :hidePrevious="true"/>
  </div>
</template>

<script>
import { MTableHeader, MPageHeader } from 'mobiotics-dynamic-components-vue'
import { mapActions } from 'vuex'

export default {
  name: 'billingSetting',
  data () {
    return {
      billingHeader: [],
      billingData: [],
      offset: 0,
      billingCount: 0,
      billingTitle: '',
      currentPage: 1,
      perPage: 0,
      billingEnv: '',
      mTableProperty: {}
    }
  },
  props: {
    environment: {
      type: String
    }
  },
  components: {
    MTableHeader,
    MPageHeader
  },
  watch: {
    billingEnv () {
      this.billingList()
    },
    environment () {
      this.billingEnv = this.environment
    }
  },
  created () {
    this.billingTitle = 'BILL SETTINGS'
    this.billingEnv = this.environment
    this.mTableProperty = {
      width: '100vw'
    }
    this.$eventHub.$on('environment', (state) => {
      this.billingEnv = state
    })
    this.billingHeader = [
      {
        type: 'sm1',
        textHeader: '#',
        filterType: false,
        valueType: 'index',
        value: 1
      },
      {
        type: 'md1',
        textHeader: 'BILLING ID',
        filterType: 'false',
        valueType: 'column',
        value: 'billingid'
      },
      {
        type: 'md1',
        textHeader: 'BILLING TYPE',
        filterType: 'false',
        valueType: 'column',
        value: 'billingtype'
      },
      {
        type: 'md1',
        textHeader: 'CRITERIA',
        filterType: 'false',
        valueType: 'column',
        value: 'criteria'
      },
      {
        type: 'md1',
        textHeader: 'USAGE ID',
        filterType: 'false',
        valueType: 'column',
        value: 'usageid'
      },
      {
        type: 'md1',
        textHeader: 'UNIT AMOUNT',
        filterType: false,
        valueType: 'column',
        value: 'unitamount'
      },
      {
        type: 'md1',
        textHeader: 'CURRENCY',
        filterType: false,
        valueType: 'column',
        value: 'currency'
      },
      {
        type: 'md1',
        textHeader: 'DESCRIPTION',
        filterType: false,
        valueType: 'column',
        value: 'description'
      },
      {
        type: 'md1',
        textHeader: 'UPDATED',
        filterType: false,
        valueType: 'dateTime',
        value: 'updatedon'
      }
    ]
    // this.billingData = [
    //   {
    //     billingtype: 'SPECIFIC',
    //     criteria: 'USER',
    //     providername: 'HOTSTAR',
    //     paramname: 'EMAIL',
    //     unitvalue: 10,
    //     unitamount: 99,
    //     currency: 'USD'
    //   },
    //   {
    //     billingtype: 'GENERAL',
    //     criteria: 'USAGE',
    //     providername: '',
    //     paramname: 'EMAIL',
    //     unitvalue: 10,
    //     unitamount: 99,
    //     currency: 'USD'
    //   },
    //   {
    //     billingtype: 'SPECIFIC',
    //     criteria: 'USER',
    //     providername: 'HOTSTAR',
    //     paramname: 'EMAIL',
    //     unitvalue: 10,
    //     unitamount: 99,
    //     currency: 'USD'
    //   },
    //   {
    //     billingtype: 'GENERAL',
    //     criteria: 'USAGE',
    //     providername: '',
    //     paramname: 'EMAIL',
    //     unitvalue: 10,
    //     unitamount: 99,
    //     currency: 'USD'
    //   }
    // ]
    this.billingList()
    this.billingCount = this.billingData.length
  },
  methods: {
    ...mapActions(['listSettingList']),
    onPageChange (page = '') {
      if (page) {
        this.offset = (page - 1) * 10
        this.billingList(page)
      } else {
        let page = this.currentPage
        this.billingList(page)
      }
    },
    billingList (page = 1) {
      let data = {}
      data.environment = this.billingEnv
      data.settingtype = 'BILLING'
      this.currentPage = page
      this.$eventHub.$emit('Loader', true)
      this.listSettingList(data).then((res) => {
        if (res.errorcode === 7007) {
          this.billingData = []
        } else if (res.errorcode === 7005) {
          this.billingData = []
        } else {
          this.billingData = res.billinglist
        }
        this.perPage = []
        this.billingCount = this.billingData.length
        this.perPage = Math.ceil(this.billingData.length / 10)
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
  .billing-wrapper {
    padding: 40px 30px;
    .billing-header {
      font: 1.3vw/1.7vw var(--font-bold);
      color: var(--primary-grey);
    }
    /deep/ .data-count {
      font-weight: inherit;
      letter-spacing: 0.5px;
      font-family: var(--font-bold);
      .count {
        font-weight: inherit;
      }
      span {
        font-family: var(--font-bold);
      }
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
