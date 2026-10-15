# 课程目录规范与难度任务扩充实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task. Native 顺序执行，不委派子代理；每项行为改动先写失败测试，再实现并验证。

**目标：** 标准化星岛学园课程目录、README 与内容编写约定；为全部 53 个二年级语文、数学、英语可玩条目增加第二个进阶和高阶任务，并完成全量逐题审校。

**架构：** 保留现有课程路径，以共享编写器的固定二任务 tuple 表达进阶和高阶任务；过渡期间分批迁移课程数据，最终由校验器强制恰好两个任务。目录一致性、答案结构和数学答案测试提供自动保障，中文逐题台账记录 53 个条目的完整人工审校。

**技术栈：** Node.js 22.16.0、npm、React、TypeScript、Vite、Vitest、React Testing Library、Playwright；课程内容维持本地静态数据和 Cloudflare Pages 部署。

**规格：** [课程目录规范与难度任务扩充设计](../specs/2026-10-15-curriculum-standardization-and-difficulty-review-design.md)

## Global Constraints

- 只处理二年级上下学期语文、数学、英语当前注册表中的 53 个可玩条目；不补写未来年级或未开放条目。
- 保留 `grade-N/term-N/subject/entry/index.ts` 路径，不搬动现有课程目录；项目名统一为 `starry-island`。
- 基础任务至少 2 个；进阶和高阶各恰好 2 个；每任务 1 场、每场 20 分钟、恰好 8 题；新增 106 个任务、848 道题。
- 基础题围绕单知识点；进阶题迁移或组合已学知识；高阶题在二年级知识范围内要求多步策略推理。不得用超纲知识、陷阱或重复题凑量。
- 逐题审校覆盖所有现有和新增课程数据；内容必须原创、教材对齐、适龄、答案唯一；记录修复过的问题 ID。
- 用户可见和过程文档使用中文。保留现有 TapXWorld 来源与版次说明、PolyForm Noncommercial License 1.0.0、隐私和 Cloudflare Pages 行为。
- 保持 Vitest 全局 statements、branches、functions、lines 各至少 60%，既有核心逻辑四项覆盖率各 100%。

## Review Focus

- **物理目录和目录注册表不一致：** `src/content/curriculumLayout.test.ts` 检查 53 个条目的路径、入口文件、合法命名及无多余课程目录。
- **任务数、顺序或 ID 在迁移中漂移：** `build*Unit.test.ts`、`validateCurriculum.test.ts` 与全量 `curriculum.test.ts` 锁定固定二任务、`task-01/02`、全路径 ID 和八题场次。
- **数学答案、单位或算式与答案键不符：** `src/content/grade-2/term-1/math/mathAnswers.test.ts` 对两学期数学目录和每档所有算式重算；每批新增的算式都会自动纳入遍历。
- **台账漏审旧题或新增题：** `src/content/questionReviewLedger.test.ts` 将台账已审数量、总数量与课程注册表逐题对照；只有 53 个条目全量相等且各维度完成时通过。
- **第二个任务在路由、刷新或进度中不可用：** `tests/e2e/catalog.spec.ts` 和 `tests/e2e/learning-flow.spec.ts` 直接打开、刷新并完成第二个进阶/高阶任务，确认完成场次被持久化。

---

### Task 1：统一课程编写规范、README 和项目元数据

**文件：**

- 创建：`docs/curriculum/authoring-standard.md`
- 修改：`README.md`、`AGENTS.md`、`package.json`、`package-lock.json`
- 修改：`docs/superpowers/specs/2026-10-13-grade-2-full-curriculum-and-testing-design.md`
- 修改：`docs/superpowers/plans/2026-10-13-grade-2-full-curriculum-and-testing.md`

**接口：** 新编写规范成为课程贡献的单一入口，定义年级/学期/学科/条目路径、类别 slug、入口文件、共享构建器、稳定 ID、来源字段、难度、审校、目录注册及检查命令。README 按规格规定的章节顺序呈现项目、启动、课程/难度、目录、审校、质量检查、Cloudflare、素材/隐私/许可；旧规格和已完成计划仅加“历史记录/由新规格覆盖”说明，不篡改原任务完成记录。

