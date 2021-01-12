<template>
  <div class="t-row settings-wrap">
    <div class="t-col-2 settings-wrapper">
      <MChildSideNav :sideNavStyle="sideNavStyle">
        <div class="login-wrapper">
          <div class="login-image">
            <img :src="headerContent.profileImage"/>
          </div>
          <p class="user-name">{{headerContent.userName}}</p>
          <p class="user-email">{{headerContent.userEmail}}</p>
          <div class="user-toggle">
            <MToggle class="toggle-status settings-toggle" :toggleCheckBox="toggleCheckBox" :leftLabel="'STAGING'" :rightLabel="'PROD'" @changetoggle="openModal()"/>
          </div>
        </div>
      </MChildSideNav>
    </div>
    <div class="t-col-10 tab-wrapper">
      <MTabMenu :tabNames="tabNames" @tabNameCB="tabSelect=$event" :tabStyle="tabStyles">
        <component :is="settingComponent" :environment="environment"></component>
      </MTabMenu>
    </div>
    <MModal v-show="modalVisible" @close="modalVisible=false" :class="['modal-wrapper setting', modalVisible ? 'show-modal': '']" :styles="modalStyle">
      <div slot="body" class="modal-body">
        <p>Are you sure to change the Environment to <span class="danger" v-if="toggleCheckBox">STAGING</span><span class="secondary" v-else>PROD</span> ?</p>
        <div class="modal-button-wrapper">
          <MButton primary :plus="false" @on-btn-click="getChangedVal()">Yes</MButton>
          <MButton secondary @on-btn-click="modalVisible=false">Not Now</MButton>
        </div>
      </div>
    </MModal>
  </div>
</template>

<script>
import { MChildSideNav, MTabMenu, MToggle, MModal, MButton } from 'mobiotics-dynamic-components-vue'

