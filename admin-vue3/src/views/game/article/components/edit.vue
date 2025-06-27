<template>
  <!-- 添加或修改文章对话框 -->
  <el-dialog :title="`${ArticleForm.state.title}`" v-model="ArticleForm.state.open" width="800px" append-to-body>
    <el-form v-loading="ArticleForm.state.loading" ref="ArticleFormRef" :model="ArticleForm.state.form" :rules="rules" label-width="80px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="ArticleForm.state.form.title" placeholder="请输入文章标题" clearable maxlength="25" show-word-limit />
      </el-form-item>
      <el-form-item label="文章简介" prop="remark">
        <el-input v-model="ArticleForm.state.form.remark" placeholder="请输入文章简介" type="textarea" :rows="5" maxlength="200" show-word-limit />
      </el-form-item>
      <el-form-item label="发布时间" prop="publishTime">
        <el-date-picker v-model="ArticleForm.state.form.publishTime" type="datetime" placeholder="请选择发布时间" format="YYYY/MM/DD HH:mm:ss" />
      </el-form-item>
      <!-- todo: 文件上传公用组件的封装 -->
      <!-- <el-form-item label="文章封面" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入编码名称" />
        </el-form-item> -->
      <!-- <el-form-item label="文章状态" prop="status">
          <el-select v-model="form.status" clearable>
            <el-option v-for="dict in sys_article_status" :value="dict.value">{{ dict.label }}</el-option>
          </el-select>
        </el-form-item> -->
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="handleCancel">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
const emit = defineEmits(['success'])

import { getArticle, addArticle, updateArticle } from '@/api/game/article'
import useForm from '@/hooks/useForm'

// 当前单表模块配置
const modules = {
  tableKey: 'articleId', // 表格主键字段
  name: '游戏文章' // 模块名称
}

// 表单
const ArticleFormRef = ref()
const rules = {
  ArticleTitle: [{ required: true, message: '请输入公告标题', trigger: 'blur' }],
  ArticleType: [{ required: true, message: '请选择公告类型', trigger: 'change' }]
}
const defaultForm = { ArticleTitle: '', ArticleType: '', status: '0', ArticleContent: '' }
const ArticleForm = useForm({ add: addArticle, update: updateArticle, get: getArticle }, ArticleFormRef, modules, defaultForm)

// 新增操作
const handleAdd = () => {
  console.log('handleAddson', ArticleFormRef)
  ArticleForm.onOpenForm()
}

// 修改操作
const handleUpdate = (row) => {
  ArticleForm.onOpenForm(row)
}

// 提交按钮
const handleSubmit = () => {
  ArticleFormRef.value.validate((valid) => {
    if (valid) {
      ArticleForm.onSubmit().then(() => {
        emit('success')
      })
    }
  })
}

// 取消弹窗
const handleCancel = () => {
  ArticleForm.onCancel()
}

defineExpose({
  handleAdd,
  handleUpdate
})
</script>
