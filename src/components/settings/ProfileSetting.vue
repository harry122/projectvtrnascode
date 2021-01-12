<template>
  <div class="profile-wrapper">
    <p class="danger-text">Do not add/edit profile settings, unless you are sure.!</p>
    <div class="header-wrapper">
      <MPageHeader class="profile-header" :title="profileTitle" :count="profileCount" />
      <MButton primary :mButtonProperty="mButtonProperty" @on-btn-click="setModalVisible()">ADD NEW</MButton>
    </div>
    <MTableHeader tableSecondary class="table-stripped" :mTableProperty="mTableProperty" :headerArray="profileHeader" :data="profileData" @filters="getFilterData($event)" :offset="offset" />
    <MPagination class='tw__pagination' v-if="profileCount>10"
      :totalPages='perPage'
      :maxVisibleButtons="perPage > 3 ? 3: perPage"
      :currentPage='currentPage'
      @pagechanged='onPageChange'
      :hidePrevious='true'/>
    <AddProfile :isModalVisible="isModalVisible" @changeModal="isModalVisible=$event" @profileData="addProfile($event)" />
    <UpdateProfile :isUpdateVisible="isUpdateVisible" @changeModal="isUpdateVisible=$event" />
    <EditDefault :isEditVisible="isRadioVisible" @changeModal="isRadioVisible=$event" :defaultRow="defaultRow" @changeDefault="changeDefaultProfile($event)"/>
    <DeleteProfile :isDeleteVisible="isDeleteVisible" @changeModal="isDeleteVisible=$event" :deleteRow="deleteRow" />
  </div>
</template>

<script>
import { MTableHeader, MPageHeader, MButton, MPagination } from 'mobiotics-dynamic-components-vue'
import { mapActions } from 'vuex'

