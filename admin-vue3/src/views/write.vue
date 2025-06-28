<template>
  <div class="write-header">
    <div class="write-header-title write-header-item">
      <input v-model="article.model.title" @input="handleTitleInput" placeholder="请输入标题..." />
    </div>
    <div class="write-header-actions write-header-item">
      <el-button type="info" @click="article.handleCancel">取消</el-button>
      <el-button type="primary" @click="article.handleSave">发布</el-button>
    </div>
  </div>

  <div class="write-main">
    <MdEditor v-model="article.model.content" height="100vh" @save="article.handleSave" />
  </div>

  <gameArticleEdit ref="gameArticleEditRef" v-model:model="article.model" @success="article.handleSubmitSuccess" />
</template>

<script setup>
import gameArticleEdit from '@/views/game/article/components/edit'

const gameArticleEditRef = ref()

const route = useRoute()
/**
 * desc: 编辑文章页面,所有需要编辑文章的模块最后都聚合到当前页面，操作统一封装
 */
const { action, id } = route.query

import { getArticle } from '@/api/game/article'
import MdEditor from '@/components/MdEditor/index.vue'

import useWrtie from '@/hooks/useWrite'

const useWriteGame = useWrtie({ get: getArticle }, { id }, { key: 'articleId' })

const article = reactive({
  model: {
    title: '',
    content: ''
  },
  getContent: async () => {
    switch (action) {
      case 'gameArticle':
        await useWriteGame.request()
        article.model.title = useWriteGame.state.title
        article.model.content = useWriteGame.state.content
        break
    }

    window.document.title = `编辑 - ${article.model.title}`
  },
  handleCancel: () => {
    useWriteGame.onCancel()
  },
  handleSave: () => {
    const form = useWriteGame.onSubmit(article.model)
    switch (action) {
      case 'gameArticle':
        gameArticleEditRef.value.handleUpdate(form)
        break
    }
  },
  handleSubmitSuccess: () => {
    setTimeout(() => {
      ElMessageBox.confirm('您已完成发布，要关闭当前页面吗？', '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          window.close()
        })
        .catch(() => {
          console.log('取消关闭')
        })
    }, 2000)
  }
})

// 监听文字输入时，截取前25个字
const handleTitleInput = () => {
  if (article.model.title.length > 25) {
    article.model.title = article.model.title.slice(0, 25)
    ElMessage.warning('标题长度不能超过25个字')
  }
}

article.getContent()
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
      width: calc(100% - 200px);
      float: left;
      padding: 0 12px;
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
      width: 170px;
      float: right;
      padding: 0 8px;
      padding-right: 25px;
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
