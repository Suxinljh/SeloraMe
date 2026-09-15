# SelorMe Engineering Instructions

## 1. Project Context

SelorMe 是一个微信心理测评小程序。

当前项目的主要技术栈以仓库实际配置为准，预计包括：

- Taro
- React
- TypeScript
- Zustand
- SCSS / CSS
- 微信小程序

主要运行目标：

```
weapp
```

微信小程序是当前第一优先级。

不要为了 H5、React Web 或其他平台牺牲微信小程序端的正确性。

------

## 2. Before Writing Code

任何任务开始前，先检查：

- `package.json`
- `config/`
- `src/app.config.*`
- 当前页面的 `*.config.*`
- 当前 Taro 版本
- React 版本
- TypeScript 配置
- 已有组件
- 已有工具函数
- 已有样式规范
- git diff / git status

不要假设项目使用某个 Taro 版本。

必须以 `package.json` 中安装的版本为准。

如果官方文档存在多个版本，只参考与当前项目版本匹配的文档。

------

## 3. Source of Truth

实现优先级：

1. 当前项目代码和配置
2. SelorMe 设计稿
3. 当前版本 Taro 官方文档
4. 微信小程序官方文档
5. 第三方资料

不得用博客、Stack Overflow、历史文章覆盖官方文档。

如果不确定一个 Taro API、微信 API、组件属性、生命周期或配置项：

不要猜。

先查官方文档。

如果无法确认，明确说明无法确认，不要自行编造 API。

官方资料索引见：

```
docs/mini-program-reference.md
```

------

## 4. This Is Not A Normal React Web App

不要把 Taro 微信小程序项目按照普通 React Web 项目实现。

默认禁止未经确认直接依赖：

- `window`
- `document`
- `localStorage`
- `sessionStorage`
- `history`
- `location`
- 浏览器 DOM API
- 浏览器专属事件
- 浏览器专属 CSS 行为

Taro 可能提供部分 Web API 兼容实现，但不得假设它们与浏览器行为完全一致。

微信小程序目标下优先使用：

- `@tarojs/components`
- `@tarojs/taro`
- Taro 官方 API
- 微信小程序官方能力

除非明确验证支持性，否则不要引入依赖 DOM 的 React Web Library。

------

## 5. Taro Components

小程序 UI 优先使用：

```tsx
import {
  View,
  Text,
  Image,
  ScrollView,
  Button,
  Input
} from '@tarojs/components'
```

不要默认使用：

```tsx
div
span
img
input
button
```

即使当前 Taro 版本支持部分 HTML 标签，也不要无必要混用 Web 标签。

项目核心页面保持小程序组件语义。

事件、属性和组件 API 必须按照当前版本 Taro 文档实现。

不要凭普通 React DOM 经验猜测。

------

## 6. Taro API

涉及以下能力时优先使用 Taro API：

- 页面跳转
- Storage
- Network
- System Info
- Clipboard
- Image
- Share
- Login
- Payment
- Navigation
- Toast
- Modal
- Loading

例如：

```ts
import Taro from '@tarojs/taro'
```

不要在业务代码里同时混杂：

```ts
Taro.xxx
wx.xxx
```

默认统一使用 Taro API。

只有在 Taro 未支持某个微信原生能力，且已经确认必须使用微信原生 API 时，才允许使用 `wx.*`。

这种情况必须添加说明。

------

## 7. Page Lifecycle

React 生命周期不等于微信小程序页面生命周期。

涉及：

- 页面进入
- 页面显示
- 页面隐藏
- 页面卸载
- 页面参数
- 下拉刷新
- 分享
- 返回页面后刷新数据

必须先判断这是：

React Component Lifecycle

还是：

Mini Program Page Lifecycle

如果属于页面生命周期，优先使用对应的 Taro Hooks，例如当前版本支持时：

```ts
useLoad
useReady
useDidShow
useDidHide
useUnload
```

不要用一个普通 `useEffect(() => {}, [])` 机械替代所有小程序生命周期。

------

## 8. Routing

页面路由必须遵循微信小程序 / Taro 路由规则。

使用：

```ts
Taro.navigateTo()
Taro.redirectTo()
Taro.navigateBack()
Taro.switchTab()
Taro.reLaunch()
```

必须理解这些 API 的区别。

尤其注意：

`navigateTo` 不能用于跳转 TabBar 页面。

TabBar 页面使用：

```ts
Taro.switchTab()
```

不要引入：

- React Router
- browser history router
- URL SPA Router