export default {
  name: 'ProfileSetting',
  data () {
    return {
      profileHeader: [],
      profileData: [],
      offset: 0,
      profileTitle: '',
      profileCount: 0,
      isModalVisible: false,
      mButtonProperty: {},
      isDeleteVisible: false,
      isUpdateVisible: false,
      mTableProperty: {},
      deleteRow: '',
      currentPage: 0,
      perPage: 0,
      profileFilter: {},
      isRadioVisible: false,
      defaultRow: '',
      defaultArr: {},
    }
  },
  components: {
    MTableHeader,
    MPageHeader,
    MButton,
    MPagination,
    AddProfile: () => import('@/components/settings/AddProfile.vue'),
    UpdateProfile: () => import('@/components/settings/UpdateProfile.vue'),
    DeleteProfile: () => import('@/components/settings/DeleteProfile.vue'),
    EditDefault: () => import('@/components/settings/EditDefault.vue')
  },
  created () {
    this.profileTitle = 'PROFILES'
    this.profileFilter = {
      'profiletype': '',
      'profilestatus': '',
      'profileid': ''
    }
    this.profileList()
    this.mButtonProperty = {
      defaultProperty: {
        fontFamily: 'inherit',
        width: '125px'
      }
    }
    // this.profileData = apidata.profiles
    this.mTableProperty = {
      width: '90vw'
    }
    this.profileHeader = [
      {
        type: 'sm1',
        textHeader: '#',
        filterType: false,
        valueType: 'index',
        value: 1
      },
      {
        type: 'md1',
        textHeader: 'ID',
        filterType: 'search',
        valueType: 'column',
        value: 'transcodingprofileid',
        filterData: {
          label: 'Profile Id',
          showfilter: false,
          filterName: 'idQuery',
          default: ''
        }
      },
      {
        type: 'sm2',
        textHeader: 'TYPE',
        filterType: 'dropDown',
        valueType: 'column',
        value: 'profiletype',
        filterData: {
          label: 'Profile Type',
          showfilter: false,
          filterName: 'typeQuery',
          default: 'all',
          valueOption: [
            {text: 'All', value: 'all'},
            {text: 'Audio', value: 'audio'},
            {text: 'Video', value: 'video'},
            {text: 'Audio_Video', value: 'audio_video'}
          ]
        }
      },
      {
        type: 'md1',
        textHeader: 'ENCODING LIST',
        filterType: 'dropDown',
        valueType: 'column',
        value: ['encoding', 'encodingid'],
        filterData: {
          label: 'Encoding List',
          showfilter: false,
          filterName: 'encodingQuery',
          default: 'all',
          valueOption: [
            {text: 'All', value: 'all'},
            {text: 'HD', value: 'hd'},
            {text: 'SD', value: 'sd'},
            {text: 'K', value: 'k'}
          ]
        }
      },
      {
        type: 'sm3',
        textHeader: 'STATUS',
        filterType: 'dropDown',
        valueType: 'toggleButton',
        value: 'profilestatus',
        activeValue: 'ACTIVE',
        inactiveValue: 'INACTIVE',
        toggleAction: {
          toggle: (row) => {
            this.updateProfileStatus(row)
          }
        },
        filterData: {
          label: 'Profile Status',
          showfilter: false,
          filterName: 'statusQuery',
          default: 'all',
          valueOption: [
            {text: 'All', value: 'all'},
            {text: 'Active', value: 'active'},
            {text: 'InActive', value: 'inactive'}
          ]
        },
        customClass: (row) => {
          if (row) {
            if (row.isdefault.toLowerCase() === 'no' && row.profilestatus.toLowerCase() === 'inactive') {
              return 'do-click'
            } else if (row.isdefault.toLowerCase() === 'yes' && row.profilestatus.toLowerCase() === 'active') {
              return 'no-click config toggle'
            } else {
              return 'do-click'
            }
          }
        }
      },
      {
        type: 'text',
        textHeader: 'WATERMARK',
        filterType: 'dropDown',
        valueType: 'column',
        value: (row, index) => {
          if (this.profileData[index].watermarkdetails) {
            return 'YES'
          } else {
            return 'NO'
          }
        },
        filterData: {
          label: 'Watermark',
          showfilter: false,
          filterName: 'watermarkQuery',
          default: 'all',
          valueOption: [
            {text: 'All', value: 'all'},
            {text: 'Yes', value: 'yes'},
            {text: 'No', value: 'no'}
          ]
        }
      },
      {
        type: 'text',
        textHeader: 'TRAILERS',
        filterType: 'dropDown',
        valueType: 'column',
        value: (row, index) => {
          if (this.profileData[index].trailerdetails) {
            let val = []
            for (let i in this.profileData[index].trailerdetails) {
              val.push(Object.values(this.profileData[index].trailerdetails[i]).join(', '))
            }
            return val.join(', ')
          } else {
            return ''
          }
        },
        filterData: {
          label: 'Trailers',
          showfilter: false,
          filterName: 'trailerQuery',
          default: 'all',
          valueOption: [
            {text: 'All', value: 'all'},
            {text: 'Audio', value: 'audio'},
            {text: 'Video', value: 'video'}
          ]
        }
      },
      {
        type: 'text',
        textHeader: 'POSTERS',
        filterType: 'dropDown',
        valueType: 'column',
        value: (row, index) => {
          if (this.profileData[index].posterdetails) {
            let val = []
            for (let i in this.profileData[index].posterdetails) {
              val.push(Object.values(this.profileData[index].posterdetails[i]).join(', '))
            }
            return val.join(', ')
          } else {
            return ''
          }
        },
        filterData: {
          label: 'Posters',
          showfilter: false,
          filterName: 'posterQuery',
          default: 'all',
          valueOption: [
            {text: 'All', value: 'all'},
            {text: 'Audio', value: 'audio'},
            {text: 'Video', value: 'video'}
          ]
        }
      },
      {
        type: 'sm2',
        textHeader: 'DEFAULT',
        filterType: false,
        valueType: 'radio',
        value: 'isdefault',
        radioAction: {
          radioRow: (row, val) => {
            this.setRadioVisible(row, val)
          }
        },
        customClass: (row) => {
          if (row) {
            if (row.isdefault.toLowerCase() === 'no' && row.profilestatus.toLowerCase() === 'inactive') {
              return 'no-click config'
            } else if (row.isdefault.toLowerCase() === 'yes' && row.profilestatus.toLowerCase() === 'active') {
              return 'no-click'
            } else {
              return 'do-click'
            }
          }
        }
      },
      {
        type: 'sm2',
        textHeader: 'ACTIONS',
        filterType: false,
        valueType: 'action',
        value: {
          edit: (row) => {
            this.updateProfile(row)
          }
          // delete1: (row) => {
          //   this.deleteProfile(row)
          // }
        }
      }
    ]
  },
  methods: {
    ...mapActions(['listProfileList', 'updateProfileList', 'addProfileList']),
    onPageChange (page = '') {
      if (page) {
        this.offset = (page - 1) * 10
        this.profileList(page)
      } else {
        let page = this.currentPage
        this.profileList(page)
      }
    },
    changeDefaultProfile (val) {
      let formData = {
        bodyData: {
          'defaultprofile': 'YES'
        }
      }
      formData.id = val
      this.updateProfileSetting(formData)
    },
    updateProfileStatus (val) {
      let formData = {}
      if (val.profilestatus.toLowerCase() === 'active') {
        formData = {
          bodyData: {
            'profilestatus': 'ACTIVE'
          }
        }
      } else if (val.profilestatus.toLowerCase() === 'inactive') {
        formData = {
          bodyData: {
            'profilestatus': 'INACTIVE'
          }
        }
      }
      formData.id = val.transcodingprofileid
      this.updateProfileSetting(formData)
    },
    addProfile (data) {
      this.addProfileSetting(data)
    },
    addProfileSetting (data) {
      this.$eventHub.$emit('Loader', true)
      this.addProfileList(data).then((res) => {
        if (res.success) {
          this.isModalVisible = false
          this.$eventHub.$emit('Loader', false)
          this.profileList()
        } else if (res.errorcode) {
          console.log('Error', res.reason)
        }
      }).catch((error) => {
        this.$eventHub.$emit('Loader', false)
        if (error.status === 401) {
          console.log(error)
        }
      })
    },
    updateProfileSetting (data) {
      this.$eventHub.$emit('Loader', true)
      this.updateProfileList(data).then((res) => {
        if (res.success) {
          this.isRadioVisible = false
          this.$eventHub.$emit('Loader', false)
          this.profileList()
        } else if (res.errorcode) {
          console.log('Error', res.reason)
        }
      }).catch((error) => {
        this.$eventHub.$emit('Loader', false)
        if (error.status === 401) {
          console.log(error)
        }
      })
    },
    setRadioVisible (row, val) {
      this.isRadioVisible = true
      this.defaultArr = row
      this.defaultRow = row.transcodingprofileid
    },
    updateProfile (data) {
      this.isUpdateVisible = true
    },
    getFilterData (data) {
      console.log(data)
      this.profileFilter.profileid = data.transcodingprofileid
      this.profileFilter.profilestatus = data.profilestatus
      this.profileFilter.profiletype = data.profiletype
      this.profileList()
    },
    profileList (page = 1) {
      this.currentPage = page
      let data = {
        profiletype: this.profileFilter.profiletype,
        profilestatus: this.profileFilter.profilestatus,
        profileid: this.profileFilter.profileid,
        pagesize: 10,
        page: page
      }
      this.$eventHub.$emit('Loader', true)
      this.listProfileList(data).then((res) => {
        if (res.errorcode === 2001) {
          this.profileData = []
          this.profileCount = 0
        } else if (res.totalcount) {
          if (res.totalcount <= 10) {
            this.currentPage = 1
          }
          this.profileData = res.data
          this.profileCount = res.totalcount
        }
        this.perPage = []
        this.perPage = Math.ceil(this.profileCount / 10)
        this.$eventHub.$emit('Loader', false)
      }).catch((error) => {
        this.$eventHub.$emit('Loader', false)
        if (error.status === 401) {
          console.log(error)
        }
      })
    },
    deleteProfile (data) {
      console.log(data)
      this.deleteRow = data.transcodingprofileid
      this.isDeleteVisible = true
    },
    setModalVisible () {
      this.isModalVisible = true
    }
  }
}
</script>

