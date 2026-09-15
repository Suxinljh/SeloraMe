import { useState } from 'react'
import { Button, Text, View } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import Icon from '../../components/Icon'
import Nav from '../../components/Nav'
import AnswerArea from '../../features/quiz/AnswerArea'
import {
  INTERACTION_LABELS,
  getScale,
  incompleteHint,
  interactionOf,
  isAnswered,
  type QuizAnswerValue,
  type Scale,
} from '../../data/scales'
import { completeSession, getSession, saveAnswer } from '../../store/session'

/**
 * 答题页。
 *
 * 本身只负责进度、翻页与存储；题目怎么作答、怎么校验、怎么计分全部交给
 * src/features/quiz 下的交互组件与其行为实现，此页不感知具体交互类型。
 */
export default function Questions() {
  const [scaleId, setScaleId] = useState('phq-9')
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Array<QuizAnswerValue | null>>([])

  useLoad((options) => {
    const id = typeof options.assessment === 'string' ? options.assessment : 'phq-9'
    setScaleId(id)
    const target = getScale(id)
    if (target) setAnswers(getSession(target.id, target.questions.length).answers)
  })

  const scale: Scale | undefined = getScale(scaleId)

  if (!scale) {
    return (
      <View className="question-page">
        <Nav back />
        <View className="quiz-body">
          <View className="quiz-question-card">
            <Text className="question-title">未找到该评测</Text>
          </View>
        </View>
      </View>
    )
  }

  const total = scale.questions.length
  const current = scale.questions[step]
  const answer = answers[step] ?? null
  const kind = interactionOf(current).kind
  const progress = Math.round(((step + 1) / total) * 100)
  const isLast = step + 1 === total

  const change = (value: QuizAnswerValue | null) => {
    saveAnswer(scale.id, total, step, value)
    setAnswers(getSession(scale.id, total).answers)
  }

  const next = () => {
    if (!isAnswered(scale, current, answer)) {
      Taro.showToast({ title: incompleteHint(current), icon: 'none' })
      return
    }
    if (isLast) {
      completeSession(scale.id, total)
      Taro.redirectTo({ url: `/pages/report/index?assessment=${scale.id}` })
      return
    }
    setStep((currentStep) => currentStep + 1)
  }

  const previous = () => (step === 0 ? Taro.navigateBack() : setStep((currentStep) => currentStep - 1))

  return (
    <View className="question-page">
      <Nav back />
      <View className="quiz-body">
        <View className="quiz-progress">
          <View className="quiz-progress-summary">
            <View className="question-chip">
              <View className="question-chip-dot" />
              <Text>第 {step + 1} / {total} 题</Text>
            </View>
            <View className="progress-copy">
              <Text>{progress}%</Text>
              <Text>已完成</Text>
            </View>
          </View>
          <View className="progress-track">
            <View className="progress-value" style={{ width: `${progress}%` }} />
          </View>
        </View>

        <View className="quiz-question-card">
          <View className="question-orb" />
          <Text className="question-kind">{scale.title} · {INTERACTION_LABELS[kind]}</Text>
          <Text className="question-title">{current.text}</Text>
        </View>

        <AnswerArea scale={scale} question={current} answer={answer} onChange={change} />

        <View className="quiz-note">
          <Icon name="autoAwesome" className="note-icon" />
          <Text>请按实际情况作答；结果用于自我了解与初步筛查，不构成临床诊断。</Text>
        </View>
      </View>

      <View className="quiz-footer">
        <Button className="quiz-prev" onClick={previous}>
          <Icon name="arrowBack" className="button-icon" />
          <Text>{step === 0 ? '返回' : '上一题'}</Text>
        </Button>
        <Button className="quiz-next" onClick={next}>
          <Text>{isLast ? '查看报告' : '下一题'}</Text>
          <Icon name="arrowForward" className="button-icon" />
        </Button>
      </View>
    </View>
  )
}
