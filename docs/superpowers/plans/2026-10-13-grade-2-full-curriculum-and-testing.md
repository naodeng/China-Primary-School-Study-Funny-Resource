# 小学趣味学习站全量课程扩展实施计划

> **执行要求：** 使用 superpowers:executing-plans Skill，按任务顺序 Native 实施。每项代码任务先写失败测试，再实现、验证并提交；不委派子代理。

**目标：** 将当前二年级上学期语文、数学第一、二单元扩展为用户最终裁定版次的二年级上下学期语文、数学和英语（一年级起点预备级）完整互动课程，并补齐自动化质量保障。

**架构：** 保持 React、Vite、TypeScript 静态单页应用。课程按年级、学期、学科、目录条目、难度、任务、场次和题目组织；纯模块承载课程校验、作答、反馈、进度和成就；学习数据只保存在本机，Cloudflare Pages 继续静态托管。

**技术栈：** Node.js 22.16.0、npm、React 19、TypeScript、Vite、animal-island-ui、Vitest、@vitest/coverage-v8、React Testing Library、jsdom、Playwright。

**设计规格：** docs/superpowers/specs/2026-10-13-grade-2-full-curriculum-and-testing-design.md

## 全局约束

- 用户最终裁定按人教社公开最新版编写。用户确认学校实际使用 TapXWorld 固定快照教材；该快照仅用于对照校用版本，不作为新版目录或课程内容的补充来源。Tasks 5–10 不得混版；最新版某册公开目录证据不足时，记录缺口，不用 TapXWorld 旧版猜补。
- 按用户要求纳入人教版英语一年级起点预备级；人教社说明一、二年级预备级供地方课程规划选用。产品包含英语，但没有学校课程材料时不声称特定学校实际开设。
- 覆盖二年级上下学期语文、数学、英语；正式单元、复习和综合实践均登记，并区分正式编号计数。
- 每个可玩条目有 basic、advanced、high 三档；基础至少 2 个按知识目标划分的任务，进阶和高阶各 1 个任务。任务可有多场，每场恰好 8 题，建议 20 分钟。
- 单元只在基础版所有任务的所有场次完成后点亮。进阶/高阶进度独立记录。
- 题目、提示、解释、反馈和配图原创；不复制教材 PDF、封面、扫描页、插图或大段原文。
- 配对答案按稳定 ID 判分；每次尝试打散、单次尝试中保持稳定、重试重新打散。
- 答对、答错从各自文案池随机选鼓励反馈，避免连续重复；错误不羞辱、不扣分、不误报正确。
- 旧版少题场次不迁移为新版完成状态；进度、主题和学习起点留在当前设备。
- 保留十二星区；裁定来源的版次/目录尚未核实的课程不开放或计入头衔。不得把 TapXWorld 旧快照描述为人教社当前最新版。
- 全局 lines/statements/functions/branches 覆盖率各至少 60%；指定核心纯逻辑模块四项均 100%，由测试命令和 CI 强制。
- E2E 用独立上下文和 127.0.0.1:4174 专用端口，禁止连接或清理用户当前 4173/5173 服务。
- 过程文档中文；保留 PolyForm Noncommercial License 1.0.0、动物岛 UI 第三方声明和现有头像素材边界。

## Review Focus

- TapXWorld 与人教社公开最新版不一致：库存记录学校现用文件及差异；新版作为本项目唯一课程依据，不把旧快照称为最新版或用于补缺。
- 人教社最新版书目/目录证据不足：清单标注待核，不猜 ISBN、目录或课文；仍可完成已有权威来源支持的其他册次。
- 人教版英语二年级属于地方课程预备级：按用户要求纳入产品，但将“出版社有此预备级”“用户希望有英语内容”和“学校实际开设”分开记录。
- 正式单元、总复习、英语 Revision、综合实践的计数边界：校验器和成就测试覆盖计入/不计入。
- 旧进度产生虚假完成：迁移测试验证旧场次隔离、有效学习起点保留。
- 配对答案重新渲染时洗牌或仍完全同序：固定随机源测试首次排序、渲染稳定和重试。
- 答错使用答对文案或连续责备：纯函数和组件测试验证状态隔离、文案变化和重试。

---

### Task 1：建立单元、组件与 E2E 测试基础

