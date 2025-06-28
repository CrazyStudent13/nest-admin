<template>
  <el-drawer v-model="drawer.visible" size="1000px" direction="rtl" @close="handleClose">
    <template #title>
      <div class="drawer-title">
        <h3>{{ drawer.title }}</h3>
        <div style="margin-left: 15px">
          <el-button type="primary" size="small" @click="handleUpdate">编辑</el-button>
        </div>
      </div>
    </template>
    <el-tabs v-model="drawer.activeName" style="margin-top: 0px" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="first">
        <h2 class="article-title">{{ form.model.title }}</h2>
        <el-descriptions>
          <el-descriptions-item label="发布时间" label-class-name="desc-label">{{ form.model.publishTime }}</el-descriptions-item>
          <el-descriptions-item label="创建时间" label-class-name="desc-label">{{ form.model.createTime }}</el-descriptions-item>
          <el-descriptions-item label="最后修改时间" :label-class-name="'desc-label'">{{ form.model.updateTime }}</el-descriptions-item>
          <el-descriptions-item label="文章简介" direction="vertical" :span="3" label-class-name="desc-label">{{ form.model.remark }}</el-descriptions-item>
        </el-descriptions>
      </el-tab-pane>
      <el-tab-pane label="文章内容" name="detail">
        <MdViewer :value="form.model.content" style="float: left" />
      </el-tab-pane>
    </el-tabs>
  </el-drawer>
</template>

<script setup>
import dayjs from 'dayjs'
import { getArticle } from '@/api/game/article'
import MdViewer from '@/components/MdViewer'
const router = useRouter()

const drawer = reactive({
  visible: false,
  activeName: 'first',
  title: '新增文章'
})

const form = reactive({
  model: {}
})

const handleUpdate = () => {
  const routeData = router.resolve({
    path: '/write',
    query: {
      id: form.model.articleId,
      action: 'gameArticle'
    }
  })

  window.open(routeData.href, '_blank')
}

const handleOpen = (row) => {
  const articleId = row.articleId || ids.value
  getArticle(articleId).then((res) => {
    form.model = res.data
    drawer.title = `${form.model.title}`

    form.model.updateTime = dayjs(form.model.updateTime).format('YYYY-MM-DD HH:mm:ss')
    form.model.createTime = dayjs(form.model.createTime).format('YYYY-MM-DD HH:mm:ss')
    form.model.publishTime = dayjs(form.model.publishTime).format('YYYY-MM-DD HH:mm:ss')
    drawer.visible = true
  })
}

const emit = defineEmits(['close'])
const handleClose = () => {
  emit('close')
  drawer.visible = false
}

defineExpose({
  handleOpen,
  handleClose
})
</script>

<style lang="scss" scoped>
.drawer-title {
  display: flex;
  align-items: center;
  margin-right: 20px;
  font-weight: bold;
}

.article-title {
  width: 100vw;
  font-weight: 600;
  padding: 24px 0;
  margin-bottom: 30px;
  font-size: 1.5em;
  border-bottom: 1px solid rgba(209, 217, 224, 0.7019607843);
}

.desc-label {
  width: 120px;
  font-weight: 800;
}
</style>