除非项目未来明确支持 H5 并经过架构设计。

页面必须在对应 Taro 配置中正确注册。

------

## 9. app.config / Page Config

不要按照 React Router 的思路管理页面。

新增页面时检查：

```text
src/app.config.ts
```

或者仓库当前实际的 app config 文件。

需要页面特殊配置时建立：

```text
index.config.ts
```

配置字段必须来源于：

Taro 官方文档

或：

微信小程序官方文档。

不要自行创造配置字段。

------

## 10. Styling

SelorMe 已存在完整设计稿。

设计稿是 UI 实现的视觉 Source of Truth。

不要自行重新设计：

- 间距
- 字体
- 字号
- 圆角
- 颜色
- 卡片
- 页面结构
- 图标
- 按钮
- 导航
- Tab Bar

如果设计稿和小程序平台能力产生冲突，优先选择视觉上最接近且技术正确的实现。

不要偷偷改变设计。

------

## 11. Taro Size Units

修改尺寸系统前必须先检查：

```ts
config/index.*
```

中的：

```ts
designWidth
deviceRatio
```

不得假设：

```text
1px = 1 physical pixel
```

Taro 会根据项目配置进行尺寸转换。

设计稿尺寸与项目 `designWidth` 不一致时，先理解现有转换机制，不要通过大量 magic number 强行修正。

优先写能够参与 Taro pxtransform 的样式。

JS 中需要动态尺寸转换时，检查是否应该使用：

```ts
Taro.pxTransform()
```

不要同时混乱使用：

```text
px
rpx
vw
rem
```

而没有明确尺寸策略。

------

## 12. Safe Area

所有底部固定元素必须考虑微信小程序安全区。

包括：

- Bottom Tab Bar
- Bottom CTA
- Assessment Next Button
- Report Actions
- Popup Footer

不要假设：

```css
bottom: 0;
```

就可以安全适配所有设备。

根据项目现有方案使用：

```css
env(safe-area-inset-bottom)
```

或经官方文档确认的安全区信息。

------

## 13. Scroll

微信小程序滚动行为与浏览器页面存在差异。

实现以下内容前必须确认：

- 页面整体滚动
- `ScrollView`
- 横向滚动
- Sticky
- Fixed
- Nested Scroll
- 下拉刷新

不要为了普通页面无意义地全部使用 `ScrollView`。

只有明确需要小程序 ScrollView 能力时才使用。

------

## 14. Storage

不要直接使用：

```ts
localStorage
```

项目如果已有 Storage Adapter，必须继续使用。

否则优先使用：

```ts
Taro.setStorage
Taro.getStorage
Taro.removeStorage
```

或对应 Sync API。

Assessment Session 等业务层不要直接散落调用 Storage API。

通过：

```text
storage service
repository
store persistence adapter
```

等已有抽象访问。

------

## 15. Network

网络请求优先沿用当前项目已有 API Client。

如果没有，再考虑封装 Taro Request。

不要在页面 JSX 里散落：

```ts
Taro.request(...)
```

页面：

```text
Page
↓
Store / Hook
↓
Service / Repository
↓
API Client
```

不要把：

UI
Network
Storage
Scoring

全部写在 Page Component 内。

------

## 16. WeChat-Specific Features

涉及以下功能时，不允许凭经验直接实现：

- `wx.login`
- 获取手机号
- 用户隐私授权
- 微信支付
- 分享
- 小程序码
- 订阅消息
- 文件上传
- 图片选择
- 相册权限
- 客服
- OpenID
- UnionID

必须：

1. 查微信小程序当前官方文档。
2. 检查基础库 / API 支持要求。
3. 再实现。

这些能力可能随微信平台政策变化，不使用旧教程作为实现依据。

------

## 17. Third-Party Dependencies

新增 npm 包前必须先回答：

1. 是否真的需要？
2. 是否支持 Taro？
3. 是否支持微信小程序？
4. 是否依赖 DOM？
5. 是否增加明显包体积？
6. 是否已有项目能力可以实现？

不要因为在 React Web 中常见就默认可以用于微信小程序。

特别谨慎使用：

- Web UI Library
- Chart Library
- Rich Text Editor
- Animation Library
- Browser Storage Library
- DOM Utility
- Router

------

## 18. Package Size

微信小程序存在包体积约束。

不要：

- 随意安装大型 npm 包
- 全量导入大型图标库
- 将大量高清图片直接放入主包
- 无意义复制资源
- 引入重复依赖

资源和页面数量扩大时，需要评估：

