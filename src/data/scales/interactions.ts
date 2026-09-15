import type { QuizAnswerValue, QuizAnswers, QuizInteraction, QuizInteractionKind, Scale, ScaleQuestion } from './types'
import { questionOptions } from './types'

/**
 * 作答交互的「行为层」。
 *
 * 这里只放纯逻辑（作答默认值、是否已答、计分、报告摘要），不含任何 React 代码，
 * 因此数据层可以安全引用。对应的渲染组件在 src/features/quiz/registry.tsx 中登记，
 * 两张表都以 Record<QuizInteractionKind, ...> 约束，新增交互类型时编译期即会强制补齐。
 */

export const INTERACTION_LABELS: Record<QuizInteractionKind, string> = {
  single: '单选',
  multiple: '多选',
  rank: '排序',
  match: '配对',
}

/** 取该题实际生效的交互类型，未声明时按单选 */
export const interactionOf = (question: ScaleQuestion): QuizInteraction =>
  question.interaction ?? { kind: 'single' }

/** 新建该题的空作答 */
export const defaultAnswer = (question: ScaleQuestion): QuizAnswerValue => {
  const interaction = interactionOf(question)
  if (interaction.kind === 'multiple') return []
  if (interaction.kind === 'rank') return []
  if (interaction.kind === 'match') return {}
  return -1
}

/** 该题是否已完成作答 */
export const isAnswered = (scale: Scale, question: ScaleQuestion, answer: QuizAnswerValue | null): boolean => {
  if (answer === null || answer === undefined) return false
  const interaction = interactionOf(question)
  const optionCount = questionOptions(scale, question).length

  if (interaction.kind === 'single') {
    return typeof answer === 'number' && answer >= 0 && answer < optionCount
  }
  if (interaction.kind === 'multiple') {
    if (!Array.isArray(answer)) return false
    const min = interaction.min ?? 1
    const max = interaction.max ?? optionCount
    return answer.length >= min && answer.length <= max
  }
  if (interaction.kind === 'rank') {
    // 排序要求每个选项都占到名次，即顺序数组覆盖全部选项
    if (!Array.isArray(answer) || answer.length !== optionCount) return false
    const unique = new Set(answer)
    return unique.size === optionCount && answer.every((index) => index >= 0 && index < optionCount)
  }
  // 配对要求每个左项都配上右项
  if (typeof answer !== 'object' || Array.isArray(answer)) return false
  const pairs = Object.keys(answer).length
  return pairs === optionCount && optionCount > 0
}

/** 未完成时的提示文案 */
export const incompleteHint = (question: ScaleQuestion): string => {
  const interaction = interactionOf(question)
  if (interaction.kind === 'multiple') return `请至少选择 ${interaction.min ?? 1} 项后继续`
  if (interaction.kind === 'rank') return '请把全部选项排序后继续'
  if (interaction.kind === 'match') return '请完成全部配对后继续'
  return '请选择一项后继续'
}

/** 单题得分，处理反向计分 */
export const questionScore = (scale: Scale, question: ScaleQuestion, optionIndex: number): number => {
  const options = questionOptions(scale, question)
  const raw = options[optionIndex]?.score ?? 0
  if (!question.reverse) return raw
  const scores = options.map((option) => option.score)
  if (scores.length === 0) return raw
  return Math.max(...scores) + Math.min(...scores) - raw
}

/**
 * 按作答值计算单题得分。各交互的取分规则：
 * - single   取所选选项分值
 * - multiple 取所选选项分值的平均
 * - rank     取排序首位选项的分值（名次分由 rankTally 单独统计）
 * - match    取各配对右项分值之和
 */
export const scoreQuestion = (scale: Scale, question: ScaleQuestion, answer: QuizAnswerValue | null): number => {
  if (answer === null || answer === undefined) return 0
  const interaction = interactionOf(question)
  const options = questionOptions(scale, question)

  if (interaction.kind === 'single') {
    return typeof answer === 'number' && answer >= 0 ? questionScore(scale, question, answer) : 0
  }
  if (interaction.kind === 'multiple') {
    if (!Array.isArray(answer) || answer.length === 0) return 0
    const values = answer.map((index) => questionScore(scale, question, index))
    return values.reduce((sum, value) => sum + value, 0) / values.length
  }
  if (interaction.kind === 'rank') {
    if (!Array.isArray(answer) || answer.length === 0) return 0
    const first = answer[0]
    return typeof first === 'number' ? questionScore(scale, question, first) : 0
  }
  if (typeof answer !== 'object' || Array.isArray(answer)) return 0
  return Object.values(answer).reduce((sum, targetIndex) => sum + (options[targetIndex]?.score ?? 0), 0)
}

