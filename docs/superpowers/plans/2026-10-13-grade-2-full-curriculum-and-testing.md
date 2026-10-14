# 小学趣味学习站全量课程扩展实施计划

> **执行要求：** 使用 superpowers:executing-plans Skill，按任务顺序 Native 实施。每项代码任务先写失败测试，再实现、验证并提交；不委派子代理。

**目标：** 将当前二年级上学期语文、数学第一、二单元扩展为用户最终裁定版次的二年级上下学期语文、数学和英语（一年级起点预备级）完整互动课程，并补齐自动化质量保障。

**架构：** 保持 React、Vite、TypeScript 静态单页应用。课程按年级、学期、学科、目录条目、难度、任务、场次和题目组织；纯模块承载课程校验、作答、反馈、进度和成就；学习数据只保存在本机，Cloudflare Pages 继续静态托管。

**技术栈：** Node.js 22.16.0、npm、React 19、TypeScript、Vite、animal-island-ui、Vitest、@vitest/coverage-v8、React Testing Library、jsdom、Playwright。

**设计规格：** docs/superpowers/specs/2026-10-13-grade-2-full-curriculum-and-testing-design.md

## 全局约束

- 用户最新裁定按逐册来源处理：优先采用可完整核实的人教社公开最新版；找不到完整新版学生书或目录时，使用 TapXWorld 固定快照回退。一个册次不混用两个版本；元数据记录 `sourceKind`、精确来源、TapX 提交号、回退原因、人教社新版证据及可核实版次。未知 ISBN/印次留空；不得把回退版称为最新版。
- 按用户要求纳入人教版英语一年级起点预备级；人教社说明一、二年级预备级供地方课程规划选用。产品包含英语，但没有学校课程材料时不声称特定学校实际开设。
- 覆盖二年级上下学期语文、数学、英语；正式单元、复习和综合实践均登记，并区分正式编号计数。
- 每个可玩条目有 basic、advanced、high 三档；基础至少 2 个按知识目标划分的任务，进阶和高阶各 1 个任务。任务可有多场，每场恰好 8 题，建议 20 分钟。
- 单元只在基础版所有任务的所有场次完成后点亮。进阶/高阶进度独立记录。
- 题目、提示、解释、反馈和配图原创；不复制教材 PDF、封面、扫描页、插图或大段原文。
- 配对答案按稳定 ID 判分；每次尝试打散、单次尝试中保持稳定、重试重新打散。
- 答对、答错从各自文案池随机选鼓励反馈，避免连续重复；错误不羞辱、不扣分、不误报正确。
- 用户提供的五段 MP3 作为本地素材；语音默认开启并记住设备偏好，关闭后答题语音与点击音全部停止/静音。普通答对、连续答对、答错、第 8 题全对和普通交互分别播放对应素材；最终全对音优先于该题连续答对音，播放失败不影响学习。
- 旧版少题场次不迁移为新版完成状态；进度、主题和学习起点留在当前设备。
- 保留十二星区；所选来源、目录和原创课程尚未核实的课程不开放或计入头衔。不得把 TapXWorld 回退快照描述为人教社当前最新版。
- 全局 lines/statements/functions/branches 覆盖率各至少 60%；指定核心纯逻辑模块四项均 100%，由测试命令和 CI 强制。
- E2E 用独立上下文和 127.0.0.1:4174 专用端口，禁止连接或清理用户当前 4173/5173 服务。
- 过程文档中文；保留 PolyForm Noncommercial License 1.0.0、动物岛 UI 第三方声明和现有头像素材边界。

## Review Focus

- TapXWorld 与人教社公开最新版不一致：优先采用完整可核实的新版；找不到时依用户最新授权使用 TapX 回退，并逐册记录差异，不把回退快照称为最新版。
- 完整新版学生书/目录证据不足：使用同一 TapX 文件的完整目录及知识范围，不跨版拼接；未知 ISBN、印次留空，不能由教师用书或文件日期推断。
- 人教版英语二年级属于地方课程预备级：按用户要求纳入产品，但将“出版社有此预备级”“用户希望有英语内容”和“学校实际开设”分开记录。
- 正式单元、总复习、英语 Revision、综合实践的计数边界：校验器和成就测试覆盖计入/不计入。
- 旧进度产生虚假完成：迁移测试验证旧场次隔离、有效学习起点保留。
- 配对答案重新渲染时洗牌或仍完全同序：固定随机源测试首次排序、渲染稳定和重试。
- 答错使用答对文案或连续责备：纯函数和组件测试验证状态隔离、文案变化和重试。
- 答题语音状态错配或静音开关遗漏：纯函数、设置组件和 E2E 验证正确、连续正确、答错、本场全对、点击和关闭后的静音行为。

