<template>
 <div>
    <div class="upload-div-border" @click="triggerClick">
      <input hidden ref="files" type="file" multiple class="form-control" @change="uploadDocument($event)" @click="triggerChange($event)" tabindex="-1" accept="image/*,.pdf,.txt">
      <span><img ref="uploadButton" class="upload-button" src='@/assets/images/dwnld_doc.svg'></span>
      <label class="upload-label">Upload Document</label>
    </div>
    <div class="image-preview-div">
      <div class="image-container t-flex-wrapper" v-for="(head, index) in attachment" :key="index">
        <span v-if="head.img"><img class="image-preview" :src="head.img" alt="img"></span>
        <span class="doc-icon" v-else><img class="image-preview" src='@/assets/images/invoice.svg'  alt="img"></span>
        <span class="name-preview t-flex-wrapper">
          <span class="name-data">{{head.data.name}}</span>
          <span><img class="remove-image" src='@/assets/images/dwnld_hover copy 3.svg' @click="removeFile(index)"></span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      attachment: []
    }
  },
  methods: {
    uploadDocument (e) {
      let uploader = this.$refs.files
      for (let x = 0; x < uploader.files.length; x++) {
        if (this.fileFormat(uploader.files[x].type, uploader.files[x].size)) {
          if (this.checkDuplicate(uploader.files[x].name)) {
            if (uploader.files[x].type === 'image/png' || uploader.files[x].type === 'image/jpeg' || uploader.files[x].type === 'image/jpg') {
              this.createImage(uploader.files[x])
            } else {
              this.attachment.push({data: uploader.files[x], img: ''})
            }
          }
        }
      }
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
      reader.onload = (e) => {
        this.attachment.push({data: files, img: e.target.result})
      }
      reader.readAsDataURL(files)
    },
    removeFile (index) {
      const attachments = [...this.attachment]
      attachments.splice(index, 1)
      this.attachment = attachments
      console.log(this.attachment)
    }
  }
}
</script>

<style scoped lang="scss">
  .plus-button {
    margin-left: 1px;
    margin-right: 1px;
    padding:2px;
  }
  .upload-button {
    vertical-align: middleimage-preview;
    border-style: none;
    height: 20px;
    margin-left: 3px;
    margin-top: 4px;
    transform: rotate(180deg);
    padding-right: 10px;
  }
  .name-preview {
    padding-left: 2px;
    font-size: small;
    text-overflow: ellipsis;
  }
  .doc-icon {
    width: 56px;
    padding: 0 21px;
  }
  .image-preview {
    height:36px
  }
  .remove-image {
    cursor: pointer;
    width: 16px;
  }
  .image-container {
    padding-bottom: 20px;
  }
  .upload-div-border {
    border: 1px dashed var(--light-grey);
    width: inherit;
    display: flex;
    align-items: center;
    height: 36px;
    background: var(--light-blue);
    cursor: pointer;
  }
  .image-preview-div {
    margin-top: 40px;
  }
  .image-preview {
    width: auto;
    height: auto;
    max-width: 56px;
    max-height: 36px;
    display: block;
    object-fit: cover;
  }
  .name-preview {
    flex: 1;
    border-bottom-style: solid;
    border-width: 1px;
    border-color: rgba(212,221,228, 0.3);
    margin-left: 15px;
    padding-bottom: 5px;
    .name-data {
      flex: 1;
    }
  }
  .upload-label {
    height: 16px;
    color: var(--primary-blue);
    font-family: var(--font-bold);
    font-size: 12px;
    letter-spacing: 0;
    line-height: 16px;
    text-transform: uppercase;
    padding-left: 20px;
    cursor: pointer;
  }
</style>
