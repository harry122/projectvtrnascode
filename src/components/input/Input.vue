<template>
  <div>
    <transcode-popup v-if="isActiveTranscode" @closePopup-transcode="closeSpecPopup"></transcode-popup>

    <input-transcode-header :header_data="header_data" @tab-callback="actTabNameCB"></input-transcode-header>
    <component :is="inputType"></component>
    <input-transcode-footer @event-addToTranscode="actTranscode" @event-actPreprocess="actpreprocss"></input-transcode-footer>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapGetters } from 'vuex'
import audioSvg from '@/svg/AudioSvg.vue'
import videoSvg from '@/svg/VideoSvg.vue'

import VIDEO from '@/components/input/content/ContentBody.vue';
import AUDIO from '@/components/input/audio/Init.vue';
import { EventBus } from '@/event'


export default {
  data () {
    return {
      header_data: [{name: 'VIDEO', status: 'active', com: videoSvg}, {name: 'AUDIO', status: 'deactive', com: audioSvg}],
      inputType: 'VIDEO',
      isActiveTranscode: false
    }
  },
  computed: {
    ...mapGetters(['getAllProfileList'])
  },
  methods: {
    ...mapMutations(['setSelectedTranscodeItem', 'setListFilteredJobTranscode', 'setIsTrancodeEnable', 'setAllProfileList']),
      ...mapActions(['actInititedTranscode', 'listProfileList']),
    closeSpecPopup (status) {
      this.isActiveTranscode = status;
    },
    actTabNameCB (name) {
      this.inputType = name === 'VIDEO' ? VIDEO : AUDIO;
    },
    actpreprocss (status) {
      console.log("status>>",status)
    },
    actTranscode () {
      console.log("[transcode]");
      this.setIsTrancodeEnable(true)
    },
    getALlProfiles () {
      let data = {
        profiletype: '',
        profilestatus: '',
        profileid: '',
        preprocessstatus: 'active'
      }
      let payload = []
      this.listProfileList(data).then((response) => {
        for (let i in response.data) {
          payload.push({
            name: response.data[i].transcodingprofileid,
            id: JSON.parse(i)
          })
        }
        this.setAllProfileList(payload)
      })
    }
  },
  created () {
    this.inputType = VIDEO;
    this.setListFilteredJobTranscode([]);
    this.getALlProfiles();
    EventBus.$on('event-active-transcode', (status) => {
      this.closeSpecPopup(status);
    })
  },
  components: {
    'input-transcode-header': () => import('@/components/input/header/Init.vue'),
    'input-transcode-footer': () => import('@/components/input/transcode/Transcode-Init.vue'),
    'input-transcode-audio': () => import('@/components/input/audio/Init.vue'),
     'transcode-popup': () => import('@/components/input/transcode/PopupTranscode.vue')
  }
}
</script>

<style>

</style>
