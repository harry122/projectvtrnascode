<template>
  <div  class="watermark-div vtrans-card">
    <div class="close" @click="closeWaterMark">
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
    <div class="watermark-body">
      <div class="watermark-header">
        WATERMARK
      </div>
      <div class="body t-row">
        <div class="upload t-col-2">
          <FileDragInput class="file-input" @dataFiles="setWatermark($event)" :singleImage="true"/>
        </div>
        <div class="deatils t-col-4">
          <div class="form-group">
            <form>
              <div class="form-container">
                <div class="t-form-group haserror">
                  <div class="label-wrapper">
                    <Mlabel class="label">SIZE %</Mlabel>
                  </div>
                  <MTextbox :placeholder="'Size'" :textboxInput="profileWatermark.size" required @on-change-value="setSize($event)" :mInputProperty="mTextboxProperty"/>
                </div>
              </div>
              <div class="form-container">
                <div class="t-form-group haserror">
                  <div class="label-wrapper">
                    <Mlabel class="label">TOP %</Mlabel>
                  </div>
                  <MTextbox :placeholder="'Top'" :textboxInput="profileWatermark.top" required @on-change-value="setTop($event)" :mInputProperty="mTextboxProperty"/>
                </div>
              </div>
              <div class="form-container">
                <div class="t-form-group haserror">
                  <div class="label-wrapper">
                    <Mlabel class="label">LEFT %</Mlabel>
                  </div>
                  <MTextbox :placeholder="'LEFT'" :textboxInput="profileWatermark.left" required @on-change-value="setLeft($event)" :mInputProperty="mTextboxProperty"/>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div class="transparency t-col-6">
          <div class="form-group">
            <form>
              <div class="form-container">
                  <div class="t-form-group haserror">
                    <div class="label-wrapper">
                      <Mlabel class="label">TRANSPARENCY %</Mlabel>
                    </div>
                    <MTextbox :placeholder="'Transparency'" required :textboxInput="profileWatermark.transparency" @on-change-value="setTransparency($event)" :mInputProperty="mInputProperty"/>
                  </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Mlabel, MTextbox } from 'mobiotics-dynamic-components-vue'

export default {
  name: 'Watermark',
  data () {
    return {
      mTextboxProperty: {},
      mInputProperty: {},
      watermark: {}
    }
  },
  props: {
    profileWatermark: {
      type: Object,
      default: () => {
        return {
          size: '',
          top: '',
          left: ''
        }
      }
    }
  },
  components: {
    Mlabel,
    MTextbox,
    FileDragInput: () => import('@/components/common/FileDragInput.vue')
  },
  methods: {
    closeWaterMark () {
      this.$emit('closeWaterMark', false)
    },
    setSize (val) {
      this.watermark.size = val
      this.$emit('watermark', {'val': this.watermark, forVal: 'size'})
    },
    setTop (val) {
      this.watermark.top = val
      this.$emit('watermark', {'val': this.watermark, forVal: 'top'})
    },
    setLeft (val) {
      this.watermark.left = val
      this.$emit('watermark', {'val': this.watermark, forVal: 'left'})
    },
    setTransparency (val) {
      this.watermark.transparency = val
      this.$emit('watermark', {'val': this.watermark, forVal: 'transparency'})
    },
    setWatermark (val) {
      this.watermark.filename = val[0]
      this.$emit('watermark', {'val': this.watermark, forVal: 'filename'})
    }
  },
  created () {
    this.mTextboxProperty = {
      defaultProperty: {
        width: '51px',
        height: '20px',
        marginTop: '4px',
        border: '1px solid rgba(212,218,228,0.7)',
        color: '#1F2631'
      }
    }
    this.mInputProperty = {
      defaultProperty: {
        width: '104px',
        height: '20px',
        marginTop: '4px',
        border: '1px solid rgba(212,218,228,0.7)',
        color: '#1F2631'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .watermark-div {
    .close {
      float: right;
      cursor: pointer;
      display: flex;
      align-items: center;
      margin: 6px 7px 0;
    }
    .watermark-body {
      .watermark-header {
        font: 11px/13px var(--font-bold);
        padding-bottom: 10px;
        color: var(--primary-grey);
      }
      .body {
        &.t-row {
          align-items: center;
          .upload {
            height: 59px;
            max-width: 64px;
            padding: 0;
            margin-right: 4px;
            opacity: 0.5;
            border-radius: 3px;
            background: #F0F3F7;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          }
          .transparency {
            padding: 0;
            max-width: 105px;
          }
          .deatils {
            padding-right: 5px;
            margin-right: 19px;
            form {
              display: flex;
              .form-container {
                padding: 0 4px;
              }
            }
          }
        }
      }
    }
  }
</style>
