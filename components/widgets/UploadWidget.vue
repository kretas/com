<template>
  <div
    v-if="type == 'overlay'"
    class="absolute-full text-subtitle2 flex flex-center"
    style="border-radius: inherit; background: rgba(0, 0, 0, 0.2)">
    <q-icon name="add_a_photo" color="white" size="42px" />
    <label
      for="single"
      style="
        position: absolute;
        top: 0;
        right: 0;
        height: 100%;
        width: 100%;
        z-index: 1;
        cursor: pointer;
      ">
    </label>
    <input
      ref="fileInput"
      style="visibility: hidden; position: absolute"
      type="file"
      id="single"
      @change="onFileChange"
      :disabled="uploading" />
  </div>
  <div v-else>
    <q-file
      outlined
      v-model="files"
      :label="uploading ? 'Uploading ...' : 'Upload'"
      :disabled="uploading"
      :loading="uploading" />
  </div>
</template>

<script>
export default {
  props: ["type", "bucket", "fileName"],
  data() {
    return {
      uploading: false,
      files: null,
    };
  },
  methods: {
    onFileChange(evt) {
      this.files = evt.target.files[0];
    },
    async uploadFile() {
      try {
        this.uploading = true;
        if (!this.files || this.files.length === 0) {
          throw new Error("You must select an image to upload.");
        }
        const file = this.files;
        const fileExt = file.name.split(".").pop();
        let filePath = "";
        console.log(this.fileName);
        if (this.fileName) {
          filePath = `${this.fileName}.${fileExt}`;
        } else {
          filePath = `${Math.random()}.${fileExt}`;
        }
        console.log(filePath);

        let { error: uploadError } = await this.$upload(
          this.bucket,
          filePath,
          file
        );

        if (uploadError) throw uploadError;
        this.$emit("upload", filePath);
      } catch (error) {
        alert(error.message);
      } finally {
        this.uploading = false;
        this.$refs.fileInput.value = "";
        return true;
      }
    },
  },
  watch: {
    files() {
      if (this.files) this.uploadFile();
    },
    path() {
      if (this.path) this.downloadImage();
    },
  },
};
</script>
