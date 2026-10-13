# 星岛学习站

面向中国小学低年级学生的互动学习网站 MVP。当前优先支持人教版二年级上学期语文、数学第一和第二单元，以随堂小游戏帮助孩子复习知识点。

## 当前课程

| 年级与学期 | 学科 | 单元 | 游戏场次 |
| --- | --- | --- | ---: |
| 二年级上学期 | 语文 | 第一单元·阅读 | 3 |
| 二年级上学期 | 语文 | 第二单元·识字 | 3 |
| 二年级上学期 | 数学 | 第一单元·长度单位 | 2 |
| 二年级上学期 | 数学 | 第二单元·100以内的加法和减法（二） | 4 |

每场建议约 20 分钟，由 3–4 个短挑战组成。练习题、讲解和图形表达为原创内容；暂未开放的课程会显示“筹备中”。学习进度只保存在当前浏览器的 `localStorage`，不创建账号，也不收集访客资料。

## 项目结构

课程数据按年级、学期、学科、单元逐层存放；单元数据再列出各场游戏。

```text
src/content/
├── types.ts
├── curriculum.ts
└── grade-2/
    └── term-1/
        ├── chinese/
        │   ├── unit-01/index.ts
        │   └── unit-02/index.ts
        └── math/
            ├── unit-01/index.ts
            └── unit-02/index.ts
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

课程知识点以人教版教材为准，并参考 [TapXWorld/ChinaTextbook](https://github.com/TapXWorld/ChinaTextbook) 的课程目录核对单元。来源仓库仅作为核对依据；本项目不复制或托管教材 PDF、封面、整页、插图或大段课文。游戏中的题目、解释和配图由本项目原创。

## 头像素材

四张头像由对话中提供的参考照片生成卡通衍生图，再转为 WebP；仓库只包含衍生图，不包含参考原图或真实姓名。公开部署前，请确认监护人同意在公开网站展示这些未成年人肖像。

## 许可

- 本项目自有代码和内容采用 [PolyForm Noncommercial License 1.0.0](LICENSE)。请阅读完整许可文本后使用；本许可限制商业用途。
- 直接依赖 `animal-island-ui` 按其 MIT 许可使用。作者、项目链接、许可声明与 MIT 正文见 [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md)，网站构建产物也包含 `third-party-notices.txt`。
- `react`、`react-dom`、`classnames`、`vite`、`@vitejs/plugin-react` 和 `typescript` 受各自上游许可约束；版本与依赖清单见 `package.json` 和 `package-lock.json`。
