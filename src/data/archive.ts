import { allScales, getScale } from './scales'
import { peekSession } from '../store/session'
import { getFavoriteAssessmentIds } from '../store/favorites'
import { getPurchasedAssessmentIds } from '../store/purchase'

export type ArchiveType = 'unfinished' | 'purchased' | 'reports' | 'favorites'
export type ArchiveEntry = { assessment: string; title: string; detail: string; completedAt?: number }

const dateText = (time: number) => {
  const date = new Date(time)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

/** 读取全部量表在本地留下的作答进度 */
const readProgress = () =>
  allScales.map((scale) => {
    const session = peekSession(scale.id)
    const answers = Array.isArray(session?.answers) ? session.answers : []
    const valid = answers.length === scale.questions.length
    return {
      scale,
      answered: valid ? answers.filter((answer) => answer !== null).length : 0,
      completedAt: valid && typeof session?.completedAt === 'number' ? session.completedAt : null,
      valid,
    }
  })

export function getUnfinishedAssessments(): ArchiveEntry[] {
  return readProgress()
    .filter(({ scale, answered, completedAt, valid }) => valid && answered > 0 && !completedAt)
    .map(({ scale, answered }) => ({
      assessment: scale.id,
      title: scale.title,
      detail: `已完成 ${answered} / ${scale.questions.length} 题`,
    }))
}

export function getReportAssessments(): ArchiveEntry[] {
  return readProgress()
    .filter(({ completedAt }) => completedAt !== null)
    .map(({ scale, completedAt }) => ({
      assessment: scale.id,
      title: scale.title,
      detail: `完成于 ${dateText(completedAt as number)}`,
      completedAt: completedAt as number,
    }))
    .sort((first, second) => (second.completedAt ?? 0) - (first.completedAt ?? 0))
}

export function getFavoriteAssessments(): ArchiveEntry[] {
  return getFavoriteAssessmentIds().flatMap((id) => {
    const scale = getScale(id)
    return scale ? [{ assessment: scale.id, title: scale.title, detail: scale.desc }] : []
  })
}

export function getPurchasedAssessments(): ArchiveEntry[] {
  return getPurchasedAssessmentIds().flatMap((id) => {
    const scale = getScale(id)
    return scale ? [{ assessment: scale.id, title: scale.title, detail: '已解锁，可随时开始测评' }] : []
  })
}

export function getArchiveEntries(type: ArchiveType): ArchiveEntry[] {
  if (type === 'unfinished') return getUnfinishedAssessments()
  if (type === 'reports') return getReportAssessments()
  if (type === 'favorites') return getFavoriteAssessments()
  if (type === 'purchased') return getPurchasedAssessments()
  return []
}
