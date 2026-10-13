# 小学趣味学习站实施计划

> 执行时先阅读 superpowers:executing-plans。本计划已获用户批准，采用 Native 顺序实施。
>
> 本计划及后续过程文档使用中文。代码标识符、文件名、命令和库名保留原文。

## 目标

构建可部署到 Cloudflare Pages 的静态学习站，面向二年级上学期人教版语文、数学第一和第二单元。每个单元由若干建议时长约 20 分钟的小游戏场次组成，练习题和配图原创，不托管教材 PDF、整页、插图或大段原文。

## 架构与技术栈

- Vite、React、TypeScript，构建为静态单页应用。
- 使用用户指定的 animal-island-vue 视觉风格；React 项目实际依赖同一作者的 animal-island-ui 组件库，按其官方文档导入 Button、Card 等组件及样式。
- 课程目录和数据文件按年级、学期、学科、单元分层；每个单元入口集中维护元数据与场次。
- 使用浏览器 History API 处理目录、单元和场次路径；使用 localStorage 保存本机完成进度，不建账号、不收集访客资料。
- 使用 Cloudflare Pages 静态托管，构建命令为 npm run build，输出目录为 dist；不使用 Functions 或独立 Worker。

## 实施约束

- 课程范围以二年级上学期语文、数学第一和第二单元为限。语文按人教版（统编教材）核对课文与单元，数学按人教版核对知识点。
- 教材仓库仅作为核对来源；练习题、解释和图形表达原创，不复制或托管教材 PDF、封面、整页、插图或大段课文。
- 课程路径和文件遵循“年级 → 学期 → 学科 → 单元 → 场次”。课程数据索引使用完整层级键，不能只用 unit-01 之类的单元编号。
- 每场包含 3–4 个短挑战，建议总时长约 20 分钟，不设倒计时、不强迫按顺序解锁。
- UI 采用暖纸色、圆角卡片、胶囊按钮和轻量图案，搭配少量原创星球、星轨、能量装饰。题目和答案始终优先于装饰。
- animal-island-vue 是 Vue 3 库，其 README 中的非商业说明与 LICENSE 文件中的 MIT 文本不一致；本项目沿用 React，并使用同作者的 React 版 animal-island-ui。第三方许可文字需随源码和网站构建产物分发。
- 将当前对话附带的四张图转制为四个原创风格的 1:1 卡通头像；页面以圆形呈现。仓库只收录衍生图，不收录原图，不显示真实姓名或其他个人资料。公开部署前核实头像的公开展示许可。
- 项目自有代码采用 PolyForm Noncommercial License 1.0.0。根目录当前没有 LICENSE；实施时加入官方许可全文，不编造版权主体或 Required Notice。
- 不新增自动化测试框架或自动化测试。通过构建检查和手动操作关键流程验证交付。

## 实施前重点检查

- 直接打开并刷新已开放的嵌套路径时，页面仍能正确显示；构建产物没有顶层 404.html，以保留 Cloudflare Pages SPA 回退。
- 明确标记为筹备中的课程显示筹备状态；完全未知的路径显示未找到页面，不生成虚假可玩的课程。
- localStorage 无效 JSON、版本不兼容或不可用时，应用不崩溃，也不显示虚假完成状态。
- 答错不能前进或领取完成奖励；提示、重试和快速重复点击不会跳过当前题。
- 排序和测量操作在窄屏下可用，并有键盘操作方式；所有交互控件显示焦点，减少动态效果偏好生效。

---

## Task 1: 任务一：搭建静态 React 项目并明确许可

**创建文件**

- package.json、package-lock.json、index.html、vite.config.ts、tsconfig.json、.node-version
- src/main.tsx、src/App.tsx、src/styles/global.css
- LICENSE、THIRD-PARTY-NOTICES.md、public/third-party-notices.txt

**步骤**

