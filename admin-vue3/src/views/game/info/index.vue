<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" @submit.prevent>
      <el-form-item label="游戏名称" prop="nameZh">
        <el-input v-model="queryParams.nameZh" placeholder="请输入游戏中文名" clearable @keyup.enter="gameInfoTable.onSearch" />
      </el-form-item>
      <!-- <el-form-item label="游戏类型" prop="gameType">
        <el-select v-model="queryParams.gameType" placeholder="请选择游戏类型" clearable style="width: 200px">
          <el-option v-for="dict in game_types" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-button :loading="gameInfoTable.state.loading" type="primary" icon="Search" @click="gameInfoTable.onSearch">搜索</el-button>
        <el-button :loading="gameInfoTable.state.loading" icon="Refresh" @click="gameInfoTable.onReset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['game:Info:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete" v-hasPermi="['game:Info:remove']">删除</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="gameInfoTable.request" />
    </el-row>

    <el-table v-loading="gameInfoTable.state.loading" :data="tableData" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="游戏中文名" align="left" prop="nameZh" show-overflow-tooltip />
      <el-table-column label="游戏英文名" align="center" prop="nameEn" show-overflow-tooltip />
      <!-- <el-table-column label="游戏类型" align="center" prop="gameType">
        <template #default="scope">
          <dict-tag :options="game_types" :value="scope.row.gameType" />
        </template>
      </el-table-column> -->
      <el-table-column label="当前版本" align="center" prop="version" />
      <el-table-column label="最近价格" align="center" prop="price" />
      <el-table-column label="开发商" align="center" prop="gameStudio" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180" />
      <el-table-column label="修改时间" align="center" prop="updateTime" width="180" />
      <el-table-column label="操作" width="240" align="center" fixed="right" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="View" @click="handlePreview(scope.row)">预览</el-button>
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['game:Info:edit']">修改</el-button>
          <el-button link type="danger" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['game:Info:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="gameInfoTable.state.page.total > 0"
      :total="gameInfoTable.state.page.total"
      v-model:page="gameInfoTable.state.page.pageNum"
      v-model:limit="gameInfoTable.state.page.pageSize"
      @pagination="gameInfoTable.request"
    />

    <edit-view ref="editViewRef" @success="handleEditSuccess" />
    <preview ref="PreviewRef" @close="gameInfoTable.request" />
  </div>
</template>

<script setup name="Info">
import dayjs from 'dayjs'
import { listGameInfo, delGameInfo, getGameInfo } from '@/api/game/info'
import useTable from '@/hooks/useTable'
import EditView from './components/edit.vue'
import Preview from './components/preview.vue'

const modules = {
  tableKey: 'gameId',
  name: '游戏信息'
}

const queryRef = ref()
const queryParams = reactive({
  nameZh: '',
  nameEn: '',
  gameType: ''
})

const gameInfoTable = useTable({ get: listGameInfo, delete: delGameInfo }, queryParams, queryRef)

const tableData = computed(() => {
  const list = gameInfoTable.state.list
  return list.map((item) => ({
    ...item,
    createTime: item.createTime ? dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss') : '',
    updateTime: item.updateTime ? dayjs(item.updateTime).format('YYYY-MM-DD HH:mm:ss') : ''
  }))
})

// 使用数据字典
const { proxy } = getCurrentInstance()
const { game_types } = proxy.useDict('game_type')

const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)

const handleSelectionChange = (selection) => {
  ids.value = selection.map((item) => item[modules.tableKey])
  single.value = selection.length != 1
  multiple.value = !selection.length
}

const handleDelete = (row) => {
  const gameIds = row[modules.tableKey] || ids.value
  ElMessageBox.confirm('您确认要删除该数据吗？', '删除提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    gameInfoTable.onDelete(gameIds)
  })
}

const editViewRef = ref()
const PreviewRef = ref()

const handlePreview = (row) => {
  PreviewRef.value.handleOpen(row)
}

const handleAdd = () => {
  editViewRef.value.handleAdd()
}

const handleUpdate = (row) => {
  editViewRef.value.handleUpdate(row)
}

const handleEditSuccess = () => {
  gameInfoTable.request()
}
</script>

<style scoped></style>