- 主包
- 分包
- CDN / remote assets

当前阶段不要提前过度设计分包，但也不要制造明显的包体积问题。

------

## 19. TypeScript

开启并遵循当前项目 TypeScript strict 设置。

禁止为了绕过问题大量使用：

```ts
any
as any
// @ts-ignore
```

如果 Taro / 微信 API 类型不匹配：

先检查：

- 当前依赖版本
- 官方 API
- 官方 type definition

不要直接强制类型断言解决。

------

## 20. Component Design

不要出现巨大页面组件。

推荐结构：

```text
Page
↓
Feature Component
↓
Shared Component
```

但禁止过度组件化。

只有满足以下条件之一才考虑抽组件：

- 多处复用
- 有明确业务语义
- 有独立状态
- 结构明显复杂

不要把每一个 `View` 都抽成组件。

------

## 21. Platform Conditionals

除非确实存在跨平台需求，否则不要随意写：

```ts
process.env.TARO_ENV
```

当前优先目标是：

```text
weapp
```

如果必须写平台分支：

必须解释：

- 为什么需要
- 微信端逻辑是什么
- 其他平台逻辑是什么

------

## 22. Coding Workflow

修改功能前：

1. 阅读相关页面。
2. 阅读相关组件。
3. 阅读相关 Store / Service。
4. 查找项目里已有类似实现。
5. 确认 Taro / 微信 API 是否正确。
6. 再开始修改。

优先复用项目已有模式。

不要每次实现同一种功能时创建不同架构。

------

## 23. Validation

完成修改后至少执行当前项目已有的：

```text
typecheck
lint
test
build
```

具体命令从：

```text
package.json scripts
```

读取。

不要自行假设脚本名称。

必须进行微信小程序目标构建。

如果存在类似：

```bash
npm run build:weapp
```

必须执行。

Build 成功不代表微信小程序运行时一定正确。

如果某个行为只能通过微信开发者工具确认，在最终报告中明确标记：

```text
Needs WeChat DevTools verification
```

不要声称已经验证。

------

## 24. Common Mistakes To Avoid

特别避免以下 AI 常见错误：

- 把 Taro 当 React Web
- 随便使用 `div`
- 使用 `localStorage`
- 使用 React Router
- 使用 browser history
- 把所有生命周期写成 `useEffect`
- 用 `navigateTo` 跳 TabBar
- 忘记注册页面
- 忘记 page config
- 忽略 Safe Area
- 随意使用 `wx.*` 和 `Taro.*`
- 使用依赖 DOM 的 npm 包
- 不检查微信端兼容性
- 不检查 Taro 版本
- 使用错误版本官方文档
- 编译通过就认为微信端一定正常

------

## 25. When Unsure

如果对某个实现有疑问：

不要猜测。

按照以下顺序：

```text
项目现有实现
↓
当前 Taro 版本官方文档
↓
微信小程序官方文档
↓
验证最小实现
```

如果依然无法确认：

明确告诉我：

```text
该行为需要在微信开发者工具中验证。
```

不要生成一个看起来合理但没有依据的实现。

------

## 26. Final Requirement

每次完成涉及小程序平台能力的修改时，在最终总结中额外列出：

```text
Mini Program Compatibility
```

说明：

- 使用了哪些 Taro API
- 使用了哪些微信平台能力
- 是否存在平台限制
- 是否需要微信开发者工具验证
- 是否存在基础库版本要求

如果没有相关内容，则无需机械添加。

# Material Design Icons Rules

SelorMe 的通用 UI 图标统一使用 Google Material Icons 图形体系。

本项目实际依赖：

```
@material-design-icons/svg
```

锁定版本：

```
0.14.15
```

许可：

```
Apache-2.0
```

官方图标浏览器：

```
https://fonts.google.com/icons
```

Google 官方图形源码仓库：

```
https://github.com/google/material-design-icons
```

该 npm 包的实际发行仓库：

```
https://github.com/marella/material-design-icons
```

说明：

- 图标图形本体来自 Google 官方 Material Icons 仓库，许可为 Apache-2.0。
- npm 包由社区项目 marella/material-design-icons 重新打包并优化为 SVG。
- 因此「图形来源」是 Google 官方，「获取渠道」是本项目已安装的 npm 依赖。
- 本项目**不使用** Material Symbols。Material Symbols 是另一套体系（带可变字体轴），
  与本项目的依赖、目录结构、命名规则均不兼容。