1. 初始化 Vite、React、TypeScript 项目，安装 React、React DOM、Vite、React 插件、TypeScript、React 类型声明，以及 animal-island-ui 和其 peer dependency classnames。执行时核对该库当前发布的包信息并生成锁文件，不猜测组件属性。
2. 在入口导入 animal-island-ui/style；把文档语言设为简体中文，建立可启动的最小 App。
3. 从 PolyForm 官方许可页面复制 Noncommercial License 1.0.0 正文到根目录 LICENSE，保持正文原样。只有项目已有明确的 Required Notice 时才一并保留，不新增虚构的主体信息。
4. 将 .node-version 固定为 Cloudflare Pages 当前默认兼容的 Node 22.16.0；Vite 8 要求 Node 20.19+ 或 22.12+。
5. 在 THIRD-PARTY-NOTICES.md 及 public/third-party-notices.txt 中加入 animal-island-ui 的作者、项目链接、MIT 全文和版权/许可声明；确保静态构建时文件会进入 dist。
6. 配置 dev、build、preview 命令。运行 npm run build，确认 dist/index.html 和第三方声明文件生成。

## Task 2: 任务二：定义课程类型并录入 12 场原创游戏

**创建文件**

- src/content/types.ts、src/content/curriculum.ts
- src/content/grade-2/term-1/chinese/unit-01/index.ts
- src/content/grade-2/term-1/chinese/unit-02/index.ts
- src/content/grade-2/term-1/math/unit-01/index.ts
- src/content/grade-2/term-1/math/unit-02/index.ts

**数据接口**

- SubjectId 为 chinese 或 math；CatalogStatus 为 active 或 comingSoon。
- ActivityDefinition 使用 kind 区分 choice、match、order、categorize、measurement、arithmetic。所有题型包含 id、prompt、hint、explanation；choice 保存 options 和 correctOptionId，match 保存 pairs，order 保存 items 和 correctOrder，categorize 保存 categories、items 和 categoryId，measurement 保存 objectLabel、targetLengthCm、minCm、maxCm，arithmetic 保存 expression、correctAnswer 和可选的 carryBorrowSteps。
- LearningSession 包含 id、title、durationMinutes（固定为 20）、objective 和 activities。
- CurriculumUnit 包含 id、subject、title、sourceTopics 和 sessions；sourceTopics 记录教材名称及课文/知识主题，不嵌入大段教材内容。
- CatalogGradeEntry、CatalogTermEntry、CatalogSubjectEntry、CatalogUnitEntry 组成分层目录；开放的单元项引用 curriculumUnitKey，筹备中项目不引用可玩的课程数据。
- curriculumUnitKey 使用 grade-2/term-1/chinese/unit-01 这样的完整层级键；curriculum.units 按此键索引，不得只用可能跨学科重复的 unit-01。

**步骤**

1. 为四个单元定义 TypeScript 类型和完整层级课程目录。二年级上学期语文和数学第一、第二单元标为开放；其他入口若列出则标为筹备中。
2. 录入语文第一单元三场：分别围绕《小蝌蚪找妈妈》《我是什么》《植物妈妈有办法》，串联口语表达、语文园地和童话阅读复习。
3. 录入语文第二单元三场：覆盖《场景歌》《树之歌》《拍手歌》《田家四季歌》和语文园地中的识字、量词、分类及四季词语。
4. 录入数学第一单元两场：厘米与米、单位选择、估测/测量和线段。
5. 录入数学第二单元四场：两位数加法、两位数减法、连加连减与混合运算、比较关系和应用题。
6. 每场安排 3–4 个短活动，题目与讲解使用原创例子，核对场次数依次为 3、3、2、4。

## Task 3: 任务三：实现目录、单元页和客户端路由

**创建文件**

- src/app/router.ts
- src/components/catalog/CourseCatalog.tsx
- src/components/catalog/UnitOverview.tsx
- src/components/catalog/CourseBreadcrumbs.tsx
- src/styles/catalog.css
- 修改 src/App.tsx