---

### Task 1：建立单元、组件与 E2E 测试基础

**文件：** 修改 package.json、package-lock.json、.gitignore；创建 vitest.config.ts、playwright.config.ts、src/test/setup.ts、src/App.test.tsx、tests/e2e/smoke.spec.ts；修改 AGENTS.md 和原设计文档。Vitest 配置合并现有 Vite 配置，不修改 vite.config.ts。

**接口：** npm scripts 提供 test:unit、test:coverage、test:e2e。Vitest 用 jsdom；src/test/setup.ts 模拟 matchMedia 和 scrollTo。Playwright 固定 127.0.0.1:4174 且 reuseExistingServer=false。覆盖率门槛留到最终任务启用。

- [x] 安装并锁定 Vitest、V8 coverage、React Testing Library、user-event、jest-dom、jsdom、Playwright；核对与当前 Node、Vite、React 版本兼容。
- [x] 测试名分别为 renders catalog and opens settings、loads catalog and refreshes a nested unit；断言目录标题、设置 dialog 可见和刷新后单元标题仍在。
- [x] 配置测试运行器、setup 与 npm scripts。
- [x] 在 AGENTS.md 增加测试命令；原设计文档标记新规格为当前范围并删除不新增自动化测试的旧约定。
- [x] 运行单元、冒烟 E2E 和构建；精确暂存后以 Conventional Commits 提交。

### Task 2：核对双来源版次并裁定目录清单

**文件：** 创建 docs/curriculum/grade-2-textbook-inventory.md。

**接口：** 本任务完成六册来源核对、TapX 快照回退裁定和目录映射；Task 3 的课程元数据记录来源类型、精确文件、固定提交号、PEP 新版证据和回退原因。未知书目信息留空。

- [x] 核对六册 TapXWorld 固定快照文件及版权页/目录；逐册检查人教社公开资料能否提供完整最新版学生书和目录。记录用户确认的校用快照及出版社已知新版信息。
- [x] 区分编号单元、review、integrated-practice 并记录课程 key 映射。
- [x] 英语保留为用户要求的课程范围，按人教版一年级起点预备级标注；学校是否开设未知。
- [x] 找不到完整人教社最新版学生书或目录的册次，依用户授权采用 TapX 固定快照回退；记录 sourceKind、精确 PDF、commit、回退原因及可核实版次，不跨版本拼接，未知 ISBN/印次不猜。
- [x] 审核双来源资料的完整性和可追溯性；运行单元测试与 diff 检查后提交。

### Task 3：定义课程层级、元数据和完整性校验

**文件：** 修改 src/content/types.ts、src/content/curriculum.ts、四个现有 unit-01/unit-02 文件，以及 src/app/router.ts、src/achievements/{exploration,position,progress}.ts、src/components/achievements/AchievementDashboard.tsx、src/components/catalog/UnitOverview.tsx 这些旧 session 消费方；创建 src/content/textbooks.ts、src/content/sessionUtils.ts、src/content/sessionUtils.test.ts、src/content/validateCurriculum.ts、src/content/validateCurriculum.test.ts、src/content/curriculum.test.ts。

**接口：** SubjectId 加 english；增加 Difficulty、CatalogEntryType、TextbookEdition（id、subject、grade、term、series、edition、printing、isbn、sourceKind、sourceUrl、latestPepEvidenceUrl、fallbackReason、checkedAt、tapxCommit、verificationStatus、可选 schoolOfferingStatus）、LearningTask、DifficultyTrack。`sourceKind` 仅为 `pep-latest` 或 `tapx-fallback`；回退版本必须有精确来源和原因。英语预备级是否由学校开设单独记录为已确认/待确认，不能从出版社版本信息推断。目录条目只有在对应所选教材版本及课程内容 verificationStatus 为 verified 时才能 active。课程、任务、场次的 canonical ID 均为完整层级 key；URL 使用父级内的末段 slug。CurriculumUnit 含目录类型、正式编号、achievementEligible、版次 ID、sourceTopics 和三档内容。validateCurriculum(curriculum: Curriculum): ValidationIssue[]。LearningSession.activities 必须为 8 道题。