export default {
  name: 'Settings',
  data () {
    return {
      sideNavStyle: {},
      tabNames: [],
      headerContent: {},
      settingComponent: '',
      tabSelect: '',
      tabStyles: {},
      toggleCheckBox: true,
      environment: '',
      modalStyle: {},
      modalVisible: false
    }
  },
  components: {
    MChildSideNav,
    MTabMenu,
    MToggle,
    MModal,
    MButton
  },
  watch: {
    tabSelect () {
      this.getTabComponent(this.tabSelect)
    },
    environment () {
      if (this.toggleCheckBox) {
        this.environment = 'PROD'
        this.$eventHub.$emit('environment', this.environment)
      } else {
        this.environment = 'STAGING'
        this.$eventHub.$emit('environment', this.environment)
      }
    },
    modalVisible () {
      if (this.modalVisible) {
        document.documentElement.style.overflow = 'hidden'
      } else {
        document.documentElement.style.overflow = 'auto'
      }
    }
  },
  created () {
    if (this.toggleCheckBox) {
      this.environment = 'PROD'
      this.$eventHub.$emit('environment', this.environment)
    } else {
      this.environment = 'STAGING'
      this.$eventHub.$emit('environment', this.environment)
    }
    this.modalStyle = {
      width: '370px',
      height: '200px'
    }
    this.sideNavStyle = {
      width: '100%',
      borderRadius: '5px',
      margin: '12px 0',
      minWidth: 'unset',
      minHeight: 'calc(100vh + 38px)',
      height: 'calc(100% - 22px)'
    }
    this.tabStyles = {
      height: '100%',
      minHeight: '100vh'
    }
    this.headerContent = {
      userName: 'Hotstar',
      profileImage: require('@/assets/images/UserProfileImage.png'),
      userEmail: 'abc.scd@gmail.com'
    }
    this.tabNames = [
      'PROFILES',
      'ENCODINGS',
      'ACCESS',
      'PROVIDER',
      'FEATURES',
      'USAGE',
      'BILLING'
    ]
    this.tabSelect = 'PROFILES'
  },
  methods: {
    openModal () {
      this.modalVisible = true
    },
    getTabComponent (val) {
      if (val === 'ACCESS') {
        this.settingComponent = () => import('@/components/settings/AccessSetting.vue')
      } else if (val === 'PROVIDER') {
        this.settingComponent = () => import('@/components/settings/ProviderSetting.vue')
      } else if (val === 'BILLING') {
        this.settingComponent = () => import('@/components/settings/BillingSetting.vue')
      } else if (val === 'FEATURES') {
        this.settingComponent = () => import('@/components/settings/FeaturesSetting.vue')
      } else if (val === 'USAGE') {
        this.settingComponent = () => import('@/components/settings/UsageSetting.vue')
      } else if (val === 'PROFILES') {
        this.settingComponent = () => import('@/components/settings/ProfileSetting.vue')
      } else if (val === 'ENCODINGS') {
        this.settingComponent = () => import('@/components/settings/EncodingSetting.vue')
      }
      if (this.toggleCheckBox) {
        this.environment = 'PROD'
        this.$eventHub.$emit('environment', this.environment)
      } else {
        this.environment = 'STAGING'
        this.$eventHub.$emit('environment', this.environment)
      }
    },
    getChangedVal () {
      this.actLabel()
      this.modalVisible = false
    },
    actLabel () {
      this.toggleCheckBox = !this.toggleCheckBox
      if (this.toggleCheckBox) {
        this.environment = 'PROD'
        this.$eventHub.$emit('environment', this.environment)
      } else {
        this.environment = 'STAGING'
        this.$eventHub.$emit('environment', this.environment)
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .tab-wrapper {
    >>> .m-tab-init {
      .m-tab-header {
        div {
          margin-bottom: 5px;
          height: 35px;
          width: 9vw;
          align-items: center;
          font-size: 1vw;
          margin-right: 5.67px;
          transition: all 0.2s;
          font: 1.2vw/1.5vw var(--font-medium);
          color: var(--primary-grey);
          &.active {
            height: 39px;
            margin-bottom: 0;
            position: relative;
            margin-top: 1px;
            color: var(--primary-blue);
            &:before {
              position: absolute;
              content: '';
              background: var(--white);
              width: 9vw;
              height: 4px;
              display: block;
              top: 37px;
              left: 0;
            }
            &:after {
              position: absolute;
              content: '';
              background: var(--white);
              width: 5px;
              height: 4px;
              display: block;
              top: 37px;
              right: 0;
            }
          }
        }
      }
    }
  }
  .settings-wrap {
    display: flex;
    >>> .modal-wrapper {
      &.setting {
        z-index: 1009;
        opacity: 0;
        transition: opacity .15s linear;
      }
      &.show-modal {
        opacity: 1;
        .m-modal {
          transform: translate(0,0);
        }
      }
      .m-modal {
        transition: transform .3s ease-out,-webkit-transform .3s ease-out;
      }
    }
    .settings-wrapper {
      padding: 0;
      -ms-flex: 0 0 20%;
      -webkit-box-flex: 0;
      flex: 0 0 20%;
      max-width: 20%;
      .login-wrapper {
        padding-top: 50px;
        .login-image {
          display: flex;
          justify-content: center;
        }
        .user-name {
          text-align: center;
          padding: 25px 0 10px;
          font: 1.2vw/1.3vw var(--font-bold);
          color: var(--dark-grey);
        }
        .user-email {
          text-align: center;
          font: 1.1vw/1.3vw var(--font-regular);
          color: var(--dark-grey);
        }
        .user-toggle {
          display: flex;
          justify-content: center;
          margin: 45px 0;
          .settings-toggle {
            display: flex;
            justify-content: space-evenly;
            background: var(--light-yellow);
            border-radius: 34px;
            padding: 5px;
          }
          >>> .toggle-status {
            width: 170px;
            .toggle-text {
              font: 1vw/1.2vw var(--font-bold);
            }
          }
        }
      }
    }
  }
  .modal-wrapper {
    .modal-body {
      padding: 0 40px;
    }
    p {
      margin: 0 30px 20px;
      text-align: center;
      font-size: 1.1vw;
      line-height: 1.7vw;
      span {
        font-family: var(--font-medium);
        &.secondary {
          color: var(--primary-blue);
        }
        &.danger {
          color: var(--error);
        }
      }
    }
    .modal-button-wrapper {
      display: flex;
      margin: 0 auto;
      button {
        margin: 9px;
      }
    }
  }
</style>
