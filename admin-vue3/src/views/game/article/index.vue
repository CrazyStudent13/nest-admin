<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" @submit.prevent>
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="queryParams.title" placeholder="请输入文章标题" clearable @keyup.enter="gameArticleTable.onSearch" />
      </el-form-item>
      <!-- todo: 状态字典翻译,数据字典有问题，目前的数据字典改完数据之后，前端的数据字典没有及时修改数据键值 -->
      <!-- <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="文章状态" clearable style="width: 200px">
          <el-option v-for="dict in sys_article_status" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-button :loading="gameArticleTable.state.loading" type="primary" icon="Search" @click="gameArticleTable.onSearch">搜索</el-button>
        <el-button :loading="gameArticleTable.state.loading" icon="Refresh" @click="gameArticleTable.onReset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['game:Article:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete" v-hasPermi="['game:Article:remove']">删除</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="gameArticleTable.request" />
    </el-row>

    <el-table v-loading="gameArticleTable.state.loading" :data="tableData" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="文章标题" align="left" prop="title" show-overflow-tooltip />
      <el-table-column label="文章简介" align="center" prop="remark" show-overflow-tooltip />
      <!-- <el-table-column label="文章作者" align="center" prop="author" /> -->
      <el-table-column v-if="false" label="状态" align="center" prop="status">
        <template #default="scope">
          <!-- <dict-tag :options="sys_article_status" :value="scope.row.status" /> -->
        </template>
      </el-table-column>
      <!-- <el-table-column label="发布时间" align="center" prop="publishTime" width="180" /> -->
      <el-table-column label="创建时间" align="center" prop="createTime" width="180" />
      <el-table-column label="修改时间" align="center" prop="updateTime" width="180" />
      <el-table-column label="操作" width="240" align="center" fixed="right" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="View" @click="handlePreview(scope.row)">预览</el-button>
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['game:Article:edit']">修改</el-button>
          <el-button link type="danger" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['game:Article:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="gameArticleTable.state.page.total > 0"
      :total="gameArticleTable.state.page.total"
      v-model:page="gameArticleTable.state.page.pageNum"
      v-model:limit="gameArticleTable.state.page.pageSize"
      @pagination="gameArticleTable.request"
    />

    <editView ref="editViewRef" @success="handleEditSuccess" />
    <Preview ref="PreviewRef" @close="gameArticleTable.request" />
  </div>
</template>

<script setup name="Article">
import dayjs from 'dayjs'
import { listArticle, addArticle, delArticle, getArticle, updateArticle } from '@/api/game/article'
import Preview from './components/Preview'
import editView from './components/edit'

const { proxy } = getCurrentInstance()
const { sys_article_status } = proxy.useDict('sys_article_status')

import useTable from '@/hooks/useTable'
import { computed, toRefs } from 'vue'

// 当前单表模块配置
const modules = {
  tableKey: 'articleId', // 表格主键字段
  name: '游戏文章' // 模块名称
}

// 列表
const queryRef = ref()
const queryParams = reactive({
  ArticleCode: '',
  ArticleName: '',
  status: '',
  isAsc: 'descending',
  orderByColumn: 'createTime'
})
const gameArticleTable = useTable({ get: listArticle, delete: delArticle }, queryParams, queryRef)

const tableData = computed(() => {
  const list = gameArticleTable.state.list
  list.map((item) => {
    item.createTime = dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')
    item.updateTime = dayjs(item.updateTime).format('YYYY-MM-DD HH:mm:ss')
    item.publishTime = dayjs(item.publishTime).format('YYYY-MM-DD HH:mm:ss')
  })
  return list
})

// 列表控制相关变量
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
// 多选框选中数据
const handleSelectionChange = (selection) => {
  ids.value = selection.map((item) => item[modules.tableKey])
  single.value = selection.length != 1
  multiple.value = !selection.length
}

// 删除操作
const handleDelete = (row) => {
  const articleIds = row[modules.tableKey] || ids.value
  ElMessageBox.confirm('您确认要删除该数据吗？', '删除提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    gameArticleTable.onDelete(articleIds)
  })
}

const editViewRef = ref()
const PreviewRef = ref()

const handlePreview = (row) => {
  PreviewRef.value.handleOpen(row)
}
// 新增操作
const handleAdd = () => {
  console.log('handleAdd', editViewRef.value)
  editViewRef.value.handleAdd()
}

// 修改操作
const handleUpdate = (row) => {
  editViewRef.value.handleUpdate(row)
}

// 编辑成功回调
const handleEditSuccess = () => {
  gameArticleTable.request()
}
</script>
