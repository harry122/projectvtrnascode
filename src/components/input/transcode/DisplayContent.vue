<template>
  <div class="close-list-popup">
    <div  @click="closePopup()" > 
      <delete-svg class="close-list-popup-icon"></delete-svg>
    </div>  
    <div class="tr-sub-footer">
      <single-item @enable-popup-edit-transcode="actStatusPopup" v-for="(job, index) in getListFilteredJobTranscode" :key="index" :jobinfo="job"></single-item>
    </div>
    <popup-edit-transcode v-if="isPopupEditTranscode" @closePopup-transcode-editpopup="closePopupEdit" :editTranscodePayload="editTranscodePayload"></popup-edit-transcode>
</div>
</template>

<script>
import { EventBus } from '@/event';
import { mapGetters, mapMutations } from 'vuex'

export default {
  data () {
    return {
      header_data: [{name: 'VIDEO', status: 'active'}, {name: 'AUDIO', status: 'deactive'}],
      isPopupEditTranscode: false,
      isActivePopup: true,
      editTranscodePayload: []
    }
  },
  computed: {
    ...mapGetters(['getListAllJobTranscode', 'getListFilteredJobTranscode'])
  },
  methods: {
    actStatusPopup(item) {
      console.log('reached')
      this.isPopupEditTranscode = true;
      this.editTranscodePayload = item;
    },
    closePopupEdit (status) {
      this.isPopupEditTranscode = status;
    },
    closePopup() {
       EventBus.$emit("footer-transcode-item-enable", false)
    }
  },
  created() {
   
  },
  components: {
    'single-item': () => import('./SingleItem.vue'),
    'popup-edit-transcode': () => import('./PopupEditTranscode.vue'),
    'delete-svg': () => import('@/svg/DeleteIconSvg.vue'),
  }
}
</script>

<style lang="scss" scoped>
    .tr-sub-footer {
        height: 128px;
        border-radius: 7px;
        margin: 9px 8.7px;
        padding: 10px;
        display: flex;
        flex-wrap: wrap;
        overflow: auto;
    }
    .close-list-popup {
        position: fixed;
        bottom: 132px;
        background-color: white;
        margin: 0px 10px;
        width: 91%;
    }
    .close-list-popup-icon {
      position: absolute;
      right: 40px;
      top: 17px;
      cursor: pointer;
      z-index: 10;
    }
</style>
