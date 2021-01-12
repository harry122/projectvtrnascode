<template>
  <div class="transcode-input-body">
    <MTabMenu :tabNames="tabNames" @tabNameCB="cb" :tabStyle="tabStyles">
      <!-- <content-table></content-table> -->
      <component :is="selectContentTrailer"></component>
    </MTabMenu>
    <!-- <transcode-popup v-if="isActiveTranscode" @closePopup-transcode="closeSpecPopup"></transcode-popup> -->
    <MButton  :plus="false"   primary @on-btn-click="inititedTranscode(true)" :disabled="getIsTrancodeEnable && getListFilteredJobTranscode.length ? false : true">{{getListFilteredJobTranscode.length == 0 ? '' : '(' + getListFilteredJobTranscode.length + ')'}} INITIATE TRANSCODE
</MButton>

  </div>
</template>

<script>
import {
  MTabMenu, MButton
} from 'mobiotics-dynamic-components-vue'
import { mapGetters, mapActions } from 'vuex'
import CONTENT from './ContentTable.vue'
import TRAILER from '../trailer/ContentbodyTrailer.vue'
import { EventBus } from '@/event'

export default {
  data () {
    return {
      tabNames: [],
      tabStyles: {},
      isActiveTranscode: false,
      selectContentTrailer: CONTENT,
    }
  },
  computed: {
    ...mapGetters(['getListAllJobTranscode', 'getListFilteredJobTranscode', 'getIsTrancodeEnable'])
  },
  watch: {
    getListAllJobTranscode () {
      this.getMimeTypeData();
    }
  },
  methods: {
    ...mapActions(['actInititedTranscode']),
    closeSpecPopup (status) {
      console.log('ok')
      this.isActiveTranscode = status;
    },
    cb(e) {
      console.log('ok', e)
      this.selectContentTrailer = e.includes('CONTENT') ? CONTENT : TRAILER;
    },
    getMimeTypeData () {
      let videoCount = 0;
      let trailer = 0;
       this.getListAllJobTranscode.forEach((item) => {
        if (item.contenttype === 'CONTENT' && item.filetype === 'VIDEO') {
          videoCount++;
        }
        if (item.contenttype === 'TRAILER' && item.filetype === 'VIDEO') {
          trailer++;
        }
      })
        this.tabNames = [
          'CONTENT | ' + (videoCount),
          'TRAILER | ' + (trailer)
       ]
    },
    inititedTranscode() {
      console.log("[reached transcode]")
      // this.closeSpecPopup(true);
      EventBus.$emit('event-active-transcode', true)

    }
  },
  created () {
    this.getMimeTypeData();
    this.tabStyles = {
      height: '100%',
      minHeight: '100vh'
    }
  },
  components: {
    MTabMenu,
    MButton,
    'content-table': () => import('./ContentTable.vue'),
    'transcode-popup': () => import('../transcode/PopupTranscode.vue')
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
  >>> .table-wrapper.data-table {
    height: 100vh;
  }
</style>