- [ ] **Step 1：写中文目录与内容编写规范**，逐项使用规格中的路径模式、`unit-NN`/`review-NN`/`integrated-practice-NN`、`index.ts` 入口及题目审校维度。
- [ ] **Step 2：按固定章节顺序重写 README 课程说明**，准确列出 53 个条目分类与每档任务数量，移除“进阶、高阶各一个”的旧说法。
- [ ] **Step 3：同步 AGENTS 和历史文档说明**，为后续贡献者指向新编写规范，并在 2026-10-13 的历史规格/计划开头标注当前任务数量和审校规则由本规格覆盖。
- [ ] **Step 4：更新项目包名和锁文件根元数据**为 `starry-island`；只改 `package.json.name`、`package-lock.json.name` 与 `packages[""].name`，不改依赖版本。
- [ ] **Step 5：运行文档和元数据检查**：`git diff --check`；用 Node 读取两份 JSON 并断言根包名均为 `starry-island`；人工核对 README 各章节顺序和旧计数用语。
- [ ] **Step 6：提交本任务范围**：`git add README.md AGENTS.md package.json package-lock.json docs/curriculum/authoring-standard.md docs/superpowers/specs/2026-10-13-grade-2-full-curriculum-and-testing-design.md docs/superpowers/plans/2026-10-13-grade-2-full-curriculum-and-testing.md && git commit -m "docs: standardize curriculum authoring guidance"`。

### Task 2：用测试锁定课程目录规范

**文件：**

- 创建：`src/content/curriculumLayout.test.ts`
- 读取：`src/content/curriculum.ts`、`src/content/types.ts`、`src/content/grade-2/**/index.ts`

**接口：** 测试从 curriculum registry 取得每个有 `curriculumUnitKey` 的目录项，转换为 `src/content/{unitKey}/index.ts`；递归枚举课程入口并与注册表双向比对。当前应精确找到 53 个入口、16 个语文条目、21 个数学条目、16 个英语条目。

- [ ] **Step 1：先写失败测试** `matchesEveryPlayableRegistryEntryToOneCanonicalDirectory`、`rejectsMissingEntryFilesAndUnregisteredEntryDirectories`、`usesExpectedGradeTermSubjectAndEntrySlugs`。
- [ ] **Step 2：运行 `npx vitest run src/content/curriculumLayout.test.ts`**，确认现有 53 个课程入口通过目录与 registry 双向对照；在测试中使用内存中的缺入口、多余入口、非法路径样本验证断言确实能识别不一致，不修改真实课程目录制造失败。
- [ ] **Step 3：实现只读目录枚举与路径断言**，不新增第二套课程注册表，不改变运行时课程加载方式。
- [ ] **Step 4：重跑该测试**，确认 53 个条目全部一一对应，并验证测试夹具可捕获少入口、多余入口及非法 slug。
- [ ] **Step 5：提交**：`git add src/content/curriculumLayout.test.ts && git commit -m "test: enforce canonical curriculum directories"`。

### Task 3：扩展三种课程构建器以接收双任务

**文件：**

- 修改：`src/content/grade-2/term-1/chinese/buildChineseUnit.ts`、`buildChineseUnit.test.ts`
- 修改：`src/content/grade-2/term-1/math/buildMathUnit.ts`
- 创建：`src/content/grade-2/term-1/math/buildMathUnit.test.ts`
- 修改：`src/content/grade-2/term-1/english/buildEnglishUnit.ts`
- 创建：`src/content/grade-2/term-1/english/buildEnglishUnit.test.ts`

**接口：** 三种 unit spec 增加 `advancedTasks` 和 `highTasks` 双元素只读 tuple，并生成各难度 `task-01`、`task-02`、`order: 1/2` 及其独立 session/question ID。为了让后续六批内容可单独验证，迁移期间暂时接受原 `advancedTask`/`highTask` 单值字段；Task 10 会删除此兼容路径。

- [ ] **Step 1：先在三个 builder 测试中加入双任务 fixture 和断言**，验证两个标题、目标、顺序、session ID、每场 8 题及题目 ID 无重复。
- [ ] **Step 2：分别运行三个 builder 测试**，确认新增双任务断言失败。
- [ ] **Step 3：扩展三种 spec 类型和 `build*Unit`**，优先消费 tuple；旧单值仅作为迁移期后备。
- [ ] **Step 4：重跑三个 builder 测试**，并运行 `npm run build` 验证 53 个尚未迁移的入口仍可编译。
- [ ] **Step 5：提交**：`git add src/content/grade-2/term-1/{chinese,math,english}/build*Unit* && git commit -m "feat: support paired advanced curriculum tasks"`。

### 六批课程数据扩写和逐题审校的共同要求