**文件：** 修改 package.json、package-lock.json、.gitignore；创建 vitest.config.ts、playwright.config.ts、src/test/setup.ts、src/App.test.tsx、tests/e2e/smoke.spec.ts；修改 AGENTS.md 和原设计文档。Vitest 配置合并现有 Vite 配置，不修改 vite.config.ts。

**接口：** npm scripts 提供 test:unit、test:coverage、test:e2e。Vitest 用 jsdom；src/test/setup.ts 模拟 matchMedia 和 scrollTo。Playwright 固定 127.0.0.1:4174 且 reuseExistingServer=false。覆盖率门槛留到最终任务启用。

- [ ] 安装并锁定 Vitest、V8 coverage、React Testing Library、user-event、jest-dom、jsdom、Playwright；核对与当前 Node、Vite、React 版本兼容。
- [ ] 测试名分别为 renders catalog and opens settings、loads catalog and refreshes a nested unit；断言目录标题、设置 dialog 可见和刷新后单元标题仍在。
- [ ] 配置测试运行器、setup 与 npm scripts。
- [ ] 在 AGENTS.md 增加测试命令；原设计文档标记新规格为当前范围并删除不新增自动化测试的旧约定。
- [ ] 运行单元、冒烟 E2E 和构建；精确暂存后以 Conventional Commits 提交。

### Task 2：核对双来源版次并裁定目录清单

**文件：** 创建 docs/curriculum/grade-2-textbook-inventory.md。

**接口：** 本任务只完成来源核对和目录映射；课程元数据类型在 Task 3 统一定义，未知书目信息标为未核实。

- [ ] 核对六册 TapXWorld 固定快照文件，记录用户确认其为学校实际教材来源，并核对人教社公开最新版；本项目课程采用人教社最新版，TapX 只作学校旧版差异对照。
- [ ] 区分编号单元、review、integrated-practice 并记录课程 key 映射。
- [ ] 英语保留为用户要求的课程范围，按人教版一年级起点预备级标注；学校是否开设未知。
- [ ] Tasks 5–10 均以人教社公开最新版为唯一教材内容来源；逐册记录版权页和目录核验结果，公开版次或目录信息不足的册次保持待核、不从 TapXWorld 旧版补齐。
- [ ] 审核双来源资料的完整性和可追溯性；运行单元测试与 diff 检查后提交。

### Task 3：定义课程层级、元数据和完整性校验

**文件：** 修改 src/content/types.ts、src/content/curriculum.ts、四个现有 unit-01/unit-02 文件，以及 src/app/router.ts、src/achievements/{exploration,position,progress}.ts、src/components/achievements/AchievementDashboard.tsx、src/components/catalog/UnitOverview.tsx 这些旧 session 消费方；创建 src/content/textbooks.ts、src/content/sessionUtils.ts、src/content/sessionUtils.test.ts、src/content/validateCurriculum.ts、src/content/validateCurriculum.test.ts、src/content/curriculum.test.ts。

**接口：** SubjectId 加 english；增加 Difficulty、CatalogEntryType、TextbookEdition（id、subject、grade、term、series、edition、printing、isbn、sourceUrl、checkedAt、tapxCommit、verificationStatus）、LearningTask、DifficultyTrack。目录条目只有在对应所选教材版本 verificationStatus 为 verified 时才能 active。课程、任务、场次的 canonical ID 均为完整层级 key；URL 使用父级内的末段 slug。CurriculumUnit 含目录类型、正式编号、achievementEligible、版次 ID、sourceTopics 和三档内容。validateCurriculum(curriculum: Curriculum): ValidationIssue[]。LearningSession.activities 必须为 8 道题。

- [ ] 先写并运行失败测试 requiresAllDifficulties、requiresTwoBasicTasks、requiresOneAdvancedAndHighTask、rejectsEmptyTasks、requiresEightQuestions、rejectsDuplicateIds、rejectsInvalidAnswerReferences、validatesAchievementEligibility、requiresVerifiedEditionForActiveEntry；断言各自问题路径和稳定错误码。
- [ ] 实现类型和无静默修正的校验器。
- [ ] 将现有四个课程文件迁入三档任务结构；未核实版次的旧场次只作为待核基础任务保留，并将目录标为 comingSoon，不作为当前校用课程或成就节点。用 sessionUtils 为旧组件统一提供基础任务场次视图，避免在课程类型上保留重复的顶层 sessions 字段。
- [ ] 测试所有旧开放内容结构，运行 validator、build，修正后提交。

