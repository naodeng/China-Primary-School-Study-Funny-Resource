# 小学趣味学习站实施计划

> 本计划只记录首版 MVP，已由 2026-10-13-grade-2-full-curriculum-and-testing.md 取代。当前全量课程、难度、任务和自动化测试范围以新计划及 grade-2-full-curriculum-and-testing-design.md 为准；不得据本文件执行。

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
- 自动化测试和覆盖率要求已由扩展设计与实施计划更新；本句以上的 MVP 范围、场次数和验证步骤仅保留为历史记录。

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

- ProgressState 使用 schemaVersion: 2，包含 completedSessionIds 和可选学习起点；读取 schemaVersion: 1 时保留旧场次记录并迁移。
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

## 追加范围：主题切换、全年级成就星图与鼓励反馈

本追加范围对应设计文档中新确认的 12 星区成长路线。实施时沿用现有课程层级、localStorage 进度和 Animal Island 组件，不另建一套账号或奖励数据。

**涉及文件**

- src/theme/ThemeProvider.tsx、src/components/theme/ThemeSwitcher.tsx、index.html、src/styles/theme.css
- src/achievements/progress.ts、src/achievements/exploration.ts、src/components/achievements/AchievementDashboard.tsx
- 修改 App、目录、游戏流程、反馈与完成总结相关组件及样式

**步骤**

1. 增加跟随系统、浅色、深色三种主题；默认跟随系统，用户手动选择保存在当前设备并在刷新后保留。
2. 按设计文档登记一至六年级上下学期共 12 个星区及主题、视觉和单元节点意象。
3. 由年级、学期和课程目录数据生成对应星区的单元节点；二年级上学期按人教版预留语文 8 个、数学 9 个（含总复习）节点。只开放已有游戏内容的课程，其余节点灰显；未来学期没有核实的教材单元数时不预造节点。
4. 从单元内所有游戏场次的完成状态计算节点。完成整个单元后打勾并高亮；部分完成、筹备中或未接入内容保持灰显。场次 ID 使用完整层级路径，保证跨学期累计不串号。
5. 按累计完成的单元数发放“预备宇航员、月球开拓者、火星探险家、银河系舰长、宇宙终极探索官”头衔，升级门槛为 0、1、2、4、8 个单元；提供即时、温和、不比较排名的鼓励反馈。
6. 手动切换三种主题并刷新确认偏好保留；检查 12 个星区、当前单元数、完成/未完成状态和窄屏布局。完成情况仍只保存在当前设备。

## 完成标准

- 目录和内容路径完整区分年级、学期、学科、单元和场次。
- 四个开放单元包含 3、3、2、4 场原创游戏，每场有 3–4 个互动挑战和约 20 分钟建议时长。
- animal-island-ui 组件实际用于界面；视觉保持小岛风格并加入适量原创科幻元素。
- 四个用户提供的头像转制后以圆形卡通学习伙伴出现；原图没有进入仓库。
- 系统主题默认生效；用户可切换浅色/深色并在刷新后保留选择。
- 成就星图包括设计文档登记的 12 个学期星区；已接入的单元完成后打勾高亮，未完成内容置灰，头衔按 0、1、2、4、8 个单元累计升级。
- 答题反馈、提示、重试、键盘操作、窄屏交互和本机进度符合设计。
- 根目录包含 PolyForm Noncommercial License 1.0.0 正式文本；第三方 MIT 许可声明可在仓库和 dist 中找到；README 和过程文档为中文。
- npm run build 成功；Cloudflare Pages 可按文档配置部署。本地证据与远端部署证据分开陈述。
- 本计划已被全量课程扩展计划取代；测试与覆盖率按新计划执行。

## 追加范围：首页成就摘要、设置弹窗和学习起点

**涉及文件**

- src/achievements/position.ts、src/achievements/progress.ts、src/achievements/exploration.ts
- src/storage/progress.ts、src/app/router.ts、src/App.tsx
- src/components/catalog/CourseCatalog.tsx、src/components/achievements/AchievementSummary.tsx、src/components/achievements/AchievementPage.tsx、src/components/achievements/AchievementDashboard.tsx、src/components/settings/SettingsDialog.tsx
- src/styles/catalog.css、src/styles/theme.css、README.md、本文设计说明与实施计划

**步骤**

1. 将课程目录页的完整星图替换成当前用户的头衔、已点亮单元数和下一头衔进度摘要；添加 `/achievements` 页面展示详细星区、课程和场次记录。
2. 在首页顶部课程目录导航右侧添加设置入口。弹窗包含显示主题、成就详情入口，以及年级、学期和起始单元选择。
3. 将本地进度升级为 schemaVersion 2，保留旧版已完成场次数据，并新增可选学习起点。应用新起点时，重算所选位置之前的已登记课程，清除所选位置及之后的已完成场次。
4. 把学习起点应用到单元进度、星区节点与累计头衔。未来教材内容按年级、学期、单元位置继承该起点；未知学期不生成猜测的教材单元。
5. 在设置中说明应用起点会替换本地后续进度，明确数据只保存在当前浏览器。手动检查键盘和 Escape 关闭、主题选择、设置后刷新、成就导航及 390 像素窄屏布局。
6. 更新中文 README、设计说明、计划和项目 AGENTS.md。

**完成标准**

- 首页只展示当前用户的成就摘要；摘要和设置入口均可进入完整成就详情。
- 设置弹窗可调整跟随系统、浅色、深色主题，并能按年级、学期、单元应用新的本地学习起点。
- 起点之前所有已登记节点显示为完成，所选单元及之后重新开始；课程扩展后，新课程按起点自动计算。
- schemaVersion 1 的本地进度可无损读取；schemaVersion 2 保存主题之外的完成场次与学习起点。
- `npm run build`、`git diff --check` 通过；手动检查桌面、窄屏、主题、弹窗关闭和导航关键路径。
