<template>
      <div class="tr-single-item" :style="cssVars" >
          <div>
              <div style="font-family:var(--font-medium);text-overflow: ellipsis;white-space: nowrap;overflow: hidden;width: 190px;">
                  {{jobinfo.originalfilename || jobinfo.filename }}
              </div>
              <div style="opacity: 0.6; color: #303B4B; font-size:10px" >
                  {{jobinfo.filetype}}
              </div>
          </div>
          <div style="display: flex;">
            <div style="opacity: 0.6; color: #303B4B; font-size:10px;font-family:var(--font-medium)">
                2 TRACKS
            </div>

              <div style="padding: 0px 14px; cursor: pointer;" @click="editTranscode(jobinfo)">
                <edit-svg></edit-svg>
              </div>
              <div style="margin-top: -2px; cursor: pointer;" @click="deleteTranscode(jobinfo)">
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
      bgColor: ''
    }
  },
  props: ['jobinfo'],
  mounted(){
      console.log("Jobinfo",this.jobinfo)
  },
  computed: {
    ...mapGetters(['getListAllJobTranscode', 'getListFilteredJobTranscode']),
   cssVars() {
      return {
        '--bg-color': this.bgColor
      }
    }
  },
  methods: {
    ...mapMutations(['setListFilteredJobTranscode']),
    editTranscode(item) {
      this.$emit('enable-popup-edit-transcode', item)
    },
    deleteTranscode(item) {
      console.log("item", item)
      let localItems = this.getListFilteredJobTranscode.filter((filterItem) => {
        if (filterItem.preprocessid != item.preprocessid) return filterItem
      })

      this.setListFilteredJobTranscode(localItems)
      
    },
  },
  components: {
    'edit-svg': () => import('@/svg/EditTranscodeSvg.vue'),
    'delete-svg': () => import('@/svg/DeleteIconSvg.vue'),
    'popup-edit-transcode': () => import('./PopupEditTranscode.vue'),

  },
  created () {
    if (this.jobinfo.filetype === 'VIDEO') {
      this.bgColor = '#3286EA'
    } else {
      this.bgColor = '#EA9432'
    }
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
        position: relative;
        margin: 6px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 13px;
        &:before {
            content: ' ';
            border-radius: 5px 0 0 5px;
            background-color: var(--bg-color);
            padding: 22px 3px;
            position: absolute;
            left: 0px;
            top: 0;
        }
}
</style>