### Task 4：升级路由、目录和任务入口

**文件：** 修改 src/app/router.ts、src/App.tsx、src/components/catalog/CourseCatalog.tsx、src/components/catalog/UnitOverview.tsx、src/components/catalog/CourseBreadcrumbs.tsx、src/styles/catalog.css、src/styles/theme.css；创建 src/app/router.test.ts、src/components/catalog/CourseCatalog.test.tsx、src/components/catalog/UnitOverview.test.tsx。

**接口：** AppRoute 加 task 和含 difficulty/task/session 的 session 路由。getTaskPath(unitKey: string, difficulty: Difficulty, taskId: string): string 与 getSessionPath(unitKey: string, difficulty: Difficulty, taskId: string, sessionId: string): string 使用完整 ID 的末段 slug 生成路径。保留单元 URL，并把旧 /unit/session-NN 按序号映射到基础版对应场次。

- [ ] 先写 router.test：resolveRoute 解析主页/单元/任务/场次；拒绝未知学科与非法 slug；筹备中和未知分流；旧 session 路径按序号映射基础版场次；popstate 更新页面。逐例断言 route.kind 与层级 key。
- [ ] 实现规范化路径、路由解析和浏览器前进/后退。
- [ ] 单元页展示基础多任务、进阶/高阶单任务、目标、场次和任务级进度。
- [ ] 验证键盘、窄屏及现有设置入口；运行对应测试和构建后提交。

### Task 5：录入二年级上学期语文

**文件：** src/content/grade-2/term-1/chinese/ 下所有单元、review、实践入口；修改 curriculum registry、数据测试和教材清单。

- [ ] 先在 curriculum.test 写 listsAllVerifiedTerm1ChineseEntries，依据教材清单断言每个上册条目均存在且类型/编号正确；运行测试确认缺失条目时失败。
- [ ] 依据人教社 2025 修订版二年级语文上册可核实的官方目录和语文要素逐条录入正式单元、复习、实践；不得把 TapXWorld 旧版的变更课文录入新版。
- [ ] 每条基础至少两个知识目标明确的任务，进阶/高阶各一个；场次可拆分且各 8 题。registry 数据测试以 it.each 遍历该册所有条目，断言正式编号顺序、任务数和每场题数。
- [ ] 原创题目适龄、答案正确，不复制课文原句或插图。
- [ ] 运行课程结构和目录映射测试后提交。

### Task 6：录入二年级下学期语文

**文件：** src/content/grade-2/term-2/chinese/ 下所有单元、review、实践入口；修改 registry、数据测试和教材清单。

- [ ] 先写 listsAllVerifiedTerm2ChineseEntries 并断言目录清单与 registry 一一对应；运行确认缺失项时失败。
- [ ] 按人教社 2025 修订版二年级语文下册官方可核实目录录入；修订版目录证据不完整时先标注缺项，禁止从 TapXWorld 旧版直接补全。
- [ ] 每条符合三档任务结构和每场 8 题；校对语言和答案。目录映射测试断言不存在缺失或多余条目，validator 断言每个任务至少一场。
- [ ] 运行 validator、语文数据测试后提交。

### Task 7：录入二年级上学期数学

**文件：** src/content/grade-2/term-1/math/ 下所有单元、review、实践入口；修改 registry、数据测试和教材清单。

- [ ] 先写 listsAllVerifiedTerm1MathEntries，断言正式编号、总复习及实践类型符合教材清单；运行确认缺项时报错。
- [ ] 按人教社公开最新版二年级上册数学目录录入，并区分编号单元、复习与综合实践；核对 ISBN/版次和官方目录，不用 TapXWorld 旧版代替新版证据。
- [ ] 每条提供基础至少两任务、进阶/高阶各一任务，每场八题；按知识点选用题型。数据测试遍历全部 math 条目，断言任务结构、八题长度、测量范围和算术答案。
- [ ] 对运算和测量答案增加专项断言；运行测试后提交。

### Task 8：录入二年级下学期数学

**文件：** src/content/grade-2/term-2/math/ 下所有条目；修改 registry、数据测试和教材清单。

