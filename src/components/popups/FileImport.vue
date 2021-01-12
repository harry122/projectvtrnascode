<template>
  <div class="file-import">
    <MModal @close="closePopup">
      <div slot="header">
        <p class="import-your-files">Import Your Files</p>
        <p class="choose-a-service-to">Choose a Service to import your files</p>
        <div class="import-icon">
          <div class="icon" @click="selectService('GDRIVE')">
            <component :is="GDriveSvg"></component>
            <p class="icon-text">G-Drive</p>
          </div>
          <p id="s-text">OR</p>
          <div class="icon" @click="selectService('DROPBOX')">
            <component :is="DropboxSvg"></component>
            <p class="icon-text">Dropbox</p>
          </div>
        </div>
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
import { mapActions } from "vuex";
import DropboxSvg from "@/svg/DropboxSvg.vue";
import GdriveSvg from "@/svg/GdriveSvg.vue";
import { GDrive } from "@/components/common/import-services/Gdrive.js";
import { Dropbox } from "@/components/common/import-services/Dropbox.js";
export default {
  name: "import-main",
  data() {
    return {
      GDriveSvg: GdriveSvg,
      DropboxSvg: DropboxSvg,
      Gdrive: "",
      dropBox: ""
    };
  },
  components: {
    MModal,
    MTextbox,
    MButton,
    MChip
  },
  created() {
    EventBus.$on("fileImport", value=>{
      this.closePopup()
    });
  },
  mounted() {
    this.Gdrive = new GDrive();
    this.dropBox = new Dropbox();
    this.Gdrive.gdriveSdkInit();
    this.dropBox.init();
  },
  methods: {
    selectService(service) {
      if (service === "GDRIVE") {
        this.Gdrive.handleAuthClick();
      } else if (service === "DROPBOX") {
        this.dropBox.handleAuthClick();
      }
    },
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
  height: 315px;
  width: 481px;
  max-height: none;
  border-radius: 2px;
  overflow-y: auto;
  margin-top: 1%;
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
.import-your-files {
  height: 24px;
  color: #1f2631;
  font-family: "Helvetica Neue Bold";
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 0.4px;
  line-height: 25px;
  text-align: center;
  text-transform: uppercase;
}
.choose-a-service-to {
  height: 17px;
  color: #1f2631;
  font-family: "Helvetica Neue";
  font-size: 15px;
  letter-spacing: 0;
  line-height: 40px;
  text-align: center;
}
.import-icon {
  padding-top: 25%;
  display: flex;
  justify-content: center;
}
#s-text {
  align-content: center;
  display: grid;
  margin: 0% 10% 0% 10%;
  color: #1f2631;
  font-family: "Helvetica Neue";
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0;
  height: 100px;
}
.icon-text {
  color: #1f2631;
  font-family: "Helvetica Neue";
  font-size: 15px;
  letter-spacing: 0;
  text-align: center;
  margin-top: 10px;
}
</style>