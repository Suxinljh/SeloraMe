import { Button, Text, View } from '@tarojs/components'
import Taro, { useDidShow, useLoad } from '@tarojs/taro'
import { useState } from 'react'
import Icon from '../../components/Icon'
import Nav from '../../components/Nav'
import { assessments, type Assessment } from '../../data/assessments'
import { getPurchasedAssessmentIds } from '../../store/purchase'
import { isFavoriteAssessment, toggleFavoriteAssessment } from '../../store/favorites'

type DetailSection = {
  title: string
  paragraphs?: string[]
  highlights?: string
  benefits?: { title: string; description: string }[]
  instructions?: string[]
}

type DetailContent = {
  participants: string
  sections: DetailSection[]
  ready: boolean
}

const detailContent: Record<string, DetailContent> = {
  'phq-9': {
    participants: '12.8 万人已测',
    sections: [
      {
        title: '这是个什么样的测试？',
        paragraphs: [
          '情绪低落只是抑郁状态的一种表现。',
          '有时候，我们可能并不会觉得自己“特别难过”，但会逐渐出现对事情失去兴趣、睡眠改变、疲倦、注意力下降、食欲变化，或者越来越容易否定自己。',
          'PHQ-9（Patient Health Questionnaire-9，病人健康状况问卷-9）是一份广泛使用的抑郁症状自评量表，由 Robert L. Spitzer、Janet B. W. Williams、Kurt Kroenke 等研究者开发。它包含 9 道核心题目，用于了解你在过去两周中不同抑郁相关症状出现的频率。',
          'PHQ-9 来源于 Patient Health Questionnaire（PHQ）体系，可用于评估抑郁症状的严重程度，也是临床研究和健康筛查中常见的量表之一。它关注的不只有情绪，还包括：',
        ],
        highlights: '兴趣下降｜情绪低落｜睡眠变化｜精力下降｜食欲变化｜自我评价｜注意力｜行动状态｜消极念头',
      },
      {
        title: '这个测试有什么用？',
        benefits: [
          { title: '近期情绪状态', description: '了解过去两周是否存在较明显的抑郁相关症状。' },
          { title: '症状严重程度', description: '通过标准化计分，大致判断当前症状处于较低、轻度、中度还是更高水平。' },
          { title: '具体困扰来源', description: '不仅看一个总分，也可以观察睡眠、精力、兴趣、注意力、自我评价等具体维度。' },
        ],
        paragraphs: [
          'PHQ-9 共 9 题，每题按照症状出现频率计 0～3 分，总分范围为 0～27 分。官方说明通常采用 5、10、15、20 分作为轻度、中度、中重度和重度抑郁症状的参考界值。',
          '量表还可以结合“这些问题对工作、家庭事务或与他人相处造成了多大困难”来帮助理解症状对现实生活的影响。',
        ],
      },
      {
        title: '测试说明',
        instructions: [
          '本测试共 9 道核心题目，请根据自己过去两周的实际情况进行回答。',
          '每道题按照症状出现的频率选择：完全没有 / 有几天 / 七天以上 / 接近每天。',
          '测试结果主要用于评估近期的抑郁症状严重程度，适合作为自我了解和初步筛查参考，不能单独用于确定是否患有抑郁症。',
          '第 9 题涉及死亡或自伤相关想法。如果你在这一题选择了任何非“完全没有”的选项，不建议只根据总分判断情况，应进一步寻求专业人员评估。官方使用说明也明确指出，自伤风险的最终判断需要临床评估。',
          '如果近期情绪问题已经明显影响日常生活，或出现持续、强烈的自伤或轻生想法，应及时联系当地医疗机构、心理危机干预服务或紧急求助渠道。',
        ],
      },
    ],
    ready: true,
  },
  gad: {
    participants: '9.6 万人已测',
    sections: [
      {
        title: '这是个什么样的测试？',
        paragraphs: [
          '焦虑，并不只是“想太多”。',
          '当压力持续存在时，我们可能会出现紧张、担忧、难以放松、坐立不安，甚至总觉得有什么不好的事情即将发生。',
          'GAD-7（Generalized Anxiety Disorder-7，广泛性焦虑量表）是一份用于评估焦虑症状严重程度的简短自评量表，由 Robert L. Spitzer、Janet B. W. Williams、Kurt Kroenke 等研究者开发。量表包含 7 道题目，主要关注你在过去两周内受到不同焦虑症状困扰的频率。',
          '它最初用于广泛性焦虑障碍的筛查，同时也被用于评估整体焦虑症状的严重程度。研究资料显示，它对于惊恐、社交焦虑等常见焦虑问题也具有一定筛查价值。整个测试很短，但关注的都是焦虑状态中比较核心的体验：',
        ],
        highlights: '反复担忧｜紧张不安｜难以放松｜坐立不安｜易怒急躁｜不安与恐惧',
      },
      {
        title: '这个测试有什么用？',
        benefits: [
          { title: '焦虑程度', description: '看看最近两周的紧张与担忧处于什么水平。' },
          { title: '症状分布', description: '了解自己的焦虑更常表现为担忧、身体紧张、难以放松，还是持续的不安感。' },
          { title: '状态变化', description: '如果间隔一段时间再次测试，可以用相同量表观察近期焦虑状态的变化。' },
        ],
        paragraphs: [
          'GAD-7 共 7 题，每题按照出现频率计 0～3 分，总分范围为 0～21 分。官方说明中通常以 5、10、15 分作为轻度、中度和重度焦虑症状的参考界值。',
        ],
      },
      {
        title: '测试说明',
        instructions: [
          '本测试共 7 道题，请根据自己过去两周的真实感受作答，而不是根据某一天的特殊状态判断。',
          '每道题均选择症状出现的频率：完全没有 / 有几天 / 超过一半的天数 / 几乎每天。',
          '测试结果用于帮助你了解近期的焦虑症状水平，适合作为自我观察和初步筛查工具。',
          '本测试不能替代医生或心理专业人员的诊断。如果焦虑已经持续影响到睡眠、学习、工作、人际关系或日常生活，建议进一步寻求专业评估。',
        ],
      },
    ],
    ready: true,
  },
}

