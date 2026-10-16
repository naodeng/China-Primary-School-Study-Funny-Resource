# 一年级、三年级题目全量审校与规则交付计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**目标：** 逐题复核一年级、三年级上下学期语文、数学、英语的全部课程数据，修复确认的问题，并交付可供后续课程接入使用的分层审校规则。

**架构：** 以 `curriculum` 实际生成的活动作为审校对象，共 105 个条目、每条 48 题。先通过结构、答案键、算式和重复检测筛查，再结合题库源配置与固定教材目录逐主题复核；修复后更新逐题审校台账，并将学期、单元、任务、题目四层审校门槛补入课程编写规范。

**技术栈：** Node.js 22.16.0、TypeScript、Vite、Vitest、npm。

**Spec：** 用户本轮要求；`docs/curriculum/authoring-standard.md`；`docs/curriculum/grade-1-and-3-textbook-inventory.md`；`docs/superpowers/specs/2026-10-15-curriculum-standardization-and-difficulty-review-design.md`。

## Global Constraints

- 课程范围固定为一年级、三年级上下学期语文、数学、英语的 105 个注册条目。
- 每个可玩条目必须保留 `basic`、`advanced`、`high` 三档；每档两个任务，每任务一场 8 道题。
- 单册只使用固定 TapXWorld 快照和已登记 `sourceTopics`；题目、提示和解释保持原创。
- 答案准确、唯一、题目适龄且属于对应主题是开放课程的硬门槛；审校未完成不得标记完成。
- 保留现有 PR 分支目标 `main`；不合并 PR。

## Review Focus

- 选择题有重复或多个合理答案时，应改成可唯一判定的选项。
- 配对题出现重复答案标签时，应改成互异答案或换题型，确保儿童能判断具体配对。
- 数学算式、单位、余数范围、日期和情境数据须能逐题复算。
- 复习题只能覆盖已登记的前置单元，单元题不得挪用无关册次知识。
- 三档题及同档两个任务须有可观察的认知目标和内容差异，不能只改数字、姓名或题目标题。

## Tasks

### Task 1：建立全量题目基线

**Files：** 只读 `src/content/curriculum.ts`、`src/content/grade-1-and-3/*/lessonFactory.ts`、课程台账及教材清单；审计导出写入 `/tmp`。

- [x] 从实际 `curriculum` 导出 105 个条目的全部生成题，核对每条 48 道、总计 5,040 道及全部任务/难度覆盖。
- [x] 自动筛查答案引用、重复选项、重复配对标签、排序键、分类键、算式答案、单题卡片数量、同任务重复与跨难度重复。
- [x] 将自动筛查结果逐项人工判定为缺陷、合理重复或误报，形成待修清单。

### Task 2：按学科复核并修复内容

**Files：** `src/content/grade-1-and-3/{chinese,math,english}/lessonFactory.ts`、相应题库测试、`docs/curriculum/grade-1-and-3-question-review.tsv`。

- [x] 逐配置复核语文词义/拼音、数学答案/单位/边界、英语拼写/词义/句法及各题型答案键。
- [x] 逐条目对照教材清单与 `sourceTopics`，核实任务目标、复习范围、年龄适配和题型合理性。
- [x] 为重复任务题、难度克隆或答案歧义编写失败用例，再修复生成器或题目配置。
- [x] 修订台账：有实际题目 ID 与修复原因才记修复；所有检查未通过的条目保留未完成状态。

### Task 3：交付可复用的分层审校规则

**Files：** `docs/curriculum/authoring-standard.md`、必要的课程内容审核测试。

- [x] 明确学期/教材版本与课程范围、单元与 `sourceTopics`、任务目标与难度、逐题答案与表述四层检查项及放行条件。
- [x] 定义重复检测、版本差异、复习边界、答案唯一性和人工/自动证据的记录格式。
- [x] 以当前数据运行完整性审计和既有测试，确保规则能发现本轮实际确认的问题。

### Task 4：最终验证并更新 PR

- [x] 运行 `npm run test:unit`、`npm run test:coverage`、`npm run test:e2e`、`npm run build` 与 `git diff --check`。
- [x] 检查 git 状态和精确差异，提交本任务文件并推送到 PR #4 分支，更新 PR 描述及相关 review 线程证据。
- [x] 不合并 PR；报告实际审校覆盖、修复、验证结果和仍未解决的风险。
