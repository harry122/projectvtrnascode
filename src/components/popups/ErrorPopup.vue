<template>
  <div class="file-import">
    <MModal @close="closePopup">
      <div slot="header">{{message}}</div>
         <div slot="body">
      <MButton primary :plus="false" class="create-btn1" @on-btn-click="closePopup" type="submit">OK</MButton>
         </div>
    </MModal>
  </div>
</template>

<script>
/* eslint-disable */
import {
  MModal,
  MButton,
  MTextbox,
  MChip
} from "mobiotics-dynamic-components-vue";
import "mobiotics-dynamic-components-vue/dist/mobiotics_dynamic_components_vue.css";
import Vue from "vue";
import { EventBus } from "@/event";

export default {
  name: "error-opoup",
  data() {
    return {};
  },
  props: ["message"],
  components: {
    MModal,
    MTextbox,
    MButton,
    MChip
  },
  created() {
    EventBus.$on("fileImport", value => {
      this.closePopup();
    });
  },
  mounted() {},
  methods: {
    closePopup() {
      EventBus.$emit("closePopup", false);
    }
  }
};
</script>

<style scoped lang="scss">
/deep/ .m-modal {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  flex-direction: column;
  max-height: none;
  border-radius: 2px;
  overflow-y: auto;
  margin-top: 1%;
  padding: 1%!important;
  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(235, 235, 235, 0.3);
    border-radius: 2.5px;
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background: #ebebeb;
    border-radius: 2.5px;
    width: 5px;
  }
}
.create-btn1 {
  width: 100% !important;
  margin-top: 6%;
  height: 5%;
  padding: 0 10% 0 10% !important;

}
</style>