import { reactive } from 'vue'
// import { debounce } from 'lodash'
// import ElMessage from 'element-plus'

// 后续参考一下这个
// https://www.buerblog.cn/docs/study/web/use-table

const table = reactive({
  loading: false,
  list: [],
  page: {
    current: 1,
    size: 15,
    total: 1
  }
})

/**
 * @description table操作方法封装
 * @param {Function} api 表格列表数据接口
 * @param {Object} searchParam 表格查询参数
 */

const useTable = (api, searchParam = {}) => {
  // 获取表格列表数据

  const request = async () => {
    table.loading = true

    const params = {
      current: table.page.current,
      size: table.page.size,
      ...searchParam
    }
    try {
      const { code, data, msg } = await api(params)

      table.loading = false
      if (code === 200) {
        table.list = data.list
        table.page.total = data.total
      } else {
        console.log(msg)
      }
    } catch (e) {
      console.log(e)
    } finally {
      table.loading = false
      console.log('finally,我最后用了useTable这个Khooks', '测试--->>>')
    }
  }

  // 分页切换方法
  const handleSizeChange = (val) => {
    table.page.size = val
    request()
  }

  // 表格数据搜索, 防抖(需安装lodash)
  //   const searchData = debounce((request) => {
  //     request()
  //   }, 500)

  // 返回相关变量与方法
  return {
    table,
    request,
    handleSizeChange
  }
}

export default useTable
