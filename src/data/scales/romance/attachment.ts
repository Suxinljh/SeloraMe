import type { Scale } from '../types'

// 计分依据：源文本——七点 Likert，1=根本不符合，2=比较不符合，3=有点不符合，4=无法确定，
// 5=有点符合，6=比较符合，7=非常符合。每个维度 15 题求和，范围 15~105。
// 分型：回避≤68 且 焦虑≤68 为安全型；回避≤68 且 焦虑>68 为焦虑型；
// 回避>68 且 焦虑≤68 为回避型；回避>68 且 焦虑>68 为恐惧型。
// 疑虑：源文件注明「标黄的为反向计分」，但文本提取后无法识别哪些题被标黄，
// 故本文件未对题目设置 reverse。如需精确计分，应补回源表的高亮标记。
// 范围说明：本文件仅取源表中「恋爱依恋回避」「恋爱依恋焦虑」两个维度（各 15 题，共 30 题）；
// 源表后续「择偶动机」「择偶标准」等部分不在本次范围内。
const scale: Scale = {
  id: 'attachment',
  title: '成人恋爱依恋类型测评',
  desc: '评估你在亲密关系中的依恋回避与焦虑水平',
  category: 'romance',
  duration: '约 6 分钟',
  tag: '依恋类型',
  participants: '持续更新中',
  intro: [
    '本测评测量成人恋爱中的依恋类型，包含「恋爱依恋回避」与「恋爱依恋焦虑」两个维度，各 15 题，共 30 题。',
    '采用七点 Likert 计分：从「根本不符合」(1 分) 到「非常符合」(7 分)。每个维度 15 题求和，得分范围 15~105。',
    '以 68 分为界区分两个维度的高低，结合高低水平可将依恋分为安全型、焦虑型、回避型、恐惧型四种类型。',
  ],
  highlights: '依恋回避｜依恋焦虑｜四种类型｜关系模式',
  benefits: [
    { title: '了解依恋模式', description: '通过回避与焦虑两个维度的得分，识别自己在亲密关系中的典型互动与情绪反应。' },
    { title: '促进关系觉察', description: '对照四种依恋类型的解释，反思自身在关系中的安全感、依赖与边界。' },
  ],
  instructions: [
    '以当前或最近一段恋爱关系为参照作答。',
    '每题在七级中择一，凭真实感受勾选。',
    '分别累加两个维度的得分，再以 68 分为界划分高低。',
  ],
  source: '成人恋爱依恋量表（ECR 中文改编版）',
  options: [
    { label: '根本不符合', score: 1 },
    { label: '比较不符合', score: 2 },
    { label: '有点不符合', score: 3 },
    { label: '无法确定', score: 4 },
    { label: '有点符合', score: 5 },
    { label: '比较符合', score: 6 },
    { label: '非常符合', score: 7 },
  ],
  questions: [
    { id: 1, text: '总的来说，我不喜欢让恋人知道自己内心深处的感觉', dimension: 'avoidance' },
    { id: 2, text: '我觉得跟恋人亲近是一件惬意的事情。', dimension: 'avoidance' },
    { id: 3, text: '当恋人开始要跟我亲近时，我发现我自己在退缩', dimension: 'avoidance' },
    { id: 4, text: '当恋人希望跟我非常亲近时，我会觉得不自在。', dimension: 'avoidance' },
    { id: 5, text: '我觉得对恋人开诚布公，不是一件很舒服的事情.', dimension: 'avoidance' },
    { id: 6, text: '我想与恋人亲近，但我又总是会退缩不前。', dimension: 'avoidance' },
    { id: 7, text: '我愿意把我内心的想法和感觉告诉恋人，我觉得这是一件自在的事情。', dimension: 'avoidance' },
    { id: 8, text: '我试图避免与恋人变得太亲近。', dimension: 'avoidance' },
    { id: 9, text: '我觉得我比较容易与恋人亲近。', dimension: 'avoidance' },
    { id: 10, text: '我发现让我依赖恋人，是一件困难的事情。', dimension: 'avoidance' },
    { id: 11, text: '我跟恋人什么事情都讲。', dimension: 'avoidance' },
    { id: 12, text: '我经常与恋人讨论我所遇到的问题以及我关心的事情。', dimension: 'avoidance' },
    { id: 13, text: '我觉得依赖恋人是很自在的事情', dimension: 'avoidance' },
    { id: 14, text: '在我需要帮助的时候，向恋人求助是有用的。', dimension: 'avoidance' },
    { id: 15, text: '我会在很多事情上向恋人求助，包括寻求安慰和得到承诺。', dimension: 'avoidance' },
    { id: 16, text: '我担心我会被抛弃。', dimension: 'anxiety' },
    { id: 17, text: '我很担心我和恋人的关系。', dimension: 'anxiety' },
    { id: 18, text: '我担心恋人不会像我关心他/她那样地关心我。', dimension: 'anxiety' },
    { id: 19, text: '我有点担心会失去恋人。', dimension: 'anxiety' },
    { id: 20, text: '我常常希望恋人对我的感情和我对恋人的感情样强烈。', dimension: 'anxiety' },
    { id: 21, text: '我常常想与恋人形影不离，但有时这样会把恋人不跑。', dimension: 'anxiety' },
    { id: 22, text: '我想跟恋人非常亲密的愿望，有时会把恋人吓跑。', dimension: 'anxiety' },
    { id: 23, text: '我需要恋人一再地保证他/她是爱我的。', dimension: 'anxiety' },
    { id: 24, text: '我觉得自己在要求恋人把更多的感觉，以及家庭关系的投入程度表现出来。', dimension: 'anxiety' },
    { id: 25, text: '我并不是常常担心被恋人抛弃。', dimension: 'anxiety' },
    { id: 26, text: '我觉得恋人没表现出我想要的亲近。', dimension: 'anxiety' },
    { id: 27, text: '当我没有可以亲近的人时 (没有人陪我、照顾我)，我会感到焦虑和不安。', dimension: 'anxiety' },
    { id: 28, text: '如果在我需要的时候，恋人却不在我身边，我会感到沮丧。', dimension: 'anxiety' },
    { id: 29, text: '当恋人不赞同我时，我觉得确实是我不好。', dimension: 'anxiety' },
    { id: 30, text: '当恋人不花时间和我在一起时，我会感到怨恨', dimension: 'anxiety' },
  ],
  dimensions: [
    {
      key: 'avoidance',
      name: '恋爱依恋回避',
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      bands: [
        { min: 15, max: 68, label: '低恋爱依恋回避', summary: '在亲密关系中较为自在，乐于亲近与依赖。', recommendation: '可保持开放沟通，适度表达需求。', tone: 'calm' },
        { min: 69, max: 105, label: '高恋爱依恋回避', summary: '倾向保持情感距离，对过度亲密感到不适。', recommendation: '留意自己在关系中筑墙的倾向，尝试逐步建立信任。', tone: 'attention' },
      ],
    },
    {
      key: 'anxiety',
      name: '恋爱依恋焦虑',
      items: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
      bands: [
        { min: 15, max: 68, label: '低恋爱依恋焦虑', summary: '对关系较为安心，较少担心被抛弃。', recommendation: '可维持稳定的自我价值感与边界。', tone: 'calm' },
        { min: 69, max: 105, label: '高恋爱依恋焦虑', summary: '常担心失去伴侣，渴望强烈的亲密与保证。', recommendation: '注意过度依赖带来的波动，明确彼此边界。', tone: 'attention' },
      ],
    },
  ],
  scoring: {
    kind: 'profile',
    profileNote: '两个维度各 15 题求和（范围 15~105），以 68 分为界区分高低，组合四种依恋类型：安全型（回避≤68 且 焦虑≤68）、焦虑型（回避≤68 且 焦虑>68）、回避型（回避>68 且 焦虑≤68）、恐惧型（回避>68 且 焦虑>68）。注：源文件注明部分题目为反向计分（「标黄的为反向计分」），但提取文本无法识别具体题号，本文件未设置 reverse，如用于精确计分需补回高亮标记。',
  },
}

export default scale
