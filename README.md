# 星岛学园 · Starry Island

<p align="center">
  <img src="public/assets/brand/starry-island-logo-512.png" alt="星岛学园 · Starry Island 四位太空学习伙伴与笑脸星星飞船" width="220" />
</p>

**在星岛上快乐学习，探索知识宇宙。**

*Learn, Play & Explore.*

星岛学园是面向 7–12 岁学生的星际探索式趣味学习平台。课程按人教版年级、学期、学科和目录条目组织，用原创小游戏帮助孩子练习和复习知识点。

## 快速开始

需要 Node.js 22.16.0（版本见根目录 `.node-version`）和 npm。

```bash
npm ci
npm run dev
```

生成生产静态文件并本地预览：

```bash
npm run build
npm run preview
```

构建输出位于 `dist/`。

## 当前课程范围与难度

目前已登记一至三年级上下学期语文、数学和英语的 158 个可玩条目：一年级 51 个、二年级 53 个、三年级 54 个。科目合计为语文 48 个、数学 62 个、英语 48 个；具体分类以课程注册表与逐册教材清单为准。一年级语文的部分主题分组是内部课程条目，不对应教材正式编号单元。

| 年级 | 上学期 | 下学期 | 合计 |
| --- | ---: | ---: | ---: |
| 一年级 | 26 个 | 25 个 | 51 个 |
| 二年级 | 26 个 | 27 个 | 53 个 |
| 三年级 | 27 个 | 27 个 | 54 个 |

每个可玩条目提供三个难度：基础版至少 2 个按知识目标拆分的任务，进阶版和高阶版各 2 个不同任务。每个任务约 20 分钟、恰好 8 道题；学习进度和偏好只保存在当前浏览器。基础练习帮助掌握单个知识点，进阶练习迁移或组合已学知识，高阶练习在已学范围内进行多步推理与策略选择。

完成一个正式单元的全部基础任务后，星图会点亮对应节点；宇宙头衔根据跨年级、跨学期完成的单元数累计。首页展示当前成就摘要，成就详情可查看完整进度；设置中可调整学习起点，起点之前已登记的课程视为完成，所选单元及之后的进度重新开始。主题默认跟随系统，也可手动选择浅色或深色；答题鼓励语音和交互提示音默认开启，可在设置中关闭。

## 课程目录规范

课程按年级、学期、学科和条目逐层存放。正式编号单元、复习站和综合实践使用不同 slug；条目入口统一为 `index.ts`。

```text
src/content/
├── curriculum.ts
├── textbooks.ts
├── grade-1/term-{1|2}/{chinese,math,english}/
├── grade-2/term-{1|2}/{chinese,math,english}/
└── grade-3/term-{1|2}/{chinese,math,english}/
```

课程 ID、任务、场次、题目 ID、注册表、难度和新增课程检查步骤见[课程目录与内容编写规范](docs/curriculum/authoring-standard.md)。主要页面、路由和进度逻辑分别位于 `src/components/`、`src/app/` 与 `src/storage/`。学习星图按一至六年级上下学期规划 12 个星区；只依据已核实课程目录生成学习节点和头衔进度。

## 教材来源与题目审校

课程知识按册次优先使用可完整核实的人教社公开最新版；找不到完整新版学生书或目录时，使用用户确认的 [TapXWorld/ChinaTextbook 固定快照](https://github.com/TapXWorld/ChinaTextbook/tree/5a80345f2043ba6f8db8d7be9cf3db82725ff1f7)，并在元数据中标记实际来源和回退原因。TapX 回退版本不称为人教社最新版；同一册不混用版次。来源与目录依据见[一年级和三年级教材清单](docs/curriculum/grade-1-and-3-textbook-inventory.md)及[二年级教材清单](docs/curriculum/grade-2-textbook-inventory.md)。

题目、提示、讲解和图形表达均为原创。所有基础、进阶和高阶旧题及新增题均需核对答案、表达清晰度、年龄适配、教材主题和难度归属；修复记录分别见[一年级和三年级逐题审校台账](docs/curriculum/grade-1-and-3-question-review.tsv)和[二年级逐题审校台账](docs/curriculum/grade-2-question-review.tsv)。

## 测试与质量检查

```bash
npm run test:unit
npm run test:coverage
npx playwright install chromium
npm run test:e2e
npm run build
git diff --check
```

Vitest 覆盖率门槛为 statements、branches、functions 和 lines 各不低于 60%；核心路由、课程校验、判题、学习进度、成就、主题和声音状态模块分别要求四项 100%。Playwright 使用专用端口 `127.0.0.1:4174`。GitHub Actions 会在提交和 PR 中运行构建、单元测试、覆盖率与 E2E。

## 部署到 Cloudflare Pages

在 Cloudflare Pages 项目中设置：

| 设置 | 值 |
| --- | --- |
| 根目录 | 仓库根目录 |
| 框架预设 | React (Vite) |
| 构建命令 | `npm run build` |
| 构建输出目录 | `dist` |
| Node.js | 根目录 `.node-version` 中的 `22.16.0` |

本项目是纯静态 SPA，不需要 Pages Functions 或独立 Worker。不要添加顶层 `404.html`，以保留 Cloudflare Pages 的 SPA 回退，使单元、任务和场次深层路由可以直接打开。构建产物应包含 `index.html`，不应包含顶层 `404.html`。配置详情见 [Pages 构建配置](https://developers.cloudflare.com/pages/configuration/build-configuration/)、[构建镜像](https://developers.cloudflare.com/pages/configuration/build-image/)和[页面路由](https://developers.cloudflare.com/pages/configuration/serving-pages/)官方文档。

当前仓库交付只验证本地构建和本地预览；这不代表已连接 Cloudflare 项目或完成线上部署。

## 品牌素材、隐私与许可

正式 Logo 使用用户提供的四位太空伙伴品牌图；四张圆形伙伴头像由对话中提供的参考照片生成卡通衍生图并转为 WebP。仓库不包含参考原照片或真实姓名；公开部署前应确认监护人同意公开展示相关未成年人肖像。

学习进度、主题与声音偏好只保存在当前浏览器的 `localStorage`。网站不要求账号，不连接在线语音服务，也不收集访客资料。

- 本项目自有代码与内容采用 [PolyForm Noncommercial License 1.0.0](LICENSE)，该许可限制商业用途。使用前请阅读完整许可文本。
- 直接依赖 `animal-island-ui` 按其 MIT 许可使用；作者、项目链接和许可正文见 [第三方声明](THIRD-PARTY-NOTICES.md)，构建产物包含 `third-party-notices.txt`。
- 其他依赖按其各自上游许可使用；版本和依赖清单见 `package.json` 与 `package-lock.json`。