- [ ] 先写 listsAllVerifiedTerm2MathEntries 并断言清单/registry 一一对应、正式编号连续；运行确认缺项时失败。
- [ ] 按人教社公开最新版二年级下册数学目录录入全部条目；目录未核实时将对应条目标为待核，不用 TapXWorld 旧版目录补齐。
- [ ] 满足三档、任务和八题规则，核验运算步骤及答案。新增下册答案检查，逐题断言解释步骤得到 correctAnswer。
- [ ] 运行全量 validator 和数学测试后提交。

### Task 9：录入二年级上学期英语（一年级起点预备级）

**文件：** src/content/grade-2/term-1/english/ 下全部语言单元和复习入口；修改 registry、数据测试和教材清单。

- [ ] 先写 listsAllVerifiedTerm1EnglishEntries，断言语言单元与 Revision 分类符合教材清单；运行确认缺项时失败。
- [ ] 按人教社最新公开的一年级起点二年级预备级学生用书目录录入上册内容；若人教社未公开该册完整目录，记录缺口并保持待核，不用 TapXWorld 旧版代替。
- [ ] 正确区分编号单元和未编号 Revision；基础多任务、进阶/高阶各单任务、每场八题。数据测试断言 Revision 的 achievementEligible=false 且不占正式单元编号。
- [ ] 检查英文词汇、指令、语法和答案适龄准确；运行测试后提交。

### Task 10：录入二年级下学期英语

**文件：** src/content/grade-2/term-2/english/ 下全部语言单元、复习和实践入口；修改 registry、数据测试和教材清单。

- [ ] 先写 listsAllVerifiedTerm2EnglishEntries 并断言 registry 与下册清单一一对应；运行确认缺项时失败。
- [ ] 按人教社最新公开的一年级起点二年级预备级学生用书目录录入下册内容；没有可核实目录时不得用 TapXWorld 旧目录伪装成新版。
- [ ] 满足任务、场次和八题规则，复核英文内容。下册测试同样校验 Revision/实践计数及全部题目引用。
- [ ] 运行全量课程 validator 和英语数据测试后提交。

### Task 11：实现判题、配对打散和随机鼓励反馈

**文件：** 创建 src/learning/answers.ts、matching.ts、feedback.ts、session.ts 及同名 .test.ts；修改 src/components/game/ActivityFeedback.tsx、ActivityRenderer.tsx、MatchActivity.tsx、SessionPlayer.tsx、SessionSummary.tsx；创建 ActivityFeedback.test.tsx、MatchActivity.test.tsx、SessionPlayer.test.tsx。

**接口：** FeedbackStatus = correct | incorrect；selectFeedbackMessage(status: FeedbackStatus, previousMessage: string | null, random: () => number = Math.random): string；shuffleMatchAnswers(pairs: readonly MatchPair[], random: () => number = Math.random): MatchPair[]；submitAnswer(activity: ActivityDefinition, answer: unknown): boolean。至少两组配对时保证右侧首轮不与左列完全同序。

- [ ] 在 answers.test、feedback.test、matching.test、session.test 中写 tests: handlesCorrectAndIncorrectAnswerForEachKind、selectsOnlyStatusMessages、avoidsPreviousMessage、shufflesMatchAnswers、fallsBackFromIdentityOrder、completesOnlyAfterLastCorrectAnswer；为六种题型逐一断言正确与错误答案，固定 random=0 和接近 1 验证选择边界。
- [ ] 实现纯函数，组件中不散落 Math.random 和判题分支。
- [ ] 每次尝试只洗牌一次，重试重洗；答错允许提示和重试，不允许误报或跳题。
- [ ] 八题进度、最后一题完成、重复点击保护和鼓励反馈写组件测试；核心学习模块达到四项 100% 后提交。

### Task 12：升级进度、成就、学习起点和主题

**文件：** 修改 src/storage/progress.ts、src/achievements/position.ts、src/achievements/progress.ts、src/achievements/exploration.ts、src/theme/ThemeProvider.tsx、src/App.tsx、src/components/settings/SettingsDialog.tsx、src/components/catalog/CourseCatalog.tsx、src/components/achievements/AchievementSummary.tsx、AchievementPage.tsx、AchievementDashboard.tsx；创建 progress/achievement/theme 模块测试及相应组件测试。

**接口：** ProgressState 使用 schemaVersion: 3，隔离旧版完成 ID 并保留有效 learningStart。src/achievements/progress.ts 导出 isCurriculumUnitComplete(unit: CurriculumUnit, ids: readonly string[]): boolean，仅在基础全部任务/场次完成时返回 true；getTaskProgress(task: LearningTask, ids: readonly string[]): { completedSessionCount: number; totalSessionCount: number; completed: boolean }。学习起点按正式单元位置计算，不计 review/practice。

