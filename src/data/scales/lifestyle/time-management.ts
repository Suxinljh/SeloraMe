import type { Scale } from '../types'

// 计分取值依据：源文本“采用5点计分法，从‘完全不符合’至‘完全符合’依次赋值为1至5分”。
// 反向计分题（共5题）：9、17、27、30、41，已在对应题目标记 reverse:true。
// 维度划分与题号、反向题取自源文本“量表说明”结构表（3 个分量表、9 个子维度）。
// 源文本未给总体或各维度的分界值，故省略 bands（源文本未给分界值）。
// 维度含义：时间价值感（个人取向/社会取向）、时间监控观（设置目标/计划性/优先级/
// 反馈性/时间分配）、时间效能感（管理行为效能/管理效能）。
const scale: Scale = {
  id: 'time-management',
  title: '青少年时间管理倾向量表',
  desc: '评估你对时间的看法、监控与效能感',
  category: 'lifestyle',
  duration: '约 8 分钟',
  tag: '权威量表',
  participantCount: 29,
  price: '¥5.9',
  intro: [
    '《青少年时间管理倾向量表》（ATMD）由黄希庭、张志杰等人编制，用于评估青少年的时间管理倾向。',
    '共 44 题，分时间价值感、时间监控观、时间效能感三个分量表，采用五级计分。',
  ],
  highlights: '44 题｜3 分量表 9 子维度｜五级计分',
  benefits: [
    { title: '了解时间观', description: '从价值感、监控观、效能感三方面了解自己的时间管理倾向。' },
    { title: '发现提升点', description: '结果可帮助识别在时间安排与执行上的薄弱子维度。' },
  ],
  instructions: [
    '每题按自己实际情况，在“完全不符合～完全符合”五级中选择。',
    '答案无对错之分，请如实作答。',
  ],
  source: '青少年时间管理倾向量表（ATMD）· 黄希庭、张志杰等编制',
  options: [
    { label: '完全不符合', score: 1 },
    { label: '大部分不符合', score: 2 },
    { label: '部分符合，部分不符合', score: 3 },
    { label: '大部分符合', score: 4 },
    { label: '完全符合', score: 5 },
  ],
  questions: [
    { id: 1, text: '我认为“一寸光阴一寸金”这句话是正确的。', dimension: 'socialValue' },
    { id: 2, text: '我通常把每天的活动安排成一个日程表。', dimension: 'planning' },
    { id: 3, text: '“时间就是效益”这句话是正确的。', dimension: 'socialValue' },
    { id: 4, text: '我每天都给自己指定一个学习目标。', dimension: 'goalSetting' },
    { id: 5, text: '无论做什么事情,我首先要考虑的是时间因素。', dimension: 'personalValue' },
    { id: 6, text: '我以为将来比现在和过去更重要。', dimension: 'personalValue' },
    { id: 7, text: '我总是把最重要的工作安排在活动效率最高的时间里去做。', dimension: 'priority' },
    { id: 8, text: '无论做什么事情我总是既有短期安排又有长期计划。', dimension: 'planning' },
    { id: 9, text: '目前我尚年轻,浪费一些时间无所谓。', dimension: 'personalValue', reverse: true },
    { id: 10, text: '在每周开始之前,我都制定了目标。', dimension: 'goalSetting' },
    { id: 11, text: '对每个人来说,时间就是一切。', dimension: 'socialValue' },
    { id: 12, text: '在每个学期我都要制定自己的学习计划。', dimension: 'planning' },
    { id: 13, text: '我认为我在学习和课外活动上的时间分配是合理的。', dimension: 'behaviorEfficacy' },
    { id: 14, text: '我总是把大量的时间花在做重要的工作上。', dimension: 'timeAllocation' },
    { id: 15, text: '在新年开始的时候,我通常都要制定这一年中自己的奋斗目标。', dimension: 'goalSetting' },
    { id: 16, text: '我相信时间就是生命。', dimension: 'personalValue' },
    { id: 17, text: '我课后复习功课的时间是由老师布置的作业量来决定的。', dimension: 'goalSetting', reverse: true },
    { id: 18, text: '我认为时间是可以有效地加以管理的。', dimension: 'manageEfficacy' },
    { id: 19, text: '我通常把重要的任务安排在计划表的重要位置上。', dimension: 'priority' },
    { id: 20, text: '我能够有效地利用自己的时间。', dimension: 'manageEfficacy' },
    { id: 21, text: '我经常根据实际情况对计划进行调整。', dimension: 'feedback' },
    { id: 22, text: '如果有几件事要同时做,我经常要衡量它们的重要性来安排时间。', dimension: 'priority' },
    { id: 23, text: '我能够很好地利用课堂上的学习时间。', dimension: 'manageEfficacy' },
    { id: 24, text: '我对自己设定的目标充满信心。', dimension: 'behaviorEfficacy' },
    { id: 25, text: '我对每个星期要做的事情都有一个计划安排。', dimension: 'planning' },
    { id: 26, text: '我经常对自己利用时间的情况进行总结。', dimension: 'feedback' },
    { id: 27, text: '在处理好几件事情的时候,我认为最好是每件事情都做一些。', dimension: 'priority', reverse: true },
    { id: 28, text: '利用好时间对我具有重要的意义。', dimension: 'personalValue' },
    { id: 29, text: '我对自己浪费掉的时间深感懊悔。', dimension: 'manageEfficacy' },
    { id: 30, text: '我确定的目标通常都难以实现。', dimension: 'behaviorEfficacy', reverse: true },
    { id: 31, text: '世上最宝贵的是时间。', dimension: 'socialValue' },
    { id: 32, text: '我的时间大部分都掌握在自己手中。', dimension: 'manageEfficacy' },
    { id: 33, text: '我通常根据学习任务的重要性来安排学习的先后次序。', dimension: 'priority' },
    { id: 34, text: '只要是重要的工作,我一定要挤时间去做。', dimension: 'timeAllocation' },
    { id: 35, text: '我相信我的计划安排通常是合理的。', dimension: 'behaviorEfficacy' },
    { id: 36, text: '我认为我对事情重要性的顺序安排是合理的。', dimension: 'behaviorEfficacy' },
    { id: 37, text: '要做的事情很多,我却能处理好这些事。', dimension: 'timeAllocation' },
    { id: 38, text: '我常常与同学交流合理利用时间的经验。', dimension: 'feedback' },
    { id: 39, text: '我认为时间就是力量。', dimension: 'socialValue' },
    { id: 40, text: '我通常都能按时完成老师布置的作业。', dimension: 'goalSetting' },
    { id: 41, text: '我每天什么时候学习,什么时候玩都有一个清楚的想法。', dimension: 'planning', reverse: true },
    { id: 42, text: '为了提高时间利用效率,我经常学习有关如何有效利用时间的知识。', dimension: 'timeAllocation' },
    { id: 43, text: '我总是根据目标的完成情况来检验自己的计划。', dimension: 'feedback' },
    { id: 44, text: '我常常对自己的工作在什么时候完成没有一个期限。', dimension: 'feedback' },
  ],
  dimensions: [
    { key: 'personalValue', name: '时间价值感·个人取向', items: [5, 6, 9, 16, 28] },
    { key: 'socialValue', name: '时间价值感·社会取向', items: [1, 3, 11, 31, 39] },
    { key: 'goalSetting', name: '时间监控观·设置目标', items: [4, 10, 15, 17, 40] },
    { key: 'planning', name: '时间监控观·计划性', items: [2, 8, 12, 25, 41] },
    { key: 'priority', name: '时间监控观·优先级', items: [7, 19, 22, 27, 33] },
    { key: 'feedback', name: '时间监控观·反馈性', items: [21, 26, 38, 43, 44] },
    { key: 'timeAllocation', name: '时间监控观·时间分配', items: [14, 34, 37, 42] },
    { key: 'behaviorEfficacy', name: '时间效能感·管理行为效能', items: [13, 24, 30, 35, 36] },
    { key: 'manageEfficacy', name: '时间效能感·管理效能', items: [18, 20, 23, 29, 32] },
  ],
  scoring: {
    kind: 'profile',
    profileNote:
      '本表为多维剖析型，不做总分。三个分量表（时间价值感 10 题、时间监控观 24 题、' +
      '时间效能感 10 题）及各子维度分别计算得分，得分越高表示对应时间管理倾向越强。' +
      '源文本未提供维度的分界值，报告页可展示各维度得分。',
  },
}

export default scale
