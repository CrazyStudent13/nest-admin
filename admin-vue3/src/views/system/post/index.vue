<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
      <el-form-item label="岗位编码" prop="postCode">
        <el-input v-model="queryParams.postCode" placeholder="请输入岗位编码" clearable style="width: 200px" @keyup.enter="postTable.onSearch" />
      </el-form-item>
      <el-form-item label="岗位名称" prop="postName">
        <el-input v-model="queryParams.postName" placeholder="请输入岗位名称" clearable style="width: 200px" @keyup.enter="postTable.onSearch" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="岗位状态" clearable style="width: 200px">
          <el-option v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button :loading="postTable.state.loading" type="primary" icon="Search" @click="postTable.onSearch">搜索</el-button>
        <el-button :loading="postTable.state.loading" icon="Refresh" @click="postTable.onReset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['system:post:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete" v-hasPermi="['system:post:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['system:post:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="postTable.request" />
    </el-row>

    <el-table v-loading="postTable.state.loading" :data="postTable.state.list" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="岗位编号" align="center" prop="postId" />
      <el-table-column label="岗位编码" align="center" prop="postCode" />
      <el-table-column label="岗位名称" align="center" prop="postName" />
      <el-table-column label="岗位排序" align="center" prop="postSort" />
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:post:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:post:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="postTable.state.page.total > 0"
      :total="postTable.state.page.total"
      v-model:page="postTable.state.page.pageNum"
      v-model:limit="postTable.state.page.pageSize"
      @pagination="postTable.request"
    />

    <!-- 添加或修改岗位对话框 -->
    <el-dialog :title="`${postForm.state.title}-${modules.name}`" v-model="postForm.state.open" width="500px" append-to-body>
      <el-form ref="postFormRef" :model="postForm.state.form" :rules="rules" label-width="80px">
        <el-form-item label="岗位名称" prop="postName">
          <el-input v-model="postForm.state.form.postName" placeholder="请输入岗位名称" />
        </el-form-item>
        <el-form-item label="岗位编码" prop="postCode">
          <el-input v-model="postForm.state.form.postCode" placeholder="请输入编码名称" />
        </el-form-item>
        <el-form-item label="岗位顺序" prop="postSort">
          <el-input-number v-model="postForm.state.form.postSort" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="岗位状态" prop="status">
          <el-radio-group v-model="postForm.state.form.status">
            <el-radio v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.value">{{ dict.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="postForm.state.form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="postForm.state.loading" type="primary" @click="handleSubmit">确 定</el-button>
          <el-button @click="handleCancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Post">
import { listPost, addPost, delPost, getPost, updatePost, exportPost } from '@/api/system/post'
import useTable from '@/hooks/useTable'
import useForm from '@/hooks/useForm'

const { proxy } = getCurrentInstance()
const { sys_normal_disable } = proxy.useDict('sys_normal_disable')

// 当前模块配置
const modules = {
  tableKey: 'postId',
  name: '岗位管理'
}

// 列表相关
const queryRef = ref()
const queryParams = reactive({
  postCode: '',
  postName: '',
  status: ''
})
const postTable = useTable({ get: listPost, delete: delPost, export: exportPost }, queryParams, queryRef, modules)

// 表单相关
const postFormRef = ref()
const rules = {
  postName: [{ required: true, message: '岗位名称不能为空', trigger: 'blur' }],
  postCode: [{ required: true, message: '岗位编码不能为空', trigger: 'blur' }],
  postSort: [{ required: true, message: '岗位顺序不能为空', trigger: 'blur' }]
}
const defaultForm = { postCode: '', postName: '', postSort: 0, status: '0', remark: '' }
const postForm = useForm({ add: addPost, update: updatePost, delete: delPost, get: getPost }, postFormRef, modules.tableKey, defaultForm)

// 控制变量
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)

// 多选处理
const handleSelectionChange = (selection) => {
  ids.value = selection.map((item) => item[modules.tableKey])
  single.value = selection.length !== 1
  multiple.value = !selection.length
}

// 新增按钮
const handleAdd = () => {
  postForm.onOpenForm()
}

// 修改按钮
const handleUpdate = (row) => {
  postForm.onOpenForm(row)
}

// 提交按钮
const handleSubmit = () => {
  postFormRef.value.validate((valid) => {
    if (valid) {
      postForm.onSubmit().then(() => {
        postTable.request()
      })
    }
  })
}

// 取消按钮
const handleCancel = () => {
  postForm.onCancel()
}

// 删除按钮
const handleDelete = (row) => {
  const postIds = row[modules.tableKey] || ids.value
  ElMessageBox.confirm('您确认要删除该数据吗？', '删除提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    postTable.onDelete(postIds)
  })
}

// 导出
const handleExport = () => {
  postTable.onExport()
}
</script>
