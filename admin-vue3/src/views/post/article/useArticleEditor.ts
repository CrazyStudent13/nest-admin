/**
 * 文章编辑器页面 - 使用 useArticle 组合函数的示例
 * 
 * 这个文件展示了如何将原有的文章编辑器页面重构为使用 useArticle 组合函数
 */

import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useArticle } from '@/composables/useArticle'
import { useSubject } from '@/composables/useSubject'
import { useDynamicTitle } from '@/composables/useDynamicTitle'
import type { Article } from '@/types/api'

export function useArticleEditor() {
  const route = useRoute()
  const router = useRouter()
  const articleManager = useArticle()
  const subject = useSubject()
  const { setTitle } = useDynamicTitle()

  // ==================== 响应式状态 ====================
  
  const title = ref('')
  const content = ref('')
  const articleId = ref<number | string | null>(null)
  const loading = ref(false)
  const isEdit = ref(false)
  const subjectList = ref<any[]>([])
  const sidebarCollapsed = ref(false)
  const saveTimer = ref<number | null>(null)

  // 文章完整数据
  const articleData = reactive<Partial<Article>>({
    id: undefined,
    articleId: undefined,
    title: '',
    subjectId: undefined,
    desc: '',
    content: '',
    cover: '',
    author: '',
    source: '0', // 默认原创
    publishTime: undefined,
    likeNum: 0,
    readNum: 0,
    commentNum: 0,
    publishStatus: '0',
    auditStatus: '0',
    scheduledPublishTime: undefined,
    sort: 0
  })

  // ==================== 生命周期 ====================

  onMounted(() => {
    // 加载专栏列表
    subject.getList().then(() => {
      subjectList.value = subject.state.list
    })
    
    // 初始化标题
    setTitle('文章新建 - 编辑器')
  })

  onUnmounted(() => {
    // 清理定时器
    if (saveTimer.value) {
      clearTimeout(saveTimer.value)
      saveTimer.value = null
    }
  })

  // ==================== 核心方法 ====================

  /**
   * 加载文章信息
   */
  const loadArticleInfo = async (id: number | string) => {
    loading.value = true
    try {
      const detail = await articleManager.getDetail(id)
      
      // 填充所有字段
      Object.assign(articleData, detail)
      
      // 同步到响应式变量
      title.value = detail.title || ''
      content.value = detail.content || ''
      
      // 更新浏览器标题
      if (detail.title) {
        setTitle(`${detail.title} - 编辑器`)
      }
    } catch (error) {
      console.error('加载文章失败:', error)
      ElMessage.error('加载文章失败')
    } finally {
      loading.value = false
    }
  }

  /**
   * 标题输入处理
   */
  const handleTitleInput = (value: string) => {
    articleData.title = value
    
    // 实时更新浏览器标题
    if (value && value.trim()) {
      setTitle(`${value} - 编辑器`)
    } else {
      setTitle(isEdit.value ? '文章编辑 - 编辑器' : '文章新建 - 编辑器')
    }
  }

  /**
   * 监听 content 变化，同步到 articleData
   */
  watch(content, (newVal) => {
    articleData.content = newVal
  })

  /**
   * 监听路由参数变化
   */
  watch(
    () => route.query.id,
    (newId) => {
      const id = Number(newId)
      if (newId && !isNaN(id)) {
        if (articleId.value !== id) {
          articleId.value = id
          isEdit.value = true
          loadArticleInfo(id)
        }
      }
    },
    { immediate: true }
  )

  /**
   * 监听 title 变化
   */
  watch(title, (newVal) => {
    if (newVal && newVal.trim()) {
      setTitle(`${newVal} - 编辑器`)
    } else if (!newVal) {
      setTitle(isEdit.value ? '文章编辑 - 编辑器' : '文章新建 - 编辑器')
    }
  })

  /**
   * 切换侧面板展开/收起
   */
  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  /**
   * 验证表单
   */
  const validateForm = (): boolean => {
    if (!title.value || !title.value.trim()) {
      ElMessage.warning('请输入文章标题')
      return false
    }
    if (!content.value || !content.value.trim()) {
      ElMessage.warning('请输入文章内容')
      return false
    }
    return true
  }

  /**
   * 准备保存数据
   */
  const prepareSaveData = (publishStatus: string): Partial<Article> => {
    // 清除之前的定时器
    if (saveTimer.value) {
      clearTimeout(saveTimer.value)
    }

    // 设置新的防抖定时器
    saveTimer.value = setTimeout(async () => {
      if (!validateForm()) {
        return
      }

      loading.value = true
      try {
        const saveData = prepareSaveData('0') // 草稿状态
        
        // 使用统一的 saveArticle 方法，自动判断新增或更新
        const result = await articleManager.saveArticle(saveData)
        
        // 如果是新建，更新 ID
        if (!articleData.id && result.id) {
          const newId = Number(result.id)
          articleId.value = newId
          isEdit.value = true
          articleData.id = newId
          articleData.articleId = newId
          
          // 更新 URL
          router.replace({ query: { id: newId } })
        }
        
        ElMessage.success('草稿保存成功')
      } catch (error) {
        console.error('保存草稿失败:', error)
        ElMessage.error('保存草稿失败')
      } finally {
        loading.value = false
        saveTimer.value = null
      }
    }, 300) // 300ms 防抖延迟
  }

  /**
   * 发布文章（带防抖）
   */
  const handlePublish = async () => {
    // 清除之前的定时器
    if (saveTimer.value) {
      clearTimeout(saveTimer.value)
    }

    // 设置新的防抖定时器
    saveTimer.value = setTimeout(async () => {
      if (!validateForm()) {
        return
      }

      loading.value = true
      try {
        const saveData = prepareSaveData('1') // 发布状态
        
        // 使用统一的 saveArticle 方法，自动判断新增或更新
        const result = await articleManager.saveArticle(saveData)
        
        // 如果是新建，更新 ID
        if (!articleData.id && result.id) {
          const newId = Number(result.id)
          articleId.value = newId
          isEdit.value = true
          articleData.id = newId
          articleData.articleId = newId
          
          // 更新 URL
          router.replace({ query: { id: newId } })
        }
        
        ElMessage.success('文章发布成功')

        // 发布成功后返回列表页
        setTimeout(() => {
          router.push('/post/article')
        }, 1500)
      } catch (error) {
        console.error('发布文章失败:', error)
        ElMessage.error('发布文章失败')
      } finally {
        loading.value = false
        saveTimer.value = null
      }
    }, 300) // 300ms 防抖延迟
  }

  // ==================== 返回 ====================

  return {
    // 状态
    title,
    content,
    articleId,
    loading,
    isEdit,
    subjectList,
    sidebarCollapsed,
    articleData,
    
    // 方法
    loadArticleInfo,
    handleTitleInput,
    toggleSidebar,
    validateForm,
    handleSaveDraft,
    handlePublish
  }
}
