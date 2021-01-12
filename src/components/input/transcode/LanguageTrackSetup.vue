<template>
    <div style="margin-top: 20px; display: flex;">
        <div style="margin-right: 35px"> 
            <Mlabel isrequired class="label">TRACK</Mlabel>
            <MToolTip title="BURN SUBTITLES" value="3"></MToolTip>
            <div style="margin-top: 12px;margin-left: 12px;">
                #1
            </div>
        </div>
        <div> 
            <Mlabel isrequired class="label">LANGUAGE</Mlabel>
            <MToolTip title="BURN SUBTITLES" value="3"></MToolTip>
            <MDropdown :selected="1" :itemList="reportList" :mSelectProperty="mDropdownProperty" @on-item-selected="dropdownSelection=$event" @on-item-reset="dropdownSelection=$event"/>
        </div>
    </div>
</template>

<script>
import {
  MModal,
  MButton,
  MTextbox,
  MChip,
  MDropdown,
  MToolTip,
  Mlabel,
  MToggle
} from "mobiotics-dynamic-components-vue";
export default {
    data () {
        return {
            mDropdownProperty: '',
            reportList: ''
        }
        
    },
    components: {
        MModal,
        MTextbox,
        MButton,
        MChip,
        MDropdown,
        MToolTip,
        Mlabel,
        MToggle,    
    },
    created() {
    this.reportList = [
      { name: 'ENGLISH', id: 1 },
      { name: 'SPANISH', id: 2 },
    ]
    }
}
</script>

<style scoped lang="scss">
    >>>.md__list {
            width: 215px ;
        }
    >>>.popup-transcode .m-dropdown .md__input input {
        width: 215px ;
        margin: 10px 0px;
    }
</style>