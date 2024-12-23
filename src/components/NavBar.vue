<script setup>
import { ref, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
/*
const router = useRouter()
const items = ref([
  { path: '/func1', label: '機能1' },
  { path: '/func2', label: '機能2' },
])
*/
const isActive = (path) => {
  return path === route.path
}
</script>

<template>
<header class="navbar bg-base-100 sticky top-0 bg-opacity-80 backdrop-blur-sm shadow z-40">
  <div class="flex-1">
    <a class="btn btn-ghost text-xl" href="/">
      <img src="/images/Primary_Logo_Green_CMYK.svg" class="inline-block h-[1.5rem] align-text-top" /> Spotify Data Deck
    </a>
  </div>
  <!--
  <nav class="flex-none">
    <ul class="menu menu-horizontal px-1">
      <li v-for="item in items"
        :class="isActive(item.path) ? 'border-b-4' : ''"
      ><a href="/conf">{{ item.label }}</a></li>
    </ul>
  </nav>
  -->
</header>
</template>

<style scoped>
</style>
