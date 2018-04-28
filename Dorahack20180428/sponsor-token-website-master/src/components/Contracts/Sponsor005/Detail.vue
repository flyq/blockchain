<template>
  <div class="itemView ">
    <b-modal :active.sync="isComponentModalActive"
             has-modal-card>
      <div class="modal-card"
           style="width: auto">

        <section class="modal-card-body">
          <b-field label="赞赏金额(ETH)">
            <b-input v-model="tipValue"
                     placeholder="赞赏金额 "
                     required>
            </b-input>
          </b-field>

          <b-field label="推荐者账户地址">
            <b-input v-model="referrer"
                     placeholder="推荐人以太网Address">
            </b-input>
          </b-field>

        </section>
        <footer class="modal-card-foot">
          <button class="button"
                  type="button"
                  @click="isComponentModalActive = false;">取消</button>
          <button class="button is-primary"
                  @click="onTip">确定</button>
        </footer>
      </div>
    </b-modal>
    <div v-if="item"
         class="columns is-centered">
      <div class="column is-two-thirds">
        <div class="box">
          <a :href="item.sourceLink"
             target="_blank"
             class="is-pulled-right button is-small is-info is-outlined">查看原内容</a>

          <h1 class=" title is-4"
              style="margin-bottom: 0.8rem;">
            {{item.name}}
          </h1>

          <article class="media ">

            <figure class="media-left">
              <p class="image is-32x32">
                <img style="border-radius:5px"
                     :src="item.creator.avatar">
              </p>
            </figure>
            <div class="media-content">
              <div class="content">
                <p class="is-size-7">
                  <strong>{{item.creator.name}}</strong>
                  <small>{{item.creator.address}}</small>
                  <!-- <small>2天前</small> -->
                  <br/>
                  <span style="font-size:0.88em">{{item.creator.bio}}</span>
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
          <p class="is-size-7 has-text-grey-dark content">
            <ul>
              <li>赞赏时，需要支付一定数量ETH</li>
              <li>赞赏后，你可获得收益：您所赞赏金额的<strong>{{item.ponzi}}%</strong></li>
              <li>当后续有人赞赏后，你的收益才可到账</li>
              <li>如何加快收益到账：点击分享按钮，复制链接给他人，他们赞赏后，你的收益可优先到账 </li>
              <li>如何增加收益：可进行多次赞赏</li>
            </ul>
            <a target="_blank"
               :href="'https://ropsten.etherscan.io/address/'+contractAddress">查看合约</a>
          </p>
        </div>
        <div class="box has-text-centered">
          <nav class="level">
            <div class="level-item has-text-centered">
              <div>
                <h6 class="subtitle is-6 is-spaced">赞赏总额</h6>
                <p class="title">{{item.value}} ETH</p>
              </div>
            </div>
          </nav>

          <a @click="isComponentModalActive = true"
             class="button is-success"
             style="width:100%">
            <span class="icon is-medium">
              <i class="fas fa-lg fa-thumbs-up"></i>
            </span>
            <span>&nbsp;&nbsp;赞赏</span>
          </a>
          <br/><br/>
          <p class="dropdown">
            <span>已获得 {{item.tipTimes}} 次赞赏 </span>
            <span v-if="false"
                  class="icon">
              <i class="fas fa-angle-down"></i>
            </span>
          </p>
        </div>
        <div v-if="item.me"
             class="box has-text-centered">
          <nav class="level">
            <div class="level-item has-text-centered">
              <div>
                <h6 class="subtitle is-6 is-spaced">我的收益</h6>
                <p class="title">{{item.me.total}} ETH</p>
              </div>
            </div>
          </nav>
          <a v-if="false"
             lass="button is-info"
             style="width:100%">
            <span class="icon is-medium">
              <i class="fas fa-lg fa-paper-plane"></i>
            </span>
            <span>&nbsp;&nbsp;分享</span>
          </a>
          <b-dropdown class="ss-share-btn">
            <button class="button is-info"
                    slot="trigger">
              <span class="icon is-medium">
                <i class="fas fa-lg fa-paper-plane"></i>
              </span>
              <span>&nbsp;&nbsp;分享</span>
            </button>

            <b-dropdown-item>
              <a v-clipboard:copy="shareLink"
                 v-clipboard:success="onCopyShareLink.bind(this, true)"
                 v-clipboard:error="onCopyShareLink.bind(this, false)"
                 class="button is-white has-text-grey">
                <span class="icon ">
                  <i class="fas fa-link"></i>
                </span>
                <span>&nbsp;复制链接</span>
              </a>
            </b-dropdown-item>
            <b-dropdown-item v-if="false">
              <a @click="onShare('weibo')"
                 class="button is-white has-text-grey">
                <span class="icon ">
                  <i class="fab fa-weibo"></i>
                </span>
                <span>&nbsp;新浪微博</span>
              </a>
            </b-dropdown-item>
          </b-dropdown>
          <br/>
          <br/>

          <div class="columns">
            <div class="column">
              已到账 {{item.me.got}} ETH
            </div>
            <div class="column">
              未到账 {{item.me.remain}} ETH
              <p v-if="false"
                 class="dropdown">
                <span>未到账 {{item.me.remain}} ETH </span>
                <span class="icon">
                  <i class="fas fa-angle-down"></i>
                </span>
              </p>
            </div>
          </div>
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
import xApi from '@/xApi';

Quill.register('modules/ImageExtend', ImageExtend);

export default {
  name: 'item-view',
  props: ['tokenId', 'contractAddress', 'tx'],
  components: {
    PulseLoader,
    quillEditor,
  },

  data: () => ({
    item: undefined,
    tipValue: undefined,
    referrer: '',
    sponsors: [],
    loading: true,
    editorOption: {},
    isComponentModalActive: false,
  }),

  mounted() {},

  computed: {
    me() {
      return this.$store.state.me || {};
    },
    signInError() {
      return this.$store.state.signInError;
    },
    shareLink() {
      const ref = this.me.address;
      return `${window.document.location.origin}/#${this.$route.path}?id=${
        this.tokenId
      }&address=${this.contractAddress}&ref=${ref}`;
    },
  },
  async created() {
    this.referrer = this.$route.query.ref;

    this.item = await xApi('getItem', {
      contractAddress: this.contractAddress,
      tokenId: this.tokenId,
      tx: this.tx,
      me: this.me.address,
    });
  },

  watch: {},

  methods: {
    async onTip() {
      this.isComponentModalActive = false;
      const tx = await xApi('tipToken', {
        contract: this.contractAddress,
        id: this.tokenId,
        value: Number(this.tipValue),
        referrer: this.referrer || '0x0',
      });
      if (typeof tx === 'string') {
        this.$dialog.alert({
          title: '感谢您的赞赏',
          message: `赞赏已提交，请耐心等待矿工确认<br/> \n <a target="_blank" href="https://ropsten.etherscan.io/tx/${tx}">查看TX详情</a>`,
        });
      }
    },
    onCopyShareLink(isSuccess) {
      if (!isSuccess) {
        alert(`复制失败，请手动复制，分享链接是：${this.shareLink}`);
      } else {
        this.$toast.open('复制成功');
      }
    },
  },
};
</script>
 <style scoped>
.box {
  margin-bottom: 0.8rem;
}
</style>
