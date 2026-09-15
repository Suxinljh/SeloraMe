/**
 * 量表数据模型
 *
 * 设计目标：支持项目内所有心理量表，且不把任何量表 ID 硬编码进页面。
 *
 * 约定：
 * - `score` 一律使用量表原始计分（不是标准化后的分数）。
 * - 选项不统一长度：SCL-90 是五级、PHQ-9 是四级、恋爱依恋量表是七级。
 * - 维度可有可无。无维度的量表维度数组为空，报告页只出总分与分级。
 * - `reverse` 标记反向计分题，计分时用 `maxOptionScore + minOptionScore - score` 翻转。
 */

/** 十个分类。与 src/pages/categories/index.tsx 的分类一一对应。 */
export type ScaleCategory =
  | 'personality'   // 性格人格
  | 'emotion'       // 情绪心理
  | 'romance'       // 恋爱关系
  | 'social'        // 人际关系
  | 'career'        // 职场能力
  | 'self'          // 自我探索
  | 'lifestyle'     // 生活状态
  | 'interest'      // 兴趣偏好
  | 'fun'           // 趣味测试
  | 'professional'  // 专业量表

/** 分类元数据：顺序即分类页展示顺序。 */
export const SCALE_CATEGORIES: Array<{ key: ScaleCategory; name: string }> = [
  { key: 'personality', name: '性格人格' },
  { key: 'emotion', name: '情绪心理' },
  { key: 'romance', name: '恋爱关系' },
  { key: 'social', name: '人际关系' },
  { key: 'career', name: '职场能力' },
  { key: 'self', name: '自我探索' },
  { key: 'lifestyle', name: '生活状态' },
  { key: 'interest', name: '兴趣偏好' },
  { key: 'fun', name: '趣味测试' },
  { key: 'professional', name: '专业量表' },
]

export type ScaleOption = {
  /** 选项文案，如「完全没有」「有几天」 */
  label: string
  /** 该选项对应的原始得分 */
  score: number
}

export type ScaleQuestion = {
  /** 从 1 开始的题号 */
  id: number
  /** 题干。不包含选项，选项中不留 A/B/C 前缀 */
  text: string
  /** 该题所属维度 key，无维度时省略 */
  dimension?: string
  /** 是否反向计分 */
  reverse?: boolean
  /**
   * 该题专属选项集。省略时使用量表级的 scale.options。
   * 用于两类情况：题目选项与其余题不同（如 PHQ-9 的功能影响题），
   * 或各题选项文案本就逐题不同（如挫折能力测试）。
   */
  options?: ScaleOption[]
  /**
   * 是否计入总分。默认 true。
   * 设为 false 的题目仍会展示与记录作答，但不参与计分（如功能影响题）。
   */
  scored?: boolean
}

/** 计分方式 */
export type ScaleScoringKind =
  | 'sum'      // 各题得分求和后按分界值分级
  | 'profile'  // 多维剖析型，不做总分，只看各维度得分组合（MBTI / 霍兰德 / DISC / 依恋）
  | 'average'  // 取均分后按分界值分级

/** 总分分级带，仅 sum / average 使用 */
export type ScaleBand = {
  /** 下界，含 */
  min: number
  /** 上界，含 */
  max: number
  label: string
  summary: string
  recommendation: string
  tone: 'calm' | 'attention' | 'urgent'
}

export type ScaleDimension = {
  /** 维度的程序标识，小驼峰 */
  key: string
  /** 维度显示名 */
  name: string
  /** 该维度包含的题号，从 1 开始 */
  items: number[]
  /** 维度结果解释，逐条列出可命中的区间 */
  bands?: ScaleBand[]
}

export type Scale = {
  /** 唯一标识，kebab-case。作为路由参数 ?assessment= 的值 */
  id: string
  title: string
  /** 一句话描述，用于列表卡片 */
  desc: string
  category: ScaleCategory
  /** 形如「9 题 · 约 3 分钟」。交给聚合层计算更稳妥 */
  duration: string
  /** 卡片右上角标签，如「医学标准」「高信效度」 */
  tag: string
  /** 详情页顶部人数文案 */
  participants: string
  /** 详情页「这是个什么样的测试？」正文段落 */
  intro: string[]
  /** 详情页要点行，用「｜」分隔 */
  highlights: string
  /** 详情页「这个测试有什么用？」要点 */
  benefits: Array<{ title: string; description: string }>
  /** 详情页测试说明，逐条 */
  instructions: string[]
  /** 量表来源，如「PHQ-9 · Kroenke 等，2001」；用于报告页标注 */
  source?: string
  /** 全部题目共用的选项集。题目自带选项时，仍须在此给出唯一选项集 */
  options: ScaleOption[]
  questions: ScaleQuestion[]
  dimensions: ScaleDimension[]
  scoring: {
    kind: ScaleScoringKind
    /** sum / average 模式下的总分级带 */
    bands?: ScaleBand[]
    /** profile 模式下的类型判定说明 */
    profileNote?: string
  }
  /** 结果页免责声明，省略时用全局默认文案 */
  disclaimer?: string
}

/** 取某题实际生效的选项集 */
export const questionOptions = (scale: Scale, question: ScaleQuestion): ScaleOption[] =>
  question.options ?? scale.options

/** 由题目与选项推导题目数量文案 */
export const scaleMeta = (scale: Scale): string => `${scale.questions.length} 题 · ${scale.duration}`

/** 单题计分，处理反向题与逐题选项 */
export const questionScore = (scale: Scale, question: ScaleQuestion, optionIndex: number): number => {
  const options = questionOptions(scale, question)
  const raw = options[optionIndex]?.score ?? 0
  if (!question.reverse) return raw
  const scores = options.map((option) => option.score)
  return Math.max(...scores) + Math.min(...scores) - raw
}

export type ScaleResult = {
  /** 计分题得分总和 */
  total: number
  /** 计分题均分 */
  average: number
  /** 各维度得分 */
  byDimension: Record<string, number>
  /** 已作答题数（含不计分题） */
  answered: number
  /** 计入总分的题数 */
  scoredCount: number
}

/** 汇总计分。scored === false 的题目只记录作答，不参与总分与维度 */
export const scoreAnswers = (scale: Scale, answers: Array<number | null>): ScaleResult => {
  let total = 0
  let scoredAnswered = 0
  let scoredCount = 0
  const byDimension: Record<string, number> = {}

  scale.questions.forEach((question, index) => {
    const isScored = question.scored !== false
    if (isScored) scoredCount += 1

    const optionIndex = answers[index]
    if (optionIndex === null || optionIndex === undefined) return
    if (!isScored) return

    const value = questionScore(scale, question, optionIndex)
    total += value
    scoredAnswered += 1
    if (question.dimension) byDimension[question.dimension] = (byDimension[question.dimension] ?? 0) + value
  })

  const answered = answers.filter((answer) => answer !== null && answer !== undefined).length
  return { total, average: scoredAnswered ? total / scoredAnswered : 0, byDimension, answered, scoredCount }
}

/** 取某维度已作答的计分题数，用于计算维度均分 */
export const dimensionItemCount = (scale: Scale, dimensionKey: string): number =>
  scale.questions.filter((question) => question.dimension === dimensionKey && question.scored !== false).length

/** 按分界值取分级带 */
export const resolveBand = (bands: ScaleBand[] | undefined, value: number): ScaleBand | undefined =>
  bands?.find((band) => value >= band.min && value <= band.max)

