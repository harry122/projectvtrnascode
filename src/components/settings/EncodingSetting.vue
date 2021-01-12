<template>
  <div class="billing-wrapper">
    <div class="provider-header">
    <MPageHeader class="billing-header" :title="billingTitle" :count="billingCount" />
    <MButton primary :mButtonProperty="mButtonProperty" @on-btn-click="setModalVisible()">ADD NEW</MButton>
    </div>
    <MTableHeader tableSecondary class="table-stripped" :headerArray="billingHeader" :data="billingData" :offset="offset" />
    <MPagination class="encoding-pagination"
        :totalPages="10"
        :currentPage="currentPage"
        :hidePrevious="true"/>
  </div>
</template>

<script>
import { MTableHeader, MPageHeader, MPagination, MButton } from 'mobiotics-dynamic-components-vue'
import { mapActions } from 'vuex'
import { EventBus } from '@/event'

export default {
  name: 'billingSetting',
  data () {
    return {
      billingHeader: [],
      billingData: [],
      offset: 0,
      billingCount: 0,
      mButtonProperty: {},
      billingTitle: '',
      currentPage: 1
    }
  },
  components: {
    MTableHeader,
    MPageHeader,
    MPagination,
    MButton
  },
  mounted () {
    this.getBillingSettingData()
  },
  methods: {
    ...mapActions(['actSettingsList']),
    getBillingSettingData (val) {
      let data = {}
      if (val === 'STAGING') {
        data = {
          stage: 'STAGING'
        }
      } else {
        data = {
          stage: 'PROD'
        }
      }
      this.actSettingsList(data).then((res) => {
        if (res.succes) {
          this.billingData = res.billinglist
          console.log(this.billingData, 'res')
        } else {
          this.billingData = []
          console.log('fail')
        }
      }).catch((error) => {
        EventBus.$emit('Loader', true)
        console.log('ERRORRRRR', error)
        if (error.status === 401) {
          console.log('error ====>', error)
        }
      })
    }
  },
  created () {
    EventBus.$on('PROD', (val) => {
      console.log('event')
      this.toggleValue = val
      this.getBillingSettingData(this.toggleValue)
    })
    this.mButtonProperty = {
      defaultProperty: {
        fontFamily: 'inherit',
        width: '125px',
        marginLeft: '85.5%',
        marginTop: '-2.5%'
      }
    }
    this.billingTitle = 'ENCODING'
    this.billingHeader = [
      {
        type: 'sm2',
        textHeader: '#',
        filterType: false,
        valueType: 'index',
        value: 1
      },
      {
        type: 'md1',
        textHeader: 'ID',
        filterType: false,
        valueType: 'column',
        value: 'billingtype'
      },
      {
        type: 'md1',
        textHeader: 'TYPE',
        filterType: false,
        valueType: 'column',
        value: 'billingtype'
      },
      {
        type: 'md1',
        textHeader: 'CODEC',
        filterType: false,
        valueType: 'column',
        value: 'criteria'
      },
      {
        type: 'md1',
        textHeader: 'QUALITY',
        filterType: false,
        valueType: 'column',
        value: 'billingtype'
      },
      {
        type: 'md2',
        textHeader: 'PRESET ID',
        filterType: false,
        valueType: 'column',
        value: 'providername'
      },
      {
        type: 'md3',
        textHeader: 'PRESET DETAILS',
        filterType: false,
        valueType: 'column',
        value: 'unitamount'
      },
      {
        type: 'md1',
        textHeader: 'UPDATED',
        valueType: 'column',
        value: 'updated',
        filterType: false
      },
      {
        type: 'md1',
        textHeader: 'ACTIONS',
        filterType: false,
        valueType: 'action',
        value: {
          delete: (row) => {
            this.updateSettingArr.settingname = row.settingname
            this.updateSettingArr.settingvalue = row.settingvalue
            this.editModalVisible = true
          }
        }
      }
    ]
    // this.billingData = [
    //   {
    //     billingtype: 'SPECIFIC',
    //     criteria: 'USER',
    //     providername: 'HOTSTAR',
    //     paramname: 'EMAIL',
    //     updated: '22 JAN 2020, 12:00:00',
    //     unitamount: 99,
    //     currency: 'USD'
    //   },
    //   {
    //     billingtype: 'GENERAL',
    //     criteria: 'USAGE',
    //     providername: '',
    //     paramname: 'EMAIL',
    //     updated: '22 JAN 2020, 12:00:00',
    //     unitamount: 99,
    //     currency: 'USD'
    //   },
    //   {
    //     billingtype: 'SPECIFIC',
    //     criteria: 'USER',
    //     providername: 'HOTSTAR',
    //     paramname: 'EMAIL',
    //     updated: '22 JAN 2020, 12:00:00',
    //     unitamount: 99,
    //     currency: 'USD'
    //   },
    //   {
    //     billingtype: 'GENERAL',
    //     criteria: 'USAGE',
    //     providername: '',
    //     paramname: 'EMAIL',
    //     updated: '22 JAN 2020, 12:00:00',
    //     unitamount: 99,
    //     currency: 'USD'
    //   }
    // ]
    // this.billingCount = this.billingData.length
  }
}
</script>

<style scpoed lang="scss">
  .encoding-pagination {

    margin-left: 70%!important;
 
  }
  .billing-wrapper {
    padding: 40px 30px;
    .billing-header {
      font: 1.3vw/1.7vw var(--font-bold);
      color: var(--primary-grey);
    }
    .data-count {
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
              font-family: 'Helvetica Neue';
              font-weight: bold;
            }
          }
          div {
            &.m-sm-1 {
              color: var(--light-grey);
              width: 40px !important;
            }
            &.m-md-1 {
              margin: 0 !important;
            }
          }
        }
      }
    }
  }

 /deep/ .action-btn {
   padding: 18px;
 }
 .group-para {
      opacity: 0.5;
      color: #1A1A1A;
      font-family: 'Roboto-Regular';
      font-size: 13px;
      font-weight: bold;
      letter-spacing: 0;
      line-height: 16px;
      position: absolute;
      top: 6px;
    }
 .provider-header {
    font: 1.3vw/1.7vw var(--font-bold);
    color: var(--primary-grey);
    flex: 1;
  }
</style>
