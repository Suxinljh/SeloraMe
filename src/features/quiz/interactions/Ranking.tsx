import { Button, Text, View } from '@tarojs/components'
import Icon from '../../../components/Icon'
import { questionOptions } from '../../../data/scales'
import type { InteractionProps } from '../types'

/**
 * 排序。作答值是从高到低排列的选项下标数组。
 *
 * 交互方式：依次点击选项，第 1 次点击的排第 1 名，以此类推；
 * 再次点击已排名的选项可把它移出，后面的名次自动前移。
 * 采用点击而非拖拽，避免在小程序里依赖 movable-view 的兼容性。
 */
export default function Ranking ({ scale, question, answer, onChange }: InteractionProps) {
  const options = questionOptions(scale, question)
  const order = Array.isArray(answer) ? answer : []

  const toggle = (index: number) => {
    const next = order.includes(index)
      ? order.filter((item) => item !== index)
      : [...order, index]
    onChange(next.length > 0 ? next : null)
  }

  const reset = () => onChange(null)

  return (
    <View className='quiz-options'>
      <View className='quiz-options-hint'>
        <Text>请按符合程度从高到低依次点击，已完成 {order.length} / {options.length}</Text>
      </View>
      {options.map((option, index) => {
        const rank = order.indexOf(index)
        const ranked = rank >= 0
        return (
          <Button
            key={option.label}
            className={`quiz-option quiz-option-rank ${ranked ? 'is-selected' : ''}`}
            onClick={() => toggle(index)}
          >
            <View className='option-main'>
              <View className={`quiz-rank-badge ${ranked ? 'is-filled' : ''}`}>
                <Text>{ranked ? rank + 1 : '—'}</Text>
              </View>
              <View className='option-copy'>
                <Text className='option-title'>{option.label}</Text>
              </View>
            </View>
            {ranked ? (
              <View className='selected-check'>
                <Icon name='check' className='selected-check-icon' />
              </View>
            ) : (
              <Icon name='chevronRight' className='option-chevron' />
            )}
          </Button>
        )
      })}
      {order.length > 0 && (
        <Button className='quiz-reset' onClick={reset}>
          <Icon name='replay' className='button-icon' />
          重置排序
        </Button>
      )}
    </View>
  )
}