- 不要参考 Material Symbols 的 `symbols/web/<name>/materialsymbolsrounded/` 路径规则，
  本项目的资源路径不适用该结构。

------

## 1. Default Icon Style

如果任务只提供图标名称，没有额外说明，默认使用：

```text
Package: @material-design-icons/svg
Style:   round
Canvas:  24 × 24
viewBox: 0 0 24 24
```

例如用户说：

```text
使用 Google 的 search 图标
```

等价于：

```text
@material-design-icons/svg

round/search.svg
```

包内提供 5 个 style 目录：

```text
filled/
outlined/
round/
sharp/
two-tone/
```

本项目仅允许使用：

```text
round
outlined
```

`filled` / `sharp` / `two-tone` 默认不启用。除非用户明确要求，否则不要引入。

不要自行替换成：

- Material Symbols
- Lucide
- Heroicons
- Font Awesome
- Emoji
- 自己绘制的近似图标

除非用户明确要求。

------

## 2. Icon Name Is Source of Truth

包内文件名即图标真名，统一使用 snake_case。

本项目中，用户给出的图标名称就是唯一真源。

例如：

```text
search
home
person
favorite
settings
arrow_back
chevron_right
psychology
visibility
close
receipt_long
```

必须使用该名称对应的文件：

```text
round/<name>.svg
```

不要因为你觉得另一个图标「更合适」而自行替换。

例如：

用户指定：

```text
favorite
```

不得自行换成：

```text
favorite_border
bookmark
heart
```

------

## 3. Prompt Convention

用户可能使用下面这种简写：

```text
material:search
material:home
material:person
material:favorite
material:receipt_long
```

`material:<name>` 一律表示：

```text
@material-design-icons/svg 下的 round/<name>.svg
```

如果同时要求线框 / 未选中形态，则表示：

```text
outlined/<name>.svg
```

例如：

```text
搜索按钮使用 material:search
```

必须寻找包内 `round/search.svg`。

------

## 4. Local Dependency Only

SelorMe 是面向国内用户的微信小程序。

禁止在运行时依赖：

```text
fonts.googleapis.com
fonts.gstatic.com
Google Fonts CDN
Google 在线字体
Google 在线 SVG
```

图标已作为 npm 依赖本地安装，由 webpack5 在构建期打包进小程序包。

运行中的微信小程序不得因为 Google 服务不可访问而导致图标丢失。

Google 只在开发阶段作为图标名称查询与视觉参考来源。

------

## 5. Import Rules

图标 SVG 必须从 npm 包按需引入，且必须经过统一 Icon 组件。

正确写法：

```ts
import search from '@material-design-icons/svg/round/search.svg'
import bookmarkOutlined from '@material-design-icons/svg/outlined/bookmark_border.svg'
```

禁止：

```ts
import * as icons from '@material-design-icons/svg/round'
```

或任何形式的全量导入。

原因：

```text
round/ 与 outlined/ 各含 2122 个图标文件
```

全量导入会严重破坏小程序包体积。

也禁止在业务页面中直接书写 SVG 文件路径。

图标资源只允许来自：

```text
1. 已安装的 @material-design-icons/svg
2. src/assets/icons/material/ 中已存在的项目自有资产
```

不要从以下渠道复制近似版本：

```text
非官方 Icon 网站
博客
SVG 聚合网站
随机 GitHub 仓库
```

不要根据路径规则虚构包内不存在的 SVG 文件名。
文件是否存在，必须实际检查 `node_modules/@material-design-icons/svg/<style>/` 目录。

构建行为（已实测）：

```text
SVG 资源在构建时被 webpack5 内联为 base64 data URI，
不会在 dist/ 中生成独立的 .svg 文件。
```

实际影响：

- 每个被 import 的图标都会以 base64 形式进入 JS bundle，直接占用包体积。
- registry 中已注册的图标无法被 tree-shaking 移除，注册即占体积。
- 因此「只注册项目真正用到的图标」是硬性要求，不是建议。
- 只有超过内联阈值的位图（PNG）才会作为独立文件输出，例如：

```text
dist/assets/figma/home-mbti.png
```

------

## 6. Local Custom Icon Directory

```text
src/assets/icons/material/
```

该目录仅用于存放**包外**的自定义图标资源。

当前实际内容为 categories 页使用的 10 个品牌色图标：

```text
category-auto-awesome.svg
category-badge.svg
category-business-center.svg
category-explore.svg
category-favorite.svg
category-groups.svg
category-palette.svg
category-psychology.svg
category-sentiment-satisfied.svg
category-spa.svg
```

