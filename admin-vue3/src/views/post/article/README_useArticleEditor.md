# useArticleEditor 使用指南

## 📋 概述

`useArticleEditor` 是一个专门用于文章编辑器的组合函数，它使用了 `useArticle` 来管理文章的保存逻辑。

---

## ✨ 核心特性

### 1. 统一的保存方法

使用 `saveArticle` 方法，自动判断是新增还是更新：

```typescript
// 无需判断，直接调用
const result = await articleManager.saveArticle(saveData)

// 如果是新建，更新 ID
if (!articleData.id && result.id) {
  articleData.id = result.id
}
```

### 2. 防抖处理

保存操作带有 300ms 的防抖延迟，避免频繁保存：

```typescript
saveTimer.value = setTimeout(async () => {
  // 保存逻辑
}, 300)
```

### 3. 自动 URL 更新

新建文章后，自动更新 URL 添加文章 ID：

```typescript
router.replace({ query: { id: newId } })
```

---

## 🎯 使用方法

### 基本用法

```vue
<script setup lang="ts">
import { useArticleEditor } from './useArticleEditor'

const {
  // 状态
  title,
  content,
  articleData,
  loading,
  
  // 方法
  handleSaveDraft,
  handlePublish,
  handleTitleInput
} = useArticleEditor()
</script>

<template>
  <div>
    <input v-model="title" @input="handleTitleInput" />
    <textarea v-model="content" />
    
    <button @click="handleSaveDraft" :disabled="loading">
      存草稿
    </button>
    <button @click="handlePublish" :disabled="loading">
      发布
    </button>
  </div>
</template>
```

---

## 📝 API 说明

### 返回值

#### 状态

| 属性 | 类型 | 说明 |
|------|------|------|
| `title` | `Ref<string>` | 文章标题 |
| `content` | `Ref<string>` | 文章内容 |
| `articleId` | `Ref<number \| null>` | 文章 ID |
| `loading` | `Ref<boolean>` | 加载状态 |
| `isEdit` | `Ref<boolean>` | 是否为编辑模式 |
| `subjectList` | `Ref<any[]>` | 专栏列表 |
| `sidebarCollapsed` | `Ref<boolean>` | 侧边栏是否收起 |
| `articleData` | `Reactive<Partial<Article>>` | 文章完整数据 |

#### 方法

| 方法 | 说明 |
|------|------|
| `loadArticleInfo(id)` | 加载文章信息 |
| `handleTitleInput(value)` | 标题输入处理 |
| `toggleSidebar()` | 切换侧边栏 |
| `validateForm()` | 验证表单 |
| `handleSaveDraft()` | 保存草稿（带防抖） |
| `handlePublish()` | 发布文章（带防抖） |

---

## 💡 核心逻辑

### 保存流程

```typescript
// 1. 准备数据
const saveData = prepareSaveData('0') // '0' - 草稿, '1' - 发布

// 2. 调用统一的保存方法
const result = await articleManager.saveArticle(saveData)

// 3. 如果是新建，更新本地 ID
if (!articleData.id && result.id) {
  const newId = Number(result.id)
  articleId.value = newId
  articleData.id = newId
  articleData.articleId = newId
  
  // 4. 更新 URL
  router.replace({ query: { id: newId } })
}
```

### 防抖机制

```typescript
// 清除之前的定时器
if (saveTimer.value) {
  clearTimeout(saveTimer.value)
}

// 设置新的防抖定时器
saveTimer.value = setTimeout(async () => {
  // 执行保存
}, 300)
```

---

## 🔧 自定义配置

### 修改防抖时间

```typescript
// 在 handleSaveDraft 和 handlePublish 中修改
}, 300) // 改为其他值，如 500、1000
```

### 修改保存状态

```typescript
// 草稿
const saveData = prepareSaveData('0')

// 发布
const saveData = prepareSaveData('1')

// 定时发布
const saveData = prepareSaveData('0')
saveData.scheduledPublishTime = '2026-05-01 10:00:00'
```

---

## 📚 完整示例

```vue
<template>
  <div class="article-editor">
    <!-- 标题 -->
    <input 
      v-model="title" 
      placeholder="输入文章标题..."
      @input="handleTitleInput"
    />
    
    <!-- 内容编辑器 -->
    <MdEditor v-model="content" />
    
    <!-- 操作按钮 -->
    <div class="actions">
      <span>{{ isEdit ? '编辑模式' : '新建文章' }}</span>
      <button @click="handleSaveDraft" :disabled="loading">
        {{ loading ? '保存中...' : '存草稿' }}
      </button>
      <button @click="handlePublish" :disabled="loading">
        {{ loading ? '发布中...' : '发布' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useArticleEditor } from './useArticleEditor'
import MdEditor from '@/components/MdEditor/index.vue'

const {
  title,
  content,
  loading,
  isEdit,
  handleSaveDraft,
  handlePublish,
  handleTitleInput
} = useArticleEditor()
</script>
```

---

## ⚠️ 注意事项

### 1. 必须调用 handleTitleInput

```vue
<!-- ✅ 正确 -->
<input v-model="title" @input="handleTitleInput" />

<!-- ❌ 错误 - 浏览器标题不会更新 -->
<input v-model="title" />
```

### 2. 防抖会影响即时保存

如果需要立即保存，可以清除定时器：

```typescript
// 强制立即保存
if (saveTimer.value) {
  clearTimeout(saveTimer.value)
  saveTimer.value = null
}
await handleSaveDraft()
```

### 3. 新建文章后 ID 会自动更新

```typescript
// 不需要手动处理
const result = await articleManager.saveArticle(data)

// 组合函数已经处理了 ID 更新
// if (!articleData.id && result.id) { ... }
```

---

## 🎓 最佳实践

### 1. 自动保存

```typescript
import { debounce } from 'lodash-es'

const autoSave = debounce(() => {
  handleSaveDraft()
}, 5000) // 5秒自动保存

watch(content, () => {
  autoSave()
})
```

### 2. 离开页面提示

```typescript
onBeforeRouteLeave((to, from, next) => {
  if (hasUnsavedChanges.value) {
    const confirm = window.confirm('有未保存的更改，确定要离开吗？')
    if (confirm) {
      next()
    } else {
      next(false)
    }
  } else {
    next()
  }
})
```

### 3. 快捷键支持

```typescript
onMounted(() => {
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + S 保存草稿
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault()
      handleSaveDraft()
    }
  })
})
```

---

## 🔗 相关文件

- [useArticle 组合函数](../../composables/useArticle.ts)
- [saveArticle 优化说明](../../docs/saveArticle优化说明.md)
- [useArticle 快速开始](../../docs/useArticle快速开始.md)

---

**版本**: v1.0.0  
**更新时间**: 2026-04-28
