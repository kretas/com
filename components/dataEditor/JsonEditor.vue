<template>
  <div>
    <div v-for="(value, key, index) in localData" :key="index">
      <div v-if="isObject(value)" class="bg-grey-3 q-pa-md q-mb-sm">
        <div class="flex">
          <p class="text-h6 q-mb-none q-mr-md">{{ key }}</p>
          <q-btn
            label="Remove Category"
            color="negative"
            noCaps
            outline
            @click="removeCategory(key)" />
        </div>

        <div v-for="(entryVal, entryKey, index) in value" :key="index">
          <div class="flex q-my-sm">
            <div class="q-ma-sm" style="min-width: 90px">{{ entryKey }}</div>
            <q-input
              v-model="localData[key][entryKey]"
              style="min-width: 90px"
              dense />
            <q-btn
              class="q-ml-sm"
              label="Delete"
              dense
              noCaps
              color="negative"
              outline
              style="width: 60px"
              @click="removeEntry(key, entryKey)" />
          </div>
        </div>
        <div class="flex">
          <q-input
            v-model="newEntryKey[key]"
            dense
            filled
            style="width: 100px"
            label="Key" />
          <q-input
            v-model="newEntryValue[key]"
            dense
            filled
            label="Value" /><q-btn
            label="Add"
            color="positive"
            noCaps
            outline
            style="width: 60px"
            @click="addEntry(key)" />
        </div>
      </div>
    </div>

    <div class="flex q-my-md">
      <q-input v-model="newCategoryKey" filled dense label="Category Name" />
      <q-btn
        label="Add Category"
        color="positive"
        noCaps
        @click="addCategory"
        :disabled="!newCategoryKey" />
    </div>
  </div>
</template>

<script>
export default {
  name: "JsonEditor",
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      localData: { ...this.data },
      newEntryKey: {},
      newEntryValue: {},
      newCategoryKey: "",
    };
  },
  watch: {
    data(newVal) {
      this.localData = { ...newVal };
    },
  },
  methods: {
    isObject(value) {
      return typeof value === "object" && value !== null;
    },
    addCategory() {
      if (!this.newCategoryKey) {
        // If the key is not provided, return early
        return;
      }

      this.localData[this.newCategoryKey] = {};
      this.newCategoryKey = "";

      this.$emit("update:data", this.localData);
    },
    addEntry(key) {
      if (!this.newEntryKey[key] || !this.newEntryValue[key]) {
        // If the key or value is not provided, return early
        return;
      }

      this.localData[key] = {
        ...this.localData[key],
        [this.newEntryKey[key]]: this.newEntryValue[key],
      };
      this.newEntryKey[key] = "";
      this.newEntryValue[key] = "";

      this.$emit("update:data", this.localData);
    },

    removeEntry(categoryKey, entryKey) {
      // Delete the entry
      delete this.localData[categoryKey][entryKey];
      // Emit the updated data back to the parent
      this.$emit("update:data", this.localData);
    },
    removeCategory(key) {
      delete this.localData[key];
      this.$emit("update:data", this.localData);
    },
    nestedUpdate(newVal, key) {
      this.localData[key] = newVal;
      this.$emit("update:data", this.localData);
    },
  },
};
</script>
