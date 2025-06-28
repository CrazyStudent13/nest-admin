// 挂载MD编辑器
import VMdEditor from '@kangc/v-md-editor'
import '@kangc/v-md-editor/lib/style/base-editor.css'
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js'
import '@kangc/v-md-editor/lib/theme/style/github.css'

// highlightjs
import hljs from 'highlight.js'

VMdEditor.use(githubTheme, {
  Hljs: hljs
})

// 挂载MD预览工具
import VMdPreview from '@kangc/v-md-editor/lib/preview'
import '@kangc/v-md-editor/lib/style/preview.css'
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index'
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css'
VMdPreview.use(githubTheme, {
  Hljs: hljs
})

export { VMdEditor, VMdPreview }
