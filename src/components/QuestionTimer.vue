<template>
  <div>
    <div v-if="remainingTime > 0">
      <h3>{{ label }}</h3>
      <p>{{ remainingTime }}</p>
    </div>
    <div v-if="remainingTime === 0">
      <h3>{{ timeExpiredMessage }}</h3>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps({
  time: {
    type: Number,
    required: true,
  },
  label: {
    type: String,
  },
  timeExpiredMessage: {
    type: String,
  },
})
// EMITS
const emit = defineEmits(['timeFinished'])

// DATA
const timer = ref<NodeJS.Timeout | null>(null)
const remainingTime = ref(props.time)

const startTimer = () => {
  timer.value = setInterval(() => {
    remainingTime.value -= 1
    if (remainingTime.value === 0) {
      clearInterval(timer.value!)
      emit('timeFinished')
    }
  }, 100000)
}

const resetTimer = () => {
  clearInterval(timer.value!)
  remainingTime.value = props.time
  startTimer()
}

// Exposing to parent component
defineExpose({
  startTimer,
  resetTimer,
})
</script>
