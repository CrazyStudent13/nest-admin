<template>
  <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px" append-to-body>
    <el-form label-width="120px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="游戏中文名">
            <el-input v-model="form.nameZh" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="游戏英文名">
            <el-input v-model="form.nameEn" disabled />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="游戏类型">
            <el-select v-model="form.gameType" disabled style="width: 100%">
              <el-option v-for="dict in game_types" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="当前版本">
            <el-input v-model="form.version" disabled />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="最近价格">
            <el-input-number v-model="form.price" disabled style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开发商">
            <el-input v-model="form.gameStudio" disabled />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="游戏简介">
            <el-input v-model="form.desc" type="textarea" :rows="3" disabled />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="创建时间">
            <el-input v-model="form.createTime" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="修改时间">
            <el-input v-model="form.updateTime" disabled />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
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

const dialogVisible = ref(false)
const dialogTitle = ref('')

// 使用数据字典
const { proxy } = getCurrentInstance()
const { game_types } = proxy.useDict('game_type')

// 打开预览对话框
const handleOpen = (row) => {
  form.value = {
    ...row,
    createTime: row.createTime ? row.createTime : '',
    updateTime: row.updateTime ? row.updateTime : ''
  }
  dialogTitle.value = `游戏信息详情 - ${row.nameZh}`
  dialogVisible.value = true
}

// 暴露方法给父组件调用
defineExpose({
  handleOpen
})
</script>

<style scoped></style>
