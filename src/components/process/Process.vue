<template>
<div>
 <process-header :header_data="header_data" @tab-callback="actTabNameCB"></process-header>
 <process-body v-if="name === 'PREPROCESSED'"></process-body>
 <unprocess-body v-else-if="name == 'UNPROCESSED'"></unprocess-body>
</div>
</template>

<script>
/* eslint-disable */
import preprocessSvg from '@/svg/preprocessSvg.vue'
import unprocessSvg from '@/svg/unprocessSvg.vue'
export default {
  data () {
    return {
      header_data: [{name: 'PREPROCESSED', status: 'active', com: preprocessSvg}, {name: 'UNPROCESSED', status: 'deactive', com: unprocessSvg}],
      name:'PREPROCESSED'
    }
  },
  methods: {
    actTabNameCB (name) {
      this.name = name
    }
  },
  components: {
    'process-header': () => import('@/components/input/header/Init.vue'),
    'process-body': () => import('@/components/process/content/ProcessContentBody.vue'),
    'unprocess-body': () => import('@/components/process/unprocessed/UnprocessedComp.vue'),
  }
}
</script>

<style>
</style>
