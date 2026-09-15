import Taro from '@tarojs/taro'
import type { QuizAnswers, QuizAnswerValue } from '../data/scales'

/**
 * 量表作答会话。
 *
 * 每个量表一份，按 `selorme-session-<scaleId>` 存储，避免为每个量表写一套读写函数。
 * answers 的长度必须与量表的题目数一致；长度不符时视为无效数据并重置，
 * 以兼容量表题目变更后的旧数据。
 *
 * 作答值的形态由题目的作答交互决定（单选是下标、多选是下标数组、
 * 排序是名次数组、配对是映射对象），这里只做透传，不解释内容。
 */
export type ScaleSession = {
  answers: QuizAnswers
  completedAt: number | null
}

const storageKey = (scaleId: string) => `selorme-session-${scaleId}`

const emptySession = (questionCount: number): ScaleSession => ({
  answers: Array<QuizAnswers[number]>(questionCount).fill(null),
  completedAt: null,
})

export function getSession(scaleId: string, questionCount: number): ScaleSession {
  const stored = Taro.getStorageSync<Partial<ScaleSession>>(storageKey(scaleId))
  if (!stored || !Array.isArray(stored.answers) || stored.answers.length !== questionCount) {
    return emptySession(questionCount)
  }
  return {
    answers: stored.answers,
    completedAt: typeof stored.completedAt === 'number' ? stored.completedAt : null,
  }
}

function save(scaleId: string, session: ScaleSession) {
  Taro.setStorageSync(storageKey(scaleId), session)
}

export function saveAnswer(scaleId: string, questionCount: number, index: number, value: QuizAnswerValue | null) {
  const session = getSession(scaleId, questionCount)
  if (index < 0 || index >= questionCount) return
  session.answers[index] = value
  save(scaleId, session)
}

export function completeSession(scaleId: string, questionCount: number) {
  const session = getSession(scaleId, questionCount)
  session.completedAt = Date.now()
  save(scaleId, session)
}

export function resetSession(scaleId: string, questionCount: number) {
  save(scaleId, emptySession(questionCount))
}

/** 已作答题数，用于「继续测评」的进度文案 */
export function answeredCount(scaleId: string, questionCount: number): number {
  return getSession(scaleId, questionCount).answers.filter((answer) => answer !== null).length
}

/** 读取该量表在存储中留下的原始记录，不校验长度。供归档聚合使用 */
export function peekSession(scaleId: string): Partial<ScaleSession> | null {
  const stored = Taro.getStorageSync<Partial<ScaleSession>>(storageKey(scaleId))
  return stored && typeof stored === 'object' ? stored : null
}

/** 清除全部量表会话。scaleIds 由调用方传入，避免此处依赖数据层造成循环引用 */
export function clearAllSessions(scaleIds: string[]) {
  scaleIds.forEach((id) => Taro.removeStorageSync(storageKey(id)))
}
