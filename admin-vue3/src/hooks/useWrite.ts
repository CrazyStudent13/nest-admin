import { nextTick, reactive, unref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

interface apiParams {
  get: Function
  add: Function
  edit: Function
}

/**
 * 查询参数
 * @param {Number} id 文章id
 */
interface searchParam {
  id: number
}

/**
 * options 配置项
 * @param key 文章主键
 */
interface options {
  key: string
}

interface State {
  loading: boolean
  title: string
  content: string
}

// 格式化回显数据
function formatData(data: any) {
  return {
    title: data?.title,
    content: data.content ? data?.content : ''
  }
}

const useWrtie = (api: apiParams, searchParam: searchParam, options: options = { key: 'id' }) => {
  const state = reactive<State>({
    loading: false,
    title: '',
    content: ''
  })

  const request = async () => {
    state.loading = true
    try {
      // console.log('表单详情获取开始', api)
      const { code, data, msg } = await api.get(searchParam.id)
      if (data && code === 200) {
        Object.assign(state, data, formatData(data))
      } else {
        ElMessage.error(msg)
      }
    } catch (error) {
      console.log('表单详情获取失败：', error)
    } finally {
      nextTick(() => {
        state.loading = false
      })
    }
  }
  // 提交之前格式化数据，为修改做数据准备
  const onSubmit = (row) => {
    const form = formatData(row)

    console.log('提交数据：', Object.assign(state, form))
    return Object.assign(state, form)
  }

  const onCancel = () => {
    ElMessageBox.confirm('您确定要取消保存吗？不保存将会失去当前所有修改并无法恢复，您真的确定要这么做吗？', '系统提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        window.close()
      })
      .catch(() => {
        console.log('取消')
      })
  }

  return {
    state,
    request,
    onSubmit,
    onCancel
  }
}

export default useWrtie
