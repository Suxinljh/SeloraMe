import { Button, Text, View } from '@tarojs/components'
import { questionOptions } from '../../../data/scales'
import type { InteractionProps } from '../types'

/**
 * 双向刻度选择。题干给出两端描述，用户在若干刻度上选一点。
 *
 * 参照 OEJTS 的呈现方式：两端描述分列左右，刻度按钮从两端向中间递减，
 * 中间点代表不偏向任何一端。作答值就是所选刻度的下标。
 */
export default function ScaleChoice ({ scale, question, answer, onChange }: InteractionProps) {
  const options = questionOptions(scale, question)
  const selected = typeof answer === 'number' ? answer : -1
  const bounds = question.endpoints
  const middle = (options.length - 1) / 2

  return (
    <View className='quiz-scale'>
      {bounds && (
        <View className='quiz-scale-labels'>
          <Text className='quiz-scale-label'>{bounds.low}</Text>
          <Text className='quiz-scale-label is-right'>{bounds.high}</Text>
        </View>
      )}
      <View className='quiz-scale-buttons'>
        {options.map((option, index) => {
          // 越靠近中间刻度越小，形成「两端强、中间中性」的视觉暗示
          const distance = Math.abs(index - middle)
          const size = distance >= middle ? 'lg' : distance >= middle - 1 ? 'md' : 'sm'
          return (
            <Button
              key={option.label}
              className={`quiz-scale-btn size-${size} ${selected === index ? 'is-selected' : ''}`}
              onClick={() => onChange(index)}
            >
              {option.label}
            </Button>
          )
        })}
      </View>
    </View>
  )
}
