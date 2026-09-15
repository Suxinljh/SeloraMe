import type { QuizAnswerValue, Scale, ScaleQuestion } from '../../data/scales'

/**
 * 答题交互组件的统一契约。
 * 组件只负责「渲染 + 产出作答值」，不参与计分、不写存储、不管翻页。
 */
export type InteractionProps = {
  scale: Scale
  question: ScaleQuestion
  /** 当前作答值，形态由交互类型决定 */
  answer: QuizAnswerValue | null
  /** 作答变化时回调，传 null 表示清空 */
  onChange: (value: QuizAnswerValue | null) => void
}
