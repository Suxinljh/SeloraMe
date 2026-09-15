import { getGadSession, getPhqSession } from '../store/session'

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

const sum = (answers: Array<number | null>, indexes: number[]) => indexes.reduce((total, index) => total + (answers[index] ?? 0), 0)

export function getProfileOverview (): ProfileOverview {
  const phq = getPhqSession()
  const gad = getGadSession()
  const topics: ProfileTopic[] = []

  if (phq.completedAt) {
    const definitions = [
      { label: '情绪体验', detail: '基于情绪低落相关作答', indexes: [0, 1] },
      { label: '睡眠与精力', detail: '基于睡眠与精力相关作答', indexes: [2, 3] },
      { label: '饮食与自我评价', detail: '基于饮食与自我评价相关作答', indexes: [4, 5] },
      { label: '专注与行动状态', detail: '基于专注和行动状态相关作答', indexes: [6, 7] },
    ]
    definitions.forEach(({ label, detail, indexes }) => {
      const score = sum(phq.answers, indexes)
      if (score > 0) topics.push({ label, detail, score })
    })
  }

  if (gad.completedAt) {
    const definitions = [
      { label: '焦虑与担忧', detail: '基于紧张和担忧相关作答', indexes: [0, 1, 2, 6] },
      { label: '放松与安定感', detail: '基于放松困难相关作答', indexes: [3, 4] },
      { label: '易怒与敏感度', detail: '基于易怒或急躁相关作答', indexes: [5] },
    ]
    definitions.forEach(({ label, detail, indexes }) => {
      const score = sum(gad.answers, indexes)
      if (score > 0) topics.push({ label, detail, score })
    })
  }

  const completedCount = Number(Boolean(phq.completedAt)) + Number(Boolean(gad.completedAt))
  return { completedCount, reportCount: completedCount, topics: topics.sort((a, b) => b.score - a.score).slice(0, 5) }
}