**步骤**

1. 定义课程目录、单元、场次、筹备中和未找到页面的路由类型；实现路径解析、路径生成、pushState 和 popstate 处理。
2. 支持首页 /、单元路径 /grade-2/term-1/chinese/unit-01 和场次路径 /grade-2/term-1/chinese/unit-01/session-01；路径层级与课程目录和面包屑一致。
3. 首页默认二年级上学期，可切换学科；只让开放课程进入单元和场次。
4. 单元页展示单元主题、课程来源、场次、建议时长和本机完成进度。
5. 未开放但已登记的目录显示“筹备中”；不认识的课程 ID 显示明确的未找到页面。
6. 构建后运行本地预览，直接打开一个已开放的嵌套单元和场次 URL，并刷新页面确认路由显示正确。

## Task 4: 任务四：实现通用小游戏流程

**创建文件**

- src/components/game/SessionPlayer.tsx
- src/components/game/ActivityRenderer.tsx
- src/components/game/ChoiceActivity.tsx
- src/components/game/MatchActivity.tsx
- src/components/game/OrderActivity.tsx
- src/components/game/CategorizeActivity.tsx
- src/components/game/ActivityFeedback.tsx
- src/styles/game.css

**步骤**

1. SessionPlayer 展示任务目标、建议时长、当前活动进度，并一次呈现一道题；不使用倒计时。
2. 实现单选与配对。配对采用依次选择两侧的方式，在触屏设备上不依赖拖放。
3. 实现排序和分类；提供按钮、点击或键盘操作方式，不能只支持拖动。
4. 为未作答、错误、已看提示和已答对状态提供简短反馈、解释、提示与重试。
5. 只有正确作答才能进入下一题；快速重复点击不应重复加分、跳题或提前结束。
6. 在浏览器中手动走一遍各类互动，检查答错、看提示、重试、答对和连续点击。

**组件接口**

- SessionPlayer 接收 session 和 onComplete；活动组件接收对应 ActivityDefinition 和 onSolved。
- onComplete 使用场次 ID；每道活动答对后只调用一次 onSolved。
- 反馈状态包含未作答、错误、已看提示和已答对。

## Task 5: 任务五：实现数学测量和运算活动

**创建文件**

- src/components/game/MeasurementActivity.tsx
- src/components/game/ArithmeticActivity.tsx
- 修改 src/components/game/ActivityRenderer.tsx、src/styles/game.css

**步骤**

1. 绘制标有厘米刻度的虚拟尺与待测物体；允许触屏/鼠标设置端点，也提供键盘方式；比较测量结果和题目答案。
2. 运算活动展示数位图示；在题目提供进位或退位步骤时呈现步骤讲解；通过大号选项或数字键盘输入答案。
3. 在统一题目反馈流程中接入测量和运算类型。
4. 手动完成厘米、线段、进位和退位代表题；在 320 像素宽度检查触控和键盘操作。

## Task 6: 任务六：保存本机进度和完成奖励

**创建文件**

- src/storage/progress.ts
- src/components/game/SessionSummary.tsx
- 修改 src/components/game/SessionPlayer.tsx、src/components/catalog/UnitOverview.tsx

**步骤**

1. 定义带 schemaVersion 的进度格式和完成场次 ID 列表。
2. 实现 localStorage 读取、保存和完成场次更新。无效 JSON、不兼容版本或浏览器存储不可用时，退回空的内存状态，不崩溃。
3. 仅在最后一个活动答对后标记完成。允许重玩，重复完成不重复增加奖励。
4. 完成页展示星章和友好反馈，单元页更新进度；不加入排行榜或惩罚性计分。
5. 手动完成一场并刷新，确认进度保留；再设置损坏的本机数据，确认页面恢复且没有虚假完成状态。

**进度接口**

