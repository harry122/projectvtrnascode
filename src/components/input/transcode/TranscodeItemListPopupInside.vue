<template>
      <div class="tr-single-item" >
          <div>
              <div style="font-family:var(--font-medium);text-overflow: ellipsis;white-space: nowrap;overflow: hidden;width: 190px;">
                  {{getTranscodeProcessName}}
              </div>
              <div style="opacity: 0.6; color: #303B4B; font-size:10px" >
                 {{tabNames.video}}
              </div>
          </div>
          <div style="display: flex;">
              <div style="padding: 0px 14px;" @click="editTranscode(jobinfo)">
                <edit-svg></edit-svg>
              </div>
              <div style="margin-top: -2px;" @click="deleteTranscode(jobinfo)">
                <delete-svg></delete-svg>
              </div>
          </div>
      </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  data () {
    return {
      header_data: [{name: 'VIDEO', status: 'active'}, {name: 'AUDIO', status: 'deactive'}],
      tabNames: []
    }
  },
  props: ['jobinfo'],
  computed: {
    ...mapGetters(['getListAllJobTranscode', 'getListFilteredJobTranscode', 'getIsTrancodeEnable', 'getTranscodeProcessName', 'getAllProfileList'])
  },
  methods: {
    ...mapMutations(['setListFilteredJobTranscode']),
    editTranscode(item) {
      //this.$emit('enable-popup-edit-transcode', true)
    },
    deleteTranscode(item) {
      console.log("item", item)
      let localItems = this.getListFilteredJobTranscode.filter((filterItem) => {
        if (filterItem.preprocessid != item.preprocessid) return filterItem
      })

      this.setListFilteredJobTranscode(localItems)
      
    }
  },
  components: {
    'edit-svg': () => import('@/svg/EditTranscodeSvg.vue'),
    'delete-svg': () => import('@/svg/DeleteIconSvg.vue'),
  },
  mounted () {
    let videoCount = 0;
      let audio = 0;
       this.getListFilteredJobTranscode.forEach((item) => {
        if (item.filetype === 'VIDEO') {
          videoCount++;
        }
        if (item.filetype === 'AUDIO') {
          audio++;
        }
      })
        this.tabNames =  { video: videoCount + ' ' + 'VIDEO' + ' , ' + audio + ' ' + 'AUDIO'}
         
         
       
  }
}
</script>

<style lang="scss" scoped>
    .tr-single-item {
        height: 45px;
        width: 346.53px;
        border-radius: 5px;
        background-color: #FDFDFD;
        box-shadow: 0 3px 7px 0 rgba(0,0,0,0.16);
        padding: 0px 15px;
        margin: 6px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 13px;
        width: 353.53px;
        position: relative;
        left: -8px;
        bottom: -11px;
}
</style>
