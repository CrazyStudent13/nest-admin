<template>
  <div class="write-header">
    <div class="write-header-title write-header-item">
      <input v-model="title" placeholder="请输入标题..." />
    </div>
    <div class="write-header-actions write-header-item">
      <el-button type="info" @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSave">发布</el-button>
    </div>
  </div>

  <div class="write-main">
    <MdEditor v-model="form.model.content" height="100vh" @save="form.handleSave" />
  </div>
</template>

<script setup>
// const route = useRoute()
// import { getArticle } from '@/api/game/article'
import MdEditor from '@/components/MdEditor/index.vue'

const form = reactive({
  modelValue: '',
  model: {},
  getContent: async () => {
    // const articleId = route.query.articleId
    // getArticle(articleId).then((res) => {
    //   const content = res?.data?.content
    //   form.model.content = content.slice(1, -1).replace(/\\n/g, '\n')
    // })
  },
  handleSave: () => {
    console.log(form.model.content)
  }
})

// onMounted(() => {
//   form.getContent()
// })
</script>

<style lang="scss" scoped>
.write {
  &-header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    width: 100vw;
    height: 55px;
    background: #fff;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &-title {
      float: left;
      margin: 0 12px;
      font-size: 16px;
      line-height: 55px;
      input {
        width: 100%;
        height: 100%;
        border: none;
        outline: none;
        background: transparent;
        font-size: 18px;
        line-height: 55px;
        color: #333;
      }
    }

    &-actions {
      float: right;
      padding: 0 8px;
      margin-right: 25px;
      &::after {
        content: ' ';
        display: block;
        clear: both;
      }
    }
  }

  &-main {
    margin-top: 55px;
    height: calc(100vh - 55px);
  }
}
</style>
