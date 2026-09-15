import type { Scale, ScaleCategory } from './types'
import { SCALE_CATEGORIES } from './types'

// 专业量表
import phq9 from './professional/phq-9'
import gad7 from './professional/gad-7'
import scl90 from './professional/scl-90'
import mssmhs from './professional/mssmhs'
import mhrsp from './professional/mhrsp'
import ybocs from './professional/ybocs'

// 性格人格
import mbti32 from './personality/mbti-32'
import mbti93 from './personality/mbti-93'
import mbti100 from './personality/mbti-100'
import disc from './personality/disc'
import epq from './personality/epq'
import epqChild from './personality/epq-child'
import temperament from './personality/temperament'

// 情绪心理
import eq from './emotion/eq'
import internalFriction from './emotion/internal-friction'
import testAnxiety from './emotion/test-anxiety'
import frustration from './emotion/frustration'
import collegeMental from './emotion/college-mental'
import mentalSelfCheck from './emotion/mental-self-check'

// 恋爱关系
import attachment from './romance/attachment'
import loveStyle from './romance/love-style'

// 职场能力
import holland from './career/holland'
import careerAptitude from './career/career-aptitude'
import aq from './career/aq'
import majorChoice from './career/major-choice'

// 自我探索
import tcmConstitution from './self/tcm-constitution'
import learningStyle from './self/learning-style'
import adolescentMental from './self/adolescent-mental'

// 生活状态
import timeManagement from './lifestyle/time-management'
import studyHabit from './lifestyle/study-habit'
import wangjisheng from './lifestyle/wangjisheng'
import msmt from './lifestyle/msmt'

// 兴趣偏好
import subjectInterest from './interest/subject-interest'

export { SCALE_CATEGORIES }
export type { Scale, ScaleCategory }
export * from './types'
export * from './interactions'

/** 全部量表。顺序即列表页默认展示顺序。 */
export const allScales: Scale[] = [
  phq9,
  gad7,
  scl90,
  mssmhs,
  mhrsp,
  ybocs,
  mbti32,
  mbti93,
  mbti100,
  disc,
  epq,
  epqChild,
  temperament,
  eq,
  internalFriction,
  testAnxiety,
  frustration,
  collegeMental,
  mentalSelfCheck,
  attachment,
  loveStyle,
  holland,
  careerAptitude,
  aq,
  majorChoice,
  tcmConstitution,
  learningStyle,
  adolescentMental,
  timeManagement,
  studyHabit,
  wangjisheng,
  msmt,
  subjectInterest,
]

const scaleIndex: Record<string, Scale> = allScales.reduce<Record<string, Scale>>((acc, scale) => {
  acc[scale.id] = scale
  return acc
}, {})

/** 按 id 取量表 */
export const getScale = (id: string | undefined): Scale | undefined =>
  id ? scaleIndex[id] : undefined

/** 取某分类下的全部量表 */
export const scalesByCategory = (category: ScaleCategory): Scale[] =>
  allScales.filter((scale) => scale.category === category)

/** 各分类的量表数量。空分类返回 0，供分类页展示空态。 */
export const categoryCounts = (): Record<ScaleCategory, number> =>
  SCALE_CATEGORIES.reduce<Record<ScaleCategory, number>>((acc, { key }) => {
    acc[key] = scalesByCategory(key).length
    return acc
  }, {} as Record<ScaleCategory, number>)

/** 有内容的分类数量，用于统计文案 */
export const filledCategoryCount = (): number =>
  SCALE_CATEGORIES.filter(({ key }) => scalesByCategory(key).length > 0).length

/** 把关键词拆成词项，按空白切分 */
const termsOf = (keyword: string): string[] =>
  keyword.trim().toLowerCase().split(/\s+/).filter((term) => term.length > 0)

/**
 * 按关键词搜索量表。
 *
 * 匹配范围**只包含「标题」与「描述」两个字段**，不涉及介绍正文、分类、标签或维度名
 * —— 那些字段内容长，纳入匹配会让结果变得难以预期。
 * 支持空格分隔的多个词项，全部命中才算匹配（不要求出现在同一字段）。
 */
export const searchScales = (keyword: string): Scale[] => {
  const terms = termsOf(keyword)
  if (terms.length === 0) return []
  return allScales.filter((scale) => {
    const haystack = `${scale.title} ${scale.desc}`.toLowerCase()
    return terms.every((term) => haystack.includes(term))
  })
}

/**
 * 找出文本中首个命中的词项区间，供搜索结果页高亮。
 * 无命中时返回 null。
 */
export const matchRange = (text: string, keyword: string): { start: number; end: number } | null => {
  const lower = text.toLowerCase()
  for (const term of termsOf(keyword)) {
    const index = lower.indexOf(term)
    if (index >= 0) return { start: index, end: index + term.length }
  }
  return null
}
