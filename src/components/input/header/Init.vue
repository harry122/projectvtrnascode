<template>
  <div class='trancode-header'>
    <div v-for="item in tablist" :key="item.name" @click="actSetActive(item.name)" :class="selectClassSelection(item.status, item.name) " >
     <component :is="item.com" style="position: relative;bottom: -3px;margin-right: 3px;margin-right: 10px;" :highlite="item.status"></component> 
     {{item.name}}
    </div>
  </div>
</template>

<script>
 import { mapActions, mapMutations } from 'vuex'
export default {
  data () {
    return {
      item_status: 'deactive',
      tablist: []
    }
  },
  props: ['header_data'],
  methods: {
    ...mapActions(['actTranscodeData']),
    ...mapMutations(['setListAllJobTranscode']),
    actSetActive (name) {
      this.$emit('tab-callback', name)
      this.actSetClass(name)
    },
    actSetClass (item) {
      for (let i in this.tablist) {
        if (this.tablist[i].name === item) {
          this.tablist[i].status = 'active'
        } else {
          this.tablist[i].status = 'deactive'
        }
      }
    },
    selectClassSelection (status, name) {
      if (status === 'active') {
        if (name == 'AUDIO') {
          return 'audioActive'
        }
      }
      return status;
    }
  },
  mounted () {
    this.actTranscodeData().then((res) => {
      console.log(res);
      let dataset = res.data.map((item) => {
        if (item.size)
          item.size = (parseInt(item.size) / (1024 * 1024)).toFixed(2);
          item.size = item.size + ' ' + 'MB'
          if (item.size > 1024) {
            item.size = item.size + ' ' + 'GB'
          }
          return item; 
      })
      this.setListAllJobTranscode(res.data)
    }, (error) => {
      console.log(error);
    })
    console.log('init')
    this.tablist = this.header_data
    this.actSetClass(this.tablist[0].name)
  }
}
</script>

<style lang="scss" scoped>
.trancode-header {
  margin: -13px -10px;
  height: 76px;
  background-color: #FFFFFF;
  -webkit-box-shadow: 3px 2px 4px 0 rgba(0,0,0,0.08);
  box-shadow: 3px 4px 4px 0 rgba(0,0,0,0.08);
  display: flex;
  display: flex;
  justify-content: start;
  align-items: flex-end;
  padding-left: 30px;
  div {
    font-family: "Helvetica Neue Bold";
    font-size: 15px;
    padding: 5px 0px;
    padding-right: 45px;
    cursor: pointer;
  }
  div:not(:first-child) {
    margin-left: 60px;
  }
  // div:first-child {
  //   color: #0978FC;
  //   border-bottom: 2px solid blue;
  // }
  .active {
    color: #0978FC;
    border-bottom: 2px solid blue;
  }
  .audioActive {
    color:#EA9432;
    border-bottom: 2px solid #EA9432;
  }
  .deactive {
    color: #A1A1A1;
  }
}
.content-route {
  padding: 0px;
}
</style>
