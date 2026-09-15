import type { ComponentType } from 'react'
import type { QuizInteractionKind } from '../../data/scales'
import type { InteractionProps } from './types'
import SingleChoice from './interactions/SingleChoice'
import MultiChoice from './interactions/MultiChoice'
import Ranking from './interactions/Ranking'
import Matching from './interactions/Matching'

/**
 * 作答交互组件注册表。
 *
 * 用 Record<QuizInteractionKind, ...> 约束，新增交互类型时若此处漏登记，
 * TypeScript 会直接报错，不会出现「数据里声明了但页面渲染不出来」的情况。
 *
 * 新增一种交互的完整步骤：
 * 1. src/data/scales/types.ts：QuizInteraction 联合类型加一个 kind
 * 2. src/data/scales/interactions.ts：INTERACTION_LABELS 与各行为函数补该 kind 分支
 * 3. src/features/quiz/interactions/：新建组件
 * 4. 本文件：登记到下表
 * 答题页无需改动。
 */
export const INTERACTION_COMPONENTS: Record<QuizInteractionKind, ComponentType<InteractionProps>> = {
  single: SingleChoice,
  multiple: MultiChoice,
  rank: Ranking,
  match: Matching,
}
