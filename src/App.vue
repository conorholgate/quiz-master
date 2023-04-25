<template>
  <div>
    <!-- instructions for the quiz -->
    <div v-if="!quizStarted && !quizFinished">
      <div style="margin-bottom: 20px">
        Instructions: You will be shown a series of questions. You have 20 seconds to answer each question. Once the timer is up, the next question will be shown. Your results will be shown at the end of the quiz. Good luck!
      </div>
      <div style="margin-bottom: 20px">Total number of questions in this quiz: {{ questions.length }}</div>
      <button @click="startQuiz">Start Quiz</button>
    </div>

    <!-- quiz content -->
    <div v-show="quizStarted && !quizFinished">
      <div>
        <!-- assuming question timer is not being returned from api, so it is being hard coded -->
        <question-timer ref="timer" :time="5" :label="'Time remaining'" :timeExpiredMessage="'Time expired. Get ready for the next question'" @timeFinished="timerFinished" />
      </div>
      <div v-if="!hideQuestion">
        <div style="margin-bottom: 20px">
          {{ `Question ${activeQuestion + 1}/${questions.length}` }}
        </div>
        <div v-for="(question, index) in questions" :key="index" v-show="activeQuestion === index">
          <quiz-question :question="question.question" :answers="question.answers" @answerSelected="answerSelected" />
        </div>
      </div>
    </div>

    <!-- quiz results -->
    <div v-if="quizFinished">Quiz finished</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import QuestionTimer from './components/QuestionTimer.vue'
import QuizQuestion from './components/QuizQuestion.vue'
const timer = ref<InstanceType<typeof QuestionTimer> | null>(null)

interface Answer {
  phrasing: string
  isCorrect: boolean
}
interface Question {
  question: string
  answers: Answer[]
}
const questions = ref<Question[]>([])
const answers = ref<Array<object>>([])
const quizStarted = ref<Boolean>(false)
const quizFinished = ref<Boolean>(false)
const activeQuestion = ref<Number>(0)
const hideQuestion = ref<Boolean>(false)

const startQuiz = () => {
  quizStarted.value = true
  timer.value.startTimer()
}
const endQuiz = () => {
  quizFinished.value = true
}
const resetTimer = () => {
  timer.value.resetTimer()
}
const setHideQuestion = value => {
  hideQuestion.value = value
}

// handles the user selecting an answer
const nextQuestion = () => {
  if (activeQuestion.value < questions.value.length - 1) {
    activeQuestion.value++
    resetTimer()
  } else {
    endQuiz()
  }
}
const answerSelected = answer => {
  answers.value.push(answer)
  nextQuestion()
}

// handles if user does not select an answer
const timerFinished = () => {
  setHideQuestion(true)
  if (activeQuestion.value < questions.value.length - 1) {
    setTimeout(() => {
      activeQuestion.value++
      resetTimer()
      setHideQuestion(false)
      //   setting to 3 seconds to provide a better user expierence between questions
    }, 1000)
  } else {
    endQuiz()
  }
}

async function fetchQuestions() {
  try {
    const response = await fetch('/questions.json')
    const data = await response.json()
    questions.value.push(...data)
  } catch (error) {
    console.error(error)
  }
}
onMounted(() => {
  fetchQuestions()
})
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
