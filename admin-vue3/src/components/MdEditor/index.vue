<!-- todo 待完善，等后续组件太多的时候，进行统一的整合 -->
<!-- 参考文档：https://code-farmer-i.github.io/vue-markdown-editor/zh/examples/base-editor.html -->
<template>
  <v-md-editor v-model="text" :previewTheme="state.theme" @save="handleSave" />
</template>

<script setup>
const state = reactive({
  text: '',
  theme: 'github'
})

const text = ref('')

const props = defineProps({
  value: {
    type: String,
    default: ''
  }
})

const handleSave = () => {
  console.log(props.value)
  console.log(text)
}

defineExpose({
  handleSave
})
</script>
