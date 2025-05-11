# Falco-STRM

一个用于同步 AList 媒体文件到本地 STRM 文件的工具。该工具可以帮助您将 AList 中的媒体文件转换为 Emby/Jellyfin 可识别的 STRM 文件格式。

## 功能特性

- 支持从 AList 同步媒体文件到本地 STRM 文件
- 自动处理中文路径和特殊字符的 URL 编码
- 内置请求限流机制，防止 API 请求过于频繁
- 支持失败重试机制，提高同步可靠性
- 使用 TypeScript 开发，提供类型安全

## 系统要求

- Node.js 16.0 或更高版本
- pnpm 包管理器

## 安装

1. 克隆仓库：
```bash
git clone https://github.com/yourusername/falco-strm.git
cd falco-strm
```

2. 安装依赖：
```bash
pnpm install
```

## 配置

在使用之前，您需要配置以下信息：

1. AList 服务器地址
2. AList API Token
3. 源目录路径（AList 中的媒体目录）
4. 目标目录路径（本地 STRM 文件存储目录）

## 使用方法

1. 修改 `src/index.ts` 中的配置信息：
```typescript
const alistTemplate = new AlistTemplate(
  'http://your-alist-server:port', // AList 服务器地址
  'your-alist-token' // AList API Token
)
const alistStrmFileManager = new AlistStrmFileManager(
  alistTemplate,
  '/your/source/path', // AList 源目录
  '/your/local/path' // 本地目标目录
)
```

2. 运行同步：
```bash
pnpm start
```

## 开发

- 开发模式（支持热重载）：
```bash
pnpm dev
```

- 代码检查：
```bash
pnpm lint
```

- 自动修复代码格式：
```bash
pnpm lint:fix
```

## 项目结构

```
src/
├── index.ts              # 程序入口
├── strm/                 # STRM 文件管理相关代码
├── types/               # 类型定义
└── limiter/             # 请求限流相关代码
```

## 许可证

ISC
