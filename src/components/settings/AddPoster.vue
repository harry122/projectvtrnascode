<template>
  <div class="poster-div vtrans-card vtrans-short">
    <div class="close" @click="closePoster">
      <svg width="8px" height="7px" viewBox="0 0 12 12" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <title>Close</title>
        <desc>Created with sketchtool.</desc>
        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="01vCRM/Provider/Tickets/Update/addcomment" transform="translate(-1324.000000, -243.000000)" fill="#A7B1C6">
                <g id="popup-copy-3" transform="translate(944.000000, 224.000000)">
                    <g id="Ic_close_m" transform="translate(374.003580, 13.496062)">
                        <g id="ic_close" transform="translate(5.218281, 5.218281)">
                            <path d="M11.5593866,0.889763621 L11.5966155,0.928423079 C11.9923755,1.33924041 11.9923755,2.00542904 11.596688,2.41632171 L7.82539314,6.33159412 L11.596688,10.2468665 C11.9659964,10.6303664 11.9906169,11.2362573 11.6704907,11.6493481 L11.5966155,11.7347652 L11.5593866,11.7734246 C11.1900782,12.1569244 10.6066083,12.1824911 10.2087451,11.8501246 L10.1264753,11.7734246 L6.32939421,7.83043265 L2.53779324,11.7677339 C2.16848487,12.1512337 1.58501496,12.1768004 1.18715173,11.8444339 L1.10488193,11.7677339 L1.0665093,11.7278868 C0.697618092,11.3448201 0.672579523,10.7397565 0.991711975,10.3265575 L1.06536554,10.2411024 L4.84923963,6.33159412 L1.06536554,2.42208585 C0.670756935,2.01100209 0.67126872,1.34573003 1.0665093,0.935301495 L1.10488193,0.895454322 C1.50056946,0.484561657 2.14210571,0.484561657 2.53779324,0.895454322 L6.32939421,4.83275559 L10.1264753,0.889763621 C10.5221628,0.478870956 11.1636991,0.478870956 11.5593866,0.889763621 Z" id="Path"></path>
                        </g>
                    </g>
                </g>
            </g>
        </g>
      </svg>
    </div>
    <div class="poster-body">
      <div class="poster-header">
        POSTER
      </div>
      <div class="body t-flex-wrapper">
        <div class="form-group">
          <form class="t-flex-wrapper">
            <div class="form-container prefix">
              <div class="t-form-group haserror">
                <div class="label-wrapper">
                  <Mlabel isrequired class="label">PREFIX</Mlabel>
                  <MToolTip title="Prefix" value="1"></MToolTip>
                </div>
                <MTextbox :placeholder="'Prefix'" required :textboxInput="formPosterData.prefix" @on-change-value="setPrefix($event)" :mInputProperty="mTextboxProperty"/>
              </div>
            </div>
            <div class="form-container quality">
              <div class="t-form-group haserror">
                <div class="label-wrapper">
                  <Mlabel isrequired class="label">QUALITY</Mlabel>
                  <MToolTip title="Quality" value="2"></MToolTip>
                </div>
                <MDropdown :selected="formPosterData.quality" :itemList="qualityList" :mSelectProperty="mDropdownProperty" :placeholder="'Select Quality'" @on-item-selected="setQuality($event)" @on-item-reset="setQuality($event)"/>
              </div>
            </div>
            <div class="form-container count">
              <div class="t-form-group haserror">
                <div class="label-wrapper">
                  <Mlabel isrequired class="label">COUNT</Mlabel>
                  <MToolTip title="Count" value="3"></MToolTip>
                </div>
                <Counter :defaultValue="formPosterData.count" :maxValue="50" @changedCounter="setCount($event)" />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Mlabel, MTextbox, MToolTip, MDropdown } from 'mobiotics-dynamic-components-vue'

export default {
  name: 'AddPoster',
  data () {
    return {
      mTextboxProperty: {},
      profileData: {},
      qualitySelected: 1,
      mDropdownProperty: {},
      qualityList: [],
      fullTime: '',
      count: 0
    }
  },
  props: {
    formPosterData: {
      type: [Object, Array, String]
    },
    id: {
      type: Number
    }
  },
  components: {
    Mlabel,
    MTextbox,
    MToolTip,
    MDropdown,
    Counter: () => import('@/components/common/Counter.vue')
  },
  methods: {
    closePoster () {
      this.$emit('closePoster', this.id)
    },
    setPrefix (data) {
      this.profileData.prefix = data
      this.$emit('poster', {'val': this.profileData, forVal: 'prefix'})
    },
    setQuality (data) {
      this.profileData.quality = data.name
      this.$emit('poster', {'val': this.profileData, forVal: 'quality'})
    },
    setCount (data) {
      this.profileData.count = data
      this.$emit('poster', {'val': this.profileData, forVal: 'count'})
    }
  },
  created () {
    let newTime = new Date().setHours(24, 0, 0, 0)
    this.fullTime = new Date(new Date(newTime).getTime()).toLocaleTimeString()
    this.mTextboxProperty = {
      defaultProperty: {
        width: 'inherit',
        height: '21px',
        marginTop: '4px',
        border: '1px solid rgba(212,218,228,0.7)',
        color: '#1F2631'
      }
    }
    this.mDropdownProperty = {
      defaultProperty: {
        width: 'inherit',
        marginTop: '4px'
      },
      inputProperty: {
        width: '113px',
        height: '21px'
      },
      listProperty: {
        width: 'calc(100%)'
      }
    }
    this.qualityList = [
      { 'name': 'HD', id: 'hd' },
      { 'name': 'SD', id: 'sd' }
    ]
  }
}
</script>

<style scoped lang="scss">
  .poster-div {
    margin-bottom: 10px;
    .close {
       float: right;
       cursor: pointer;
       display: flex;
       align-items: center;
       margin: 6px 7px 0;
    }
    .poster-body {
      .poster-header {
        font: 11px/13px var(--font-bold);
        padding-bottom: 10px;
        color: var(--primary-grey);
      }
      .body {
        align-items: center;
        .form-container {
          margin: 0 8.5px;
          &.prefix {
            max-width: 73px;
            margin-left: 0;
          }
          &.quality {
            max-width: 113px;
          }
          >>> .tooltip-div {
            cursor: pointer;
            .tooltip {
              .tooltiptext {
                font: 10px/15px var(--font-regular);
                color: rgba(0,0,0,0.7);
                width: auto;
                padding: 2px 25px 2px 8px;
                top: -18px;
                left: 6px;
                border-radius: 3px;
                white-space: nowrap;
              }
            }
          }
          >>> .m-dropdown {
            .dropdown-selected,
            .md__search {
              max-width: 113px;
            }
          }
        }
      }
    }
  }
</style>
