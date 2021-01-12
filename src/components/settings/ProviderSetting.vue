<template>
  <div class="provider-wrapper">
    <div class="header-wrapper">
      <p class="provider-header">PROVIDER SETTINGS</p>
      <!-- <MButton primary :mButtonProperty="mButtonProperty" @on-btn-click="setModalVisible()">ADD NEW</MButton> -->
    </div>
    <div v-if="groupArr.length">
      <div class="table-div" v-for="(i, index) in groupArr" :key="index">
        <p class="group-para">{{i}}</p>
        <MTableHeader v-if="providerData[index]" tableSecondary class="table-stripped" :headerArray="providerHeader" :data="providerData[index]" :offset="offset" />
      </div>
    </div>
    <div v-else>
      <div class="table-div">
        <MTableHeader tableSecondary class="table-stripped" :headerArray="providerHeader" :data="providerData" :offset="offset" />
        <MPagination class="nw__pagination" v-if="providerData.length > 10"
        :totalPages="perPage"
        :maxVisibleButtons="perPage"
        :currentPage="currentPage"
        @pagechanged="onPageChange"
        :hidePrevious="true"/>
      </div>
    </div>
    <!-- <AddProvider :isModalVisible="isModalVisible" @changeModal="isModalVisible=$event" @providerData="provideData=$event"/> -->
    <EditProvider :isModalVisible="editModalVisible" @changeModal="editModalVisible=$event" @providerData="setUpateProvider($event)" :updateData="updateSettingArr"/>
  </div>
</template>

<script>
import { MTableHeader, MButton } from 'mobiotics-dynamic-components-vue'
import { mapActions } from 'vuex'

export default {
  name: 'ProviderSetting',
  data () {
    return {
      providerHeader: [],
      providerData: [],
      offset: 0,
      isModalVisible: false,
      provideData: {},
      provideEditData: {},
      editModalVisible: false,
      updateSettingArr: {},
      groupData: '',
      perPage: 0,
      currentPage: 1,
      providerEnv: '',
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
    MTableHeader,
    MButton,
    EditProvider: () => import('@/components/settings/EditProviderSettings.vue')
  },
  watch: {
    providerEnv () {
      this.providerList()
    }
  },
  created () {
    this.providerEnv = this.environment
    this.$eventHub.$on('environment', (state) => {
      this.providerEnv = state
    })
    this.providerList()
    this.mButtonProperty = {
      defaultProperty: {
        fontFamily: 'inherit',
        width: '125px'
      }
    }
    this.providerHeader = [
      {
        type: 'sm1',
        textHeader: '#',
        filterType: false,
        valueType: 'index',
        value: 1
      },
      {
        type: 'largeColumn',
        textHeader: 'SETTINGS ID',
        filterType: false,
        valueType: 'column',
        value: 'settingid',
        customClass: (row) => {
          if (row.settingid) {
            return 'pad-15'
          }
        }
      },
      {
        type: 'md5',
        textHeader: 'SETTINGS VALUE',
        filterType: false,
        valueType: 'column',
        value: 'settingvalue'
      },
      {
        type: 'md5',
        textHeader: 'MANDATORY',
        filterType: false,
        valueType: (row) => {
          if (row.settingvalue) {
            return 'column'
          } else {
            return 'column-tooltip'
          }
        },
        tooltipTitle: 'Please add atleast one value',
        value: 'ismandatory',
        customClass: (row) => {
          if (row.settingvalue) {
            return ''
          } else {
            return 'failed'
          }
        }
      },
      {
        type: 'md5',
        textHeader: 'DESCRIPTION',
        filterType: false,
        valueType: 'column',
        value: 'description'
      },
      {
        type: 'sm2',
        textHeader: 'ACTIONS',
        filterType: false,
        valueType: 'action',
        value: (row) => {
          if (row.settingvalue) {
            return {
              'edit': (row) => {
                this.sendUpdateData(row)
              }
            }
          } else {
            return {
              'edit-error': (row) => {
                this.sendUpdateData(row)
              }
            }
          }
        }
      }
    ]
  },
  methods: {
    ...mapActions(['listSettingList', 'updateProviderList']),
    setModalVisible () {
      this.isModalVisible = true
    },
    sendUpdateData (data) {
      this.updateSettingArr = data
      this.editModalVisible = true
    },
    setUpateProvider (data) {
      this.provideEditData = data
      let formData = {}
      formData.environment = this.providerEnv
      formData.serviceid = 'VCTRANSCODE'
      formData.providerid = this.provideEditData.providerid
      formData.settinglist = [
        {
          'settingid': this.provideEditData.settingid,
          'settingdata': this.provideEditData.provider
        }
      ]
      console.log(formData)
      this.updateProviderData(formData)
    },
    providerList () {
      let data = {}
      data.environment = this.providerEnv
      data.settingtype = 'PROVIDER'
      this.groupArr = []
      this.$eventHub.$emit('Loader', true)
      this.listSettingList(data).then((res) => {
        if (res.errorcode) {
          this.providerData = []
          this.$eventHub.$emit('Loader', false)
        } else {
          this.providerData = []
          for (let i in res.providersettinglist) {
            let found = this.groupArr.some(e1 => e1 === res.providersettinglist[i].groupid)
            if (!found) {
              this.groupArr.push(res.providersettinglist[i].groupid)
            }
          }
          for (let i in this.groupArr) {
            this.groupId = this.groupArr[i]
            this.providerGroupList()
          }
        }
      }).catch((error) => {
        this.$eventHub.$emit('Loader', false)
        if (error.status === 401) {
          console.log(error)
        }
      })
    },
    providerGroupList (page = 1) {
      this.currentPage = page
      let data = {}
      data.environment = this.providerEnv
      data.settingtype = 'PROVIDER'
      data.groupid = this.groupId
      this.$eventHub.$emit('Loader', true)
      this.listSettingList(data).then((res) => {
        if (res.errorcode === 7007) {
          this.providerData = []
        } else {
          for (let i in this.groupArr) {
            this.providerData.push(res.providersettinglist)
            console.log(i)
          }
        }
        this.perPage = []
        this.perPage = Math.ceil(this.providerData.length / 10)
        this.$eventHub.$emit('Loader', false)
      }).catch((error) => {
        this.$eventHub.$emit('Loader', false)
        if (error.status === 401) {
          console.log(error)
        }
      })
    },
    updateProviderData (data) {
      this.$eventHub.$emit('Loader', true)
      this.updateProviderList(data).then((res) => {
        if (res.success) {
          this.editModalVisible = false
          this.$eventHub.$emit('Loader', false)
          this.providerList()
        } else if (res.errorcode) {
          console.log('Error', res.reason)
        }
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
  .provider-wrapper {
    padding: 40px 30px;
    .header-wrapper {
      display: flex;
    }
    .provider-header {
      font: 1.3vw/1.7vw var(--font-bold);
      color: var(--primary-grey);
      flex: 1;
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
        min-height: unset;
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
            &.large-column {
              &.pad-15 {
                padding-right: 15px;
              }
            }
            &.m-lg-5,
            &.large-column,
            &.m-sm-2 {
              color: var(--dark-grey);
              letter-spacing: 0.2px;
            }
            &.m-lg-5 {
              width: 95vh;
            }
          }
        }
      }
    }
  }
</style>
