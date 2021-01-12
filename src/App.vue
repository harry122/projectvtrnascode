<template>
  <div id="app">
    <Launch />
  </div>
</template>

<script>
import "mobiotics-dynamic-components-vue/dist/mobiotics_dynamic_components_vue.css";
import { mapActions } from "vuex";
export default {
  name: "App",
  components: {
    Launch: () => import("@/components/init/Init.vue")
  },
  mounted() {
    // this.actTranscodeData()
    //   .then(result => {})
    //   .catch(error => {
    //     if (error.errorcode == 302 && error.reason) {
    //       window.location.replace(error.reason);
    //     }
    //   });
  },
  methods: {
    ...mapActions(["actTranscodeData"])
  }
};
</script>

<style lang='scss'>
@import "./scss/_main.scss";

body {
  margin: 0;
}
</style>
