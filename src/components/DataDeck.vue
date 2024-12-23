<script setup>
import { reactive, onMounted } from 'vue';
//import { useRouter } from 'vue-router'
import { getValues, setValues, getAuthorizationCode, queryAlbum, queryTrack, pushTemporaryMemory, popTemporaryMemory } from '../spotify-api.js'
import IconSearch from "./icons/IconSearch.vue";
import DataDeckAlbum from "./DataDeckAlbum.vue";
import MessagePanel from './MessagePanel.vue'

//const router = useRouter()
const searching = reactive({ url: '', type: null, data: null })
const guidance = reactive({ show: false, level: 'info', message: '' })
const searchValueStoreKey = 'SpotifySearchUrl'

// 検索対象 URL チェック
const validateUrl = () => {
  const pattern = /^https:\/\/open\.spotify\.com\/(intl-ja\/)?(album|track)\/([a-zA-Z0-9\-_]+)/
  const m = searching.url.match(pattern)
  if (! m) return null
  const ofs = m.length - 3
  return { type: m[1+ofs], params: [m[2+ofs]] }
}
// マウント時処理
onMounted(() => {
  // 認証前に検索しようとしていた URL を思い出す
  const lastUrl = popTemporaryMemory(searchValueStoreKey)
  if (lastUrl) {
    searching.url = lastUrl
    doSearch()
  }
})
// ガイダンス表示
const showGuidance = (level='info', message='') => {
  if (level === false) {
    guidance.show = false
    return
  }
  guidance.show = true
  guidance.level = level
  guidance.message = message
}
// 検索結果を記憶する
const setResult = (type, data) => {
  searching.type = type
  searching.data = data
}
// API 検索
const doSearch = async () => {
  showGuidance(false)
  // 検索対象 URL チェック
  if (searching.url === '') {
    showGuidance('warning', 'Sotify URL を入力して下さい。')
    return
  }
  const q = validateUrl()
  if (! q) {
    showGuidance('error', 'URL が不当です。')
    return
  }
  setResult(null, null)
  // 設定チェック
  if (! getValues().client_id) {
    const clientId = prompt('Spotify API クラアント ID を指定して下さい。入力した値はブラウザに記憶されます。')
    if (! clientId) {
      showGuidance('warning', '検索には Spotify API クラアント ID が必要です。')
      return
    }
    setValues({ client_id: clientId })
  }
  // 認証チェック
  if (! getValues().access_token) {
    pushTemporaryMemory(searchValueStoreKey, searching.url) // 検索中の値を記憶
    console.log('Spotify API Authorizing...')
    getAuthorizationCode()
    return
  }
  // 検索処理
  if (q.type === 'album') {
    const data = await queryAlbum(q.params[0])
    setResult('album', data)
  }
  else if (q.type === 'track') {
    const data = await queryTrack(q.params[0])
    setResult('track', data)
  }
}
const onSubmit = (e) => {
  e.preventDefault()
  doSearch()
}
// 現在日時を YYYY-MM-DD hh:mm:ss な文字列で返す
const datetimeString = () => {
  const now = new Date
  return now.toLocaleDateString('ja-JP') + ' ' + now.toLocaleTimeString('ja-JP')
}
</script>

<template>
  <article class="mt-4">
    <form class="max-w-full mx-auto px-4" @submit="onSubmit">
      <label
        for="default-search"
        class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
      >Search</label>
      <div class="relative">
        <div
          class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"
        ><IconSearch /></div>
        <input
          type="search"
          id="default-search"
          class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="検索したい Spotify URL (アルバム・トラック)"
          required
          v-model.trim="searching.url"
        />
        <button
          type="button"
          class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          @click="doSearch"
        >
          Search
        </button>
      </div>
      <MessagePanel
        :show="guidance.show"
        :level="guidance.level"
        :message="guidance.message"
      />
    </form>
    <!-- 検索結果 -->
    <template v-if="searching.data">
      <div class="m-4">
        <div class="text-center">Searched at {{ datetimeString() }}</div>
        <DataDeckAlbum v-if="searching.type === 'album'"
          :album="searching.data"
          :tracks="searching.data.tracks.items"
          class="mt-4"
        />
        <DataDeckAlbum v-if="searching.type === 'track'"
          :album="searching.data.album"
          :tracks="[ searching.data ]"
          class="mt-4"
        />
      </div>
    </template>
  </article>
</template>
