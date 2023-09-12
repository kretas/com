<template>
  <div>
    <q-select
      filled
      :model-value="modelValue"
      @update:model-value="updateValue"
      :use-input="true"
      :use-chips="false"
      :multiple="multiple"
      :input-debounce="300"
      :new-value-mode="isAllowToAddNewValues ? 'add-unique' : undefined"
      @new-value="createValue"
      :options="filterOptions"
      @filter="filterFn"
      :option-label="optionLabel"
      :label="label"
      :option-value="optionValue">
      <template v-slot:append>
        <q-icon
          name="close"
          @click.stop.prevent="clearFunction"
          class="cursor-pointer" /> </template
    ></q-select>
  </div>
</template>

<script>
import { ref, watch } from "vue";

export default {
  props: {
    options: {
      type: Array,
      default: () => [
        { label: "Google", value: 1 },
        { label: "Facebook", value: 2 },
        { label: "Twitter", value: 3 },
      ],
    },
    isAllowToAddNewValues: {
      type: Boolean,
      default: false,
    },
    prefilledValue: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "Select",
    },
    optionLabel: {
      type: String,
      default: "label",
    },
    optionValue: {
      type: String,
      default: "value",
    },
    modelValue: {
      default: null,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const originalOptions = ref(props.options);
    const filterOptions = ref(props.options);

    watch(
      () => props.options,
      (newVal) => {
        originalOptions.value = newVal;
        filterOptions.value = newVal;
      }
    );

    watch(
      () => props.prefilledValue,
      (newVal) => {
        filterOptions.value = originalOptions.value.filter((option) =>
          option[props.optionLabel].toLowerCase().includes(newVal.toLowerCase())
        );
      }
    );
    const clearFunction = () => {
      emit("update:modelValue", null);
    };
    const updateValue = (newValue) => {
      if (
        newValue &&
        typeof newValue === "object" &&
        newValue.hasOwnProperty(props.optionValue)
      ) {
        emit("update:modelValue", newValue[props.optionValue]);
      } else {
        emit("update:modelValue", newValue);
      }
    };

    return {
      filterOptions,
      updateValue,
      clearFunction,

      createValue(val, done) {
        if (props.isAllowToAddNewValues && val.length > 2) {
          let newObj = {
            [props.optionLabel]: val,
            [props.optionValue]: originalOptions.value.length + 1,
          };
          if (
            !originalOptions.value.find(
              (item) => item[props.optionLabel] === val
            )
          ) {
            done(newObj, "add-unique");
          }
        }
      },

      filterFn(val, update) {
        update(() => {
          if (val === "") {
            filterOptions.value = originalOptions.value;
          } else {
            const needle = val.toLowerCase();
            filterOptions.value = originalOptions.value.filter(
              (v) => v[props.optionLabel].toLowerCase().indexOf(needle) > -1
            );
          }
        });
      },
    };
  },
};
</script>
