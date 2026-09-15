import { getGadSession, getPhqSession } from '../store/session'
import { assessments } from './assessments'
import { getFavoriteAssessmentIds } from '../store/favorites'
import { getPurchasedAssessmentIds } from '../store/purchase'

export type ArchiveType = 'unfinished' | 'purchased' | 'reports' | 'favorites'
export type ArchiveEntry = { assessment: string; title: string; detail: string; completedAt?: number }

const definitions = {
  'phq-9': { title: 'PHQ-9 抑郁情绪筛查', total: 9 },
  gad: { title: 'GAD-7 广泛性焦虑筛查', total: 7 },
} as const

const answered = (answers: Array<number | null>) => answers.filter((answer) => answer !== null).length
const dateText = (time: number) => {
  const date = new Date(time)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function getUnfinishedAssessments(): ArchiveEntry[] {
  const sessions = [{ assessment: 'phq-9' as const, session: getPhqSession() }, { assessment: 'gad' as const, session: getGadSession() }]
  return sessions.flatMap(({ assessment, session }) => {
    const progress = answered(session.answers)
    if (progress === 0 || session.completedAt) return []
    return [{ assessment, title: definitions[assessment].title, detail: `已完成 ${progress} / ${definitions[assessment].total} 题` }]
  })
}

export function getReportAssessments(): ArchiveEntry[] {
  const sessions = [{ assessment: 'phq-9' as const, session: getPhqSession() }, { assessment: 'gad' as const, session: getGadSession() }]
  return sessions.flatMap(({ assessment, session }) => session.completedAt ? [{ assessment, title: definitions[assessment].title, detail: `完成于 ${dateText(session.completedAt)}`, completedAt: session.completedAt }] : [])
}

export function getFavoriteAssessments (): ArchiveEntry[] {
  const favoriteIds = getFavoriteAssessmentIds()
  return favoriteIds.flatMap((id) => {
    const assessment = assessments.find((item) => item.id === id)
    return assessment ? [{ assessment: assessment.id, title: assessment.title, detail: assessment.desc }] : []
  })
}

export function getPurchasedAssessments (): ArchiveEntry[] {
  const purchasedIds = getPurchasedAssessmentIds()
  return purchasedIds.flatMap((id) => {
    const assessment = assessments.find((item) => item.id === id)
    return assessment ? [{ assessment: assessment.id, title: assessment.title, detail: '已解锁，可随时开始测评' }] : []
  })
}

export function getArchiveEntries(type: ArchiveType): ArchiveEntry[] {
  if (type === 'unfinished') return getUnfinishedAssessments()
  if (type === 'reports') return getReportAssessments()
  if (type === 'favorites') return getFavoriteAssessments()
  if (type === 'purchased') return getPurchasedAssessments()
  return []
}