- [ ] 在 progress.test 写 migratesV1AndV2PreservingStart、ignoresLegacyCompletionsForNewSessions、fallsBackOnCorruptOrUnavailableStorage、completeSessionIsIdempotent、setLearningStartReplacesLaterProgress；断言返回状态和 localStorage 内容。
- [ ] 在 achievement tests 写 doesNotCompleteUnitWhenBasicTaskIsPartial、completesUnitAfterAllBasicSessions、ignoresAdvancedAndHighForUnitCompletion、excludesUnnumberedReviewFromRankCount、mapsOnlyVerifiedCurriculum、unlocksRanksAt1_2_4_8；断言节点状态和正式单元数。
- [ ] 实现新 schema 和成就纯函数；只根据校验过的课程目录生成节点，不虚构其他年级单元。
- [ ] 主题解析提取纯函数；测试首次 system、手动 light/dark、恢复系统和存储不可用。
- [ ] 更新设置页仅允许登记位置，说明替换影响；组件测试验证进度与主题交互；核心模块覆盖率达标后提交。

### Task 13：完成 E2E、覆盖率门槛、CI 和 PR 交付

**文件：** 修改 vitest.config.ts、package.json、README.md、AGENTS.md 和 UI 样式；创建 tests/e2e/catalog.spec.ts、learning-flow.spec.ts、settings-achievements.spec.ts、.github/workflows/quality.yml。

- [ ] 配置 coverage 显式纳入所有 src TS/TSX；全局四项至少 60%。下列每个文件分别设置 lines/statements/functions/branches=100%：src/app/router.ts、src/content/curriculum.ts、src/content/validateCurriculum.ts、src/learning/answers.ts、src/learning/matching.ts、src/learning/feedback.ts、src/learning/session.ts、src/storage/progress.ts、src/achievements/position.ts、src/achievements/progress.ts、src/achievements/exploration.ts、src/theme/themePreferences.ts。
- [ ] 在 catalog.spec 写rendersEveryVerifiedCourseEntry、opensEachTermAndSubject、refreshesNestedCourseRoutes；在 learning-flow.spec 写completesTwoBasicTasksAndOneTaskPerHigherTier、showsEightQuestionProgress、shufflesMatchOptionsAfterRetry、showsStateSpecificEncouragement；在 settings-achievements.spec 写persistsThemeAndStartPosition、updatesAchievementAfterBasicCompletion。断言标题、题数、状态和持久化值。
- [ ] E2E 覆盖所有题型代表流程、错误/提示/重试/正确反馈、配对排序、进度刷新、成就门槛、主题、学习起点、键盘、窄屏、reduced motion、未知和筹备中页面；用 page.addInitScript 控制随机源，断言呈现文案属于对应状态池。
- [ ] 建立 GitHub Actions：Node 22.16.0、npm ci、build、coverage、Playwright；失败时上传报告。
- [ ] 更新中文 README、AGENTS.md 和初始设计文档，说明课程版次依据、命令、隐私、许可和 Cloudflare Pages 配置。
- [ ] 运行 npm run test:unit、npm run test:coverage、npm run test:e2e、npm run build、git diff --check，并手动查看桌面/窄屏、浅/深色、键盘焦点和减少动态效果。
- [ ] 检查状态和差异，仅暂存本任务范围；提交并推送 codex/primary-school-study，更新既有 main 目标 PR。不执行正式 Cloudflare 部署。

## 完成标准

- 按用户最终裁定的人教社公开最新版完成二年级上下学期语文、数学、英语课程；六册来源记录完整，任何待核目录均不以旧版猜补。
- 每条至少 4 个任务（基础至少 2 个，进阶/高阶各 1 个），每任务至少一场；最小课程规模为 4 场、32 题，每场恰好八题。
- 配对题不泄露答案顺序；答对/答错文案随机变化且保持鼓励性。
- 基础全部任务完成后才点亮单元；迁移不造成虚假完成。
- 全局四项覆盖率至少 60%，核心模块四项 100%；单元、组件、E2E、构建及差异检查通过。
- 未核实版次或未执行的线上部署在 PR 和汇报中如实标注。
