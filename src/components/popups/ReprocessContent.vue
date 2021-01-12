<template>
  <MModal :styles="ModalStyles" v-show="showReprocessModal" @close="closeReprocessModal">
    <div slot="header">
      <p class="header-text">Are you sure to Reprocess the Content</p>
      <p class="header-text">
        with Preprocess ID
        <span class="blue">{{preprocessid}}</span> ?
      </p>
    </div>
    <div slot="body" class="body-slot">
      <MButton
        primary
        :plus="false"
        :mButtonProperty="mButtonProperty"
        @on-btn-click="updateReprocessModal"
      >YES</MButton>
      <MButton
        secondary
        :plus="false"
        :mButtonProperty="mButtonProperty"
        @on-btn-click="closeReprocessModal"
      >CANCEL</MButton>
    </div>
  </MModal>
</template>

<script>
import { MModal, MButton } from "mobiotics-dynamic-components-vue";
import { mapActions } from "vuex";
import { EventBus } from "@/event";
export default {
  name: "reprocess",
  data() {
    return {
      showReprocessModal: false,
      preprocessid: "",
      ModalStyles: {
        height: "234.04px",
        width: "441px",
        borderRadius: "2px"
      },
      mButtonProperty: {
        defaultProperty: {
          height: "38px",
          width: "146px",
          marginRight: "10px"
        }
      }
    };
  },
  components: {
    MModal,
    MButton
  },
  methods: {
    ...mapActions(["updatePreProcessFiles"]),
    displayReprocessModal(rowinfo) {
      this.preprocessid = rowinfo.preprocessid;
      this.showReprocessModal = true;
    },
    updateReprocessModal() {
      let data = {
        preprocessid: this.preprocessid,
        formdata: {
          action: "REPROCESS"
        }
      };
      this.updatePreProcessFiles(data).then(res => {
        console.log("updated", res);
        EventBus.$emit("reloadPreProcess");
        this.closeReprocessModal();
      });
    },
    closeReprocessModal() {
      this.showReprocessModal = false;
    }
  },
  created() {
    EventBus.$on("OpenReProcessModal", this.displayReprocessModal);
  }
};
</script>

<style lang="scss" scoped>
.header-text {
  font-size: 16px !important;
  letter-spacing: 0;
  line-height: 25px !important;
  margin-top: 5px;
}
.body-slot {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}
.blue {
  color: #0c77f9;
  font-weight: bold;
}
</style>