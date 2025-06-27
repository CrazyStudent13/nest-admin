import { nextTick, reactive } from 'vue'
import { ElMessage } from 'element-plus'

interface apiParams {
  get: Function
  add: Function
  edit: Function
}

/**
 * options 配置项
 * @param key 文章主键
 */
interface options {
  key: string
}

/**
 * @description: 封装了查询，增、改的逻辑
 * @param {apiParams} api 接口
 * @param {any} searchParam 查询参数
 * @param {options} options 配置项
 * @return {*}
 */
const useWrtie = (api: apiParams, searchParam, options: options = { key: 'id' }) => {
  const state = reactive({
    title: '',
    loading: false,
    content: ''
  })

  const request = async () => {
    state.loading = true
    const res = await api.get(searchParam)
    state.content = res.data
    nextTick(() => {
      state.loading = false
    })
  }

  const onSubmit = async () => {
    state.loading = true
    try {
      await api.add(state.content)
      ElMessage.success('添加成功')
    } catch (error) {
      ElMessage.error('添加失败')
    }

    state.loading = false
  }

  return {
    state,
    request,
    onSubmit
  }
}

export default useWrtie
