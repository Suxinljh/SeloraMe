import { allScales } from './scales'
import { peekSession } from '../store/session'
import { scoreAnswers } from './scales/interactions'
import type { Scale } from './scales/types'

export type ProfileTopic = {
  label: string
  detail: string
  score: number
}

export type ProfileOverview = {
  completedCount: number
  reportCount: number
  topics: ProfileTopic[]
}

/** 已完成评测的作答，转换为维度得分并汇总为「关注主题」 */
const collectTopics = (): ProfileTopic[] => {
  const topics: ProfileTopic[] = []

  allScales.forEach((scale: Scale) => {
    const session = peekSession(scale.id)
    const answers = Array.isArray(session?.answers) ? session.answers : []
    if (answers.length !== scale.questions.length) return
    if (typeof session?.completedAt !== 'number') return

    const result = scoreAnswers(scale, answers)
    scale.dimensions.forEach((dimension) => {
      const score = result.byDimension[dimension.key] ?? 0
      if (score <= 0) return
      topics.push({
        label: dimension.name,
        detail: `来自《${scale.title}》的${dimension.name}维度`,
        score,
      })
    })
  })

  return topics
}

export function getProfileOverview(): ProfileOverview {
  const completed = allScales.filter((scale) => {
    const session = peekSession(scale.id)
    const answers = Array.isArray(session?.answers) ? session.answers : []
    return answers.length === scale.questions.length && typeof session?.completedAt === 'number'
  })

  const topics = collectTopics().sort((first, second) => second.score - first.score).slice(0, 5)

  return {
    completedCount: completed.length,
    reportCount: completed.length,
    topics,
  }
}
