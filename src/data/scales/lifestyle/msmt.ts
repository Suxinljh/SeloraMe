import type { Scale } from '../types'

// 计分取值依据：源文本“每个题目若选A记1分，若选B记0分”。
// 维度划分（每组5题）：1~5 动机过弱；6~10 动机过强；11~15 学习兴趣；16~20 学习目标。
// 源文本：任一组（5题）得分在 3 分以上，即认为相应方面存在困扰。故省略总分，按 profile 呈现。
const scale: Scale = {
  id: 'msmt',
  title: '中学生学习动机评测（MSMT）',
  desc: '了解学习动机、兴趣与目标上的困扰',
  category: 'lifestyle',
  duration: '约 5 分钟',
  tag: '学习动机',
  participantCount: 26,
  price: '¥5.9',
  intro: [
    '本评测用于了解中学生在学习动机、学习兴趣、学习目标制定上是否存在行为困扰。',
    '共 20 题，每题在“符合 / 不符合”中选择，分为动机过弱、动机过强、学习兴趣、学习目标四个分评测。',
  ],
  highlights: '20 题｜4 个分评测｜困扰筛查',
  benefits: [
    { title: '定位困扰', description: '识别在学习欲望的四个方面是否存在认识偏差或困扰。' },
    { title: '引导调整', description: '结果可作为调整学习动机与目标设定的参考。' },
  ],
  instructions: [
    '每题若觉得与自己相符选 A，不相符选 B。',
    '请依据平时真实情况作答。',
  ],
  source: '中学生学习动机量表（MSMT）',
  options: [
    { label: '符合', score: 1 },
    { label: '不符合', score: 0 },
  ],
  questions: [
    { id: 1, text: '如果别人不督促你，你极少主动地学习。', dimension: 'weak' },
    { id: 2, text: '当你读书时，需要很长的时间才能提起精神来。', dimension: 'weak' },
    { id: 3, text: '你一读书就觉得疲劳与厌倦，直想睡觉。', dimension: 'weak' },
    { id: 4, text: '除了老师指定的作业外，你不想再多看书。', dimension: 'weak' },
    { id: 5, text: '如有不懂的，你根本不想设法弄懂它。', dimension: 'weak' },
    { id: 6, text: '你常想自己不用花太多的时间成绩也会超过别人。', dimension: 'strong' },
    { id: 7, text: '你迫切希望自己在短时间内就大幅度提高自己的学习成绩。', dimension: 'strong' },
    { id: 8, text: '你常为短时间内成绩没能提高而烦恼不已。', dimension: 'strong' },
    { id: 9, text: '为了及时完成某项作业，你宁愿废寝忘食、通宵达旦。', dimension: 'strong' },
    { id: 10, text: '为了把功课学好，你放弃了许多感兴趣的活动，如体育锻炼、看电影与郊游等。', dimension: 'strong' },
    { id: 11, text: '你觉得读书没意思，想去找个工作做。', dimension: 'interest' },
    { id: 12, text: '你常认为课本的基础知识没啥好学，只有看高深的理论、读大部头作品才带劲。', dimension: 'interest' },
    { id: 13, text: '只在你喜欢的科目上狠下功夫，而对不喜欢的科目放任自流。', dimension: 'interest' },
    { id: 14, text: '你花在课外读物上的时间比花在教科书上的时间要多的多。', dimension: 'interest' },
    { id: 15, text: '你把自己的时间平均分配在各科上。', dimension: 'interest' },
    { id: 16, text: '你给自己定下的学习目标，多数因做不到而不得不放弃。', dimension: 'goal' },
    { id: 17, text: '你给自己定下的学习目标，多数因做不到而不得不放弃。', dimension: 'goal' },
    { id: 18, text: '你总是同时为实现几个学习目标忙得焦头烂额。', dimension: 'goal' },
    { id: 19, text: '为了对付每天的学习任务，你已经感到力不从心。', dimension: 'goal' },
    { id: 20, text: '为了实现一个大目标，你不再给自己制定循序渐进的小目标。', dimension: 'goal' },
  ],
  dimensions: [
    {
      key: 'weak',
      name: '学习动机过弱',
      items: [1, 2, 3, 4, 5],
      bands: [
        { min: 0, max: 2, label: '无明显困扰', summary: '得分在 3 分以下，学习动机过弱方面无明显困扰。', recommendation: '保持当前状态。', tone: 'calm' },
        { min: 3, max: 5, label: '存在困扰', summary: '得分在 3 分以上，学习动机可能过弱。', recommendation: '建议关注学习主动性与内在动力。', tone: 'urgent' },
      ],
    },
    {
      key: 'strong',
      name: '学习动机过强',
      items: [6, 7, 8, 9, 10],
      bands: [
        { min: 0, max: 2, label: '无明显困扰', summary: '得分在 3 分以下，学习动机过强方面无明显困扰。', recommendation: '保持当前状态。', tone: 'calm' },
        { min: 3, max: 5, label: '存在困扰', summary: '得分在 3 分以上，学习动机可能过强。', recommendation: '注意调节期望与压力，避免过度紧绷。', tone: 'urgent' },
      ],
    },
    {
      key: 'interest',
      name: '学习兴趣困扰',
      items: [11, 12, 13, 14, 15],
      bands: [
        { min: 0, max: 2, label: '无明显困扰', summary: '得分在 3 分以下，学习兴趣方面无明显困扰。', recommendation: '保持当前状态。', tone: 'calm' },
        { min: 3, max: 5, label: '存在困扰', summary: '得分在 3 分以上，学习兴趣可能存在困扰。', recommendation: '可尝试丰富学习方式，平衡各科投入。', tone: 'urgent' },
      ],
    },
    {
      key: 'goal',
      name: '学习目标困扰',
      items: [16, 17, 18, 19, 20],
      bands: [
        { min: 0, max: 2, label: '无明显困扰', summary: '得分在 3 分以下，学习目标方面无明显困扰。', recommendation: '保持当前状态。', tone: 'calm' },
        { min: 3, max: 5, label: '存在困扰', summary: '得分在 3 分以上，学习目标制定可能存在困扰。', recommendation: '建议设定循序渐进、可达成的小目标。', tone: 'urgent' },
      ],
    },
  ],
  scoring: {
    kind: 'profile',
    profileNote:
      '本表为多维剖析型，4 个分评测各 5 题。任一分评测得分 ≥3 分，即认为相应方面' +
      '存在学习欲望上的困扰或认识偏差。报告页应分别呈现四个分评测结果。',
  },
}

export default scale
