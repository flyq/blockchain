<template>
  <div>
    <div v-if="loading"
         class="loader-wrapper">
      <pulse-loader></pulse-loader>
    </div>
    <section class="session"
             style="background-image: url(./static/icons-background.svg)">
      <div class="hero-body">
        <div class="column is-8 is-offset-2">
          <div class="box ">
            <div class="columns">
              <div class="column ">

                <div class="column ">
                  <!--  <h1 class="">
                  {{$t('Nickname')}}: {{nickame}}
                </h1> -->
                  <h2 class="">
                    {{$t('Address')}}: {{address}}
                  </h2>
                  <!--  <h1 class="">
                  {{$t('Benefit')}}: {{benefit}}
                </h1> -->
                </div>
              </div>

            </div>

            <div v-if="false"
                 class="navbar-tabs">
              <a class="navbar-item is-tab">
                <a v-if="me && me.address.toUpperCase() === address">{{$t('Cards I Bought')}}</a>
                <a v-else>{{$t('Cards He Bought')}}</a>
              </a>
              <a class="navbar-item is-tab">
                <a v-if="me && me.address.toUpperCase() === address">{{$t('Cards I Created')}}</a>
                <a v-else>{{$t('Cards He Created')}}</a>
              </a>
            </div>
          </div>
        </div>

      </div>

    </section>
    <h2 class="subtitle"
        v-if="me && me.address.toUpperCase() === address">{{$t('Cards I Created')}}</h2>
    <h2 class="subtitle"
        v-else>{{$t('Cards He Created')}}</h2>
    <ItemList :items='createdItems' />

    <h2 class="subtitle"
        v-if="me && me.address.toUpperCase() === address">{{$t('Cards I Bought')}}</h2>
    <h2 class="subtitle"
        v-else>{{$t('Cards He Bought')}}</h2>
    <ItemList :items='ownedItems' />
  </div>
</template>

<script>
import PulseLoader from 'vue-spinner/src/PulseLoader';
import ItemList from '@/components/ItemList';
import { callServerRpc } from '@/api';

export default {
  name: 'UserView',
  components: {
    ItemList,
    PulseLoader,
  },
  data: () => ({
    createdItems: [],
    ownedItems: [],
    loading: -2,
  }),

  computed: {
    address() {
      return this.$route.params.address.toUpperCase();
    },
    me() {
      return this.$store.state.me;
    },
  },
  created() {
    callServerRpc('findItems', {
      creator: this.$route.params.address,
    }).then((items) => {
      this.createdItems = items;
      this.loading++;
    });

    callServerRpc('findItems', {
      owner: this.$route.params.address,
    }).then((items) => {
      this.ownedItems = items;
      this.loading++;
    });
  },

  watch: {},

  methods: {},
};
</script>
<style scoped>
.user-info-wrapper {
  border-radius: 5px;
}
</style>

