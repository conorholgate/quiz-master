<template>
  <div class="results">
    <h3 v-if="label">{{ label }}</h3>
    <div>
      <div class="score">You scored: {{ `${userScore}/${questionsLength}` }}</div>
      <div>{{ userScoreMessage }}</div>
    </div>
    <div>
      <button @click="showQuestionsResults">View questions</button>
    </div>
    <div v-if="showQuestions" v-for="(result, index) in userAnswers" :key="index">
      <div class="question">{{ result.question.question ? `${result.question.question}?` : `${result.question}?` }}</div>
      <div v-for="(answer, index) in result.question.answers ? result.question.answers : result.answers" :key="index" class="answer" :class="getAnswerClass(result, answer, index)">
        <div>
          {{ answer.phrasing }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType, ref } from 'vue'
import { UserAnswer, QuizResultsProps } from '../types/quiz'
import QuizQuestion from './QuizQuestion.vue'

export default defineComponent({
  components: { QuizQuestion },
  name: 'quiz-results',
  props: {
    label: {
      type: String,
      default: '',
    },
    questionsLength: {
      type: Number,
      required: true,
    },
    userAnswers: {
      type: Array as PropType<UserAnswer[]>,
      required: true,
    },
  },
  setup(props: QuizResultsProps) {
    const showQuestions = ref<Boolean>(false)
    const showQuestionsResults = () => {
      showQuestions.value = !showQuestions.value
    }
    const userScore = computed(() => {
      return props.userAnswers.filter(answer => answer.answer?.isCorrect).length
    })

    const userScoreMessage = computed(() => {
      const percentage = (userScore.value / props.questionsLength) * 100

      switch (true) {
        case percentage <= 50:
          return 'You could do better!'
        case percentage <= 75:
          return 'Not a bad effort!'
        default:
          return 'Great job!'
      }
    })
    const getAnswerClass = (result, answer, index) => {
      if (answer.isCorrect) {
        return 'bg-green'
      }
      // if user has not answered the question
      if (!result.answer) {
        return 'bg-gray'
      }

      // get the index of the answer based on the users answer
      const answerIndex = result.question.answers.findIndex(answer => answer.phrasing === result.answer.phrasing)

      if (!answer.isCorrect && index === answerIndex) {
        return 'bg-red'
      }
    }

    return {
      userScore,
      userScoreMessage,
      showQuestions,
      getAnswerClass,
      showQuestionsResults,
    }
  },
})
</script>

<style scoped>
.results {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
}
.score {
  font-size: 2rem;
}
.question {
  margin-bottom: 10px;
  font-size: 1.5rem;
}
.answer {
  margin-bottom: 10px;
  border: 1px solid black;
  border-radius: 8px;
  padding: 4px;
  cursor: pointer;
}
.bg-green {
  background: rgb(62, 208, 62);
}
.bg-red {
  background: rgb(225, 87, 87);
}
.bg-gray {
  background: rgb(180, 180, 180);
}
</style>
