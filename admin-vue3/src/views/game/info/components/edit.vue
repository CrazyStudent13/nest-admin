<template>
  <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px" append-to-body>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="游戏中文名" prop="nameZh">
            <el-input v-model="form.nameZh" placeholder="请输入游戏中文名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="游戏英文名" prop="nameEn">
            <el-input v-model="form.nameEn" placeholder="请输入游戏英文名" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="游戏类型" prop="gameType">
            <el-select v-model="form.gameType" placeholder="请选择游戏类型" style="width: 100%">
              <el-option v-for="dict in game_types" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="当前版本" prop="version">
            <el-input v-model="form.version" placeholder="请输入当前版本号" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="最近价格" prop="price">
            <el-input-number v-model="form.price" placeholder="请输入最近价格" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开发商" prop="gameStudio">
            <el-input v-model="form.gameStudio" placeholder="请输入游戏开发商" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="游戏简介" prop="desc">
            <el-input v-model="form.desc" type="textarea" :rows="3" placeholder="请输入游戏简介" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="form.gameId">
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
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { addGameInfo, updateGameInfo } from '@/api/game/info'
import { ElMessage, ElMessageBox } from 'element-plus'

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
const formRef = ref()

// 使用数据字典
const { proxy } = getCurrentInstance()
const { game_types } = proxy.useDict('game_type')

// 表单验证规则
const rules = {
  nameZh: [
    { required: true, message: '请输入游戏中文名', trigger: 'blur' },
    { min: 2, max: 64, message: '长度在2到64个字符', trigger: 'blur' }
  ],
  nameEn: [
    { required: true, message: '请输入游戏英文名', trigger: 'blur' },
    { min: 2, max: 64, message: '长度在2到64个字符', trigger: 'blur' }
  ],
  gameType: [{ required: true, message: '请选择游戏类型', trigger: 'change' }]
}

// 打开新增对话框
const handleAdd = () => {
  form.value = {
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
  }
  dialogTitle.value = '新增游戏信息'
  dialogVisible.value = true
}

// 打开编辑对话框
const handleUpdate = (row) => {
  form.value = {
    ...row,
    createTime: row.createTime ? row.createTime : '',
    updateTime: row.updateTime ? row.updateTime : ''
  }
  dialogTitle.value = '修改游戏信息'
  dialogVisible.value = true
}

// 提交表单
const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (form.value.gameId) {
          // 修改操作
          await updateGameInfo(form.value)
          ElMessage.success('修改成功')
        } else {
          // 新增操作
          await addGameInfo(form.value)
          ElMessage.success('新增成功')
        }
        dialogVisible.value = false
        // 触发表格刷新
        emit('success')
      } catch (error) {
        console.error(error)
        ElMessage.error('操作失败，请重试')
      }
    }
  })
}

// 暴露方法给父组件调用
defineExpose({
  handleAdd,
  handleUpdate
})
</script>

<style scoped></style>
