import { nextTick, reactive } from 'vue'
import { ElMessage } from 'element-plus'

interface FormState {
  loading: boolean
  open: boolean
  title: string
  form: any
}

/**
 * options参数
 * @param {String} tableKey 表格主键字段
 * @param {String} name 模块名称
 */
interface options {
  tableKey: string
  name: string
}

/**
 * api参数
 * @param get 获取单条数据
 * @param add 新增数据
 * @param update 修改数据
 */
interface apiParams {
  get: (id: number | string) => Promise<any>
  add: (params: any) => Promise<any>
  update: (params: any) => Promise<any>
}

/**
 * 针对弹窗表单进行封装的hooks，附带了表单弹窗的打开和修改
 * @param api 请求的api,将新增修改删除传入
 * @param formRef 表单的ref
 * @param key 表单的key，id关键字，用来获取，修改表单数据
 * @param defaultForm 默认的表单数据
 */
const useForm = (api: apiParams, formRef: any, options: options = { tableKey: 'id', name: '' }, defaultForm: any = {}) => {
  const state = reactive<FormState>({
    loading: false, // 表单加载状态
    open: false, // 弹窗是否打开
    title: '', // 弹窗标题
    form: Object.assign({}, defaultForm) // 表单数据
  })

  // 重置表单
  const onReset = () => {
    formRef.value.resetFields()
    state.form = Object.assign({}, defaultForm)
  }

  // 关闭弹窗
  const onCancel = () => {
    formRef.value.resetFields()
    state.open = false
  }

  // 打开表单，新增或修改表单
  const onOpenForm = async (row: any) => {
    state.loading = true
    state.open = true
    // 判断是修改还是添加操作
    if (row) {
      try {
        const formId = row[options.tableKey]

        state.title = formId ? '修改' : '添加'
        state.title += options.name
        const res = await api.get(formId) // 这里后续要补充一个类型
        state.form = res.data
      } catch (error) {
        console.log('表单详情获取失败：', error)
      } finally {
        state.loading = false
      }
    } else {
      state.title = '添加' + options.name
      state.form = Object.assign({}, defaultForm)
      nextTick(() => {
        state.loading = false
        formRef.value.resetFields()
      })
    }
  }

  // 提交表单，新增或修改表单数据
  const onSubmit = async () => {
    const form = state.form
    const formId = form[options.tableKey]

    state.loading = true

    try {
      const operate = formId ? '修改' : '新增'
      const title = `${operate}${options.name}`
      if (formId) {
        await api.update(form)
      } else {
        await api.add(form)
      }
      ElMessage.success(`${title}成功`)
    } catch (error) {
      ElMessage.error('修改失败')
    } finally {
      state.loading = false
      state.open = false
    }
  }

  return {
    state,
    onReset,
    onCancel,
    onOpenForm,
    onSubmit
  }
}

export default useForm
