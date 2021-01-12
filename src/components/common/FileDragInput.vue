<template>
  <div class="file-drag-input-wrapper">
    <div class="file-input-wrapper" v-if="showInputFile">
      <label for="file" class="btn-3" @drop.stop.prevent="dropDocument($event)" @dragover.prevent>
        <input v-if="!singleImage" ref="files" type="file" id="file" class="drag-input" @change="uploadDocument($event)" @click="triggerChange($event)" tabindex="-1" accept="image/*,.pdf,.txt"/>
        <input v-else ref="files" type="file" id="file" class="drag-input" @change="uploadDocument($event)" @click="triggerChange($event)" tabindex="-1" accept="image/*"/>
        <img class="float-left image" src="@/assets/images/file-upload.svg" />
        <span class="text-content">
          <span class="float-left">
            Drag and drop files or <span class="click-browse">Browse your files</span>
          </span>
        </span>
      </label>
      <p :class="['browse-footer', errorcode? 'error': 'no-error']">{{footerText}}</p>
    </div>
    <!-- <div class="image-preview-div" v-if="attachment.length"> -->
      <div class="image-container" v-for="(head, index) in attachment" :key="index" :class="[index%2 !== 0?'no-pad':'pad', (index+1)%3 === 0? 'no-left': 'left']">
        <div class="image-preview-div t-flex-wrapper">
          <span v-if="head.img"><img class="image-preview" :src="head.img" alt="img"></span>
          <span class="doc-icon" v-else><img class="image-preview" src='@/assets/images/invoice.svg'  alt="img"></span>
          <span class="name-preview t-flex-wrapper">
            <span class="name-data">{{head.data.name}}</span>
            <span><img style="" class="remove-image" src='@/assets/images/dwnld_hover copy 3.svg' @click="removeFile(index)"></span>
          </span>
        </div>
      </div>
    <!-- </div> -->
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'FileDragInput',
  data () {
    return {
      attachment: [],
      apiSuccessData: [],
      footerText: '',
      errorcode: false,
      showInputFile: true,
      attachmentLength: 0
    }
  },
  props: {
    singleImage: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    apiSuccessData () {
      this.$emit('dataFiles', this.apiSuccessData)
    }
  },
  methods: {
    ...mapActions(['listFileList']),
    uploadDocument (e) {
      if (e.target.files) {
        for (let x = 0; x < e.target.files.length; x++) {
          if (this.checkDuplicate(e.target.files[x].name)) {
            if (e.target.files[x].type === 'image/png' || e.target.files[x].type === 'image/jpeg' || e.target.files[x].type === 'image/jpg') {
              this.apiuploadDoc(e.target.files[x], 'upImg')
            } else {
              this.apiuploadDoc(e.target.files[x], 'up')
            }
          }
        }
      }
    },
    dropDocument (e) {
      if (e.dataTransfer.files) {
        for (let x = 0; x < e.dataTransfer.files.length; x++) {
          if (this.checkDuplicate(e.dataTransfer.files[x].name)) {
            if (e.dataTransfer.files[x].type === 'image/png' || e.dataTransfer.files[x].type === 'image/jpeg' || e.dataTransfer.files[x].type === 'image/jpg') {
              this.apiuploadDoc(e.dataTransfer.files[x], 'dropImg')
            } else {
              this.apiuploadDoc(e.dataTransfer.files[x], 'drop')
            }
          }
        }
      }
    },
    apiuploadDoc (data, val) {
      this.$eventHub.$emit('Loader', true)
      this.listFileList(data).then((res) => {
        if (res.success) {
          this.apiSuccessData.push(res.success)
          if (val === 'dropImg' || val === 'upImg') {
            this.createImage(data)
          } else if (val === 'drop' || val === 'up') {
            this.attachment.push({data: data, img: ''})
          }
          this.footerText = ''
          this.errorcode = false
          this.$eventHub.$emit('Loader', false)
        } else if (res.errorcode) {
          console.log('Error', res.reason)
          this.footerText = res.reason
          this.errorcode = true
          this.$eventHub.$emit('Loader', false)
          return res.errorcode
        }
      }).catch((error) => {
        this.$eventHub.$emit('Loader', false)
        if (error.status === 401) {
          console.log(error)
        }
      })
    },
    triggerClick () {
      let uploader = this.$refs.files
      uploader.click()
    },
    checkDuplicate (name) {
      let val = true
      for (let i in this.attachment) {
        if (this.attachment[i].data.name === name) {
          val = false
          this.errorcode = true
          this.footerText = 'Duplicate Files Not Allowed'
        }
      }
      return val
    },
    triggerChange (e) {
      e.target.value = null
    },
    fileFormat (type, size) {
      if (type === 'image/png' || type === 'text/plain' || type === 'application/pdf' || type === 'image/jpeg' || type === 'image/jpg') {
        if (type === 'image/png' || type === 'image/jpeg' || type === 'image/jpg') {
          if (size <= 5242880) {
            return true
          } else {
            return false
          }
        } else if (type === 'application/pdf') {
          if (size <= 1048576) {
            return true
          } else {
            return false
          }
        } else if (type === 'text/plain') {
          if (size <= 102400) {
            return true
          } else {
            return false
          }
        }
      } else {
        return false
      }
    },
    createImage (files) {
      let reader = new FileReader()
      if (this.singleImage) {
        reader.onload = (e) => {
          let attachments = []
          attachments[0] = {data: files, img: e.target.result}
          this.attachment = [...attachments]
          this.showInputFile = false
        }
        reader.readAsDataURL(files)
      } else {
        reader.onload = (e) => {
          this.attachment.push({data: files, img: e.target.result})
        }
        reader.readAsDataURL(files)
      }
    },
    removeFile (index) {
      this.errorcode = false
      this.footerText = ''
      const attachments = [...this.attachment]
      const apiData = [...this.apiSuccessData]
      attachments.splice(index, 1)
      apiData.splice(index, 1)
      this.attachment = attachments
      this.apiSuccessData = apiData
      if (this.attachment.length === 0) {
        if (this.singleImage) {
          this.footerText = ''
        } else {
          this.footerText = 'Recommended Size 480x270 or 480x480 or 270x480'
        }
      }
      this.showInputFile = true
    },
    clearAttachement (state) {
      for (let i = 0; i < state; i++) {
        console.log(i)
        this.removeFile(0)
      }
    }
  },
  created () {
    if (this.singleImage) {
      this.footerText = ' '
    } else {
      this.footerText = 'Recommended Size 480x270 or 480x480 or 270x480'
    }
    this.$eventHub.$on('clearattachement', this.clearAttachement)
  }
}
</script>