/** 报告页展示的单题作答摘要 */
export const summarizeAnswer = (scale: Scale, question: ScaleQuestion, answer: QuizAnswerValue | null): string => {
  if (answer === null || answer === undefined) return '未作答'
  const interaction = interactionOf(question)
  const options = questionOptions(scale, question)
  const labelOf = (index: number) => options[index]?.label ?? `选项 ${index + 1}`

  if (interaction.kind === 'single') {
    if (typeof answer !== 'number' || answer < 0) return '未作答'
    return `${labelOf(answer)}${question.reverse ? '（反向计分）' : ''}`
  }
  if (interaction.kind === 'multiple') {
    if (!Array.isArray(answer) || answer.length === 0) return '未作答'
    return answer.map(labelOf).join('；')
  }
  if (interaction.kind === 'rank') {
    if (!Array.isArray(answer) || answer.length === 0) return '未作答'
    return answer.map((index, position) => `${position + 1}. ${labelOf(index)}`).join('　')
  }
  if (typeof answer !== 'object' || Array.isArray(answer)) return '未作答'
  const targets = interaction.targets
  const pairs = Object.keys(answer)
  if (pairs.length === 0) return '未作答'
  return pairs
    .map((key) => `${labelOf(Number(key))} → ${targets[answer[key]] ?? '未配对'}`)
    .join('；')
}

export type ScaleResult = {
  /** 计分题得分总和 */
  total: number
  /** 计分题均分 */
  average: number
  /** 各维度得分 */
  byDimension: Record<string, number>
  /** 已作答题数（含不计分题），按 isAnswered 判定 */
  answered: number
  /** 计入总分的题数 */
  scoredCount: number
}

/** 汇总计分。scored === false 的题目只记录作答，不参与总分与维度 */
export const scoreAnswers = (scale: Scale, answers: QuizAnswers): ScaleResult => {
  let total = 0
  let scoredAnswered = 0
  let scoredCount = 0
  let answered = 0
  const byDimension: Record<string, number> = {}

  scale.questions.forEach((question, index) => {
    const answer = answers[index] ?? null
    if (isAnswered(scale, question, answer)) answered += 1

    const isScored = question.scored !== false
    if (isScored) scoredCount += 1
    if (!isScored) return
    if (answer === null) return

    const value = scoreQuestion(scale, question, answer)
    total += value
    scoredAnswered += 1
    if (question.dimension) byDimension[question.dimension] = (byDimension[question.dimension] ?? 0) + value
  })

  return { total, average: scoredAnswered ? total / scoredAnswered : 0, byDimension, answered, scoredCount }
}

/** 统计各类型字母被选中的次数。仅单选型量表适用 */
export const letterCounts = (scale: Scale, answers: QuizAnswers): Record<string, number> => {
  const counts: Record<string, number> = {}
  scale.questions.forEach((question, index) => {
    const answer = answers[index]
    if (typeof answer !== 'number' || answer < 0) return
    const letter = question.letters?.[answer]
    if (!letter) return
    counts[letter] = (counts[letter] ?? 0) + 1
  })
  return counts
}

/**
 * 排序题的逐选项累计分。
 * 每题把名次换算成分值（选项数 → 1），按选项位置累加，
 * 用于学习风格这类「每题都对同一组选项排序」的量表。
 */
export const rankTally = (scale: Scale, answers: QuizAnswers): number[] => {
  const tally: number[] = []
  scale.questions.forEach((question, index) => {
    const options = questionOptions(scale, question)
    while (tally.length < options.length) tally.push(0)
    const answer = answers[index]
    if (!Array.isArray(answer)) return
    answer.forEach((optionIndex, position) => {
      if (optionIndex < 0 || optionIndex >= tally.length) return
      tally[optionIndex] += options.length - position
    })
  })
  return tally
}

/** 量表是否使用了某种交互 */
export const usesInteraction = (scale: Scale, kind: QuizInteractionKind): boolean =>
  scale.questions.some((question) => interactionOf(question).kind === kind)