<style scpoed lang="scss">
  .profile-wrapper {
    padding: 40px 30px;
    .danger-text {
      color: var(--primary-red);
      font: 1vw/1.2vw var(--font-italic);
      padding: 6px 0 29px;
    }
    .tw__pagination {
      display: flex;
      justify-content: flex-end;
      width: 100%;
      padding: 10px 0 0;
    }
    .header-wrapper {
      display: flex;
    }
    .profile-header {
      font: 1.3vw/1.7vw var(--font-bold);
      color: var(--primary-grey);
      flex: 1;
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
          border-right-width: 1.5px;
          border-top: 0;
        }
        .flex-table {
          height: 60px;
          &.header {
            font-weight: inherit;
            border: 1px solid rgba(0,0,0,0.75);
            border-right-width: 1.5px;
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
            .action-btn {
              padding: 5px;
            }
            .checkmark {
              z-index: unset;
            }
            &.do-click {
              .checkmark {
                color: var(--white) !important;
                border-color: rgb(208, 211, 215) !important;
                &:hover {
                  border-color: var(--primary-blue) !important;
                }
              }
            }
             &.no-click {
              pointer-events: none;
              &.config {
                opacity: 0.5;
                &.toggle {
                  .toggle-text {
                    color: var(--primary-grey) !important;
                    opacity: 0.5;
                  }
                  .slider {
                    background: var(--primary-grey) !important;
                    opacity: 0.5;
                    &:before {
                      border-color: var(--primary-grey) !important;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
</style>
