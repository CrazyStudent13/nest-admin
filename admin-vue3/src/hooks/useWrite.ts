import { nextTick, reactive } from 'vue'
import { ElMessage } from 'element-plus'

interface apiParams {
  get: Function
  add: Function
  edit: Function
}
const useWrtie = (api: apiParams, searchParam, formRef: any) => {
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
}

export default useWrtie
