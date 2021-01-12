<template>
  <div class='trancode-header'>
    <div v-for="item in tablist" :key="item.name" @click="actSetActive(item.name)" :class="item.status" :highlite="item.status">
      {{item.name}}
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      item_status: 'deactive',
      tablist: []
    }
  },
  props: ['header_data'],
  methods: {
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
    }
  },
  mounted () {
    console.log('init')
    this.tablist = this.header_data
    this.actSetClass(this.tablist[0].name)
  }
}
</script>

<style lang="scss" scoped>
.trancode-header {
  margin: -13px -10px;
  height: 67px;
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
    padding: 5px 30px;
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
  .deactive {
    color: #A1A1A1;
  }
}
.content-route {
  padding: 0px;
}
</style>
