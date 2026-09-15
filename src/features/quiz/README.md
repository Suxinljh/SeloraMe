# 答题交互体系

答题页只负责进度、翻页与存储，**不感知任何具体交互类型**。
每道题通过 `interaction` 字段声明自己用哪种交互，渲染与校验由本目录按 kind 分发。

## 目录职责

| 位置 | 职责 |
| --- | --- |
| `src/data/scales/types.ts` | 声明 `QuizInteractionKind` / `QuizInteraction` / `QuizAnswerValue` |
| `src/data/scales/interactions.ts` | **行为层**：空作答、是否已答、计分、报告摘要。纯逻辑，无 React |
| `src/features/quiz/types.ts` | 交互组件的统一契约 `InteractionProps` |
| `src/features/quiz/interactions/*.tsx` | **渲染层**：每种交互一个组件 |
| `src/features/quiz/registry.tsx` | kind → 组件的注册表 |
| `src/features/quiz/AnswerArea.tsx` | 分发器，答题页只调用它 |

行为层与渲染层分开，是为了让数据层（`profile-overview.ts` 等）能直接调用计分逻辑，
而不用把 React 依赖带进数据层。两张表都用 `Record<QuizInteractionKind, ...>` 约束，
**漏登记会在编译期报错**，不会出现「数据里声明了但渲染不出来」。

## 现有交互类型

| kind | 名称 | 作答值形态 | 说明 |
| --- | --- | --- | --- |
| `single` | 单选 | `number` | 选中的选项下标。省略 `interaction` 时默认此项 |
| `multiple` | 多选 | `number[]` | 选中下标集合，可用 `min` / `max` 限制数量 |
| `rank` | 排序 | `number[]` | 选项下标按名次从高到低排列 |
| `match` | 配对 | `Record<string, number>` | 左列下标（字符串）→ 右列下标 |

计分规则见 `interactions.ts` 的 `scoreQuestion`：单选取所选分值；多选取所选分值的平均；
排序取首位选项的分值（名次分另由 `rankTally` 累计）；配对取各配对右项分值之和。

## 新增一种交互

只需四处改动，答题页不用动：

1. `src/data/scales/types.ts`：在 `QuizInteractionKind` 加一个 kind，并在 `QuizInteraction` 联合类型中定义它的参数
2. `src/data/scales/interactions.ts`：`INTERACTION_LABELS` 补一条，并在 `defaultAnswer` / `isAnswered` / `incompleteHint` / `scoreQuestion` / `summarizeAnswer` 中补该 kind 的分支
3. `src/features/quiz/interactions/`：新建组件，props 用 `InteractionProps`
4. `src/features/quiz/registry.tsx`：登记到 `INTERACTION_COMPONENTS`

漏掉第 2 或第 4 步，`Record<QuizInteractionKind, ...>` 会让 `tsc` 直接报错。

## 图片题

图片是**选项的属性**，不是一种交互类型：

```ts
{ label: '选项一', score: 1, image: 'https://.../a.png', imageFit: 'aspectFit' }
```

单选、多选组件检测到任一选项带 `image` 时会自动切换成图文卡片两列布局，
不需要新增 kind。走网络图需在小程序后台把域名加入 downloadFile 合法域名。

## 已接入

- 科尔伯格学习风格测试：12 题全部使用 `rank`
- 其余 30 个量表均未声明 `interaction`，按默认单选处理

**尚未在微信开发者工具实测**（排序与配对用点击而非拖拽，以便在小程序端稳定运行），
真机表现需验证 —— Needs WeChat DevTools verification。
