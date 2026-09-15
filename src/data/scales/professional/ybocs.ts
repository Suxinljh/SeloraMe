import type { Scale } from '../types'

// 数据来源说明：
// 主源「yale-brown强迫量表-修改.txt」给出两维度（强迫思维 / 强迫行为）的分级带与建议，但无题目文本；
// 题目与 0-4 锚定描述取自参考源「yale-brown强迫题目.docx.txt」，逐字录入 questions 的 text 中。
// YBOCS 各题选项锚定词不同（如「无/轻微/中度/重度/极重」或「不受妨碍/极度」等），但均按 0-4 计分，
// 故共用一套通用 0-4 选项集，题面已内嵌该题的具体锚定描述以保证逐字忠实。
// 维度分级带（0-5 无、6-9 轻度、10-14 中度、15+ 重度）与总分带（<6 无、6-15 轻度、16-25 中度、25+ 重度）均照主源录入。
// 按规则 #5，instructions 含筛查/非诊断限定。
const scale: Scale = {
  id: 'ybocs',
  title: 'Yale-Brown 强迫量表',
  desc: '评估强迫思维与强迫行为严重程度的半结构式量表',
  category: 'professional',
  duration: '约 10 分钟',
  tag: '专业量表',
  participants: '持续更新中',
  intro: [
    '耶鲁布朗强迫症严重程度量表（Yale-Brown Obsessive Compulsive Scale, Y-BOCS）在国内外研究和实践中普遍使用，其结果具有权威性的参考意义。',
    '量表分为强迫思维与强迫行为两个部分，各 5 题，每题按 0-4 五级评分，两部分分别求和并合计总分。',
    '本量表用于自评与筛查，不构成临床诊断。',
  ],
  highlights: '10 题｜五级评分｜思维+行为两维度｜专业筛查',
  benefits: [
    { title: '评估严重程度', description: '分别评估强迫思维与强迫行为的严重程度。' },
    { title: '分级参考', description: '据总分与维度分区分无、轻度、中度、重度强迫。' },
    { title: '引导专业求助', description: '中重度结果建议寻求专业心理或医学评估。' },
  ],
  instructions: [
    '请仔细阅读每题及该题 0-4 的具体锚定描述，选择最贴合自己近期情况的等级。',
    '强迫思维（第 1-5 题）与强迫行为（第 6-10 题）各题分别计 0-4 分，两部分分别求和。',
    '本量表用于自评与筛查，不构成临床诊断；若总分或维度分偏高，建议寻求专业评估。',
  ],
  source: 'Yale-Brown Obsessive Compulsive Scale（Y-BOCS）· Goodman 等',
  options: [
    { label: '无', score: 0 },
    { label: '轻微', score: 1 },
    { label: '中度', score: 2 },
    { label: '重度', score: 3 },
    { label: '极重', score: 4 },
  ],
  questions: [
    { id: 1, text: '每天强迫思维的时间或频率\n0=完全无强迫思维（选择此项，则第2、3、4、5、题也会选0，可直接作答第6题）\n1=轻微（少于1小时），或偶尔有（不超过8次/天）\n2=中度（1—3小时），或常常有（超过8次/天，但每天大部分时间没有强迫思维）\n3=重度（3—8小时），或频率非常高（超过8次/天，且一天大部分时间有强迫思维）\n4=极重（8小时以上），或几乎无时无刻都有', dimension: 'obsession' },
    { id: 2, text: '强迫思维对学业、工作、社交或日常活动任意一项的妨碍（请考虑因为强迫思维而不去做或减少做的事情）\n0=不受妨碍\n1=轻微（稍微妨碍，但整体表现并无大碍）\n2=中度（确实妨碍，但仍可应付）\n3=重度（上述某一项或多项功能严重受损）\n4=极度（上述某一项或多项功能丧失）', dimension: 'obsession' },
    { id: 3, text: '强迫思维带来的苦恼或困扰\n0=没有\n1=轻微\n2=中度（尚可应付）\n3=重度\n4=极重（持续地感觉如同废人）', dimension: 'obsession' },
    { id: 4, text: '与强迫思维的抗衡\n0=无需抗衡\n1=基本能与之抗衡\n2=有时能与之抗衡\n3=经常屈服\n4=完全屈服', dimension: 'obsession' },
    { id: 5, text: '对强迫思维的掌控\n0=完全能控制\n1=大多能控制\n2=中等程度控制\n3=很少能控制\n4=完全无法控制', dimension: 'obsession' },
    { id: 6, text: '每天强迫行为的时间或频率\n0=完全无强迫行为（选择此项，则第7、8、9、10题也会选0）\n1=轻微（少于1小时），或偶尔有（不超过8次/天）\n2=中度（1—3小时），或常常有（超过8次/天，但一天大部分时间没有强迫行为）\n3=重度（3—8小时），或频率非常高（超过8次/天，且一天大部分时间有强迫行为）\n4=极重（大于8小时），或几乎无时无刻都有', dimension: 'compulsion' },
    { id: 7, text: '强迫行为对学业、工作、社交或日常活动任意一项的妨碍（请考虑因为强迫行为而不去做或减少做的事情）\n0=不受妨碍\n1=轻微（稍微妨碍，但整体表现并无大碍）\n2=中度（确实妨碍，但仍可应付）\n3=重度（上述某一项或多项功能严重受损）\n4=极度（上述某一项或多项功能丧失）', dimension: 'compulsion' },
    { id: 8, text: '强迫行为被制止时的焦虑程度\n0=没有焦虑\n1=轻微\n2=中度（仍可以应付）\n3=严重\n4=极度', dimension: 'compulsion' },
    { id: 9, text: '与抗强迫行为的抗衡\n0=无需对抗\n1=基本能与之抗衡\n2=有时能与之抗衡\n3=经常屈服\n4=完全屈服', dimension: 'compulsion' },
    { id: 10, text: '对强迫行为的掌控（回想那些控制强迫行为的情境，以便回答此题）\n0=完全控制\n1=大多能控制（只要稍加注意即能停止强迫行为）\n2=中等程度控制（注意虽能控制但有困难）\n3=控制力弱（只能忍耐短暂的时间，但最终还是必须完成强迫行为）\n4=完全无法控制（连忍耐短暂时间的能力都没有）', dimension: 'compulsion' },
  ],
  dimensions: [
    {
      key: 'obsession',
      name: '强迫思维',
      items: [1, 2, 3, 4, 5],
      bands: [
        { min: 0, max: 5, label: '无强迫思维', summary: '无强迫思维。', recommendation: '维护用脑卫生，保持正确思维方式，关注心理健康。', tone: 'calm' },
        { min: 6, max: 9, label: '轻度强迫思维', summary: '存在轻度强迫思维。', recommendation: '寻找思维根源、意识辩论、观察学习他人视角，稍加注意即可改善。', tone: 'attention' },
        { min: 10, max: 14, label: '中度强迫思维', summary: '存在中度强迫思维。', recommendation: '自我思维观察与监测、训练正确思维方式、进行认知矫正。', tone: 'urgent' },
        { min: 15, max: 20, label: '重度强迫思维', summary: '存在重度强迫思维。', recommendation: '建议寻求专业心理医师治疗，配合药物治疗与认知行为矫正。', tone: 'urgent' },
      ],
    },
    {
      key: 'compulsion',
      name: '强迫行为',
      items: [6, 7, 8, 9, 10],
      bands: [
        { min: 0, max: 5, label: '无强迫行为', summary: '无强迫行为。', recommendation: '维护用脑卫生，保持正确思维方式，关注心理健康。', tone: 'calm' },
        { min: 6, max: 9, label: '轻度强迫行为', summary: '存在轻度强迫行为。', recommendation: '自我帮助小技巧、设定小目标、暴露练习，逐步改善。', tone: 'attention' },
        { min: 10, max: 14, label: '中度强迫行为', summary: '存在中度强迫行为。', recommendation: '寻求社会支持、建立强迫行为日志、限制强迫行为时间。', tone: 'urgent' },
        { min: 15, max: 20, label: '重度强迫行为', summary: '存在重度强迫行为。', recommendation: '建议寻求专业心理医师治疗，进行更深入的症状评估与持续监测调整。', tone: 'urgent' },
      ],
    },
  ],
  // 总分 = 强迫思维分 + 强迫行为分（0-40）。源文本分级：<6 无强迫、6-15 轻度、16-25 中度、25+ 重度。
  scoring: {
    kind: 'sum',
    bands: [
      { min: 0, max: 5, label: '无强迫', summary: '测量结果显示不存在强迫，无论是强迫行为还是强迫思维。', recommendation: '继续保持良好状态，擅于接纳自己、与自己相处融洽。', tone: 'calm' },
      { min: 6, max: 15, label: '轻度强迫', summary: '存在轻度强迫，需在强迫思维和行为方面稍加注意。', recommendation: '这只是轻微症状，并不意味着异常，稍加注意即可克服。', tone: 'attention' },
      { min: 16, max: 25, label: '中度强迫', summary: '存在中度强迫，需注意强迫性的思维和行为问题。', recommendation: '这并不严重，但可通过改善缓解强迫对生活的影响。', tone: 'urgent' },
      { min: 26, max: 40, label: '重度强迫', summary: '存在重度强迫，可能已严重影响日常生活。', recommendation: '建议寻求专业心理医师治疗，进行认知行为矫正。', tone: 'urgent' },
    ],
  },
}

export default scale
