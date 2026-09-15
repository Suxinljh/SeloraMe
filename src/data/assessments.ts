export type Assessment = {
  id: string
  title: string
  desc: string
  meta: string
  tag: string
  category: 'emotion' | 'other'
  free?: boolean
  price?: string
}

export type PhqOption = { label: string; score: number }
export type PhqQuestion = { id: number; text: string }

export const assessments: Assessment[] = [
  { id: 'phq-9', title: 'PHQ-9 抑郁情绪筛查', desc: '过去两周抑郁症状自评筛查', meta: '9 题 · 约 3 分钟', tag: '医学标准', category: 'emotion', free: true },
  { id: 'gad', title: 'GAD-7 广泛性焦虑自测', desc: '了解近两周的紧张与担忧', meta: '7 题 · 约 2 分钟', tag: '高信效度', category: 'emotion', free: true },
  { id: 'energy', title: '近期心理能量晴雨表', desc: '评估内在心理耗竭与恢复力', meta: '24 题 · 约 6 分钟', tag: '深度解析', category: 'emotion', free: true, price: '¥19.9' },
  { id: 'rumination', title: '情绪内耗自测评估', desc: '识别反刍思维与精神内耗模式', meta: '18 题 · 约 5 分钟', tag: '思维解构', category: 'emotion', free: true, price: '¥12.9' },
  { id: 'anger', title: '愤怒与压抑情绪解码', desc: '探索未被表达的深层愤怒', meta: '20 题 · 约 5 分钟', tag: '情绪释放', category: 'emotion', free: true, price: '¥19.9' },
  { id: 'flow', title: '日常幸福感与心流指数', desc: '测量日常积极体验与心流时刻', meta: '15 题 · 约 4 分钟', tag: '正面心理', category: 'emotion', free: true },
]

export const phqOptions: PhqOption[] = [
  { label: '完全没有', score: 0 }, { label: '有几天', score: 1 },
  { label: '七天以上', score: 2 }, { label: '接近每天', score: 3 },
]

export const phqQuestions: PhqQuestion[] = [
  { id: 1, text: '做任何事都觉得沉闷或者根本不想做任何事' },
  { id: 2, text: '情绪低落、忧郁或绝望' },
  { id: 3, text: '难于入睡、半夜会醒，或相反，睡觉时间过多' },
  { id: 4, text: '觉得疲倦或没有精力' },
  { id: 5, text: '胃口不好或饮食过量' },
  { id: 6, text: '觉得自己做得不好，对自己失望或有负家人期望' },
  { id: 7, text: '难于集中精神做事，例如看报纸或看电视' },
  { id: 8, text: '其他人可能会注意到您在动或说话的时候比平时慢；或者相反，您坐立不安，比起平时有多余的身体动作' },
  { id: 9, text: '想到自己不如死了算了，或者有自残的念头' },
]

export const phqImpactOptions = ['完全没有困难', '有一些困难', '非常困难', '极度困难']

export const gadOptions: PhqOption[] = [
  { label: '根本没有', score: 0 }, { label: '有几天', score: 1 },
  { label: '超过一半天数', score: 2 }, { label: '几乎每天', score: 3 },
]

export const gadQuestions: PhqQuestion[] = [
  { id: 1, text: '感觉紧张、焦虑或不安' },
  { id: 2, text: '无法停止或控制担忧' },
  { id: 3, text: '对各种事情担心太多' },
  { id: 4, text: '难以放松' },
  { id: 5, text: '坐立不安，以至于很难安静地坐下来' },
  { id: 6, text: '变得容易生气或急躁' },
  { id: 7, text: '感觉害怕，好像有可怕的事情要发生一样' },
]

export type PhqSeverity = { label: string; range: string; summary: string; recommendation: string; tone: 'calm' | 'attention' | 'urgent' }

export function getPhqSeverity(score: number): PhqSeverity {
  if (score <= 4) return { label: '极轻微', range: '0–4 分', summary: '目前报告的抑郁相关症状较少。', recommendation: '可继续关注睡眠、情绪和日常节律；若困扰持续或加重，建议咨询专业人士。', tone: 'calm' }
  if (score <= 9) return { label: '轻度', range: '5–9 分', summary: '存在轻度抑郁相关症状，可能会影响部分日常状态。', recommendation: '建议留意症状变化，安排规律休息并与可信任的人沟通；若症状持续超过两周或加重，请寻求专业评估。', tone: 'attention' }
  if (score <= 14) return { label: '中度', range: '10–14 分', summary: '目前的症状达到需要进一步关注的程度。', recommendation: '建议尽快预约精神科、心理科或合格心理健康专业人员进行完整评估。', tone: 'attention' }
  if (score <= 19) return { label: '中重度', range: '15–19 分', summary: '目前的症状负担较明显，可能对生活功能造成较大影响。', recommendation: '建议尽快联系精神科、心理科或合格心理健康专业人员，讨论支持与治疗方案。', tone: 'urgent' }
  return { label: '重度', range: '20–27 分', summary: '目前报告的症状负担很高，需要及时获得专业帮助。', recommendation: '建议尽快联系精神科、心理科或合格心理健康专业人员；如有安全担忧，请立即联系当地急救服务或危机支持。', tone: 'urgent' }
}

export function getGadSeverity(score: number): PhqSeverity {
  if (score <= 4) return { label: '极轻微', range: '0–4 分', summary: '目前报告的焦虑相关症状较少。', recommendation: '可继续关注睡眠、压力和日常节律；若困扰持续或加重，建议咨询专业人士。', tone: 'calm' }
  if (score <= 9) return { label: '轻度', range: '5–9 分', summary: '存在轻度焦虑相关症状，可能影响部分日常状态。', recommendation: '建议留意症状变化，安排规律休息并与可信任的人沟通；若症状持续或加重，请寻求专业评估。', tone: 'attention' }
  if (score <= 14) return { label: '中度', range: '10–14 分', summary: '目前的焦虑症状达到需要进一步关注的程度。', recommendation: '建议预约精神科、心理科或合格心理健康专业人员进行完整评估。', tone: 'attention' }
  return { label: '重度', range: '15–21 分', summary: '目前报告的焦虑症状负担较高，需要及时获得专业帮助。', recommendation: '建议尽快联系精神科、心理科或合格心理健康专业人员，讨论支持与治疗方案。', tone: 'urgent' }
}
