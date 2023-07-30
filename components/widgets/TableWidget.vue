<template>
  <div>
    <q-table
      :rows="rows"
      :columns="columns"
      :rows-per-page-options="[0]"
      @row-click="onRowClick" />
  </div>
</template>
<script>
export default {
  props: {
    rows: {
      type: Array,
      required: true,
    },
    columns: {
      type: Array,
      required: true,
    },
    onRowClick: {
      type: Function,
      required: true,
    },
  },
};
</script>
