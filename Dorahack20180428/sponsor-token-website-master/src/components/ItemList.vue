<template>
  <div class="columns is-multiline is-mobile">
    <router-link v-for="item in items"
                 v-if="item"
                 :to="{ name: 'Item', query:{id:item.tokenId, address:item.contract}}"
                 class="column
           is-full-mobile
           is-one-quarter-tablet
           is-one-quarter-desktop
           is-one-quarter-widescreen
           is-one-quarter-fullhd"
                 :key=item._id.toString()>
      <div class="card">
        <div class="card-content">
          <p class="sub-title">
            {{item.name}}
          </p>
        </div>
      </div>
    </router-link>
  </div>
  </div>
</template>

<script>
export default {
  name: 'item-lists',
  props: ['items'],

  data: () => ({}),

  computed: {},

  methods: {},

  created() {},

  watch: {},
};
</script>
 <style scoped>

</style>

