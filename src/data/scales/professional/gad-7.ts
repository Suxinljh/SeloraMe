import type { Scale } from '../types'

/**
 * GAD-7 广泛性焦虑自测
 * 计分：7 题各 0-3 分，总分 0-21。
 * 分界值取官方界值 5 / 10 / 15，来源 Spitzer 等 2006 年 GAD-7 说明。
 */
const scale: Scale = {
  id: 'gad',
  title: 'GAD-7 广泛性焦虑自测',
  desc: '了解近两周的紧张与担忧',
  category: 'professional',
  duration: '约 2 分钟',
  tag: '高信效度',
  participantCount: 739072,
  intro: [
    '焦虑，并不只是「想太多」。',
    '当压力持续存在时，我们可能会出现紧张、担忧、难以放松、坐立不安，甚至总觉得有什么不好的事情即将发生。',
    'GAD-7（Generalized Anxiety Disorder-7，广泛性焦虑评测）是一份用于评估焦虑症状严重程度的简短自评评测，包含 7 道题目，主要关注你在过去两周内受到不同焦虑症状困扰的频率。',
    '它最初用于广泛性焦虑障碍的筛查，同时也被用于评估整体焦虑症状的严重程度。关注的都是焦虑状态中比较核心的体验：',
  ],
  highlights: '反复担忧｜紧张不安｜难以放松｜坐立不安｜易怒急躁｜不安与恐惧',
  benefits: [
    { title: '焦虑程度', description: '看看最近两周的紧张与担忧处于什么水平。' },
    { title: '症状分布', description: '了解自己的焦虑更常表现为担忧、身体紧张、难以放松，还是持续的不安感。' },
    { title: '状态变化', description: '如果间隔一段时间再次测试，可以用相同评测观察近期焦虑状态的变化。' },
  ],
  instructions: [
    '本测试共 7 道题，请根据自己过去两周的真实感受作答，而不是根据某一天的特殊状态判断。',
    '每道题均选择症状出现的频率：根本没有 / 有几天 / 超过一半天数 / 几乎每天。',
    '测试结果用于帮助你了解近期的焦虑症状水平，适合作为自我观察和初步筛查工具。',
    '本测试不能替代医生或心理专业人员的诊断。如果焦虑已经持续影响到睡眠、学习、工作、人际关系或日常生活，建议进一步寻求专业评估。',
  ],
  source: 'GAD-7 · Spitzer, Kroenke, Williams & Löwe, 2006',
  options: [
    { label: '根本没有', score: 0 },
    { label: '有几天', score: 1 },
    { label: '超过一半天数', score: 2 },
    { label: '几乎每天', score: 3 },
  ],
  questions: [
    { id: 1, text: '感觉紧张、焦虑或不安' },
    { id: 2, text: '无法停止或控制担忧' },
    { id: 3, text: '对各种事情担心太多' },
    { id: 4, text: '难以放松' },
    { id: 5, text: '坐立不安，以至于很难安静地坐下来' },
    { id: 6, text: '变得容易生气或急躁' },
    { id: 7, text: '感觉害怕，好像有可怕的事情要发生一样' },
  ],
  dimensions: [],
  scoring: {
    kind: 'sum',
    bands: [
      { min: 0, max: 4, label: '极轻微', summary: '目前报告的焦虑相关症状较少。', recommendation: '可继续关注睡眠、压力和日常节律；若困扰持续或加重，建议咨询专业人士。', tone: 'calm' },
      { min: 5, max: 9, label: '轻度', summary: '存在轻度焦虑相关症状，可能影响部分日常状态。', recommendation: '建议留意症状变化，安排规律休息并与可信任的人沟通；若症状持续或加重，请寻求专业评估。', tone: 'attention' },
      { min: 10, max: 14, label: '中度', summary: '目前的焦虑症状达到需要进一步关注的程度。', recommendation: '建议预约精神科、心理科或合格心理健康专业人员进行完整评估。', tone: 'attention' },
      { min: 15, max: 21, label: '重度', summary: '目前报告的焦虑症状负担较高，需要及时获得专业帮助。', recommendation: '建议尽快联系精神科、心理科或合格心理健康专业人员，讨论支持与治疗方案。', tone: 'urgent' },
    ],
  },
}

export default scale