const fallbackContent: DetailContent = {
  participants: '持续更新中',
  sections: [{
    title: '测评说明',
    paragraphs: ['此测评内容正在准备中，开放后将提供题目依据、适用范围与完整的报告说明。'],
  }],
  ready: false,
}

const getQuestionCount = (assessment: Assessment) => assessment.meta.split(' · ')[0]

export default function AssessmentDetail () {
  const [assessmentId, setAssessmentId] = useState('phq-9')
  const [isFavorite, setIsFavorite] = useState(false)
  useLoad((options) => {
    if (typeof options.assessment === 'string') setAssessmentId(options.assessment)
  })

  const assessment = assessments.find((item) => item.id === assessmentId) ?? assessments[0]
  useDidShow(() => setIsFavorite(isFavoriteAssessment(assessment.id)))
  const content = detailContent[assessment.id] ?? fallbackContent
  const isUnlocked = assessment.free === true || getPurchasedAssessmentIds().includes(assessment.id)
  const start = () => {
    if (!content.ready) {
      Taro.showToast({ title: '该测评正在准备中', icon: 'none' })
      return
    }
    Taro.navigateTo({ url: `/pages/questions/index?assessment=${assessment.id}` })
  }
  const toggleFavorite = () => {
    const nextValue = toggleFavoriteAssessment(assessment.id)
    setIsFavorite(nextValue)
    Taro.showToast({ title: nextValue ? '已收藏测评' : '已取消收藏', icon: 'none' })
  }

  return <View className='assessment-detail-page'>
    <Nav back light />
    <View className='assessment-detail-content'>
      <View className='assessment-detail-hero'>
        <View className='assessment-detail-orb' />
        <Button className={`assessment-detail-favorite ${isFavorite ? 'is-favorite' : ''}`} onClick={toggleFavorite}><Icon name='bookmark' variant={isFavorite ? 'round' : 'outlined'} className='assessment-detail-favorite-icon' />{isFavorite ? '已收藏' : '收藏测评'}</Button>
        <Text className='assessment-detail-label'>{assessment.tag}</Text>
        <Text className='assessment-detail-title'>{assessment.title}</Text>
        <Text className='assessment-detail-description'>{assessment.desc}</Text>
        <View className='assessment-detail-metrics'>
          <View><Text className='assessment-detail-metric-value'>{content.participants}</Text><Text>测评人数</Text></View>
          <View><Text className='assessment-detail-metric-value'>{getQuestionCount(assessment)}</Text><Text>题目数量</Text></View>
          <View><Text className='assessment-detail-metric-value'>专业解读</Text><Text>分析报告</Text></View>
        </View>
      </View>
      {content.sections.map((section, sectionIndex) => (
        <View key={section.title} className={`assessment-detail-section ${sectionIndex % 2 === 1 ? 'assessment-detail-source' : ''}`}>
          <View className='assessment-detail-section-title'><Icon name={sectionIndex === 2 ? 'quiz' : 'psychology'} className='assessment-detail-section-icon' /><Text>{section.title}</Text></View>
          {section.paragraphs?.map((paragraph) => <Text key={paragraph} className='assessment-detail-paragraph'>{paragraph}</Text>)}
          {section.highlights && <Text className='assessment-detail-highlights'>{section.highlights}</Text>}
          {section.benefits?.map((benefit) => <View key={benefit.title} className='assessment-detail-benefit'><Text>{benefit.title}</Text><Text>{benefit.description}</Text></View>)}
          {section.instructions?.map((instruction, index) => <View key={instruction} className='assessment-detail-instruction'><Text>{index + 1}</Text><Text>{instruction}</Text></View>)}
        </View>
      ))}
      <View className='assessment-detail-report-note'>
        <Icon name='assessment' className='assessment-detail-report-icon' />
        <View><Text>完成后生成分析报告</Text><Text>包含总分、结果说明与下一步建议</Text></View>
      </View>
    </View>
    <View className='assessment-detail-footer'>
      {isUnlocked ? <Button className='assessment-detail-start' onClick={start}>{content.ready ? '立即开始' : '即将开放'}</Button> : <><Text className='assessment-detail-price'>{assessment.price ?? '¥9.9'}</Text><Button className='assessment-detail-buy' onClick={() => Taro.showToast({ title: '支付功能即将开放', icon: 'none' })}>立即购买</Button></>}
    </View>
  </View>
}
