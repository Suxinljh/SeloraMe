import { Button, Text, View } from '@tarojs/components'
import Icon, { type IconName } from './Icon'

/**
 * 「找不到心仪测评？」胶囊引导条。
 *
 * 分类页底部与搜索页空结果态共用同一份样式（.suggest-bar），
 * 两处视觉完全一致；需要不同措辞时通过 props 传入，不要另写一套样式。
 */
export default function SuggestBar ({
  icon = 'helpOutline',
  title,
  detail,
  actionText,
  onClick,
}: {
  icon?: IconName
  title: string
  detail: string
  actionText: string
  onClick: () => void
}) {
  return <View className='suggest-bar'>
    <View className='suggest-bar-icon-wrap'>
      <Icon name={icon} className='suggest-bar-icon' />
    </View>
    <View className='suggest-bar-copy'>
      <Text className='suggest-bar-title'>{title}</Text>
      <Text className='suggest-bar-detail'>{detail}</Text>
    </View>
    <Button className='suggest-bar-button' onClick={onClick}>{actionText}</Button>
  </View>
}