Task 4–9 各自只负责表中列出的一个学期/学科批次。每批都先添加该批条目的 2/2 任务数回归断言，确认失败；随后逐文件复核全部旧题（基础、现有进阶和高阶），设计两项目标不同的新进阶任务和两项策略不同的新高阶任务。每个新任务是独立 8 题场次，不复用旧题、只替换数字或改名。题目必须核对对应册次目录及 `sourceTopics`；数学逐式复算，英语核查拼写/语义/语法，语文核查字词、题意与表达。发现错误即改并把题目稳定 ID 和修复简述记入中文台账。

每批结束后，更新 `curriculum.test.ts` 中按课程 ID 展开的任务数断言（描述统一为“two tasks per higher tier”），只对该批 ID 运行以确认红/绿；断言进阶和高阶任务恰好各 2 个、顺序/ID 正确、每场 8 题。同时运行对应数学答案测试（仅数学批次）和构建。

| 任务 | Cohort | 入口范围 | 条目数 |
| --- | --- | --- | ---: |
| Task 4 | 二年级上学期语文 | `src/content/grade-2/term-1/chinese/**/index.ts` | 8 |
| Task 5 | 二年级上学期数学 | `src/content/grade-2/term-1/math/**/index.ts` | 10 |
| Task 6 | 二年级上学期英语 | `src/content/grade-2/term-1/english/**/index.ts` | 8 |
| Task 7 | 二年级下学期语文 | `src/content/grade-2/term-2/chinese/**/index.ts` | 8 |
| Task 8 | 二年级下学期数学 | `src/content/grade-2/term-2/math/**/index.ts` | 11 |
| Task 9 | 二年级下学期英语 | `src/content/grade-2/term-2/english/**/index.ts` | 8 |

每批均修改 `src/content/curriculum.test.ts` 中对应课程清单断言，并新增/更新 `docs/curriculum/grade-2-question-review.tsv` 对应条目行。TSV 列固定为：课程 ID、题目总数、已审数量、答案正确性、题目清晰度、年龄适配、教材主题对齐、难度归属、修复记录、状态。该批只有在已审数量等于数据题数、五个审校状态均为“完成”时才能写入完成状态。

### Task 4：扩写并审校二年级上学期语文

**文件：**

- 修改：`src/content/grade-2/term-1/chinese/{unit-01..unit-08}/index.ts`
- 修改：`src/content/curriculum.test.ts`
- 创建/更新：`docs/curriculum/grade-2-question-review.tsv`
- 测试：`src/content/curriculum.test.ts` 中 `term1ChineseUnits`

- [ ] **Step 1：写失败断言**，对 `term1ChineseUnits` 中每个 unit 断言 `advanced/high` 各 2 个任务，并确认两个目标不同。
- [ ] **Step 2：运行 `npx vitest run src/content/curriculum.test.ts -t 'grade-2/term-1/chinese'`**，确认上学期语文条目仍因只有一个进阶/高阶任务而失败。
- [ ] **Step 3：复核 8 个语文入口的所有旧题，新增 16 个任务、128 道题**，并逐条更新审校台账及错误修复记录。
- [ ] **Step 4：运行 `npx vitest run src/content/curriculum.test.ts -t 'grade-2/term-1/chinese'` 和 `npm run build`**；检查新增题目目标不同、题数/ID正确且无超纲知识。全量课程校验留到 Task 10，避免中间迁移数据被旧的“恰好一个任务”校验规则拒绝。
- [ ] **Step 5：提交**：`git add src/content/grade-2/term-1/chinese/unit-*/index.ts src/content/curriculum.test.ts docs/curriculum/grade-2-question-review.tsv && git commit -m "feat: add reviewed Chinese extension tasks for term one"`。

### Task 5：扩写并审校二年级上学期数学

**文件：**

- 修改：`src/content/grade-2/term-1/math/unit-01..unit-09/index.ts`、`src/content/grade-2/term-1/math/integrated-practice-01/index.ts`
- 修改：`src/content/curriculum.test.ts`
- 更新：`docs/curriculum/grade-2-question-review.tsv`

