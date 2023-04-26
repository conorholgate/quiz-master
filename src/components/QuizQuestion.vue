<template>
  <div class="question">{{ `${question.question}?` }}</div>
  <div v-for="(answer, index) in question.answers" :key="index" class="answer" @click="onAnswerSelected(answer)">
    {{ answer.phrasing }}
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, defineEmits } from 'vue'
import { Question, EmitFunctions } from '../types/quiz'

export default defineComponent({
  name: 'quiz-question',
  props: {
    question: {
      type: Object as () => Question,
      required: true,
    },
  },
  emits: ['answerSelected'] as unknown as defineEmits<EmitFunctions>,

  setup(props: Question, { emit }: { emit: (event: keyof EmitFunctions, ...args: any[]) => void }) {
    const selectedAnswer = ref('')

    const selectAnswer = (answer: { phrasing: string }) => {
      selectedAnswer.value = answer.phrasing
      emit('answerSelected', { question: props.question, answer })
    }

    const onAnswerSelected = (answer: { phrasing: string }) => {
      selectAnswer(answer)
    }

    return { selectedAnswer, onAnswerSelected }
  },
})
</script>

<style scoped>
.question {
  margin-bottom: 10px;
  font-size: 2rem;
}
.answer {
  margin-bottom: 10px;
  border: 1px solid black;
  border-radius: 8px;
  padding: 4px;
  cursor: pointer;
}
.answer:hover {
  background-color: black;
  color: white;
}
</style>
