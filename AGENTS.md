# 项目协作说明

本文件用于指导本仓库内的代码、课程内容和文档修改。仓库级说明优先于通用代理说明；用户当前明确要求优先。

## 项目概况

- 面向 7–12 岁学生的静态 React 学习站，当前提供人教版二年级上学期语文、数学第一和第二单元。
- Node.js 版本见 `.node-version`（当前为 22.16.0），使用 npm。
- 本地启动：`npm ci`、`npm run dev`；生产构建：`npm run build`；本地预览：`npm run preview`。构建输出为 `dist/`。
- 测试命令：`npm run test:unit`（Vitest）、`npm run test:coverage`（V8 覆盖率）、`npm run test:e2e`（Playwright Chromium；首次运行前执行 `npx playwright install chromium`）。E2E 使用专用端口 `127.0.0.1:4174`。
- 网站部署到 Cloudflare Pages，使用 Vite SPA 路由。不要添加顶层 `404.html`，以保留 Pages 的 SPA 回退。

## 目录与课程内容

- 页面与交互：`src/components/`；路由：`src/app/`；进度存储：`src/storage/`；课程类型和索引：`src/content/`。
- 新课程按 `src/content/年级/学期/学科/单元/` 存放，先更新 `src/content/curriculum.ts` 和类型，再实现必要的活动。
- 课程知识优先以可完整核实的人教社公开最新版为准；找不到完整新版学生书或目录时，按用户裁定使用 `TapXWorld/ChinaTextbook` 固定快照，并在课程元数据标明 `tapx-fallback`、精确来源和已知差异。一个册次不得混用版次，TapX 回退版不得称为最新版。不要复制或托管教材 PDF、扫描页、插图或大段受版权保护的课文；练习题、讲解和配图应为原创。
- 新增年级或学期时，确保课程 ID（尤其场次 ID）全局唯一；学习星图和宇宙头衔按当前课程目录中的完整单元累计，不因切换学期而重置。
- 12 个星区主题和教材单元映射维护在 `src/achievements/exploration.ts`、`src/achievements/position.ts`；只根据已核实的人教版目录登记节点，不推测未来学期的单元数量。宇宙头衔门槛维护在 `src/achievements/progress.ts`；正常学习时，单元全部场次完成后才算点亮。
- `src/storage/progress.ts` 同时保存完成场次与可选学习起点。学习起点之前已登记单元按完成计算，起点及之后按真实场次进度计算；设置新起点会替换其后的本地进度，并需在界面上明确说明。
- 过程文档使用中文。修改或新增用户可见的课程内容时，检查其年龄适配、表达清楚、鼓励式反馈和答案正确性。

## UI、无障碍与主题

- 本项目使用 `animal-island-ui`。全局样式只在 `src/main.tsx` 导入一次；组件属性以已安装包的 TypeScript 声明为准，不猜测或虚构 API。优先复用组件和设计变量。
- 主题选项为“跟随系统 / 浅色 / 深色”，首次访问默认跟随系统；手动选择存于当前设备。新增页面和组件需兼容两种主题。
- 支持键盘操作、可见焦点、语义化标签、足够的文字对比度和 `prefers-reduced-motion`。颜色不能作为状态的唯一提示；完成状态应有文字或图标。
- 交互反馈应友善、不惩罚犯错，不使用排名、付费奖励或强迫连续学习的设计。

## 隐私、素材与许可

- 学习进度和偏好仅保存在当前浏览器；不要引入账号、追踪器或不必要的数据收集。
- 头像是对话中提供的未成年人照片生成的卡通衍生素材。不要新增原始照片、真实姓名或其他可识别个人信息。
- 项目自有代码与内容采用 PolyForm Noncommercial License 1.0.0；修改许可或新增第三方素材、依赖时，先核对许可并维护相应声明。

## 修改与交付

- 保持改动聚焦，不覆盖无关文件或用户修改。提交信息使用 Conventional Commits 风格。
- 完成修改后运行 `npm run build` 和 `git diff --check`；涉及 UI 时手动检查桌面与窄屏、浅色与深色、键盘焦点和 reduced motion。
- 审查结论区分必须修复的问题与可选建议；不要把建议说成缺陷，也不要声称未执行的验证已经通过。

## 上游 UI 参考

编写 Animal Island 风格的 React UI 时，参考 [animal-island-ui 上游 AGENTS.md](https://github.com/guokaigdg/animal-island-ui/blob/main/AGENTS.md) 与仓库 `animal-island-ui-style` Skill。只沿用适用于本项目的组件 API、设计系统、依赖控制和审查原则；上游专属 CI、发布和文档流程不自动适用于本仓库。
