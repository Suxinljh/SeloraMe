import { Text, View } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { useState } from 'react'
import Icon from '../../components/Icon'
import Nav from '../../components/Nav'
import { getProfileOverview, type ProfileTopic } from '../../data/profile-overview'

export default function Topics () {
  const [topics, setTopics] = useState<ProfileTopic[]>(getProfileOverview().topics)
  useDidShow(() => setTopics(getProfileOverview().topics))

  return <View className='topics-page'><Nav back light /><View className='topics-content'>
    <Text className='topics-title'>关注主题</Text><Text className='topics-subtitle'>基于已完成测评中的相关作答，为你整理的当下关注方向。</Text>
    {topics.length > 0 ? <View className='topics-list'>{topics.map((topic) => <View className='topics-item' key={topic.label} onClick={() => Taro.navigateTo({ url: '/pages/assessment-list/index?category=emotion' })}><View className='topics-icon'><Icon name='psychology' variant='outlined' /></View><View><Text className='topics-item-title'>{topic.label}</Text><Text className='topics-item-detail'>{topic.detail}</Text></View><Icon name='chevronRight' className='row-chevron' /></View>)}</View> : <View className='topics-empty'><Icon name='psychology' variant='outlined' className='topics-empty-icon' /><Text>暂无关注主题</Text><Text>完成测评后，我们会在这里为你整理相关主题。</Text></View>}
  </View></View>
}
