<template>
  <div>
    <q-form @submit="login('login')">
      <q-input v-model="email" label="Email" type="email" filled required />
      <q-input v-model="password" label="Password" type="password" filled />
      <q-btn
        :disabled="!email"
        type="submit"
        :label="$t('index.btn')"
        color="accent"
        class="q-my-md q-px-xl q-py-md rounded"
        no-caps
        style="border-radius: 15px" />
    </q-form>
    <q-spinner v-if="loading" color="accent" size="3em" :thickness="2" />
    <p v-if="error" class="text-body1">{{ $t("index.loginerror") }}</p>
    <p v-if="submitted" class="text-body1">{{ $t("index.submitted") }}</p>
  </div>
</template>
<script>
export default {
  name: "authLogin",
  data() {
    return {
      email: "",
      password: "",
      loading: false,
      submitted: false,
      tab: "magiclink",
    };
  },
  async mounted() {},
  methods: {
    async login() {
      try {
        this.loading = true;
        const { user, session, error } =
          await this.$supabase.auth.signInWithPassword({
            email: this.email,
            password: this.password,
          });
      } catch (error) {
        this.loading = false;
        this.error = true;
        console.error(error);
      } finally {
        this.loading = false;
        this.submitted = true;
      }
    },
  },
};
</script>
