<template>
  <div class="itemView ">
    <div class="columns is-centered">
      <div class="column is-two-thirds">
        <div class="box">
          <a class="is-pulled-right button is-small is-info is-outlined">查看原内容</a>

          <h1 class=" title is-4"
              style="margin-bottom: 0.8rem;">
            {{item.name}}
          </h1>

          <article class="media ">

            <figure class="media-left">
              <p class="image is-32x32">
                <img style="border-radius:5px"
                     src="http://ww1.sinaimg.cn/large/006z6wKXgy1fqh5t88cpfj30b40b4abx.jpg">
              </p>
            </figure>
            <div class="media-content">
              <div class="content">
                <p class="is-size-7">
                  <strong>玲珑邪僧</strong>
                  <small>@EFXIU8</small>
                  <!-- <small>2天前</small> -->
                  <br/>
                  <span style="font-size:0.88em">公众号「万物情史」/研发工程师/Python/Js</span>
                </p>
              </div>

            </div>
          </article>
          <hr style="margin:0.5rem 0;" />
          <div class="quill-editor"
               style="padding:0;">
            <div class="ql-container ql-snow"
                 style="border:none;">
              <div class="ql-editor"
                   v-html="item.content">
              </div>
            </div>
          </div>
        </div>

      </div>
      <div class="column ">
        <div class="box ">
          <h6 class="subtitle is-6 is-spaced is-marginless">赞赏说明</h6>
          <hr style="margin: 0.5rem 0;" />
          <p class="is-size-7 has-text-grey-dark">赞赏时，需要支付一定数量ETH，大部分会通过智能合约转账给内容作者。同时，你也可分享链接给他人，别人通过您的链接赞赏后，你也可获得收益。
            <a href="#">查看详情</a>
          </p>
        </div>
        <div class="box has-text-centered">
          <nav class="level">
            <div class="level-item has-text-centered">
              <div>
                <h6 class="subtitle is-6 is-spaced">赞赏总额</h6>
                <p class="title">126.3 ETH</p>
              </div>
            </div>
          </nav>

          <a class="button is-success"
             style="width:100%">
            <span class="icon is-medium">
              <i class="fas fa-lg fa-thumbs-up"></i>
            </span>
            <span>&nbsp;&nbsp;赞赏</span>
          </a>
          <br/><br/>
          <p class="dropdown">
            <span>已获得 350,973 次赞赏 </span>
            <span class="icon">
              <i class="fas fa-angle-down"></i>
            </span>
          </p>
        </div>
        <div class="box has-text-centered">
          <nav class="level">
            <div class="level-item has-text-centered">
              <div>
                <h6 class="subtitle is-6 is-spaced">我的收益</h6>
                <p class="title">2.8 ETH</p>
              </div>
            </div>
          </nav>
          <a class="button is-info"
             style="width:100%">
            <span class="icon is-medium">
              <i class="fas fa-lg fa-paper-plane"></i>
            </span>
            <span>&nbsp;&nbsp;分享</span>
          </a>
          <br/>
          <br/>

          <div class="columns">
            <div class="column">
              102 人已阅
            </div>
            <div class="column">

              <p class="dropdown">
                <span>58 人赞赏 </span>
                <span class="icon">
                  <i class="fas fa-angle-down"></i>
                </span>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>

    <div v-if="false"
         class="columns is-centered">

      <div class="column is-two-thirds">
        <div class="has-text-centered box">
          <figure class="image is-128x128"
                  style="margin:auto;">
            <img :src="this.item.coverUrl"
                 alt="Image">
          </figure>
          <a href="#">
            <h1 class="title">Title</h1>
          </a>
          <p class="subtitle is-4">Subtitle 3</p>
          <template v-if="Math.random()>0.5">
            <a class="button is-danger is-large">赞赏</a>
          </template>
          <template v-else>
            <a class="button is-danger is-large"
               disabled>已赞赏</a>
            <br/>
            <br/>

            <article class="message ">
              <div class="message-body"
                   style="">
                把链接分享给好友，他们打赏后，你也可获得收益。
                <br/><br/>
                <div class="field has-addons">
                  <div class="control">
                    <input class="input"
                           type="text"
                           :value="inviteLink"
                           readonly/>
                  </div>
                  <div class="control">
                    <a class="button is-info">
                      复制链接
                    </a>
                  </div>
                </div>
              </div>
            </article>

            <!-- <button class="button"
                    @click="onInvite">邀请好友打赏</button> -->
          </template>
        </div>
      </div>
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
    inviteLink:
      'https://smartsignature.io/item/1?from=0x0xd0792ac0de7ef31197c5f452b21a34389ecc725f',
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
  },

  watch: {},

  methods: {
    onInvite() {
      // 没有Metamask
      // Metamask被锁了
      // 自己还没打赏过

      this.$dialog.alert({
        title: '邀请朋友打赏',
        message: '',
        type: 'is-danger',
        confirmText: '复制链接',
      });

      //   this.$dialog.alert({
      //     title: "Title Alert",
      //     message: "I have a title, a custom button and <b>HTML</b>!",
      //     confirmText: "Cool!"
      //   });
    },
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
.box {
  margin-bottom: 0.8rem;
}
</style>
