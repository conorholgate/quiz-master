<template>
  <div class="question">{{ `${question}?` }}</div>
  <div v-for="(answer, index) in answers" :key="index">
    <div class="answer" @click="selectAnswer(answer)">
      {{ answer.phrasing }}
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  question: {
    type: String,
  },
  answers: {
    type: Array,
  },
})

// EMITS
const emit = defineEmits(['answerSelected'])

//DATA
const selectAnswer = answer => {
  emit('answerSelected', { question: props.question, answer })
}
</script>

<style scoped>
.question {
  margin-bottom: 10px;
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
