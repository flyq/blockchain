<template>
  <div class="item-view">
    <div v-if="loading"
         class="loader-wrapper">
      <pulse-loader></pulse-loader>
    </div>

    <section v-if="item"
             class="session"
             style="background-image: url(./static/icons-background.svg)">
      <div class="hero-body">
        <div class="column is-8 is-offset-2">
          <div class="box">
            <router-link class="is-pulled-right has-text-link"
                         :to="{ name: 'CreateItem', query:{parentId: item.id}}">
              创建子Token
            </router-link>
            <div class="columns">
              <div class="column ">
                <div class="column">
                  <img v-bind:src="item.coverUrl" />
                  <ul>
                    <li>{{$t('ID')}}: {{item.id}}</li>
                    <li>{{$t('Creator')}}:
                      <router-link :to="{ name: 'User', params:{address: item.creator}}">
                        {{item.creator.slice(-6).toUpperCase()}}
                      </router-link>
                    </li>
                    <li>{{$t('Owner')}}:
                      <router-link :to="{ name: 'User', params:{address: item.owner}}">
                        {{item.owner.slice(-6).toUpperCase()}}
                      </router-link>
                    </li>
                    <li>{{$t('Current Price')}}: {{toDisplayedPrice(item.price)}}</li>

                    <li v-if="isEdit">
                      {{$t('Token Cover')}}: <input class="input-loc-img"
                             type='file'
                             accept="image/*"
                             @change="selectImage" />
                    </li>

                    <li v-if="!isEdit">{{$t('Token Name')}}: {{item.name}}</li>
                    <li v-else>{{$t('Token Name')}}: <input class="input"
                             type="text"
                             v-model="item.name"></li>
                    <li v-if="!isEdit">{{$t('Token Bio')}}: {{item.bio}}</li>
                    <li v-else>{{$t('Token Bio')}}:
                      <textarea class="textarea"
                                v-model="item.bio"></textarea>
                    </li>
                  </ul>

                </div>
              </div>

            </div>

            <div class="has-text-centered">
              <div class="has-text-centered">
                <template v-if="item.status === 'SELLING' && ((me && item.owner !== me.address) || signInError) ">
                  <button class="button is-success"
                          @click="onBuy">{{$t('Buy Token')}}</button>
                </template>
                <template v-if="item.creator === me.address">
                  <button v-if="!isEdit"
                          class="button is-danger is-outlined"
                          @click="onSwitchToEditStatus">编辑</button>
                  <button v-else
                          class="button is-danger "
                          @click="onUpdate">确认</button>
                </template>
              </div>
              <br/>
              <template v-if="item.status == 'FROZEN'">
                <article class="message is-danger">
                  <div class="message-body">
                    {{$t('After frozen date, you can buy',{after: new Date(item.free1).toLocaleString()})}}
                  </div>
                </article>
              </template>
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

      <div v-if="!isEdit"
           class="quill-editor">
        <div class="ql-container ql-snow">
          <div class="ql-editor"
               v-html="item.content">
          </div>
        </div>
      </div>

      <quill-editor v-else
                    v-model="item.content"
                    :options="editorOption">
      </quill-editor>
    </section>

    <div v-else-if="item === null">
      Token doesn't exist
    </div>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import { quillEditor, Quill } from 'vue-quill-editor';
import { container, ImageExtend, QuillWatch } from 'quill-image-extend-module';
import PulseLoader from 'vue-spinner/src/PulseLoader';
import { buyItem, callServerRpc, saveImage, apiUrl } from '@/api';
import { toReadablePrice } from '@/util';

Quill.register('modules/ImageExtend', ImageExtend);

export default {
  name: 'item-view',

  components: {
    PulseLoader,
    quillEditor,
  },

  data: () => ({
    item: undefined,
    isEdit: false,
    loading: true,
    editorOption: {
      modules: {
        ImageExtend: {
          loading: true,
          name: 'img',
          action: `${apiUrl}/file`,
          response: res => res.img.url,
        },
        toolbar: {
          container,
          handlers: {
            image() {
              QuillWatch.emit(this.quill.id);
            },
          },
        },
      },
    },
  }),

  mounted() {},

  computed: {
    itemId() {
      return this.$route.params.id;
    },
    me() {
      return this.$store.state.me || {};
    },
    signInError() {
      return this.$store.state.signInError;
    },
  },
  async created() {
    this.item = await callServerRpc('getItem', { id: this.itemId });
    this.loading = false;
  },

  watch: {},

  methods: {
    onSwitchToEditStatus() {
      this.isEdit = true;
    },
    async onUpdate() {
      await callServerRpc('updateItem', this.item);
      this.isEdit = false;
    },
    onBuy() {
      if (this.$store.state.signInError) {
        this.$router.push({ name: 'Login' });
        return;
      }
      const buyPrice = this.item.price;
      buyItem(this.itemId, buyPrice)
        .then((txHash) => {
          alert(`${this.$t('BUY_SUCCESS_MSG')} TXHash: ${txHash}`);
        })
        .catch((e) => {
          alert(this.$t('BUY_FAIL_MSG'));
          console.log(e);
        });
    },
    toDisplayedPrice(priceInWei) {
      const readable = toReadablePrice(priceInWei);
      return `${readable.price} ${readable.unit}`;
    },
    async selectImage(e) {
      // this.loading = true;
      const files = e.target.files || e.dataTransfer.files;
      const file = await saveImage(files[0]);
      this.item.cover = file.id;
      this.item.coverUrl = file.url;
      this.$forceUpdate();
      // this.loading = true;
    },
  },
};
</script>
 <style scoped>

</style>