注意：

- 这些文件**不属于** `@material-design-icons/svg`，是项目自有资产。
- 它们带有硬编码品牌紫：

```text
fill="#5A3BCE"
```

- 新增 Material 图标时，**不要**把包内 SVG 复制到该目录。
- 直接从 npm 包按需引入即可，本地目录只在需要包外自定义图形时才使用。
- 该目录内文件名统一 kebab-case，并在前缀标注用途（如 `category-`）。

------

## 7. Icon Registry

唯一注册表：

```text
src/components/Icon.tsx
```

结构：

```ts
const icons = { ... }          // 默认 round 形态
const outlinedIcons = { ... }  // outlined 覆盖形态

export type IconName = keyof typeof icons
export type IconVariant = 'round' | 'outlined'
```

规则：

- registry 的 key 使用 camelCase，是**语义别名**，不强制等于包内文件名。
- key 与包内 snake_case 文件名的对应关系写在 import 语句里，例如：

```ts
import receipt from '@material-design-icons/svg/round/receipt_long.svg'
import accountCircle from '@material-design-icons/svg/round/account_circle.svg'
import gridView from '@material-design-icons/svg/round/grid_view.svg'
```

- 一个 key 只对应一个文件，不允许同一个图标出现两个 key。
- 新增 key 前先确认包内确实存在该文件，不要凭名称规则虚构。
- 页面只能通过 `<Icon name="..." />` 使用，不关心真实文件路径。
- 需要 outlined 形态的图标，除了注册进 `icons`，还要在 `outlinedIcons` 中登记。

当前 `outlinedIcons` 已登记：

```text
receipt → outlined/receipt_long.svg
bookmark → outlined/bookmark_border.svg
calendar → outlined/calendar_month.svg
helpOutline → outlined/help_outline.svg
settings → outlined/settings.svg
psychology → outlined/psychology.svg
```

新增时沿用同样模式。

------

## 8. Icon Component Usage

```tsx
<Icon name="search" />

<Icon name="bookmark" variant="outlined" className="row-chevron" />

<Icon name="arrowBack" className="back" onClick={() => Taro.navigateBack()} />
```

参数：

```text
name      IconName（必填）
variant   'round' | 'outlined'，默认 'round'
className 追加类名
其余 props 透传给 Taro Image（src / mode 除外）
```

实现约束：

- 内部使用 `@tarojs/components` 的 `Image`，`mode='aspectFit'`。
- 基础类名固定为 `material-icon`。
- 不要为了图标功能引入新的图标库或依赖。

------

## 9. Size

设计稿是尺寸 Source of Truth。

如果用户或设计稿明确指定尺寸，按照设计稿使用。

没有明确尺寸时，默认视觉尺寸为：

```text
24
```

尺寸通过外层 `className` 控制，不要写死在内联样式里。

项目现有示例：

```text
.row-chevron   28px
.back          48px
.meta-icon     22px
```

不要因为源 SVG 是 24 × 24，就认为所有页面都必须显示 24px。

样式尺寸遵循第 11 节 Taro Size Units 的 2 倍源尺寸书写规则。

------

## 10. Color

`@material-design-icons/svg` 的 SVG **不包含 fill 属性**，默认渲染为纯黑。

因此颜色不由图标的 SVG 决定，必须来自 SelorMe Design Tokens 或当前设计稿。

当前小程序的着色方式是 **CSS filter**，项目内只有两套：

次要 / 灰态：

```css
filter: invert(51%) sepia(11%) saturate(552%) hue-rotate(212deg)
    brightness(89%) contrast(86%);
```

主色 / 激活态：

```css
filter: invert(27%) sepia(70%) saturate(2188%) hue-rotate(232deg)
    brightness(85%) contrast(89%);
```

规则：

- 复用图标时必须沿用这两套滤镜之一。
- 不要新增第三套随机滤镜数值。
- 不要通过修改 `node_modules` 内 SVG 的 fill 来着色，依赖升级会覆盖。
- 例外：`src/assets/icons/material/category-*.svg` 是项目自有资产，自带品牌紫。

如果未来切换着色方案（例如改用 mask 或 SVG symbol），必须先确认微信小程序兼容性，
再统一调整，不要在单个页面上单独尝试新方案。

------

## 11. Fill State And Selected State

`@material-design-icons/svg` **没有** `_fill1` 变体。

包内也不存在 Material Symbols 的：

```text
weight
grade
fill
optical-size
```

这些可变字体轴。

