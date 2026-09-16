import { useMemo, useState } from 'react'
import { Image, Input, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import Nav from '../../components/Nav'
import Icon from '../../components/Icon'
import ScaleCard from '../../components/ScaleCard'
import SuggestBar from '../../components/SuggestBar'
import searchIcon from '../../assets/figma/home-search.svg'
import { searchScales, type Scale } from '../../data/scales'
import { getCurrentUser } from '../../store/auth'
import { ASSESSMENT_REQUEST_LINK, openSurvey } from '../../utils/tencent-survey'

/**
 * 评测搜索页。
 *
 * 匹配范围只含标题与描述（见 data/scales 的 searchScales），
 * 不涉及介绍正文、分类、标签，避免结果发散。
 * 结果卡片复用共用的 ScaleCard，与分类列表页保持一致。
 */

/**
 * 空关键词时展示的热门词，点击后直接填入搜索框。
 * 这些词均已核对过能在标题或描述中命中评测，避免点进去是空结果。
 */
const hotKeywords = ['MBTI', '霍兰德', '性格', '情绪', '焦虑', '抑郁', '职业', '依恋', '学习', '心理健康']

export default function Search () {
  const [keyword, setKeyword] = useState('')

  const results = useMemo(() => searchScales(keyword), [keyword])
  const trimmed = keyword.trim()

  const open = (scale: Scale) =>
    Taro.navigateTo({ url: `/pages/assessment-detail/index?assessment=${scale.id}` })

  /** 搜不到时引导用户提交「求测评」需求，顺带把当前关键词和账号带给问卷 */
  const requestAssessment = () =>
    openSurvey(ASSESSMENT_REQUEST_LINK, getCurrentUser()?.userId)

  return (
    <View className='page search-page'>
      <Nav back className='search-nav'>
        <View className='search-input-wrap'>
          <Image src={searchIcon} className='search-input-icon' />
          <Input
            className='search-input'
            value={keyword}
            placeholder='搜索测评名称或描述'
            confirmType='search'
            focus
            onInput={(event) => setKeyword(event.detail.value)}
          />
          {keyword.length > 0 && (
            <Icon name='close' className='search-clear' onClick={() => setKeyword('')} />
          )}
        </View>
      </Nav>

      <View className='search-body'>
        {trimmed.length === 0 && (
          <View className='search-hot'>
            <Text className='search-section-title'>热门搜索</Text>
            <View className='search-tags'>
              {hotKeywords.map((word) => (
                <Text key={word} className='search-tag' onClick={() => setKeyword(word)}>
                  {word}
                </Text>
              ))}
            </View>
          </View>
        )}

        <View className='list'>
          {results.map((scale) => (
            <ScaleCard key={scale.id} scale={scale} keyword={keyword} onClick={() => open(scale)} />
          ))}

          {trimmed.length > 0 && results.length === 0 && (
            <SuggestBar
              title={`没找到「${trimmed}」？`}
              detail='告诉我们你想要的测评'
              actionText='提建议'
              onClick={requestAssessment}
            />
          )}
        </View>
      </View>
    </View>
  )
}
