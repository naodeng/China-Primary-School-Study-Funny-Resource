# 星岛学园 · Starry Island

<p align="center">
  <img src="public/assets/brand/starry-island-logo-512.png" alt="星岛学园 · Starry Island 四位太空学习伙伴与笑脸星星飞船" width="220" />
</p>

**在星岛上快乐学习，探索知识宇宙。**

*Learn, Play & Explore.*

星岛学园是面向 7–12 岁学生的星际探索式趣味学习平台。课程按人教版的年级、学期、学科和单元组织，用原创小游戏帮助孩子练习和复习知识点。

## 当前课程

| 年级与学期 | 学科 | 已登记内容 |
| --- | --- | --- |
| 二年级上学期 | 语文 | 8 个正式单元 |
| 二年级上学期 | 数学 | 9 个正式单元、1 个综合实践 |
| 二年级上学期 | 英语 | 6 个单元、2 个复习站 |
| 二年级下学期 | 语文 | 8 个正式单元 |
| 二年级下学期 | 数学 | 10 个正式单元、1 个综合实践 |
| 二年级下学期 | 英语 | 6 个单元、2 个复习站 |

每个单元包含多个基础任务，以及各一个进阶、高阶任务；每场约 20 分钟、8 道题。练习题、讲解和图形表达为原创内容。学习进度和偏好只保存在当前浏览器的 `localStorage`，不创建账号，也不收集访客资料。

## 学习星图与主题

成就地图按一至六年级的上下学期划分为 12 个星区，每个已登记教材单元成为一个探索节点；之后可以按相同结构扩展其他年级。完整的星区主题表见[设计说明](docs/superpowers/specs/2026-10-13-primary-school-study-site-design.md#成就系统与全年级星区地图)。

完成一个单元内全部基础任务后，地图会给节点打勾并高亮。头衔按跨年级、跨学期完成的单元数累计：预备宇航员、月球开拓者（1 个）、火星探险家（2 个）、银河系舰长（4 个）、宇宙终极探索官（8 个）。主题默认跟随系统，也可以手动选浅色或深色。答题鼓励语音和操作提示音默认开启，可在设置中关闭；素材随静态网站本地加载，不调用在线语音服务。

首页只显示当前头衔和个人成就摘要。点击“查看成就详情”或打开首页右上方的“设置”，可以进入完整星图与课程记录。设置中可以调整主题，也可以把学习起点设为任意年级、学期和单元；起点之前的已登记课程会视为已完成，所选单元及之后的进度会重新开始。未来课程接入后会按此起点计算，未核实的教材单元数不会预先生成。进度重设只影响当前浏览器。

## 项目结构

课程数据按年级、学期、学科、单元逐层存放；单元数据再列出各场游戏。

```text
src/content/
├── types.ts
├── curriculum.ts
└── grade-2/
    ├── term-1/
    │   ├── chinese/ (unit-01 … unit-08/index.ts)
    │   ├── math/ (unit-01 … unit-09/index.ts)
    │   └── english/ (unit-01 … unit-06, review-01 … review-02/index.ts)
    └── term-2/
        ├── chinese/ (unit-01 … unit-08/index.ts)
        ├── math/ (unit-01 … unit-10/index.ts)
        └── english/ (unit-01 … unit-06, review-01 … review-02/index.ts)
```

主要页面和逻辑位于 `src/components/`、`src/app/` 与 `src/storage/`。四张圆形伙伴头像存放在 `public/assets/companions/`，由固定头像 ID 引用。

## 本地运行

需要 Node.js 22.16.0（版本见根目录 `.node-version`）和 npm。

```bash
npm ci
npm run dev
```

生成生产静态文件并预览：

```bash
npm run build
npm run preview
```

构建输出位于 `dist/`。

运行质量检查：

```bash
npm run test:unit
npm run test:coverage
npx playwright install chromium
npm run test:e2e
```

Vitest 覆盖率门槛为语句、分支、函数和行覆盖率各不低于 60%；核心路由、课程校验、判题、学习进度、成就、主题和声音状态模块分别要求四项 100%。GitHub Actions 会在提交和 PR 中执行构建、单元测试、覆盖率与 Playwright E2E。

## 部署到 Cloudflare Pages

在 Cloudflare Pages 项目中设置：

| 设置 | 值 |
| --- | --- |
| 根目录 | 仓库根目录 |
| 框架预设 | React (Vite) |
| 构建命令 | `npm run build` |
| 构建输出目录 | `dist` |
| Node.js | 根目录 `.node-version` 固定为 `22.16.0` |

本项目是纯静态 SPA，不需要 Pages Functions 或独立 Worker。不要创建顶层 `404.html`：Cloudflare Pages 会据此识别 SPA，并将未命中文件的请求回退到根目录页面，使单元、场次等深层路径可以直接打开。构建产物应包含 `index.html`，但不应包含顶层 `404.html`。

Cloudflare Pages 的 React (Vite) 预设、构建命令、输出目录、Node 版本文件和 SPA 回退行为见 [官方构建配置文档](https://developers.cloudflare.com/pages/configuration/build-configuration/)、[官方构建镜像文档](https://developers.cloudflare.com/pages/configuration/build-image/) 和[官方页面路由文档](https://developers.cloudflare.com/pages/configuration/serving-pages/)。

当前交付仅验证了本地构建和本地预览，没有连接 Cloudflare 项目或执行线上部署。

## 课程来源和内容边界

课程内容逐册优先采用可完整核实的人教社公开最新版；找不到完整新版学生书或目录时，按用户要求回退到 [TapXWorld/ChinaTextbook](https://github.com/TapXWorld/ChinaTextbook) 固定快照，并在课程元数据中记录来源和版次状态。一个册次不混用版次；不复制或托管教材 PDF、封面、整页、插图或大段课文。游戏中的题目、解释和配图由本项目原创。

## 品牌与头像素材

正式 Logo 使用用户提供的第二版四位伙伴品牌图；四张圆形头像由对话中提供的参考照片生成卡通衍生图，再转为 WebP。仓库不包含参考原照片或真实姓名。公开部署前，请确认监护人同意在公开网站展示 Logo 和头像中的未成年人肖像。

## 许可

- 本项目自有代码和内容采用 [PolyForm Noncommercial License 1.0.0](LICENSE)。请阅读完整许可文本后使用；本许可限制商业用途。
- 直接依赖 `animal-island-ui` 按其 MIT 许可使用。作者、项目链接、许可声明与 MIT 正文见 [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md)，网站构建产物也包含 `third-party-notices.txt`。
- `react`、`react-dom`、`classnames`、`vite`、`@vitejs/plugin-react` 和 `typescript` 受各自上游许可约束；版本与依赖清单见 `package.json` 和 `package-lock.json`。
