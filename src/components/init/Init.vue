<template>
  <div class="init">
    <div v-if="showLoader" class="spinner">
      <img id="spin" src="@/assets/images/loader-blue.gif">
    </div>
    <MHeader class="header-wrap" :headerContent="headerContent" :indexHead="false"/>
    <Container />
    <div class="help-container">?</div>
    <MFooter class="footer" :leftFooterContent="leftFooterContent" :rightFooterContent="rightFooterContent"/>
  </div>
</template>

<script>
import {MHeader, MFooter} from 'mobiotics-dynamic-components-vue'
import { EventBus } from '@/event'
export default {
  name: 'init',
  data () {
    return {
      showLoader: false,
      headerContent: {},
      leftFooterContent: []
    }
  },
  components: {
    MHeader,
    MFooter,
    Container: () => import('@/components/container/Container.vue')
  },
  created () {
    this.$eventHub.$on('Loader', (state) => {
      this.showLoader = state
    })
    EventBus.$on('Loader', (state) => {
      this.showLoader = state
    })
    this.headerContent = {
      companyLogo: require('@/assets/images/Vdrmlogo-vauth.svg'),
      serviceLogo: require('@/assets/images/Vdrmlogo-vauth.svg'),
      providerLogo: require('@/assets/images/Providerlogo.png'),
      routeName: 'VCRM',
      userName: 'Hotstar.india',
      profileLogo: require('@/assets/images/UserProfilepic.png'),
      dark: false,
      profileImage: require('@/assets/images/UserProfileImage.png'),
      userEmail: 'abc.scd@gmail.com',
      userRole: 'Master'
    }
    this.leftFooterContent = [
      {
        name: '© 2020 Mobiotics'
      },
      {
        name: 'User Guide'
      },
      {
        name: 'Terms & Conditions'
      }
    ]
    this.rightFooterContent = [
      {
        name: 'Version 1.1'
      }
    ]
  }
}
</script>

<style lang="scss" scoped>
  * {
    box-sizing: border-box;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  }
  #spin{
    z-index: 10;
    position: absolute;
    margin: -2.5em 0 0 -2.5em;
    top: 50%;
    left: 50%;
  }
  .spinner {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 1074;
  }
  .footer {
    z-index: 100 !important;
  }
  .help-container {
    height: 40px;
    width: 40px;
    background: var(--primary-blue);
    border-radius: 50%;
    position: fixed;
    bottom: 32px;
    left: 9%;
    color: var(--white);
    z-index: 102;
    display: flex;
    justify-content: center;
    align-items: center;
    font: 1.6vw/1.7vw var(--font-medium);
  }
  >>> .main-logo {
    margin-left: 10px;
    height: 37px !important;
  }
  >>> .company-logo {
    height: 24px;
  }
</style>
