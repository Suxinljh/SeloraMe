import { Button, Image, Text, View } from '@tarojs/components'
import Icon from '../../../components/Icon'
import { questionOptions } from '../../../data/scales'
import type { InteractionProps } from '../types'

/** 单选。选项为普通选项行，选中后高亮并显示勾选标记 */
export default function SingleChoice ({ scale, question, answer, onChange }: InteractionProps) {
  const options = questionOptions(scale, question)
  const selected = typeof answer === 'number' ? answer : -1
  // 任一选项带图即切到图文卡片布局，图片是选项属性而非独立交互
  const withImage = options.some((option) => option.image)

  return (
    <View className={`quiz-options ${withImage ? 'has-image' : ''}`}>
      {options.map((option, index) => (
        <Button
          key={option.label}
          className={`quiz-option ${withImage ? 'quiz-option-image' : ''} ${selected === index ? 'is-selected' : ''}`}
          onClick={() => onChange(index)}
        >
          {option.image && (
            <Image className='option-image' src={option.image} mode={option.imageFit ?? 'aspectFit'} />
          )}
          <View className='option-main'>
            {!withImage && (
              <View className='option-radio'>
                <View className='option-radio-dot' />
              </View>
            )}
            <View className='option-copy'>
              <Text className='option-title'>{option.label}</Text>
            </View>
          </View>
          {selected === index ? (
            <View className='selected-check'>
              <Icon name='check' className='selected-check-icon' />
            </View>
          ) : (
            !withImage && <Icon name='chevronRight' className='option-chevron' />
          )}
        </Button>
      ))}
    </View>
  )
}