- ProgressState 为包含 schemaVersion: 1 和 completedSessionIds 的对象。
- 提供 loadProgress、saveProgress 和 completeSession；单场完成记录只出现一次。

## Task 7: 任务七：应用 Animal Island 视觉并制作四个圆形头像

**创建文件**

- src/components/mascots/HeroGuide.tsx、src/components/mascots/CompanionAvatar.tsx
- src/styles/theme.css
- public/assets/companions/companion-01.webp 至 companion-04.webp
- 修改 src/styles/global.css、src/components/catalog/CourseCatalog.tsx、src/components/catalog/UnitOverview.tsx、src/components/game/SessionPlayer.tsx

**组件接口**

- HeroGuide 接收 mood（welcome、hint、celebrate）和 subject；CompanionAvatar 接收头像 ID、替代文本及展示尺寸。
- 头像文件使用固定 ID 映射，课程数据引用 ID，不在活动题目里写入图片路径。

**步骤**

1. 阅读 animal-island-ui 当前组件与设计文档，使用真实存在的 Card、Button 等组件和正确属性；遵循其样式导入要求。
2. 使用 image_gen 以当前对话附带的四张图为参考，分别生成原创科幻风格的 1:1 卡通头像；保留人物辨识度，避免复刻影视角色标志或标志性服装细节。仅将衍生图保存到 public/assets/companions，不保存附件原图。
3. 使用 CSS 将头像显示为圆形，并给每位伙伴一个不含真实姓名的代号/无障碍说明；在课程目录、提示和完成反馈中使用四个头像。
4. 建立主题变量：暖纸色与浅色卡片、清晰的深色正文、薄荷绿和活泼辅助色、圆角卡片和胶囊按钮；加入少量原创星球、星轨与能量装饰。
5. 使用大触控区域、明显键盘焦点和高可读文字；对 prefers-reduced-motion 降低或移除非必要动画。题目与答案不得被头像或装饰遮挡。
6. 手动预览目录和一场游戏，在 390、768、1440 像素宽度检查布局；确认窄屏没有裁切、重叠或横向滚动。

## Task 8: 任务八：补充中文使用说明并核对 Cloudflare Pages 交付

**修改文件**

- README.md

**步骤**

1. 用中文说明课程范围、目录层级、课程来源边界、依赖许可、头像素材处理、安装/本地预览命令和 PolyForm Noncommercial 1.0.0 许可范围。
2. 在中文 README 写明 Cloudflare Pages 设置：项目根目录为仓库根目录，构建命令 npm run build，输出目录 dist，不需要 Functions 或 Worker。
3. 确认 dist 内有 index.html 和 third-party-notices.txt，且没有顶层 404.html；保持 Pages 的 SPA 回退。
4. 重新运行 npm run build 和 git diff --check；本地预览直接访问深层场次路径，手动完成“目录 → 单元 → 场次 → 完成 → 刷新”流程。
5. 将验证边界写清楚：本机构建和预览不等于已部署到 Cloudflare；没有实际部署时不声称验证线上站点。

## 完成标准

- 目录和内容路径完整区分年级、学期、学科、单元和场次。
- 四个开放单元包含 3、3、2、4 场原创游戏，每场有 3–4 个互动挑战和约 20 分钟建议时长。
- animal-island-ui 组件实际用于界面；视觉保持小岛风格并加入适量原创科幻元素。
- 四个用户提供的头像转制后以圆形卡通学习伙伴出现；原图没有进入仓库。
- 答题反馈、提示、重试、键盘操作、窄屏交互和本机进度符合设计。
- 根目录包含 PolyForm Noncommercial License 1.0.0 正式文本；第三方 MIT 许可声明可在仓库和 dist 中找到；README 和过程文档为中文。
- npm run build 成功；Cloudflare Pages 可按文档配置部署。本地证据与远端部署证据分开陈述。
- git diff --check 通过；不新增自动化测试。
