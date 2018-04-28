<template>
  <div>
    <div class="create-form box">

      <div class="field">
        <label class="label">竞赛标题</label>
        <div class="control">
          <input class="input"
                 type="text"
                 v-model="item.name"
                 placeholder="请输入竞猜标题">
        </div>
      </div>

      <b-field label="开始时间">
        <b-datepicker placeholder="请输入押注开始时间"
                      icon="calendar-today">
        </b-datepicker>
      </b-field>

      <b-field label="结束时间">
        <b-datepicker placeholder="请输入押注结束时间"
                      icon="calendar-today">
        </b-datepicker>
      </b-field>

      <div class="field">
        <label class="label">最低押注金额 ETH（合约参数）</label>
        <div class="control">
          <input class="input"
                 type="number"
                 v-model="item.ponzi"
                 placeholder="最低押注金额 ETH">
        </div>
      </div>

      <div class="field">
        <label class="label">竞赛规则</label>
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
