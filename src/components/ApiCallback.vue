<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { getAccessToken } from '../spotify-api.js'
import MessagePanel from './MessagePanel.vue'

const route = useRoute()
const router = useRouter()

onMounted(async () => {
  if (route.query.code) {
    // 認可コードからアクセストークンを取得してローカルストレージに保存
    await getAccessToken(route.query.code)
    router.push('/')
  }
})
</script>

<template>
  <div class="m-4">
    <MessagePanel
      :show="Boolean(route.query.code)"
      level="info"
      message="アクセストークンを取得中です..."
    />
    <MessagePanel
      :show="! route.query.code"
      level="error"
      message="認可コードが取得できません。"
    />
  </div>
</template>