<style lang="scss" scoped>
  .drag-input {
    height: 0;
    overflow: hidden;
    width: 0;
  }
  .browse-footer {
    color: var(--primary-grey);
    font: 12px/14px var(--font-regular);
    opacity: 0.3;
    padding-top: 4px;
    position: absolute;
    bottom: -20%;
    transform: translateY(20%);
    &.error {
      color: var(--error);
      opacity: 1;
      right: 15px;
    }
  }
 .btn-3 {
    border-radius: 3px;
    cursor: pointer;
    outline: none;
    padding: 1rem;
    min-height: 100%;
    position: relative;
    background-color: rgba(240, 243, 247, .5);
    border-radius: 0;
    overflow: hidden;
    border: 1px dashed var(--light-grey);
    border-radius: 5px;
    font-size: 10px;
    width: 100%;
    display: flex;
    align-items: center;
    height: 64px;
    .image {
      width: 27px;
    }
    .text-content{
      width: 95px;
      display: inline-block;
      text-indent: -5px;
      margin-left: 20px;
      .float-left {
        padding-left: 5px;
        white-space: normal;
        font-size: 10px;
        line-height: 14px;
      }
    }
    .click-browse{
      color: blue;
      display:inline;
      &:hover{
        text-decoration: underline;
      }
    }
  }
  .image-container {
    .image-preview-div {
      background: var(--white-smoke);
      height: 55px;
      align-items: center;
    }
    &.pad {
      padding: 10px 0 0 15px;
    }
    padding: 10px 15px 0 0;
    max-width: 50%;
    width: 100%;
    .image-preview {
      width: auto;
      height: auto;
      max-width: 36px;
      max-height: 26px;
      margin-left: 20px;
      display: block;
      object-fit: cover;
    }
    .name-preview {
      padding-left: 2px;
      font-size: small;
      text-overflow: ellipsis;
      flex: 1;
      margin: 0 20px;
      .name-data {
        flex: 1;
        padding-right: 5px;
      }
    }
    .remove-image {
      cursor: pointer;
      width: 16px;
    }
  }
  .file-input-wrapper {
    position: relative;
    max-width: 50%;
    width: 100%;
    padding-right: 15px;
  }
  .notify-file-input {
    .file-input-wrapper {
      max-width: 100%;
      padding: 0;
    }
    .image-container {
      max-width: 100%;
      padding: 0;
      .image-preview-div {
        height: 64px;
      }
    }
    .browse-footer {
      bottom: -30%;
      transform: translateY(30%);
      font-size: 11px;
      &.error {
        bottom: -20%;
        transform: translateY(20%);
        right: 0;
      }
    }
  }
  .comment-wrapper {
    .file-input-wrapper {
      width: 202px;
      padding-right: 0;
      margin-bottom: 5px;
      .browse-footer {
        width: 202px;
        bottom: -25px;
        &.error {
          bottom: -12px;
          right: 0;
        }
      }
    }
    .image-container {
      width: auto;
      min-width: 202px;
      &.no-pad,
      &.pad {
        padding: 5px 0 0 15px !important;
      }
      .image-preview-div {
        background: var(--white);
        border: 1px solid var(--border-grey);
        border-radius: 4px;
        height: 50px;
      }
      &.no-left {
        padding-left: 0!important;
        padding-bottom: 10px!important;
      }
      &:nth-child(4) {
        padding-left: 0!important;
      }
      &:nth-child(2),
      &:nth-child(3),
      &:nth-child(4) {
        padding-top: 5px!important;
      }
      .name-preview {
        white-space: nowrap;
      }
    }
  }
  .file-drag-input-wrapper {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    .image-container {
      &:nth-child(2) {
        padding: 5px 0 0 15px!important;
      }
    }
  }
  .upload {
    position: relative;
    .btn-3 {
      padding: 0 8px;
      height: 59px;
      .image {
        width: 46px;
      }
      .text-content {
        display: none;
      }
    }
    .file-input-wrapper {
      max-width: 64px;
      height: 59px;
      padding: 0;
    }
    .image-container {
      max-width: 64px;
      padding: 0;
      .image-preview-div {
        flex-direction: column;
        height: 64px;
        justify-content: center;
        .name-preview {
          height: 16px;
          flex: unset;
          display: block;
          overflow: hidden;
          width: 50px;
          .name-data {
            white-space: nowrap;
          }
          span {
            height: 16px;
            font-size: 10px;
            padding-top: 5px;
            .remove-image {
              position: absolute;
              top: 0;
              right: 2px;
              width: 10px;
            }
          }
        }
      }
      .image-preview {
        margin-left: 0;
      }
    }
  }
</style>
