<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">
        {{contract.name}}
      </p>
    </header>
    <div class="card-content">
      <div class="content is-size-7" v-html="contract.bio">
      </div>
    </div>
    <!-- <footer class="card-footer">
      <a href="#"
         class="card-footer-item">了解详情</a>
    </footer> -->
  </div>
</template>

<script>
export default {
  props: ['contract'],
};
</script>

<style lang="postcss" scoped>
.card {
  cursor: pointer;
}
</style>