- [x] 先写并运行失败测试 requiresAllDifficulties、requiresTwoBasicTasks、requiresOneAdvancedAndHighTask、rejectsEmptyTasks、requiresEightQuestions、rejectsDuplicateIds、rejectsInvalidAnswerReferences、validatesAchievementEligibility、requiresVerifiedEditionForActiveEntry、validatesTapxFallbackMetadata；断言各自问题路径和稳定错误码。
- [x] 实现类型和无静默修正的校验器。
- [x] 将现有四个课程文件迁入三档任务结构；选定 TapX 回退版后，旧场次仅作为待复核的迁移输入，不得在八题、三档任务和全册目录核对通过前开放或计入成就。用 sessionUtils 为旧组件统一提供基础任务场次视图，避免在课程类型上保留重复的顶层 sessions 字段。
- [x] 在 UnitOverview 显示当前课程来源说明；组件测试检查其与 PEP/TapX 来源字段相符，TapX 回退版不显示最新版标签。
- [x] 测试所有旧开放内容结构，运行 validator、build，修正后提交。

### Task 4：升级路由、目录和任务入口

**文件：** 修改 src/app/router.ts、src/App.tsx、src/components/catalog/CourseCatalog.tsx、src/components/catalog/UnitOverview.tsx、src/components/catalog/CourseBreadcrumbs.tsx、src/styles/catalog.css、src/styles/theme.css；创建 src/app/router.test.ts、src/components/catalog/CourseCatalog.test.tsx、src/components/catalog/UnitOverview.test.tsx。

**接口：** AppRoute 加 task 和含 difficulty/task/session 的 session 路由。getTaskPath(unitKey: string, difficulty: Difficulty, taskId: string): string 与 getSessionPath(unitKey: string, difficulty: Difficulty, taskId: string, sessionId: string): string 使用完整 ID 的末段 slug 生成路径。保留单元 URL，并把旧 /unit/session-NN 按序号映射到基础版对应场次。

- [x] 先写 router.test：resolveRoute 解析主页/单元/任务/场次；拒绝未知学科与非法 slug；筹备中和未知分流；旧 session 路径按序号映射基础版场次；popstate 更新页面。逐例断言 route.kind 与层级 key。
- [x] 实现规范化路径、路由解析和浏览器前进/后退。
- [x] 单元页展示基础多任务、进阶/高阶单任务、目标、场次和任务级进度。
- [x] 验证键盘、窄屏及现有设置入口；运行对应测试和构建后提交。

### Task 5：录入二年级上学期语文

**文件：** src/content/grade-2/term-1/chinese/ 下所有单元、review、实践入口；修改 curriculum registry、数据测试和教材清单。

- [x] 先在 curriculum.test 写 listsAllVerifiedTerm1ChineseEntries，依据教材清单断言每个上册条目均存在且类型/编号正确；运行测试确认缺失条目时失败。
- [x] 本册完整 2025 修订版学生书及目录无法核实，按用户授权依据 TapX 固定快照上册目录和知识范围录入正式单元、复习及实践；标明不是 2025 修订版，不混入新版新增或调整内容。
- [x] 每条基础至少两个知识目标明确的任务，进阶/高阶各一个；场次可拆分且各 8 题。registry 数据测试以 it.each 遍历该册所有条目，断言正式编号顺序、任务数和每场题数。
- [x] 原创题目适龄、答案正确，不复制课文原句或插图。
- [x] 运行课程结构和目录映射测试后提交。

### Task 6：录入二年级下学期语文

**文件：** src/content/grade-2/term-2/chinese/ 下所有单元、review、实践入口；修改 registry、数据测试和教材清单。

- [x] 先写 listsAllVerifiedTerm2ChineseEntries 并断言目录清单与 registry 一一对应；运行确认缺失项时失败。
- [x] 本册完整 2025 修订版学生书及目录无法核实，按用户授权依据 TapX 固定快照下册目录和知识范围录入；记录修订说明已知差异，不将回退版冒充修订版。
- [x] 每条符合三档任务结构和每场 8 题；校对语言和答案。目录映射测试断言不存在缺失或多余条目，validator 断言每个任务至少一场。
- [x] 运行 validator、语文数据测试后提交。

