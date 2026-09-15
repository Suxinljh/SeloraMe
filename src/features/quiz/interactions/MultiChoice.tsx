import { Button, Image, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import Icon from '../../../components/Icon'
import { interactionOf, questionOptions } from '../../../data/scales'
import type { InteractionProps } from '../types'

/** 多选。点击切换选中状态，超出上限时提示并不予选中 */
export default function MultiChoice ({ scale, question, answer, onChange }: InteractionProps) {
  const options = questionOptions(scale, question)
  const chosen = Array.isArray(answer) ? answer : []
  const interaction = interactionOf(question)
  const max = interaction.kind === 'multiple' ? interaction.max : undefined
  const min = interaction.kind === 'multiple' ? interaction.min : undefined
  const withImage = options.some((option) => option.image)

  const toggle = (index: number) => {
    const next = chosen.includes(index)
      ? chosen.filter((item) => item !== index)
      : [...chosen, index]
    if (max !== undefined && next.length > max) {
      Taro.showToast({ title: `最多选择 ${max} 项`, icon: 'none' })
      return
    }
    onChange(next.length > 0 ? next : null)
  }

  return (
    <View className={`quiz-options ${withImage ? 'has-image' : ''}`}>
      <View className='quiz-options-hint'>
        <Text>
          可选{min !== undefined ? ` ${min}` : ''}{max !== undefined ? `～${max}` : ''} 项，已选 {chosen.length} 项
        </Text>
      </View>
      {options.map((option, index) => {
        const active = chosen.includes(index)
        return (
          <Button
            key={option.label}
            className={`quiz-option ${withImage ? 'quiz-option-image' : ''} ${active ? 'is-selected' : ''}`}
            onClick={() => toggle(index)}
          >
            {option.image && (
              <Image className='option-image' src={option.image} mode={option.imageFit ?? 'aspectFit'} />
            )}
            <View className='option-main'>
              <View className='option-checkbox'>
                {active && <Icon name='check' className='option-checkbox-icon' />}
              </View>
              <View className='option-copy'>
                <Text className='option-title'>{option.label}</Text>
              </View>
            </View>
          </Button>
        )
      })}
    </View>
  )
}