- [ ] **Step 1：写失败断言**，对 10 个 `term1MathEntries` 条目断言进阶/高阶各两个不同任务。
- [ ] **Step 2：运行 `npx vitest run src/content/curriculum.test.ts -t 'grade-2/term-1/math'`**，确认上学期数学条目因数据仍各一个任务而失败。
- [ ] **Step 3：复核 10 个条目所有旧题，新增 20 个任务、160 道题**；逐项复算新旧算式，核对单位、题意、量级、提示和解释；检查综合实践题目只组合已学内容。
- [ ] **Step 4：更新上学期数学逐题台账；运行 `npx vitest run src/content/grade-2/term-1/math/mathAnswers.test.ts`、`npx vitest run src/content/curriculum.test.ts -t 'grade-2/term-1/math'` 和 `npm run build`**，确认既有数学答案测试遍历全部新旧算式并保持答案一致。
- [ ] **Step 5：提交**：暂存上学期数学的 `unit-*/index.ts`、`integrated-practice-01/index.ts`、`src/content/curriculum.test.ts` 与台账；使用 `feat: add reviewed math extension tasks for term one` 提交。

### Task 6：扩写并审校二年级上学期英语

**文件：**

- 修改：`src/content/grade-2/term-1/english/{unit-01..unit-06,review-01..review-02}/index.ts`
- 修改：`src/content/curriculum.test.ts`
- 更新：`docs/curriculum/grade-2-question-review.tsv`

- [ ] **Step 1：写失败断言**，对 8 个 `term1EnglishEntries` 条目断言进阶/高阶各两个不同任务。
- [ ] **Step 2：运行 `npx vitest run src/content/curriculum.test.ts -t 'grade-2/term-1/english'`**，确认英语复习站和正式单元的新任务数断言失败。
- [ ] **Step 3：复核 8 个条目全部旧题，新增 16 个任务、128 道题**；核对单词拼写/大小写、词义、语法、题目指令和学生书目录范围，复习站题目只复习对应已登记单元。
- [ ] **Step 4：写入上学期英语台账；运行 `npx vitest run src/content/curriculum.test.ts -t 'grade-2/term-1/english'` 和 `npm run build`**，确保复习条目类型、成就资格和英语任务数据不变。
- [ ] **Step 5：提交**：暂存上学期英语 `unit-*/index.ts`、`review-*/index.ts`、`src/content/curriculum.test.ts` 与台账；使用 `feat: add reviewed English extension tasks for term one` 提交。

### Task 7：扩写并审校二年级下学期语文

**文件：**

- 修改：`src/content/grade-2/term-2/chinese/{unit-01..unit-08}/index.ts`
- 修改：`src/content/curriculum.test.ts`
- 更新：`docs/curriculum/grade-2-question-review.tsv`

- [ ] **Step 1：写失败断言**，对 `term2ChineseUnits` 八个条目要求进阶/高阶各 2 个任务。
- [ ] **Step 2：运行 `npx vitest run src/content/curriculum.test.ts -t 'grade-2/term-2/chinese'`**，确认当前单任务数据不能满足预期。
- [ ] **Step 3：复核全部 8 个条目的所有旧题，新增 16 个任务、128 道题**；核验语文知识点、表达清楚程度、提示讲解一致性和与上学期内容的适当递进。
- [ ] **Step 4：完成台账并运行 `npx vitest run src/content/curriculum.test.ts -t 'grade-2/term-2/chinese'` 与 `npm run build`**，确认二年级下学期数据和 task-02 ID 正确。
- [ ] **Step 5：提交**：暂存下学期语文 `unit-*/index.ts`、`src/content/curriculum.test.ts` 与台账；使用 `feat: add reviewed Chinese extension tasks for term two` 提交。

### Task 8：扩写并审校二年级下学期数学

**文件：**

- 修改：`src/content/grade-2/term-2/math/unit-01..unit-10/index.ts`、`src/content/grade-2/term-2/math/integrated-practice-01/index.ts`
- 修改：`src/content/curriculum.test.ts`
- 更新：`docs/curriculum/grade-2-question-review.tsv`

- [ ] **Step 1：写失败断言**，对 11 个 `term2MathEntries` 条目要求进阶/高阶各 2 个任务，并覆盖所有新算式。
- [ ] **Step 2：运行 `npx vitest run src/content/curriculum.test.ts -t 'grade-2/term-2/math'`**，确认任务数断言失败。
- [ ] **Step 3：复核 11 个条目的全部旧题，新增 22 个任务、176 道题**；逐式复算并重点检查表内乘除、混合运算、有余数、千以内/万以内数、单位换算、数据统计与情境条件是否符合所用册次内容。
- [ ] **Step 4：完成下学期数学台账；运行 `npx vitest run src/content/grade-2/term-1/math/mathAnswers.test.ts`、`npx vitest run src/content/curriculum.test.ts -t 'grade-2/term-2/math'` 和 `npm run build`**，确认答案测试自动覆盖新旧两学期数学算式且答案一致、无超纲先修知识。
- [ ] **Step 5：提交**：暂存下学期数学的 `unit-*/index.ts`、`integrated-practice-01/index.ts`、`src/content/curriculum.test.ts` 与台账；使用 `feat: add reviewed math extension tasks for term two` 提交。

