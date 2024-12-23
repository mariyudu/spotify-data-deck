<script setup>
const props = defineProps({
  message: {
    type: String,
  },
  level: {
    type: String,
  },
  show: {
    type: Boolean,
  },
})
const colorClasses = () => {
  // `alert-${props.level}` のようなクラス名の動的生成は Tailwind では御法度
  const classNames = ['alert-info', 'alert-success', 'alert-warning', 'alert-error']
  const idx = classNames.indexOf(`alert-${props.level}`)
  return idx >= 0 ? ['alert', classNames[idx]] : ['alert']
}
</script>

<template>
  <div v-if="show"
    role="alert" class="mt-4" :class="colorClasses()"
  >
    <span>{{ message }}</span>
  </div>
</template>