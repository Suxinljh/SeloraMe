import { View } from '@tarojs/components'
import { interactionOf } from '../../data/scales'
import { INTERACTION_COMPONENTS } from './registry'
import type { InteractionProps } from './types'

/**
 * 作答区分发器：按题目声明的交互类型渲染对应组件。
 * 答题页只调用这个组件，不关心具体是单选、多选、排序还是配对。
 */
export default function AnswerArea (props: InteractionProps) {
  const Component = INTERACTION_COMPONENTS[interactionOf(props.question).kind]
  return (
    <View className='answer-area'>
      <Component {...props} />
    </View>
  )
}