### Task 9：扩写并审校二年级下学期英语

**文件：**

- 修改：`src/content/grade-2/term-2/english/{unit-01..unit-06,review-01..review-02}/index.ts`
- 修改：`src/content/curriculum.test.ts`
- 更新：`docs/curriculum/grade-2-question-review.tsv`

- [ ] **Step 1：写失败断言**，对 8 个 `term2EnglishEntries` 条目要求进阶/高阶各 2 个任务。
- [ ] **Step 2：运行 `npx vitest run src/content/curriculum.test.ts -t 'grade-2/term-2/english'`**，确认已有正式单元和两处复习站均缺少第二个任务。
- [ ] **Step 3：复核全部旧题，新增 16 个任务、128 道题**；检查大小写、拼写、词义、表达、复习范围和高阶任务的跨知识点要求仍局限在已学英语。
- [ ] **Step 4：完成下学期英语台账；运行 `npx vitest run src/content/curriculum.test.ts -t 'grade-2/term-2/english'` 和 `npm run build`**。
- [ ] **Step 5：提交**：暂存下学期英语 `unit-*/index.ts`、`review-*/index.ts`、`src/content/curriculum.test.ts` 与台账；使用 `feat: add reviewed English extension tasks for term two` 提交。

### Task 10：移除迁移兼容并强制校验精确任务数

**文件：**

- 修改：`src/content/grade-2/term-1/chinese/buildChineseUnit.ts`、`src/content/grade-2/term-1/math/buildMathUnit.ts`、`src/content/grade-2/term-1/english/buildEnglishUnit.ts`
- 修改：`src/content/grade-2/term-2/chinese/unit-06/index.ts`（删除与 `advancedTasks` 首项重复的旧 `advancedTask` 字段）
- 修改：`src/content/validateCurriculum.ts`、`src/content/validateCurriculum.test.ts`、`src/content/curriculum.test.ts`

**接口：** `ChineseUnitSpec`、`MathUnitSpec`、`EnglishUnitSpec` 必需 `advancedTasks`、`highTasks` 两元素 tuple；移除旧的单值 `advancedTask`、`highTask`。可玩条目进阶/高阶计数不为 2 时返回既有稳定错误码 `TIER_TASK_COUNT`，错误 path 定位对应 difficulty track。

- [ ] **Step 1：先写校验器失败测试** `requiresExactlyTwoAdvancedTasks`、`rejectsOneAdvancedTask`、`rejectsThreeAdvancedTasks`、`requiresExactlyTwoHighTasks`、`rejectsOneHighTask`、`rejectsThreeHighTasks`。
- [ ] **Step 2：运行 `npx vitest run src/content/validateCurriculum.test.ts`**，确认 1 和 3 的任务数边界测试失败。
- [ ] **Step 3：更新校验器提示、三个 spec 类型和 builder 测试**，删除迁移期单任务后备字段；更新全部课程清单断言为 `toHaveLength(2)`。
- [ ] **Step 4：运行 `npx vitest run src/content/validateCurriculum.test.ts src/content/curriculum.test.ts src/content/grade-2/term-1/chinese/buildChineseUnit.test.ts src/content/grade-2/term-1/math/buildMathUnit.test.ts src/content/grade-2/term-1/english/buildEnglishUnit.test.ts`**，再运行 `npm run build`。
- [ ] **Step 5：提交**：暂存三个明确的 `build*Unit.ts` 与对应 builder 测试、`src/content/grade-2/term-2/chinese/unit-06/index.ts`、`src/content/validateCurriculum.ts`、`src/content/validateCurriculum.test.ts`、`src/content/curriculum.test.ts`；使用 `feat: require two tasks in advanced curriculum tiers` 提交。

### Task 11：校验逐题审校台账覆盖完整

**文件：**

- 完成：`docs/curriculum/grade-2-question-review.tsv`
- 创建：`src/content/questionReviewLedger.test.ts`
- 读取：`src/content/curriculum.ts`

