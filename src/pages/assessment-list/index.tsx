import { useState } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import Nav from '../../components/Nav'
import Icon from '../../components/Icon'
import { allScales, SCALE_CATEGORIES, scalesByCategory, type Scale, type ScaleCategory } from '../../data/scales'

const categoryNames = SCALE_CATEGORIES.reduce<Record<string, string>>((acc, { key, name }) => {
  acc[key] = name
  return acc
}, {})

const isScaleCategory = (value: string | undefined): value is ScaleCategory =>
  typeof value === 'string' && SCALE_CATEGORIES.some(({ key }) => key === value)

/** 标签筛选：全部 / 题目较少 / 免费 / 专业量表 */
const filters = ['全部', '10 分钟以内', '专业量表', '性格与情绪'] as const

export default function List () {
  const [category, setCategory] = useState<ScaleCategory | undefined>()
  const [active, setActive] = useState(0)

  useLoad((options) => {
    if (isScaleCategory(options.category)) setCategory(options.category)
  })

  const inCategory = category ? scalesByCategory(category) : allScales

  const visible = inCategory.filter((scale: Scale) => {
    if (active === 1) return scale.questions.length <= 40
    if (active === 2) return scale.category === 'professional'
    if (active === 3) return scale.category === 'personality' || scale.category === 'emotion'
    return true
  })

  const heading = category ? categoryNames[category] ?? '测评列表' : '全部测评'

  const open = (scale: Scale) => Taro.navigateTo({ url: `/pages/assessment-detail/index?assessment=${scale.id}` })

  return (
    <View className='page'>
      <Nav back light />
      <View className='list-head'>
        <Text className='list-heading'>{heading}</Text>
        <Text className='list-head-count'>{visible.length} 个量表</Text>
      </View>
      <ScrollView scrollX className='chip-row'>
        {filters.map((x, i) => (
          <Text key={x} className={`chip ${active === i ? 'active' : ''}`} onClick={() => setActive(i)}>{x}</Text>
        ))}
      </ScrollView>
      <View className='list'>
        {visible.map((scale) => (
          <View className='assessment-card' key={scale.id} onClick={() => open(scale)}>
            <View>
              <Text className='assessment-name'>{scale.title}</Text>
              <Text className='assessment-desc'>{scale.desc}</Text>
              <Text className='assessment-meta'>
                <Icon name='schedule' className='meta-icon' />
                {scale.questions.length} 题 · {scale.duration}
              </Text>
            </View>
            <View className='assessment-bottom'>
              <Text className='tag'>{scale.tag}</Text>
              <Text className='fee'>开始测评</Text>
            </View>
          </View>
        ))}
        {visible.length === 0 && <Text className='empty'>该筛选条件下暂无量表</Text>}
      </View>
    </View>
  )
}
