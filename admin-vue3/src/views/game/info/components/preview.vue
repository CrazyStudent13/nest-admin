<template>
  <el-drawer v-model="drawer.visible" :header-class="'drawer-title'" size="1000px" direction="rtl" @close="handleClose">
    <template #title>
      <h3>{{ drawer.title }}</h3>
    </template>

    <el-tabs v-model="drawer.activeName" style="margin-top: 0px">
      <el-tab-pane label="基本信息" name="first">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="游戏中文名" label-class-name="desc-label">{{ form.nameZh }}</el-descriptions-item>
          <el-descriptions-item label="游戏英文名" label-class-name="desc-label">{{ form.nameEn }}</el-descriptions-item>
          <!-- <el-descriptions-item label="游戏类型" label-class-name="desc-label">
            <el-tag size="small">{{ gameTypeLabel }}</el-tag>
          </el-descriptions-item> -->
          <el-descriptions-item label="当前版本" label-class-name="desc-label">{{ form.version }}</el-descriptions-item>
          <el-descriptions-item label="最近价格" label-class-name="desc-label">{{ form.price }} 元</el-descriptions-item>
          <el-descriptions-item label="开发商" label-class-name="desc-label">{{ form.gameStudio }}</el-descriptions-item>
          <el-descriptions-item label="游戏简介" :span="3" label-class-name="desc-label">
            {{ form.desc }}
          </el-descriptions-item>
          <el-descriptions-item label="创建时间" label-class-name="desc-label">
            {{ form.createTime }}
          </el-descriptions-item>
          <el-descriptions-item label="修改时间" label-class-name="desc-label">
            {{ form.updateTime }}
          </el-descriptions-item>
        </el-descriptions>
      </el-tab-pane>
    </el-tabs>
  </el-drawer>
</template>

<script setup>
// const { proxy } = getCurrentInstance()
// const game_types = useDict('game_type')

const form = ref({
  gameId: null,
  nameZh: '',
  nameEn: '',
  desc: '',
  gameType: '',
  version: '',
  price: 0,
  gameStudio: '',
  createTime: '',
  updateTime: ''
})

const drawer = ref({
  visible: false,
  activeName: 'first',
  title: '游戏信息详情'
})

// // 计算属性获取游戏类型标签
// const gameTypeLabel = computed(() => {
//   const type = game_types.value.find((t) => t.value === form.value.gameType)
//   return type ? type.label : '未知类型'
// })

// 打开预览对话框
const handleOpen = (row) => {
  form.value = {
    ...row,
    createTime: row.createTime ? row.createTime : '',
    updateTime: row.updateTime ? row.updateTime : ''
  }
  drawer.value.title = `游戏信息详情 - ${row.nameZh}`
  drawer.value.visible = true
}

// 关闭抽屉
const handleClose = () => {
  drawer.value.visible = false
}

// 暴露方法给父组件调用
defineExpose({
  handleOpen,
  handleClose
})
</script>

<style lang="scss" scoped>
.drawer-title {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 20px 20px 0;
  font-weight: bold;
}

.desc-label {
  width: 120px;
  font-weight: 800;
}
</style>
