<template>
  <div class="" style="background-image: url(./static/icons-background.svg)">
    <div v-if="loading"
         class="loader-wrapper">
      <pulse-loader></pulse-loader>
    </div>
    <ItemList :items='items' />
  </div>
</template>

<script>
import PulseLoader from 'vue-spinner/src/PulseLoader';
import ItemList from '@/components/ItemList';
import { getTotal, callServerRpc } from '@/api';

export default {
  name: 'item-list',
  components: {
    PulseLoader,
    ItemList,
  },

  data() {
    return {
      items: [],
      loading: true,
      itemIds: [],
      total: null,
    };
  },

  computed: {},

  async created() {
    this.items = await callServerRpc('findItems');
    // this.total = await getTotal();
    // const itemIds = Array.from(
    //   new Array(this.total.toNumber()),
    //   (val, index) => index
    // );
    // this.itemIds = itemIds;
    this.loading = false;
  },

  methods: {},
  watch: {},
};
</script>
<style scoped>

</style>

