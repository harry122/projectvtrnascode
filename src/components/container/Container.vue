<template>
  <div class="main-container">
    <div class="sidenav" v-if="sidebarVisible">
      <MSidebar :icons="sidebaricons" :mSidebarProperty="mSidebarProperty" />
    </div>
    <div class="routerview">
      <router-view class="content-route"></router-view>
    </div>
  </div>
</template>

<script>
import dashboardsvg from '@/svg/DashboardSvg.vue'
import inputsvg from '@/svg/InputSvg.vue'
import outputsvg from '@/svg/OutputSvg.vue'
import processsvg from '@/svg/ProcessSvg.vue'
import reportssvg from '@/svg/ReportsSvg.vue'
import settingssvg from '@/svg/SettingsSvg.vue'
import { MSidebar } from 'mobiotics-dynamic-components-vue'

export default {
  name: 'Container',
  data () {
    return {
      sidebarVisible: true,
      sidebaricons: [],
      mSidebarProperty: {}
    }
  },
  components: {
    MSidebar
  },
  created () {
    this.feedArray()
    this.mSidebarProperty = {
      subMenuProperty: {
        display: 'none'
      },
      subMenuHoverProperty: {
        display: 'none!important'
      },
      defaultProperty: {
        minHeight: '660px'
      }
    }
  },
  methods: {
    feedArray () {
      this.sidebaricons = [
        {
          svg: dashboardsvg,
          route: {name: 'Dashboard'},
          fillColor: '#A1A1A1',
          path: '/dashboard'
        },
        {
          svg: inputsvg,
          route: {name: 'Input'},
          fillColor: '#A1A1A1',
          path: '/input'
        },
        {
          svg: outputsvg,
          route: {name: 'Output'},
          fillColor: '#A1A1A1',
          path: '/output'
        },
        {
          svg: processsvg,
          route: {name: 'Process'},
          fillColor: '#A1A1A1',
          path: '/process'
        },
        {
          svg: reportssvg,
          route: {name: 'Reports'},
          fillColor: '#A1A1A1',
          path: '/reports'
        },
        {
          svg: settingssvg,
          route: {name: 'Settings'},
          fillColor: '#A1A1A1',
          path: '/settings'
        }
      ]
    }
  }
}
</script>

<style scoped lang="scss">
  .main-container{
    width: 100%;
    height: 100%;
    display: flex;
    background: #E7E7E7;
    .sidenav{
      height: auto;
      width: 6%;
      z-index: 1;
      display: block;
        /deep/ #mainMenu {
        width: 100%;
        #sidemenu {
          .ul_style {
            .li_style {
              margin: 20px 0;
            }
          }
        }
      }
    }
    .routerview {
      width: 94%;
      margin-bottom: 68px;
      height: 100%;
      .content-route {
        padding-left: 10px;
        padding-right: 10px;
        margin-top: 1%;
      }
    }
  }
</style>
