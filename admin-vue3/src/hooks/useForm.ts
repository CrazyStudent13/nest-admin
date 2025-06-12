import { ElMessage, ElMessageBox } from 'element-plus'
import type { Action } from 'element-plus'
const useForm = (formRef: any) => {
  const onDelete = (row, confirmTitle) => {
    ElMessageBox.alert('This is a message', 'Title', {
      // if you want to disable its autofocus
      // autofocus: false,
      confirmButtonText: 'OK',
      callback: (action: Action) => {
        ElMessage({
          type: 'info',
          message: `action: ${action}`
        })
      }
    })
  }
}
export default useForm
