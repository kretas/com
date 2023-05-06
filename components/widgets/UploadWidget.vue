<template>
  <div>
    <img v-if="src" :src="src" alt="Avatar" class="avatar image" :style="{ height: size + 'em', width: size + 'em' }" />
    <div v-else class="avatar no-image" :style="{ height: size + 'em', width: size + 'em' }" />

    <div :style="{ width: size + 'em' }">
      <label class="button primary block" for="single">
        {{ uploading ? 'Uploading ...' : 'Upload' }}
      </label>
      <input
        style="visibility: hidden; position: absolute"
        type="file"
        id="single"
        accept="image/*"
        @change="uploadAvatar"
        :disabled="uploading"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: ['path', 'size'],
  data() {
    return {
      uploading: false,
      src: '',
      files: null,
    };
  },
  methods: {
    async downloadImage() {
      try {
        const { data, error } = await this.$supabase.storage.from('avatars').download(this.path);
        if (error) throw error;
        this.src = URL.createObjectURL(data);
      } catch (error) {
        console.error('Error downloading image: ', error.message);
      }
    },
    async uploadAvatar(evt) {
      this.files = evt.target.files;
      try {
        this.uploading = true;
        if (!this.files || this.files.length === 0) {
          throw new Error('You must select an image to upload.');
        }

        const file = this.files[0];
        const fileExt = file.name.split('.').pop();
        const filePath = `${Math.random()}.${fileExt}`;

        let { error: uploadError } = await this.$upload('avatars', filePath, file);

        if (uploadError) throw uploadError;
        this.$emit('update:path', filePath);
        this.$emit('upload');
      } catch (error) {
        alert(error.message);
      } finally {
        this.uploading = false;
      }
    },
  },
  watch: {
    path() {
      if (this.path) this.downloadImage();
    },
  },
};
</script>
