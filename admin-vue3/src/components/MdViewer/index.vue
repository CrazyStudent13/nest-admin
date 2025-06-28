<!-- todo 待完善，等后续组件太多的时候，进行统一的整合 -->
<!-- 参考文档：https://code-farmer-i.github.io/vue-markdown-editor/zh/examples/base-editor.html -->
<template>
  <div class="preivew-container">
    <v-md-preview :text="resultStr" @copy-code-success="handleCopyCodeSuccess" />
  </div>
</template>

<script setup>
const props = defineProps({
  value: {
    type: String,
    default: ''
  }
})

const resultStr = computed(() => {
  const val = props.value
  let result = ''
  if (val !== null && typeof val !== 'undefined' && val !== '') {
    // 处理换行问题,后续考虑将这段逻辑转到后端去处理
    const tempStr = val.replace(/\\n/g, '\n')

    result = tempStr
  }
  return result || ''
})

const handleCopyCodeSuccess = (code) => {
  console.log(code)
}
</script>

<style lang="scss">
// 清除elementUI造成的样式塌陷问题
.preivew-container {
  width: 100%;
  &::after {
    content: ' ';
    display: block;
    clear: both;
  }
}
</style>
