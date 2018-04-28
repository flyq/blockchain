<template>
  <div>
    <div class="create-form box">

      <div class="field">
        <label class="label">拍卖标题</label>
        <div class="control">
          <input class="input"
                 type="text"
                 v-model="item.name"
                 placeholder="请输入标题">
        </div>
      </div>

      <div class="field">
        <label class="label">发行价 ETH（合约参数）</label>
        <div class="control">
          <input class="input"
                 type="number"
                 v-model="item.ponzi"
                 placeholder="请输入发行价">
        </div>
      </div>

      <div class="field">
        <label class="label">请设定溢价系数（合约参数）</label>
        <div class="control">
          <input class="input"
                 type="number"
                 v-model="item.ponzi"
                 placeholder="请设定溢价系数">
        </div>
      </div>

      <div class="field">
        <label class="label">拍卖内容简介</label>
        <div class="control">
          <textarea class="textarea"
                    v-model="item.bio"></textarea>
        </div>
      </div>

      <div class="field is-grouped">
        <div class="control">
          <button class="button is-link"
                  @click="onSubmit">创建</button>
        </div>
        <div class="control">
          <button class="button is-text">取消</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import { quillEditor } from 'vue-quill-editor';

export default {
  components: {
    quillEditor,
  },
  data() {
    return {
      item: {},
      editorOption: {},
    };
  },
  async created() {},
  methods: {
    onSubmit() {
      // 1. invoke web3 to create token in contract
      // 2. call server api to create item in database
      console.log(this.item);
      alert('功能正在开发... 敬请期待');
    },
  },
};
</script>
