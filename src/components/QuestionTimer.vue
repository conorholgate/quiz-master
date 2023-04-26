<template>
  <div>
    <div v-if="remainingTime > 0">
      <h3>{{ label }}</h3>
      <p style="font-size: 24px">{{ remainingTime }}</p>
    </div>
    <div v-if="remainingTime === 0">
      <h3>{{ timeExpiredMessage }}</h3>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, defineProps, defineEmits, defineExpose, ref } from 'vue'
import { TimerProps, EmitFunctions } from '../types/timer'
export default defineComponent({
  name: 'question=timer',
  props: {
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
  },
  emits: ['timeFinished'] as unknown as defineEmits<EmitFunctions>,
  setup(props: TimerProps, { emit }: { emit: (event: keyof EmitFunctions, ...args: any[]) => void }) {
    const timer = ref<number | null>(null)
    const remainingTime = ref<number>(props.time)

    const startTimer = () => {
      timer.value = setInterval(() => {
        remainingTime.value -= 1
        if (remainingTime.value === 0) {
          clearInterval(timer.value!)
          emit('timeFinished')
        }
      }, 1000)
    }

    const resetTimer = () => {
      clearInterval(timer.value!)
      remainingTime.value = props.time
      startTimer()
    }

    // Expose functions to parent component
    defineExpose({
      startTimer,
      resetTimer,
    })

    return {
      remainingTime,
      startTimer,
      resetTimer,
    }
  },
})
</script>
