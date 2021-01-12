<template>
  <div class="transcode-input-body">
    <MTabMenu :tabNames="tabNames" @tabNameCB="tabSelect=$event" :tabStyle="tabStyles">
      <content-table></content-table>
    </MTabMenu>
   <MButton  :plus="false"   primary @on-btn-click="initTranscode(true)" :disabled="getIsTrancodeEnable && getListFilteredJobTranscode.length ? false : true">{{getListFilteredJobTranscode.length == 0 ? '' : '(' + getListFilteredJobTranscode.length + ')'}} INITIATE TRANSCODE
</MButton>  
</div>
</template>

<script>
import {
  MTabMenu, MButton
} from 'mobiotics-dynamic-components-vue'
import { mapGetters } from 'vuex'
import { EventBus } from '@/event'

export default {
  data () {
    return {
      tabNames: [],
      tabStyles: {},
      isActiveTranscode: false
    }
  },
  computed: {
    ...mapGetters(['getListAllJobTranscode','getSelectedTranscodeItem', 'getListFilteredJobTranscode', 'getIsTrancodeEnable'])
  },
  methods: {
    closeSpecPopup (status) {
      console.log('ok')
      this.isActiveTranscode = status;
    },
    initTranscode () {
        EventBus.$emit('event-active-transcode', true)
    }
  },
  created () {
    let audio = 0;
    this.getListAllJobTranscode.forEach((item) => {
      if (item.contenttype === 'CONTENT' && item.filetype === 'AUDIO') {
        audio++;
      }
    })
    this.tabNames = [
      'AUDIO | '+ audio
    ]
    this.tabStyles = {
      height: '100%',
      minHeight: '100vh',
    }

  },
  components: {
    MTabMenu,
    MButton,
    'content-table': () => import('./ContentTableAudio.vue'),
  }
}
</script>

<style lang="scss" scoped>
  .transcode-input-body {
    margin-top: 50px;
    position: relative;
  }
  /deep/ .m-button {
    position: absolute;
    top: 0;
    right: 18px;
    font-family: 'Helvetica Neue Medium';
    width: 180px !important;
  }
  /deep/ .m-tab-init .m-tab-header div {
    height: 36px;
    padding: 10px 29px;
    font-family: 'Helvetica Neue Medium';
  }
   /deep/ .m-tab-init .m-tab-header .active {
    height: 39px;
  }
  >>> .m-tab-init .m-tab-header .active {
    color: #EA9432 !important;
  }

</style>
