<template>
  <div>
    <slot name="controls"></slot>
    <q-table
      :rows="rows"
      :columns="columns"
      :rows-per-page-options="[0]"
      :filter="filter"
      @row-click="onRowClick">
      <template v-slot:top-right>
        <q-input
          borderless
          dense
          debounce="300"
          v-model="filter"
          placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <div v-if="props.row.status === null || props.row.status === 'Open'">
            <q-icon name="circle" color="red" />
            <span class="text-red">Open</span>
          </div>
          <div v-else-if="props.row.status === 'TBD'">
            <q-icon name="circle" color="yellow" />
            <span class="text-yellow">TBD</span>
          </div>
          <div v-else-if="props.row.status === 'Done'">
            <q-icon name="circle" color="green" />
            <span class="text-green">Done</span>
          </div>
        </q-td>
      </template>
    </q-table>
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
  data() {
    return {
      filter: "",
    };
  },
};
</script>