### Task 7：录入二年级上学期数学

**文件：** src/content/grade-2/term-1/math/ 下所有单元、review、实践入口；修改 registry、数据测试和教材清单。

- [x] 先写 `listsAllVerifiedTerm1MathEntries`，断言正式编号、总复习及实践类型符合教材清单；先运行确认缺项时报错。
- [x] 人教社公开资料未提供本册新版完整学生书目录，按用户授权依据 TapX 固定快照上册目录录入；区分 9 个编号条目（含总复习）和未编号综合实践。版权页可核实 ISBN/版次时记录，缺失信息留空。
- [x] 每条提供基础至少两任务、进阶/高阶各一任务，每场八题；按知识点选用题型。数据测试遍历全部数学条目，断言任务结构、八题长度、测量范围和算术答案。
- [x] 对运算和测量答案增加专项断言；全量单测 121/121、类型检查、临时目录 Vite 构建、数学与综合实践路由 E2E 1/1、`git diff --check` 均通过。

### Task 8：录入二年级下学期数学

**文件：** src/content/grade-2/term-2/math/ 下所有条目；修改 registry、数据测试和教材清单。

- [x] 先写 listsAllVerifiedTerm2MathEntries 并断言清单/registry 一一对应、正式编号连续；运行确认缺项时失败。
- [x] 人教社公开资料未提供本册新版完整学生书目录，按用户授权依据 TapX 固定快照下册目录录入；区分 10 个编号条目（含总复习）和未编号综合实践，不称其为新课标版目录。
- [x] 满足三档、任务和八题规则，核验运算步骤及答案。新增下册答案检查，逐题断言解释步骤得到 correctAnswer。
- [x] 运行全量 validator 和数学测试后提交。

### Task 9：录入二年级上学期英语（一年级起点预备级）

**文件：** src/content/grade-2/term-1/english/ 下全部语言单元和复习入口；修改 registry、数据测试和教材清单。

- [x] 先写 listsAllVerifiedTerm1EnglishEntries，断言语言单元与 Revision 分类符合教材清单；运行确认缺项时失败。
- [x] 人教社公开新体系说明未提供本册完整学生书目录，按用户授权依据 TapX 固定快照的一年级起点旧学生书录入；登记 6 个 Unit 与 2 个 Revision，标注回退版及校内开课状态待确认。
- [x] 正确区分编号单元和未编号 Revision；基础多任务、进阶/高阶各单任务、每场八题。数据测试断言 Revision 的 achievementEligible=false 且不占正式单元编号。
- [x] 检查英文词汇、指令、语法和答案适龄准确；运行测试后提交。

### Task 10：录入二年级下学期英语

**文件：** src/content/grade-2/term-2/english/ 下全部语言单元、复习和实践入口；修改 registry、数据测试和教材清单。

- [x] 先写 listsAllVerifiedTerm2EnglishEntries 并断言 registry 与下册清单一一对应；运行确认缺项时失败。
- [x] 人教社公开新体系说明未提供本册完整学生书目录，按用户授权依据 TapX 固定快照的一年级起点旧学生书录入；登记 6 个 Unit 与 2 个 Revision，标注回退版及校内开课状态待确认。
- [x] 满足任务、场次和八题规则，复核英文内容。下册测试同样校验 Revision/实践计数及全部题目引用。
- [x] 运行全量课程 validator 和英语数据测试后提交。

### Task 11：实现判题、配对打散和随机鼓励反馈

**文件：** 创建 src/learning/answers.ts、matching.ts、feedback.ts、session.ts 及同名 .test.ts；创建 src/sound/soundPreferences.ts、soundCues.ts 及测试、SoundProvider.tsx；将五段用户提供 MP3 放入 public/audio/ 并按规格表命名；修改 src/components/game/ActivityFeedback.tsx、ActivityRenderer.tsx、MatchActivity.tsx、SessionPlayer.tsx、SessionSummary.tsx；创建 ActivityFeedback.test.tsx、MatchActivity.test.tsx、SessionPlayer.test.tsx。

