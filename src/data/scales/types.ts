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

/**
 * 作答交互类型。
 *
 * 新增一种交互 = 三处改动，且 Record 类型会强制补齐：
 * 1. 在此联合类型加一个 kind
 * 2. src/data/scales/interactions.ts 内的实现表加一条 Record 记录
 * 3. src/features/quiz/registry.tsx 内的组件表加一条 Record 记录
 * 答题页本身不需要改动。
 */
export type QuizInteractionKind = 'single' | 'multiple' | 'rank' | 'match'

export type QuizInteraction =
  /** 单选 */
  | { kind: 'single' }
  /** 多选。min / max 用于校验可选数量 */
  | { kind: 'multiple'; min?: number; max?: number }
  /** 排序：把全部选项按符合程度排出名次，名次分从选项个数递减到 1 */
  | { kind: 'rank' }
  /** 配对：题目的 options 为左列，targets 为右列，需一一配对 */
  | { kind: 'match'; targets: string[] }

/**
 * 单题作答值。按交互类型取不同形态：
 * - single   → number              选中的选项下标
 * - multiple → number[]            选中的选项下标集合
 * - rank     → number[]            选项下标按名次从高到低排列（长度为选项数）
 * - match    → Record<string, number>  左列下标（字符串）→ 右列下标
 */
export type QuizAnswerValue = number | number[] | Record<string, number>

/** 整卷作答。下标与 scale.questions 对齐 */
export type QuizAnswers = Array<QuizAnswerValue | null>

export type ScaleOption = {
  /** 选项文案，如「完全没有」「有几天」 */
  label: string
  /** 该选项对应的原始得分 */
  score: number
  /**
   * 选项配图 URL。用于图片题（如瑞文智力测验的图形矩阵）。
   *
   * 图片是「选项的属性」而不是一种交互类型：单选、多选都能带图，
   * 因此不需要新增 kind，交互组件会自动切换成图文卡片布局。
   * 走网络图时需为域名配置 downloadFile 合法域名。
   */
  image?: string
  /** 配图裁剪方式，默认 aspectFit */
  imageFit?: 'aspectFit' | 'aspectFill'
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
  /**
   * 各选项对应的类型字母，下标与选项一一对应。
   * 用于 profile 型量表判定类型：MBTI 如 ['J','P']，DISC 如 ['D','S','I','C']。
   * 这类量表的选项分值不计分，类型由被选中的字母累计得出。
   */
  letters?: string[]
  /**
   * 该题的作答交互。省略时按单选处理。
   * 渲染与校验由 src/features/quiz 按 kind 分发，本字段只声明类型。
   */
  interaction?: QuizInteraction
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
  /**
   * 测评人数文案。
   * 当前无真实后端数据，全部统一为「持续更新中」，且**不在界面上作为人数展示**。
   * 接入统计接口后可直接启用；在此之前不要填编造的数字。
   */
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
  /**
   * 量表级共享选项集。
   * 仅在全部题目使用同一套选项时给出（多数 Likert 型量表如此）。
   * 若各题选项不同（如 MBTI 二选一、DISC 四选一、YBOCS 每题锚点不同），
   * 则省略此字段，改由每题的 question.options 提供，避免出现无意义的占位选项。
   */
  options?: ScaleOption[]
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
  question.options ?? scale.options ?? []

/** 取量表内出现的最大选项分值，用于计算满分与柱状图上限 */
export const maxOptionScore = (scale: Scale): number => {
  const scores = scale.questions.flatMap((question) => questionOptions(scale, question).map((option) => option.score))
  return scores.length > 0 ? Math.max(...scores) : 0
}

/** 由题目与选项推导题目数量文案 */
export const scaleMeta = (scale: Scale): string => `${scale.questions.length} 题 · ${scale.duration}`

/** 取某维度已作答的计分题数，用于计算维度均分 */
export const dimensionItemCount = (scale: Scale, dimensionKey: string): number =>
  scale.questions.filter((question) => question.dimension === dimensionKey && question.scored !== false).length

/** 按分界值取分级带 */
export const resolveBand = (bands: ScaleBand[] | undefined, value: number): ScaleBand | undefined =>
  bands?.find((band) => value >= band.min && value <= band.max)

/** 取字母计数最高的一项；并列时按传入顺序取靠前者 */
export const topLetter = (counts: Record<string, number>, order: string[]): string =>
  order.reduce((best, letter) => ((counts[letter] ?? 0) > (counts[best] ?? 0) ? letter : best), order[0] ?? '')

/** MBTI 四字母类型：E/I、S/N、T/F、J/P 各取计数较高的一极 */
export const mbtiType = (counts: Record<string, number>): string =>
  ([['E', 'I'], ['S', 'N'], ['T', 'F'], ['J', 'P']] as Array<[string, string]>)
    .map(([first, second]) => ((counts[first] ?? 0) >= (counts[second] ?? 0) ? first : second))
    .join('')

/** 各类型字母的中文释义，报告页用于展示 */
export const LETTER_LABELS: Record<string, string> = {
  E: '外向 Extraversion',
  I: '内向 Introversion',
  S: '感觉 Sensing',
  N: '直觉 Intuition',
  T: '思考 Thinking',
  F: '情感 Feeling',
  J: '判断 Judging',
  P: '知觉 Perceiving',
  D: '支配 Dominance',
  C: '谨慎 Compliance',
}

/** DISC 四型释义 */
export const DISC_LABELS: Record<string, string> = {
  D: '支配型 Dominance',
  I: '影响型 Influence',
  S: '稳健型 Steadiness',
  C: '谨慎型 Compliance',
}


