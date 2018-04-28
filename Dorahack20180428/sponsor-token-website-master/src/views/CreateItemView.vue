<template>
  <div class="createTokenView"
       style="background-image: url(./static/icons-background.svg)">
    <div class="hero-body">
      <div class="column is-4 is-offset-4">
        <h3 class="title has-text-grey has-text-centered">Create Token</h3>
        <p class="subtitle has-text-grey has-text-centered">You can create your own token now</p>
        <div class="container">
          <div class="box"
               style="width: 400px;">
            <div class="field is-horizen">
              <label class="label">发行价</label>
              <div class="field has-addons">
                <p class="control is-expanded">
                  <input class="input"
                         type="number"
                         v-model="price"
                         placeholder="输入Token的发行价">
                </p>
                <p class="control">
                  <a class="button is-static">
                    ETH
                  </a>
                </p>
              </div>
              <label v-if="false"
                     class="label">Frozen时间1</label>
              <div v-if="false"
                   class="field has-addons">
                <p class="control is-expanded">
                  <input class="input"
                         type="number"
                         v-model="frozen1"
                         placeholder="请输入冻结的时间">
                </p>
                <p class="control">
                  <a class="button is-static">
                    s
                  </a>
                </p>
              </div>
              <label v-if="false"
                     class="label">Frozen时间2</label>
              <div v-if="false"
                   class="field has-addons">
                <p class="control is-expanded">
                  <input class="input "
                         type="number"
                         v-model="frozen2"
                         placeholder="请输入冻结的时间">
                </p>
                <p class="control">
                  <a class="button is-static">
                    s
                  </a>
                </p>
              </div>

              <!--<p class="help">This username is available</p>-->
              <label class="label">父Token ID</label>
              <div class="field ">
                <p class="control">
                  <input class="input"
                         type="number"
                         v-model="parentId"
                         placeholder="请输入父token的编号">
                </p>
              </div>

              <label v-if="false"
                     class="label">Token 名称</label>
              <div v-if="false"
                   class="field ">
                <p class="control">
                  <input class="input"
                         type="text"
                         v-model="name"
                         placeholder="请输入Token的名称">
                </p>
              </div>

              <label v-if="false"
                     class="label">Token 简介</label>
              <div v-if="false"
                   class="field ">
                <textarea class="textarea"
                          placeholder="e.g. Hello world"
                          v-model="bio"></textarea>
              </div>
              <div class="field is-grouped">
                <div class="control">
                  <button class="button is-link is-fullwidth"
                          @click="onSubmit">创建</button>
                </div>
                <div v-if="false"
                     class="control">
                  <button class="button is-text">取消</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createToken } from '@/api';

export default {
  name: 'item-view',

  data: () => ({
    price: null,
    frozen1: 0,
    frozen2: 100 * 24 * 60 * 60,
    parentId: null,
    name: null,
    bio: null,
  }),

  computed: {},
  async created() {
    this.parentId = this.$route.query.parentId;
  },

  watch: {},

  methods: {
    async onSubmit() {
      const txHash = await createToken({
        price: this.price,
        frozen1: this.frozen1,
        frozen2: this.frozen2,
        parentId: this.parentId,
      });
      alert(`已提交，请等待矿工确认，稍后到个人页面刷新查看. TX:${txHash}`);
    },
  },
};
</script>
 <style scoped>

</style>
