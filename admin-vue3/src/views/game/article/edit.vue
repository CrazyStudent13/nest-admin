<template>
  <MdEditor v-model="form.model.content" height="100vh" @save="form.handleSave" />
</template>

<script setup>
const route = useRoute()
import { getArticle } from '@/api/game/article'
import MdEditor from '@/components/MdEditor/index.vue'

const form = reactive({
  modelValue: '',
  model: {},
  getContent: async () => {
    const articleId = route.query.articleId
    getArticle(articleId).then((res) => {
      const content = res?.data?.content
      form.model.content = content.slice(1, -1).replace(/\\n/g, '\n')
    })
  },
  handleSave: () => {
    console.log(form.model.content)
  }
})

onMounted(() => {
  form.getContent()
})
</script>

<style scoped></style>
