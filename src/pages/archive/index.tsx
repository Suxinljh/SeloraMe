import { useState } from 'react'
import { Text, View } from '@tarojs/components'
import Taro, { useDidShow, useLoad } from '@tarojs/taro'
import Icon, { type IconName } from '../../components/Icon'
import Nav from '../../components/Nav'
import { getArchiveEntries, type ArchiveEntry, type ArchiveType } from '../../data/archive'

const copy: Record<ArchiveType, { title: string; empty: string; detail: string; icon: IconName }> = {
  unfinished: { title: '未完成测评', empty: '暂无未完成测评', detail: '开始作答后的测评会显示在这里，方便随时续答。', icon: 'quiz' },
  purchased: { title: '已购买测评', empty: '暂无已购买测评', detail: '完成购买后，已解锁测评会显示在这里。', icon: 'inventory' },
  reports: { title: '测评报告', empty: '暂无测评报告', detail: '完成 PHQ-9 或 GAD-7 后，报告会自动保存在这里。', icon: 'assessment' },
  favorites: { title: '收藏的测评', empty: '暂无收藏测评', detail: '在测评详情页点击收藏后，测评会保存在这里。', icon: 'bookmark' },
}

const isArchiveType = (value: string | undefined): value is ArchiveType => value === 'unfinished' || value === 'purchased' || value === 'reports' || value === 'favorites'

export default function Archive() {
  const [type, setType] = useState<ArchiveType>('unfinished')
  const [entries, setEntries] = useState<ArchiveEntry[]>(getArchiveEntries('unfinished'))
  const refresh = (nextType: ArchiveType) => { setType(nextType); setEntries(getArchiveEntries(nextType)) }
  useLoad((options) => refresh(isArchiveType(options.type) ? options.type : 'unfinished'))
  useDidShow(() => setEntries(getArchiveEntries(type)))
  const current = copy[type]
  const open = (entry: ArchiveEntry) => Taro.navigateTo({ url: type === 'reports' ? `/pages/report/index?assessment=${entry.assessment}` : type === 'favorites' ? `/pages/assessment-detail/index?assessment=${entry.assessment}` : `/pages/questions/index?assessment=${entry.assessment}` })
  return <View className='archive-page'><Nav back light /><View className='archive-content'><Text className='archive-title'>{current.title}</Text><Text className='archive-subtitle'>{current.detail}</Text>
    {entries.length > 0 ? <View className='archive-list'>{entries.map((entry) => <View className='archive-item' key={entry.assessment} onClick={() => open(entry)}><View className='archive-item-icon'><Icon name={current.icon} /></View><View><Text className='archive-item-title'>{entry.title}</Text><Text className='archive-item-detail'>{entry.detail}</Text></View><Icon name='chevronRight' className='row-chevron' /></View>)}</View> : <View className='archive-empty'><Icon name={current.icon} className='archive-empty-icon' /><Text>{current.empty}</Text><Text>{current.detail}</Text></View>}
  </View></View>
}
