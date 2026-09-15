import type { Scale } from '../types'

// 计分取值依据：源文本“是：2分 无法确定：1分 不是：0分”。
// 维度划分：1~11题 为 a类，12~17题 为 b类，18~20题 为 c类（源文本）。
// 结果分析将 a类 与 b类 合并判断（二者得分均在某区间时统一解释），本文件将 a/b/c
// 作为三个维度分别给出分级带，临床解释时需注意 a类 与 b类 应结合考量。
// 源文本未给题目级反向计分。
const scale: Scale = {
  id: 'mental-self-check',
  title: '心理健康自测表',
  desc: '快速自测心理健康的几个常见倾向',
  category: 'emotion',
  duration: '约 5 分钟',
  tag: '自我筛查',
  participantCount: 7,
  intro: [
    '本表帮助你了解自己的心理健康程度，共 20 题，覆盖情绪、强迫、人际敏感等方面。',
    '请根据实际情况，在“是 / 无法确定 / 不是”中选择最接近自己的选项。',
  ],
  highlights: '20 题｜a/b/c 三类计分｜倾向提示',
  benefits: [
    { title: '快速觉察', description: '用少量题目初步了解自身在几个维度的倾向。' },
    { title: '引导关注', description: '结果可作为进一步自我观察或寻求专业帮助的线索。' },
  ],
  instructions: [
    '每题选择一个最符合自己的选项。',
    '凭真实感受作答，无需过度思考。',
  ],
  options: [
    { label: '是', score: 2 },
    { label: '无法确定', score: 1 },
    { label: '不是', score: 0 },
  ],
  questions: [
    { id: 1, text: '心情总是闷闷不乐，情绪善变。', dimension: 'a' },
    { id: 2, text: '老是担心门没锁好，电源可能有问题，因而多次检查，甚至走了好远还拐回来看看。', dimension: 'a' },
    { id: 3, text: '虽未曾患过恶性疾病，却一直担心会不会染上什么严重的病。', dimension: 'a' },
    { id: 4, text: '容易脸红，害怕站在高处，害怕当众发言。', dimension: 'a' },
    { id: 5, text: '由于关心呼吸和心脏跳动的情况而难以入睡。', dimension: 'a' },
    { id: 6, text: '每天总是多次洗手，认为公用电话不洁，而不敢使用。', dimension: 'a' },
    { id: 7, text: '总是担心“这样做是否顺利？”以致无法放手去做。', dimension: 'a' },
    { id: 8, text: '有些奇怪的观念总是出现在脑海，明知这些念头很无聊，却又无法摆脱。', dimension: 'a' },
    { id: 9, text: '离开家门时，如果不从某只脚开始走，心里总是不安。改变床附近的东西就无法入睡。', dimension: 'a' },
    { id: 10, text: '尽管四周的人在欢乐的取闹，自己却觉着没有什么意思。', dimension: 'a' },
    { id: 11, text: '外界的东西犹如影子一般朦胧，见到的东西无法清晰的回忆出来。', dimension: 'a' },
    { id: 12, text: '总觉得父母或亲友最近对自己太冷漠，或者不知为什么总是很反感或产生强烈的孤独感。', dimension: 'b' },
    { id: 13, text: '心中无端的产生“这个世界正趋于灭亡，新的世界即将开始”的感觉。', dimension: 'b' },
    { id: 14, text: '总觉得有人在注意、凝视自己或追赶自己。', dimension: 'b' },
    { id: 15, text: '有时会产生被人左右或是不由己的感觉。', dimension: 'b' },
    { id: 16, text: '常自言自语或暗自发笑。', dimension: 'b' },
    { id: 17, text: '虽然没人却总觉着有声音，晚上睡觉时总觉着有人进入了房间。', dimension: 'b' },
    { id: 18, text: '遭遇失败或于同学不和谐时，会很敏感的觉着“我被人嘲笑”。', dimension: 'c' },
    { id: 19, text: '当自己的权利受到侵害时拼死力争。', dimension: 'c' },
    { id: 20, text: '当东西丢掉时，便不由自主的想到“大概是某某偷去的”，当受到老师的批评时，立即会想到“一定是某某告密的”。', dimension: 'c' },
  ],
  dimensions: [
    {
      key: 'a',
      name: 'a类（情绪·强迫·感知）',
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      bands: [
        { min: 0, max: 3, label: '非常健康', summary: 'a类得分在 4 分以下，心理非常健康，神经也很正常。', recommendation: '保持当前状态。', tone: 'calm' },
        { min: 4, max: 6, label: '一般', summary: 'a类得分在 5～7 分，心理健康情况一般。', recommendation: '可视为正常，留意压力来源。', tone: 'attention' },
        { min: 7, max: 10, label: '神经略疲倦', summary: 'a类得分在 8～10 分，神经有些疲倦。', recommendation: '设法减少学习压力，通过娱乐调节生活、放松精神。', tone: 'attention' },
        { min: 11, max: 22, label: '神经衰弱倾向', summary: 'a类得分在 11 分以上，可能有神经衰弱倾向。', recommendation: '建议关注自身健康，必要时请心理老师辅导。', tone: 'urgent' },
      ],
    },
    {
      key: 'b',
      name: 'b类（关系·被害·现实感）',
      items: [12, 13, 14, 15, 16, 17],
      bands: [
        { min: 0, max: 3, label: '非常健康', summary: 'b类得分在 4 分以下，心理非常健康。', recommendation: '保持当前状态。', tone: 'calm' },
        { min: 4, max: 6, label: '一般', summary: 'b类得分在 5～7 分，心理健康情况一般。', recommendation: '可视为正常，留意压力来源。', tone: 'attention' },
        { min: 7, max: 10, label: '神经略疲倦', summary: 'b类得分在 8～10 分，神经有些疲倦。', recommendation: '设法减少压力，调节生活、放松精神。', tone: 'attention' },
        { min: 11, max: 12, label: '精神分裂预防', summary: 'b类得分在 11 分以上，有预防精神分裂的必要。', recommendation: '建议尽早请心理老师辅导、早些预防。', tone: 'urgent' },
      ],
    },
    {
      key: 'c',
      name: 'c类（被害·关系认知）',
      items: [18, 19, 20],
      bands: [
        { min: 0, max: 3, label: '无明显倾向', summary: 'c类得分在 4 分以下，未见强烈相关倾向。', recommendation: '保持当前状态。', tone: 'calm' },
        { min: 4, max: 6, label: '强烈妄想倾向', summary: 'c类得分在 4 分以上，有强烈的妄想倾向。', recommendation: '建议尽早请老师进行辅导。', tone: 'urgent' },
      ],
    },
  ],
  scoring: {
    kind: 'profile',
    profileNote:
      '本表为多维剖析型：a类（1~11题）、b类（12~17题）、c类（18~20题）分别计算总分。' +
      'a类与b类在结果分析中合并判断（二者得分均在某区间时统一解释）。' +
      '各维度分级带见对应 dimension.bands。',
  },
}

export default scale