**接口：** FeedbackStatus = correct | incorrect；selectFeedbackMessage(status: FeedbackStatus, previousMessage: string | null, random: () => number = Math.random): string；shuffleMatchAnswers(pairs: readonly MatchPair[], random: () => number = Math.random): MatchPair[]；submitAnswer(activity: ActivityDefinition, answer: unknown): boolean。至少两组配对时保证右侧首轮不与左列完全同序。`getAnswerSoundFeedback(status, previousConsecutiveCorrectCount, sessionComplete): { cue: SoundCue, consecutiveCorrectCount: number }` 负责将错误后的连击数清零、将正确答题连击数加一，并让全场完成音优先于连击音；`SoundProvider` 提供 `{ enabled, setEnabled, playCue }`，默认开启并记住本机偏好。

- [x] 在 answers.test、feedback.test、matching.test、session.test 中写 tests: handlesCorrectAndIncorrectAnswerForEachKind、selectsOnlyStatusMessages、avoidsPreviousMessage、shufflesMatchAnswers、fallsBackFromIdentityOrder、completesOnlyAfterLastCorrectAnswer；为六种题型逐一断言正确与错误答案，固定 random=0 和接近 1 验证选择边界。
- [x] 实现纯函数，组件中不散落 Math.random 和判题分支。
- [x] 每次尝试只洗牌一次，重试重洗；答错允许提示和重试，不允许误报或跳题。
- [x] 在 soundCues.test 写 `usesCorrectCueAtStart`、`usesStreakCueAfterConsecutiveAnswers`、`resetsStreakAfterIncorrectAnswer`、`choosesSessionCompleteCueBeforeStreakCue`；在 soundPreferences.test 写 `defaultsSoundToEnabled`、`persistsSoundChoice`、`keepsSoundEnabledWhenStorageUnavailable`，覆盖纯逻辑分支。
- [x] 以纯函数覆盖声音状态优先级：错误重置答对连击；第 8 题完成音覆盖普通/连击音；默认开启、存储失败回退开启；Provider 以独立语音/点击通道播放本地资源并吞掉浏览器播放拒绝，不影响答题状态。
- [x] SessionPlayer 用第 8 题完成状态决定全对音，用连续正确计数决定普通/连击音；ActivityRenderer 将正确与错误结果回报给场次，答错后正确重试重新开始连击计数；重玩场次时连击计数归零。
- [x] 八题进度、最后一题完成、重复点击保护和鼓励反馈写组件测试；核心学习模块达到四项 100% 后提交。

### Task 12：升级进度、成就、学习起点和主题

**文件：** 修改 src/storage/progress.ts、src/achievements/position.ts、src/achievements/progress.ts、src/achievements/exploration.ts、src/theme/ThemeProvider.tsx、src/App.tsx、src/main.tsx、src/components/settings/SettingsDialog.tsx、src/components/catalog/CourseCatalog.tsx、src/components/achievements/AchievementSummary.tsx、AchievementPage.tsx、AchievementDashboard.tsx；创建 progress/achievement/theme 模块测试及相应组件测试。

**接口：** ProgressState 使用 schemaVersion: 3，隔离旧版完成 ID 并保留有效 learningStart。src/achievements/progress.ts 导出 isCurriculumUnitComplete(unit: CurriculumUnit, ids: readonly string[]): boolean，仅在基础全部任务/场次完成时返回 true；getTaskProgress(task: LearningTask, ids: readonly string[]): { completedSessionCount: number; totalSessionCount: number; completed: boolean }。学习起点按正式单元位置计算，不计 review/practice。

- [x] 在 progress.test 写 migratesV1AndV2PreservingStart、ignoresLegacyCompletionsForNewSessions、fallsBackOnCorruptOrUnavailableStorage、completeSessionIsIdempotent、setLearningStartReplacesLaterProgress；断言返回状态和 localStorage 内容。
- [x] 在 achievement tests 写 doesNotCompleteUnitWhenBasicTaskIsPartial、completesUnitAfterAllBasicSessions、ignoresAdvancedAndHighForUnitCompletion、excludesUnnumberedReviewFromRankCount、mapsOnlyVerifiedCurriculum、unlocksRanksAt1_2_4_8；断言节点状态和正式单元数。
- [x] 实现新 schema 和成就纯函数；只根据校验过的课程目录生成节点，不虚构其他年级单元。
- [x] 主题解析提取纯函数；测试首次 system、手动 light/dark、恢复系统和存储不可用。
- [x] 更新设置页仅允许登记位置，说明替换影响；组件测试验证进度与主题交互；核心模块覆盖率达标后提交。
- [x] 设置弹窗增加“语音提示与交互音效”开关，默认开启；关闭时通过统一音频 Provider 静音所有答题和点击提示，并立即停止播放。App 捕获可操作控件点击并播放提示音，原生 disabled、aria-disabled 和语音开关本身除外。组件测试覆盖开关、localStorage 持久化及关闭后的零播放、点击音和播放 Promise 拒绝。

