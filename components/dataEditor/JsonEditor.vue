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
      <!-- if no object -->
      <div v-else class="flex q-my-sm">
        <div class="q-ma-sm" style="min-width: 90px">{{ key }}</div>
        <q-input v-model="localData[key]" style="min-width: 90px" dense />
        <q-btn
          class="q-ml-sm"
          label="Delete"
          dense
          noCaps
          color="negative"
          outline
          style="width: 60px"
          @click="removeEntryArray(key)" />
      </div>
    </div>

    <div v-if="!nonObject" class="flex q-my-md">
      <q-input v-model="newCategoryKey" filled dense label="Category Name" />
      <q-btn
        label="Add Category"
        color="positive"
        noCaps
        @click="addCategory"
        :disabled="!newCategoryKey" />
    </div>
    <div v-if="nonObject" class="flex q-my-md">
      <q-select
        v-model="addNonObjectKey"
        :options="addOptions"
        use-input
        input-debounce="300"
        style="width: 150px"
        filled
        dense
        label="Key"
        @filter="filterFn"
        @new-value="createValue"
        new-value-mode="add" />
      <q-btn
        label="Add New Entry"
        color="positive"
        noCaps
        @click="addNonObject"
        :disabled="!addNonObjectKey" />
      <q-btn @click="persist" label="persist" color="positive" noCaps />
    </div>
  </div>
</template>

<script>
export default {
  name: "JsonEditor",
  props: {
    nonObject: {
      type: Boolean,
      default: false,
    },
    addOptions: {
      type: Array,
      default: () => [],
    },
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
      addNonObjectKey: "",
    };
  },
  watch: {
    data(newVal) {
      this.localData = { ...newVal };
    },
  },
  methods: {
    filterFn(val, update) {
      if (val === "") {
        update(() => {
          this.option = this.addOptions;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.option = this.addOptions.filter(
          (v) => v.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    persist() {
      this.$emit("update:data", this.localData);
    },
    createValue(val, done) {
      if (val.length > 0) {
        // eslint-disable-next-line vue/no-mutating-props
        this.addOptions.push(val);
        done(val);
      }
    },
    isObject(value) {
      return typeof value === "object" && value !== null;
    },
    addCategory() {
      if (!this.newCategoryKey) {
        return;
      }

      this.localData[this.newCategoryKey] = {};
      this.newCategoryKey = "";

      this.$emit("update:data", this.localData);
    },
    addNonObject() {
      if (!this.addNonObjectKey) {
        return;
      }

      this.localData = {
        ...this.localData,
        [this.addNonObjectKey]: "",
      };
      this.addNonObjectKey = "";

      this.$emit("update:data", this.localData);
    },
    addEntry(key) {
      if (!this.newEntryKey[key] || !this.newEntryValue[key]) {
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
      delete this.localData[categoryKey][entryKey];
      this.$emit("update:data", this.localData);
    },
    removeEntryArray(key) {
      delete this.localData[key];
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
