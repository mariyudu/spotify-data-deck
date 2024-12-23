<script setup>
import { reactive } from 'vue'
const p = defineProps({
  album: {
    type: Object,
  },
  tracks: {
    type: Array,
  },
})
const toMmss = (ms) => {
  const m = Math.floor(ms / 60000)
  const s = Math.floor(ms % 60000 / 1000)
  return m.toString() + ':' + s.toString().padStart(2, '0')
}
</script>

<template>
  <div>
    <div class="flex">
      <div class="flex-none border rounded p-1">
        <img :src="p.album.images[0].url" class="w-48 h-48" />
      </div>
      <div class="flex-none pl-4">
        <table>
          <tbody>
            <tr>
              <th class="text-sm text-right font-normal text-slate-400 pr-2">type</th>
              <td>{{ p.album.type }}</td>
            </tr>
            <tr>
              <th class="text-sm text-right font-normal text-slate-400 pr-2">title</th>
              <td class="text-xl">{{ p.album.name }}</td>
            </tr>
            <tr>
              <th class="text-sm text-right font-normal text-slate-400 pr-2">artists</th>
              <td>{{ p.album.artists.map(item => item.name).join(', ') }}</td>
            </tr>
            <tr>
              <th class="text-sm text-right font-normal text-slate-400 pr-2">release</th>
              <td>{{ p.album.release_date }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <table class="table">
      <tbody>
        <tr>
          <th>#</th>
          <th>Title</th>
          <th>Artist</th>
          <th>Time</th>
        </tr>
        <tr v-for="track in p.tracks">
          <td>{{ track.disc_number }} - {{ track.track_number }}</td>
          <td>{{ track.name }}</td>
          <td>{{ track.artists.map(artist => artist.name).join(', ') }}</td>
          <td class="text-right">{{ toMmss(track.duration_ms) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