### Task 13：完成 E2E、覆盖率门槛、CI 和 PR 交付

**文件：** 修改 vitest.config.ts、package.json、README.md、AGENTS.md 和 UI 样式；创建 tests/e2e/catalog.spec.ts、learning-flow.spec.ts、settings-achievements.spec.ts、.github/workflows/quality.yml。

- [x] 配置 coverage 显式纳入所有 src TS/TSX；全局四项至少 60%。下列每个文件分别设置 lines/statements/functions/branches=100%：src/app/router.ts、src/content/curriculum.ts、src/content/validateCurriculum.ts、src/learning/answers.ts、src/learning/matching.ts、src/learning/feedback.ts、src/learning/session.ts、src/storage/progress.ts、src/achievements/position.ts、src/achievements/progress.ts、src/achievements/exploration.ts、src/theme/themePreferences.ts、src/sound/soundPreferences.ts、src/sound/soundCues.ts。
- [x] 在 catalog.spec 写rendersEveryVerifiedCourseEntry、opensEachTermAndSubject、refreshesNestedCourseRoutes；在 learning-flow.spec 写completesTwoBasicTasksAndOneTaskPerHigherTier、showsEightQuestionProgress、shufflesMatchOptionsAfterRetry、showsStateSpecificEncouragement；在 settings-achievements.spec 写persistsThemeAndStartPosition、updatesAchievementAfterBasicCompletion。断言标题、题数、状态和持久化值。
- [x] E2E 覆盖所有当前开放题型代表流程、错误/提示/重试/正确反馈、配对排序、进度刷新、成就门槛、主题、学习起点、键盘、窄屏、reduced motion 和未知页面；用 page.addInitScript 控制随机源，断言呈现文案属于对应状态池。当前课程目录均为 active，筹备中分支由 router.test 使用未验证目录覆盖。
- [x] E2E 通过 Audio spy（不播放真实扬声器）验证声音开关默认开启且刷新持久化；普通正确、连续正确、错误、当前场次第 8 题全部完成及控件点击映射到正确本地 MP3；关闭开关后断言 Audio.play 未调用且正在播放被暂停；播放 Promise reject 不阻断答题。
- [x] 建立 GitHub Actions：Node 22.16.0、npm ci、build、coverage、Playwright；失败时上传报告。
- [x] 更新中文 README、AGENTS.md 和初始设计文档，说明课程版次依据、命令、隐私、许可和 Cloudflare Pages 配置。
- [x] 运行 npm run test:unit、npm run test:coverage、npm run test:e2e；运行 TypeScript 类型检查与独立临时目录 Vite production build，避免覆盖工作区已有 dist/ 和 tsconfig.tsbuildinfo；运行 git diff --check，并手动查看桌面/窄屏、浅/深色、键盘焦点和减少动态效果。
- [x] 检查状态和差异，仅暂存本任务范围；提交并推送 codex/primary-school-study，更新既有 main 目标 PR。不执行正式 Cloudflare 部署。

## 完成标准

- 按用户最新来源规则完成二年级上下学期语文、数学、英语课程：逐册使用可核实的人教社最新版，或在找不到完整新版时采用 TapXWorld 固定快照回退。六册来源可追溯、目录与实际版本一致、不跨版拼接、不把回退版误报为最新版。
- 每条至少 4 个任务（基础至少 2 个，进阶/高阶各 1 个），每任务至少一场；最小课程规模为 4 场、32 题，每场恰好八题。
- 配对题不泄露答案顺序；答对/答错文案随机变化且保持鼓励性。
- 基础全部任务完成后才点亮单元；迁移不造成虚假完成。
- 全局四项覆盖率至少 60%，核心模块四项 100%；单元、组件、E2E、构建及差异检查通过。
- 未核实版次或未执行的线上部署在 PR 和汇报中如实标注。
