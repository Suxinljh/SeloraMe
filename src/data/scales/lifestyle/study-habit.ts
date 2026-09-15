import type { Scale } from '../types'

// 计分取值依据：源文本“奇数题选A记2分，选B记1分，选C记0分；偶数题选A记0分，选B记1分，选C记2分”。
// 可见奇数题与偶数题的计分恰好互为反向（A/C 互换，B 均为 1）。
// 因此共享 options 取“是=2、有时=1、否=0”，并对偶数题（2,4,6,8,10,12,14,16）
// 标记 reverse:true，即可由模型统一正确计分（reverse = max+min - raw）。
// 总分分级（源文本）：≥27 非常好；22～26 较好；16～21 一般；≤15 问题很多，需改正。
const scale: Scale = {
  id: 'study-habit',
  title: '初中生学习习惯自测',
  desc: '评估你的学习习惯优劣',
  category: 'lifestyle',
  duration: '约 4 分钟',
  tag: '学习测评',
  participantCount: 4,
  price: '¥5.9',
  intro: [
    '本测试共 16 题，用于了解初中生当前的学习习惯状况。',
    '每题在“是 / 有时如此 / 否”中选择最符合自己的一项。',
  ],
  highlights: '16 题｜奇偶反向计分｜总分分级',
  benefits: [
    { title: '检视习惯', description: '从学习规律、计划性、专注度等角度了解自身习惯。' },
    { title: '提示改进', description: '总分可反映习惯整体水平，提示需要调整的方面。' },
  ],
  instructions: [
    '每题选择一个最符合自己的选项。',
    '请凭日常真实情况作答。',
  ],
  options: [
    { label: '是', score: 2 },
    { label: '有时如此（或不一定）', score: 1 },
    { label: '否', score: 0 },
  ],
  questions: [
    { id: 1, text: '在固定的时间进行学习吗？' },
    { id: 2, text: '学习时，周围必须很安静吗？', reverse: true },
    { id: 3, text: '是否经常查用辞典，字典等工具书？' },
    { id: 4, text: '学习时有下意识动作吗？', reverse: true },
    { id: 5, text: '是否再按自己制定的计划学习？' },
    { id: 6, text: '在学习中有经常沉迷于空想的时候吗？', reverse: true },
    { id: 7, text: '学习结束后，收拾书桌吗？' },
    { id: 8, text: '有一边听广播或看电视，一边学习的时候吗？', reverse: true },
    { id: 9, text: '发回的试卷，自己能认真总结，分析缺陷吗？' },
    { id: 10, text: '是否“平时不烧香，考前抱佛脚”？', reverse: true },
    { id: 11, text: '你认为自己的预习效果不错吗？' },
    { id: 12, text: '不感兴趣的课程就不愿下大力气去学吗？', reverse: true },
    { id: 13, text: '对所学的知识能够立即复习吗？' },
    { id: 14, text: '即使有不明白的问题，也不愿去办公室向老师请教吗？', reverse: true },
    { id: 15, text: '即使有你喜欢的电视节目，是否也要完成当天的学习任务再去看？' },
    { id: 16, text: '是否经常有对书本毫无兴趣而浪费时间的现象？', reverse: true },
  ],
  dimensions: [],
  scoring: {
    kind: 'sum',
    bands: [
      {
        min: 27,
        max: 32,
        label: '学习习惯非常好',
        summary: '总分在 27 分以上，表明你的学习习惯非常好。',
        recommendation: '保持良好的学习习惯，并可带动同伴共同进步。',
        tone: 'calm',
      },
      {
        min: 22,
        max: 26,
        label: '学习习惯较好',
        summary: '总分在 22～26 分，学习习惯较好。',
        recommendation: '在个别薄弱项上稍作优化即可。',
        tone: 'calm',
      },
      {
        min: 16,
        max: 21,
        label: '学习习惯一般',
        summary: '总分在 16～21 分，学习习惯一般。',
        recommendation: '可有意识地培养规律学习与计划执行的习惯。',
        tone: 'attention',
      },
      {
        min: 0,
        max: 15,
        label: '学习习惯问题较多',
        summary: '总分在 15 分以下，学习习惯问题很多，需要改正。',
        recommendation: '建议从固定学习时间、做好计划等基础习惯开始调整。',
        tone: 'urgent',
      },
    ],
  },
}

export default scale
