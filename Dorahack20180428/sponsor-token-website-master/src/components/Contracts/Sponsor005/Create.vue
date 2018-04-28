<template>
  <div>
    <div class="create-form box">
      <div class="field">
        <label class="label">内容原链接</label>
        <div class="control">
          <input class="input"
                 type="text"
                 v-model="item.sourceLink"
                 placeholder="请输入内容原链接">
        </div>
      </div>

      <div class="field">
        <label class="label">标题</label>
        <div class="control">
          <input class="input"
                 type="text"
                 v-model="item.name"
                 placeholder="请输入标题">
        </div>
      </div>

      <div class="field">
        <label class="label">打赏Ponzi系数（100-200之间整数，打赏者可获得打赏金额*Ponzi的收益）</label>
        <div class="control">
          <input class="input"
                 type="number"
                 v-model="item.ponzi"
                 placeholder="请输入旁氏系数">
        </div>
      </div>

      <div class="field">
        <label class="label">内容详情</label>
        <div class="control">
          <quill-editor v-model="item.content"
                        :options="editorOption">
          </quill-editor>
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
import { quillEditor, Quill } from 'vue-quill-editor';
import { container, ImageExtend, QuillWatch } from 'quill-image-extend-module';
import xApi from '@/xApi';
import { defaultNetwork } from '@/config';

Quill.register('modules/ImageExtend', ImageExtend);

export default {
  props: ['contract'],
  components: {
    quillEditor,
  },
  data() {
    return {
      item: {},
      editorOption: {
        modules: {
          ImageExtend: {
            loading: true,
            name: 'img',
            action: `${defaultNetwork.apiUrl}/file`,
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
    };
  },
  created() {},
  methods: {
    async onSubmit() {
      const tx = await xApi('createItem', {
        contractAddress: this.contract.address,
        item: this.item,
      });
      if (typeof tx === 'string') {
        this.$router.push({ name: 'Item', query: { tx } });
      }
    },
  },
};
</script>