因此本项目**不使用 Fill 0 / Fill 1 的表述**。

选中态 / 填充态通过以下方式表达，按优先级顺序：

1. 切换 style 目录

```text
默认：round/<name>.svg
线框：outlined/<name>.svg
```

2. 使用语义配对的独立图标名

```text
bookmark        ↔  bookmark_border
favorite        ↔  favorite_border
```

规则：

- 不要用两个语义无关的图标模拟选中态。
- 不要在两个语义无关的图标之间切换来表示状态。
- 同一个图标可通过 CSS 滤镜变色表达激活态，此时不需要换图标。

------

## 12. Bottom Tab And Navigation Current Implementation

`src/custom-tab-bar/index.tsx` 当前实现：

```text
首页  → round/home.svg
分类  → round/grid_view.svg
我的  → round/account_circle.svg
```

选中态实现方式：

- 不切换图标，始终使用 round 形态。
- 通过 `.custom-tabbar-item.is-active` 切换 CSS 滤镜与文字颜色。
- 激活文字色：

```text
#5a3bce
```

对应样式文件：

```text
src/custom-tab-bar/index.scss
```

`src/components/Nav.tsx` 使用 `arrowBack`（`round/arrow_back.svg`）作为返回图标。

------

## 13. Icon Lookup Workflow

当用户提供：

```text
material:<icon-name>
```

时按照下面步骤处理：

```text
1. 检查 src/components/Icon.tsx 是否已注册该图标
↓
2. 已注册，直接复用
↓
3. 未注册，在 node_modules/@material-design-icons/svg/round/ 确认 <name>.svg 存在
↓
4. 不存在，停止，不要猜测
↓
5. 存在，在 Icon.tsx 中新增 import 并注册进 icons
↓
6. 如果需要线框形态，确认 outlined/<name>.svg 存在，注册进 outlinedIcons
↓
7. 在页面中通过 <Icon /> 使用
↓
8. 执行 npm run typecheck
↓
9. 执行 npm run build:weapp
```

优先复用本地依赖中已有的图标，不要重复下载或复制同一图标。

------

## 14. Unknown Icon Names

如果用户给出的名称在包内不存在：

不要自行猜测替代图标。

例如用户说：

```text
material:user_profile_magic
```

但包内 `round/user_profile_magic.svg` 不存在。

应明确指出：

```text
未找到名为 user_profile_magic 的图标。
```

然后可以列出最接近的包内名称供用户选择。

不要未经允许直接替换。

------

## 15. WeChat Mini Program Requirement

所有图标最终必须能够随微信小程序代码正常运行。

开发实现必须考虑：

- Taro 4 当前版本的资源处理方式
- weapp 编译结果
- 微信小程序 Image 组件资源加载
- 包体积
- SVG 资源在 weapp 中的实际兼容性

当前实现：

```text
src/components/Icon.tsx
↓ 按需 import @material-design-icons/svg/<style>/<name>.svg
↓ webpack5 内联为 base64 data URI
↓ @tarojs/components 的 Image 组件渲染，mode='aspectFit'
```

不要使用依赖 DOM 的 Web 专属 SVG 组件方案（如 SVG symbol sprite、React SVG 组件库、
`dangerouslySetInnerHTML` 注入 SVG 等）。

不要为了着色引入 CSS `mask` 或 `background-image` 方案而不做兼容性确认。

如果无法确定兼容性：

执行 weapp build，并标记：

```text
Needs WeChat DevTools verification
```

------

## 16. Prohibited

禁止：

- 使用 Emoji 代替图标
- 根据截图自己画一个近似图标
- 用户指定 Google Material Icons 后切换 Material Symbols / Lucide / Heroicons
- 在线加载 Google Fonts
- 在线加载 Google 在线 SVG
- 全量导入 `@material-design-icons/svg`
- 为一个图标安装新的大型依赖
- 重复保存同一个图标
- 修改包内官方 SVG 的 path 形状
- 修改包内官方 SVG 的 fill 颜色
- 自行改变指定图标名称
- 引入 `filled` / `sharp` / `two-tone` 目录而未经确认

------

## 17. Short Instruction Recognition

以后看到以下指令：

```text
material:search
```

直接理解为：

```text
使用 @material-design-icons/svg 的 round/search.svg。
如果需要线框形态，使用 outlined/search.svg。
优先复用 src/components/Icon.tsx 中已注册的图标，
未注册则按第 13 节流程新增注册。
最终不得依赖任何 Google 网络服务。
```
