<template>
  <div id="app">
    <b-loading :is-full-page="true"
               :active.sync="isLoading"></b-loading>
    <xHeader />

    <router-view class="view ss-container"
                 :key="key"></router-view>

    <Footer />
  </div>
</template>

<script>
import emitter from '@/emitter';
import xHeader from '@/components/xHeader';
import Footer from '@/components/Footer';

export default {
  name: 'App',
  components: {
    xHeader,
    Footer,
  },
  computed: {
    key() {
      return this.$route.name !== undefined
        ? this.$route.name + +new Date()
        : this.$route + +new Date();
    },
  },
  data: () => ({
    isLoading: false,
  }),
  methods: {
    alertError(err) {
      this.$dialog.alert({
        type: 'is-danger',
        title: '',
        message: `${err.message}<br/> <small><b>错误编码: </b>${err.code}</small>`,
        hasIcon: true,
        icon: 'times-circle',
        iconPack: 'fa',
      });
    },
    toggleActivityIndicator(isShow) {
      this.isLoading = isShow;
    },
  },
  created() {},
  mounted() {
    emitter.on('ALERT_ERROR', this.alertError);
    emitter.on('TOGGLE_ACTIVITY_INDICATOR', this.toggleActivityIndicator);
  },
  beforeDestroy() {
    emitter.removeListener('ALERT_ERROR', this.alertError);
    emitter.removeListener(
      'TOGGLE_ACTIVITY_INDICATOR',
      this.toggleActivityIndicator,
    );
  },
};
</script>

<style lang="postcss">
body {
  font-family: Calibre, Helvetica, Arial, sans-serif;
  background: #f6f6f6;
}
#app {
}
.ss-container {
  width: 1000px !important;
  padding: 0 16px !important;
}

.view {
  margin-top: 2rem;
  margin-bottom: 2rem;
  min-height: 100vh;
  margin: 10px auto;
}
.loader-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
.ss-share-btn {
  width: 100%;
  & .dropdown-trigger {
    width: 100%;
    & .button {
      width: 100%;
    }
  }
  & .dropdown-item {
    & .button {
      background: none;
      font-size: 0.875rem;
    }
  }
}
</style>
