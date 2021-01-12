<template>
  <div>
    <MModal @close="closePopup">
      <div slot="header">
        <p class="popup-external">Upload CSV for Bulk preprocess</p>
      </div>
      <div slot="body">
        <div class="label-name">Download CSV Template</div>

        <div class="center-item-upload">
          <div
            class="text-content"
            style="align-items: center;display: flex;margin-left: 5%"
            v-if="imported"
          >
            <component class="float-left image" :is="csvImg"></component>
            <span class="text" style="padding:0 3% 0 3%;">{{file.name}}</span>
            <span @click="removeFile()">
              <component class="float-left image" :is="deleteIcon"></component>
            </span>
          </div>
          <div class="file-input" v-else>
            <div class="dropbox">
              <input
                type="file"
                id="file"
                ref="file"
                accept=".csv"
                v-on:change="handleFileUpload()"
                required
              />

              <div class="text-content upload-csv-class">
                <img class="float-left image" src="@/assets/images/uploaddoc@1x.png" />
                <div class="text upload-text">Upload CSV File</div>
              </div>
            </div>
          </div>
          <MButton
            primary
            :plus="false"
            class="create-btn1"
            @on-btn-click="submit"
            type="submit"
          >SUBMIT</MButton>
          <MButton class="cancel-btn" @on-btn-click="closePopup">CANCEL</MButton>
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
import csvSvg from "@/svg/csvSvg.vue";
import DeleteIconSvg from "@/svg/DeletePicSvg.vue";

// import 'vue-select/src/scss/vue-select.scss'
export default {
  name: "retranscode-popup",
  data() {
    return {
      mTextboxProperty: {},
      content: "",
      errorMessage: false,
      checkedValue: [],
      file: "",
      csvImg: csvSvg,
      imported: false,
      deleteIcon: DeleteIconSvg
    };
  },
  components: {
    MModal,
    MTextbox,
    MButton,
    MChip
  },

  created() {
    this.mTextboxProperty = {
      defaultProperty: {
        width: "82%"
      }
    };
  },
  mounted() {},
  methods: {
    ...mapActions(["preprocessFiles"]),
    closePopup() {
      EventBus.$emit("closePopup", false);
    },
    removeFile() {
      this.imported = false;
      this.file = "";
    },
    handleFileUpload() {
      this.file = this.$refs.file.files[0];
      this.imported = true;
      console.log(this.file);
    },
    submit() {
      if (this.file) {
        let formData = new FormData();
        formData.append("filename", this.file);
        this.preprocessFiles(formData).then(
          response => {
            EventBus.$emit("reloadPreProcess");
            this.closePopup();
          },
          err => {
            EventBus.$emit("reloadPreProcess");
            this.closePopup();
          }
        );
      }
    }
  }
};
</script>
<style scoped lang="scss">
// @import '@/sass/_main.scss';
/deep/ .m-modal {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  flex-direction: column;
  width: 500px;
  height: 50%;
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
.popup-external {
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 0.4px;
  height: 40px;
  color: #1f2631;
  text-transform: uppercase;
  font-family: "Helvetica Neue Bold";
}
.label-name {
  height: 65px;
  color: #1f2631;
  font-family: "Helvetica Neue Medium";
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0;
  line-height: 18px;
  text-align: center;
  text-decoration: underline;
}
.upload-text {
  text-transform: uppercase;
  font-family: "Helvetica Neue Bold";
  font-size: 11px;
  margin-left: 10px;
  color: #000;
}

.create-btn1 {
  width: 100% !important;
  margin-top: 6%;
  height: 5%;
}
.cancel-btn {
  position: relative;
  box-sizing: border-box;
  background-color: white !important;
  border: 1px solid #818181 !important;
  border: 1px solid #818181;
  color: #818181 !important;
  width: 100% !important;
  height: 5%;
  margin-top: 4%;
}

#file {
  opacity: 0;
  position: absolute;
  width: 321px;
}
.file-input {
  box-sizing: border-box;
  height: 35px;
  border: 1px dashed #7f8797;
  border-radius: 3px;
  background-color: #f0f3f7;
  padding: 10px;
}
.center-item-upload {
  padding: 0 80px;
}
.upload-csv-class {
  display: flex;
  align-items: center;
}
</style>