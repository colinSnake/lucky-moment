<p align="center">
  <img src="apps/web/public/favicon.svg" width="104" alt="Lucky Moment 图标" align="middle" />
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="docs/lucky-moment-wordmark.svg" width="420" alt="Lucky Moment" align="middle" />
</p>

<p align="center">
  面向婚礼现场的互动抽奖应用，让每一个瞬间都值得记住。
</p>

<p align="center">
  <a href="README.md">English</a>
</p>

Lucky Moment 是一个面向婚礼现场的互动抽奖应用。前端使用 React、Vite、TypeScript 和 Three.js CSS3DRenderer，实现可旋转、可翻牌的抽奖卡片；后端使用 Fastify，负责生产静态资源服务和健康检查接口。

项目采用 pnpm monorepo，前端和后端分别位于 `apps/web` 与 `apps/backend`。

<br />

## 功能

- 平面卡片与球面卡片布局切换
- Three.js CSS3D 抽奖动画和翻牌效果
- 抽奖、暂停、重抽、重置和中奖结果展示
- IndexedDB 保存本地抽奖进度
- Excel 参与者名单导入和中奖结果导出
- 中文语音播报与背景音乐控制
- 粒子背景、中奖礼花和动态奖品面板
- 通过 `?participantsCount=N` 限制参与人数
- 使用 Web Crypto 进行无偏随机抽奖

<br />

## 技术栈

| 层级 | 技术 |
| --- | --- |
| 前端 | React 19、Vite、TypeScript |
| 3D / 动画 | Three.js CSS3DRenderer、Tween.js |
| 视觉效果 | tsParticles、canvas-confetti |
| 本地数据 | IndexedDB |
| Excel | SheetJS (`xlsx`) |
| 后端 | Fastify、TypeScript |
| 包管理 | pnpm 10.32.0 |

<br />

## 环境要求

- Node.js 20 或更高版本
- pnpm 10.32.0

启用 Corepack 并使用项目指定的 pnpm 版本：

```bash
corepack enable
corepack prepare pnpm@10.32.0 --activate
```

<br />

## 快速开始

在项目根目录执行：

```bash
pnpm install
pnpm dev
```

启动后访问：

- 前端：`http://localhost:9087/lucky-moment`
- 前端带尾斜杠：`http://localhost:9087/lucky-moment/`
- 后端：`http://localhost:9090`
- 健康检查：`http://localhost:9090/api/health`

`/lucky-moment` 和 `/lucky-moment/` 都可以直接访问。前端开发服务器会将 `/api` 请求代理到后端 `9090` 端口。

<br />

## 常用命令

| 命令 | 说明 |
| --- | --- |
| `pnpm dev` | 同时启动前端和后端开发服务 |
| `pnpm dev:web` | 只启动 Vite 前端服务 |
| `pnpm dev:backend` | 只启动 Fastify 后端服务 |
| `pnpm build` | 构建前端和后端生产产物 |
| `pnpm start` | 启动生产 Fastify 服务 |
| `pnpm typecheck` | 执行前端和后端 TypeScript 检查 |
| `pnpm test` | 执行抽奖规则测试 |

生产模式：

```bash
pnpm build
pnpm start
```

生产访问地址：`http://localhost:9090/lucky-moment`。

<br />

## 项目结构

```text
.
├── apps/
│   ├── web/
│   │   ├── public/                 # 字体、图片、音乐、markdown 和 favicon
│   │   ├── src/
│   │   │   ├── app/                # 全局 CSS 和应用基础资源
│   │   │   ├── assets/             # WebP 背景资源
│   │   │   ├── components/         # 页面 UI 组件
│   │   │   ├── module/
│   │   │   │   ├── effects/        # 礼花等视觉效果
│   │   │   │   ├── indexedDB/      # 本地持久化
│   │   │   │   ├── lottery/        # 抽奖规则、Excel 和随机数逻辑
│   │   │   │   ├── locale/         # 中英文文案
│   │   │   │   ├── mockData/       # 奖品和视觉配置
│   │   │   │   └── util/           # 抽奖运行时、事件和音频工具
│   │   │   ├── App.tsx             # 应用组合入口
│   │   │   └── main.tsx            # React 挂载入口
│   │   ├── index.html
│   │   └── vite.config.ts
│   └── backend/
│       └── src/server.ts           # Fastify 静态服务和 API
├── docs/
│   └── lucky-moment-wordmark.svg   # README 艺术字
├── package.json                    # workspace 脚本
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
└── tsconfig.json
```

`apps/web/dist` 和 `apps/backend/dist` 是构建生成目录，不纳入 Git。

<br />

## 配置

后端支持以下环境变量：

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `PORT` | `9090` | Fastify 监听端口 |
| `HOST` | `0.0.0.0` | Fastify 监听地址 |
| `WEB_ORIGIN` | 允许所有来源 | CORS 来源，多个来源用逗号分隔 |

前端配置位于 `apps/web/vite.config.ts`：

- 开发端口：`9087`
- 应用路径：`/lucky-moment`
- API 代理：`/api` → `http://localhost:9090`

<br />

## 性能策略

- 粒子层通过 `React.lazy` 延迟加载，避免影响首屏入口。
- tsParticles 限制粒子数量和帧率，并在页面失焦时暂停。
- Three.js 只在存在活动 Tween 时请求动画帧。
- Tween.js 使用独立 `Group` 管理动画状态，避免全局动画状态互相影响。
- `xlsx` 只在导入或导出 Excel 时动态加载。
- Three.js、React 和大型依赖通过 Vite 分包。
- 礼花效果只在中奖完成时动态加载。
- 背景使用 WebP，构建目录和开发缓存目录不进入 Git。

<br />

## CI/CD

`.github/workflows/ci.yml` 会在 `master` 分支的 push 和 Pull Request 上执行：

1. 安装 pnpm 依赖
2. 执行 TypeScript 检查
3. 执行抽奖规则测试
4. 构建前端和后端

项目提供 `vercel.json` 用于部署前端静态站：

- Install Command：`pnpm install --frozen-lockfile`
- Build Command：`pnpm --filter @lucky-moment/web build`
- Output Directory：`apps/web/dist`
- 前端路径：`/lucky-moment`

Vercel 配置只负责前端静态站。`apps/backend` 是 Fastify 长驻服务，需要单独部署到支持 Node.js 服务的运行环境，并通过 `WEB_ORIGIN` 配置允许的前端来源。当前前端未依赖业务 API，后端主要提供静态服务和 `/api/health` 健康检查。

将 GitHub 仓库 `colinSnake/lucky-moment` 连接到 Vercel 项目后，GitHub push 会触发 Vercel 的预览或生产部署；Vercel 项目的 Production Branch 需要设置为 `master`。

<br />

## 验证

提交代码前建议执行：

```bash
pnpm typecheck
pnpm test
pnpm build
```

抽奖规则测试覆盖中奖人数计算、参与者筛选、无偏随机抽取、中奖应用和结果回滚等核心逻辑。