**接口：** TSV 恰好有一条数据记录对应一个可玩课程条目；每行的 `课程ID` 唯一，`题目总数`、`已审数量` 均为该课程 registry 下全部难度/任务/场次/题目数之和；答案正确性、题目清晰度、年龄适配、教材主题对齐、难度归属五列均为“完成”。`修复记录` 为“无”或至少包含修复题目完整 ID 与原因。

- [ ] **Step 1：先写失败测试** `listsEveryPlayableEntryExactlyOnce`、`requiresEveryQuestionToBeReviewed`、`requiresAllEditorialDimensionsComplete`、`recordsQuestionIdsForRepairs`。
- [ ] **Step 2：运行 `npx vitest run src/content/questionReviewLedger.test.ts`**，确认缺少 ledger 时失败。
- [ ] **Step 3：按最终课程数据补齐 53 行台账**，以实际生成的活动 ID 和数量核算总题数；逐行复核每个条目是否有漏审任务、状态是否错误。
- [ ] **Step 4：实现 TSV 读取和完整性断言**，将台账课程 ID 与 registry 一一对照，并逐条比较已审数、总数和课程实际活动数。
- [ ] **Step 5：运行 ledger 测试、所有课程与数学答案测试**；只有三方题数相等且所有审校维度完成时测试通过。
- [ ] **Step 6：提交**：`git add docs/curriculum/grade-2-question-review.tsv src/content/questionReviewLedger.test.ts && git commit -m "test: verify complete curriculum question review"`。

### Task 12：更新二任务路由与学习 E2E

**文件：**

- 修改：`tests/e2e/catalog.spec.ts`
- 修改：`tests/e2e/learning-flow.spec.ts`
- 如测试暴露缺陷，再修改对应路由/任务组件与单测

- [ ] **Step 1：先写失败 E2E**，确认代表性中文、数学、英语单元页展示第二个进阶/高阶任务入口；点击后页面显示对应第二任务标题，直接打开 `/advanced/task-02`、`/high/task-02` 并刷新也可恢复。
- [ ] **Step 2：将 `completesTwoBasicTasksAndOneTaskPerHigherTier` 改名为 `completesTwoBasicTasksAndTwoTasksPerHigherTier`**，完成两个基础任务、两个进阶任务和两个高阶任务；断言 6 个完成场次及现有正式单元成就边界不变。
- [ ] **Step 3：运行 `npm run test:e2e -- --grep 'TwoTasksPerHigherTier|second advanced and high tasks'`**，先确认新增断言暴露缺口，再修复最小的路由或测试选择器问题。
- [ ] **Step 4：重跑相关 E2E**，检查第二任务路由、题目 8/8、完成反馈、刷新和本机进度写入。
- [ ] **Step 5：提交**：暂存 `tests/e2e/catalog.spec.ts`、`tests/e2e/learning-flow.spec.ts` 和经检查确认属于此修复的单个源文件路径；提交信息使用 `test: cover second advanced and high learning tasks`。不得整体暂存 `src/app` 或 `src/components`。

### Task 13：全量回归、覆盖率和交付检查

**文件：**

- 检查：全部变更文件、README、课程台账、测试和 `dist/` 构建结果
- 如有失败：只修复本次改动引入的问题，并在归属任务中补充回归测试

- [ ] **Step 1：运行单元/组件测试** `npm run test:unit`，确认全量课程、构建器、目录、数学答案和审校台账测试通过。
- [ ] **Step 2：运行覆盖率** `npm run test:coverage`，确认全局四项各不少于 60%，既有核心模块四项各为 100%；不得通过排除文件或忽略分支规避失败。
- [ ] **Step 3：运行 E2E** `npm run test:e2e`，确认 Chromium 全链路及第二任务路由通过。
- [ ] **Step 4：运行 `npm run build` 和 `git diff --check`**；检查包名/锁文件一致、53 个台账行和新增数量（106 tasks / 848 questions）准确、README 无过时任务数。
- [ ] **Step 5：检查 git 状态与最终 diff**，确认只包含本计划范围和已记录修复，不包含临时教材、生成物或无关工作区修改。
- [ ] **Step 6：完成前独立 review 整个分支**，特别检查难度是否实质递进、答案和讲解是否一致、重复题/超纲题、复习条目是否纳入、目录及许可文案是否一致；修复发现的问题并重跑相关检查。
