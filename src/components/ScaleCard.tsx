import { Text, View } from '@tarojs/components'
import Icon from './Icon'
import { isFreeScale, matchRange, priceLabelOf, type Scale } from '../data/scales'

/**
 * 量表卡片。分类列表页与搜索结果页共用，保证两处展示完全一致。
 *
 * 右下角统一展示价格：免费为绿色「免费」，收费为黑色价格文案。
 * 价格规则只在这里和首页推荐卡各用一次，改动时两处同步。
 */

/** 把命中片段拆成三段渲染，用于搜索结果高亮。未传关键词时原样输出 */
function Highlighted ({ text, keyword, className }: { text: string; keyword: string; className: string }) {
  const range = keyword ? matchRange(text, keyword) : null
  if (!range) return <Text className={className}>{text}</Text>
  return (
    <Text className={className}>
      {text.slice(0, range.start)}
      <Text className='search-hit'>{text.slice(range.start, range.end)}</Text>
      {text.slice(range.end)}
    </Text>
  )
}

export default function ScaleCard ({ scale, keyword = '', onClick }: { scale: Scale; keyword?: string; onClick: () => void }) {
  return (
    <View className='assessment-card' onClick={onClick}>
      <View>
        <Highlighted text={scale.title} keyword={keyword} className='assessment-name' />
        <Highlighted text={scale.desc} keyword={keyword} className='assessment-desc' />
        <Text className='assessment-meta'>
          <Icon name='schedule' className='meta-icon' />
          {scale.questions.length} 题 · {scale.duration}
        </Text>
      </View>
      <View className='assessment-bottom'>
        <Text className='tag'>{scale.tag}</Text>
        <Text className={isFreeScale(scale) ? 'green' : 'price'}>{priceLabelOf(scale)}</Text>
      </View>
    </View>
  )
}
