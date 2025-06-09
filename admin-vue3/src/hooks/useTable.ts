import { reactive } from 'vue'
// import { debounce } from 'lodash'
// import ElMessage from 'element-plus'

// 后续参考一下这个
// https://www.buerblog.cn/docs/study/web/use-table

/**
 * @description table操作方法封装
 * @param {Function} api 表格列表数据接口
 * @param {Object} searchParam 表格查询参数
 */

const useTable = (api, searchParam = {}) => {
  const state = reactive({
    loading: false,
    list: [],
    page: {
      current: 1,
      size: 15,
      total: 1
    }
  })

  // 获取表格列表数据

  const request = async () => {
    state.loading = true

    const params = {
      current: state.page.current,
      size: state.page.size,
      ...searchParam
    }
    try {
      const { code, data, msg } = await api(params)

      state.loading = false
      if (code === 200) {
        state.list = data.list
        state.page.total = data.total
      } else {
        console.log(msg)
      }
    } catch (e) {
      console.log(e)
    } finally {
      state.loading = false
      console.log('finally,我最后用了useTable这个Khooks', '测试--->>>')
    }
  }

  // 分页切换方法
  const handleSizeChange = (val) => {
    state.page.size = val
    request()
  }

  // 表格数据搜索, 防抖(需安装lodash)
  //   const searchData = debounce((request) => {
  //     request()
  //   }, 500)

  // 返回相关变量与方法
  return {
    state,
    request,
    handleSizeChange
  }
}

export default useTable
