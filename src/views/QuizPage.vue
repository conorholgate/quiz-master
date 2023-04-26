<template>
  <div>
    <!-- Category & Instructions for the quiz -->
    <div class="instructions" v-if="!quizStarted && !quizFinished">
      <div>
        <h2>Catergory: Country Capitals</h2>
      </div>
      <div>
        {{
          `Instructions: You will be shown a series of questions. You have ${timerAmount} seconds to answer each question. Once the timer is up, or you select an answer, the next question will be shown. Your results will be shown at the end of the quiz. Good luck!`
        }}
      </div>
      <div>Total number of questions in this quiz: {{ questions.length }}</div>
      <button @click="startQuiz">Start Quiz</button>
    </div>

    <!-- Quiz content -->
    <div v-show="quizStarted && !quizFinished">
      <div>
        <!-- Assuming question timer is not being returned from api, so it is being hard coded -->
        <question-timer ref="timer" :time="timerAmount" :label="'Time remaining'" :timeExpiredMessage="'Time expired. Get ready for the next question'" @timeFinished="timerFinished" />
      </div>
      <div v-if="!hideQuestion">
        <div style="margin-bottom: 20px">
          {{ `Question ${activeQuestion + 1}/${questions.length}` }}
        </div>
        <!-- Displaying the questions and only showing one question at a time -->
        <div v-for="(question, index) in questions" :key="index" v-show="activeQuestion === index">
          <quiz-question :question="question" @answerSelected="answerSelected" />
        </div>
      </div>
    </div>

    <!-- Quiz results -->
    <div v-if="quizFinished">
      <quiz-results :label="'Quiz finished'" :questionsLength="questions.length" :userAnswers="usersAnswers" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import QuestionTimer from '../components/QuestionTimer.vue'
import QuizQuestion from '../components/QuizQuestion.vue'
import QuizResults from '../components/QuizResults.vue'
import { Question } from '../types/quiz'

// allows access to the QuestionTimer component functions
const timer = ref<InstanceType<typeof QuestionTimer> | null>(null)

const questions = ref<Question[]>([])
const usersAnswers = ref<Question[]>([])
const quizStarted = ref(false)
const quizFinished = ref(false)
const activeQuestion = ref<Number>(0)
const hideQuestion = ref<Boolean>(false)
const timerAmount = ref<Number>(10)

const startQuiz = (): void => {
  quizStarted.value = true
  timer.value?.startTimer()
}
const endQuiz = (): void => {
  quizFinished.value = true
}
const resetTimer = (): void => {
  timer.value?.resetTimer()
}
const setHideQuestion = (value: boolean): void => {
  hideQuestion.value = value
}

// handles the user selecting an answer
const nextQuestion = (): void => {
  if (activeQuestion.value < questions.value.length - 1) {
    activeQuestion.value++
    resetTimer()
  } else {
    endQuiz()
  }
}

// handles if user does not select an answer
const timerFinished = (): void => {
  setHideQuestion(true)
  if (activeQuestion.value < questions.value.length - 1) {
    // pushing the qustion with no answer to the array. Allows to display all the questions in the quiz results component
    usersAnswers.value.push(questions.value[activeQuestion.value])
    setTimeout(() => {
      activeQuestion.value++
      resetTimer()
      setHideQuestion(false)
      //   setting to 2 seconds to provide a better user expierence between questions
    }, 2000)
  } else {
    endQuiz()
  }
}

const answerSelected = (answer: any): void => {
  usersAnswers.value.push(answer)
  nextQuestion()
}

async function fetchQuestions(): Promise<void> {
  try {
    const response = await fetch('/questions.json')
    const data: Question[] = await response.json()
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
.instructions {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
}
.instructions > button {
  width: fit-content;
}
</style>
