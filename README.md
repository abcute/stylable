
# Styleable - AI 风格模仿写作工具

Styleable 是一个基于 AI 的智能写作工具，能够分析文本风格并生成符合特定风格的内容。通过深度学习技术，它可以提取文本的风格特征，并根据用户提供的关键词生成具有相同风格的新文章。

## 🌟 产品特色

- **智能风格分析**：深度解析文本的语言特征、结构特征、叙事特征等多维度风格要素
- **精准风格模仿**：基于分析结果生成符合原文风格的新内容
- **人性化改写**：将 AI 生成的内容进行人性化处理，增加真实感和自然度
- **风格管理**：自动保存分析过的风格，支持重复使用已保存的风格模板
- **作品管理**：完整的作品创建、保存、收藏和管理功能
- **AI 检测器**：内置 AI 内容检测功能，分析文本的 AI 生成概率
- **多语言支持**：支持中英文界面切换
- **用户认证**：完整的用户注册、登录和会话管理

## 🚀 技术栈

- **前端框架**：React 18 + TypeScript
- **构建工具**：Vite
- **UI 组件库**：shadcn/ui + Tailwind CSS
- **状态管理**：React Context + TanStack Query
- **路由管理**：React Router DOM
- **后端服务**：Supabase (数据库 + 认证 + 实时功能)
- **AI 服务**：DeepSeek API
- **部署平台**：Lovable + GitHub 集成

## 📋 核心功能

### 1. 风格分析功能

系统使用专业的风格分析提示词模板，从以下维度深度解析文本：

#### 分析维度
1. **语言特征**：句式、用词、修辞手法
2. **结构特征**：段落组织、过渡方式、层次展开
3. **叙事特征**：视角选择、时间处理、叙事态度
4. **情感特征**：情感强度、表达方式、基调设定
5. **思维特征**：逻辑模式、思维深度、节奏把控
6. **个性标记**：独特表达、意象系统
7. **文化底蕴**：典故运用、知识领域
8. **韵律节奏**：音节特征、停顿规律

### 2. 风格仿写功能

基于分析出的风格特征，根据用户提供的关键词生成符合原文风格的新文章。仿写过程严格遵循风格约束，避免使用回忆性过渡句和刻意煽情表达。

### 3. 人性化改写功能

采用先进的 AI 文本降概率改写技术，通过以下策略增强文本的自然度：

- **统计特征优化**：困惑度模糊化，插入符合 Zipf 定律的低频词
- **句法特征多样化**：重构句法树，增加右分支结构
- **语义特征扰动**：添加同义文化隐喻
- **神经特征重分布**：注意力重分布，强制局部聚焦
- **水印特征干扰**：在低概率词位置插入语义中性词

### 4. AI 内容检测

内置专业的 AI 内容检测器，提供以下功能：

- **AI 概率分析**：计算文本的 AI 生成概率
- **置信度评估**：提供检测结果的可信度
- **法证证据**：显示主要指标和模型特征
- **分段分析**：对文本片段进行详细异常检测
- **鲁棒性报告**：检测对抗性操控和文本篡改

### 5. 作品管理系统

- **作品保存**：自动保存用户创建的所有作品
- **收藏功能**：支持收藏重要作品
- **分类浏览**：按全部作品和收藏作品分类查看
- **详情查看**：支持查看作品的完整内容
- **文本复制**：一键复制原文、仿写文本或人性化文本

## 🎯 使用流程

1. **风格分析**：输入原始文本或选择已保存的风格模板
2. **主题输入**：输入要创作的主题关键词
3. **风格仿写**：基于分析结果生成符合风格的新文章
4. **人性化处理**：对生成内容进行人性化改写
5. **内容获取**：完成支付后获取最终内容
6. **作品管理**：保存、收藏和管理创作的作品

## 📁 项目结构

```
src/
├── components/          # UI 组件
│   ├── ui/             # 基础 UI 组件库
│   ├── FinalContent.tsx
│   ├── MimicPreview.tsx
│   ├── Navbar.tsx
│   ├── OriginalTextInput.tsx
│   ├── SavedStylesSelector.tsx
│   ├── StepIndicator.tsx
│   ├── StyleAnalysis.tsx
│   └── TopicInput.tsx
├── context/            # React Context
│   ├── AuthContext.tsx
│   └── LanguageContext.tsx
├── pages/              # 页面组件
│   ├── Index.tsx       # 主页
│   ├── Login.tsx       # 登录页
│   ├── Register.tsx    # 注册页
│   ├── MyWorks.tsx     # 我的作品
│   ├── SingleWorkView.tsx # 作品详情
│   ├── AIDetector.tsx  # AI 检测器
│   └── Guide.tsx       # 使用指南
├── utils/              # 工具函数
│   ├── analysisUtils.ts # AI 分析工具
│   ├── supabaseUtils.ts # 数据库操作
│   ├── workUtils.ts    # 作品管理
│   └── aiDetectorUtils.ts # AI 检测工具
└── integrations/       # 第三方集成
    └── supabase/       # Supabase 配置
```

## 🗄️ 数据库结构

### profiles 表
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### styles 表
```sql
CREATE TABLE styles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  style_name TEXT NOT NULL,
  style_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### works 表
```sql
CREATE TABLE works (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  keywords TEXT,
  original_text TEXT NOT NULL,
  mimic_text TEXT,
  humanized_text TEXT,
  favorite BOOLEAN DEFAULT false,
  style_id UUID REFERENCES styles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## 🚀 部署指南

### 前置要求

1. **Node.js 环境**：Node.js 18+ 和 npm
2. **Supabase 账号**：用于数据库和认证服务
3. **DeepSeek API Key**：用于 AI 分析功能
4. **GitHub 账号**：用于代码托管（可选）

### 1. 环境配置

#### 1.1 Supabase 配置
1. 访问 [supabase.com](https://supabase.com) 创建新项目
2. 获取项目 URL 和 anon key
3. 在 Lovable 项目中点击右上角绿色 "Supabase" 按钮连接

#### 1.2 数据库设置
在 Supabase SQL 编辑器中执行数据库初始化脚本（见上方数据库结构部分）

#### 1.3 DeepSeek API 配置
在 `src/utils/analysisUtils.ts` 中更新 API 密钥：
```typescript
const DEEPSEEK_API_KEY = 'your-deepseek-api-key';
```

### 2. 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 3. 生产部署

#### 3.1 通过 Lovable 部署
1. 在 Lovable 编辑器中点击右上角 "Publish" 按钮
2. 配置自定义域名（需要付费计划）

#### 3.2 通过 GitHub 部署
1. 在 Lovable 中连接 GitHub
2. 推送代码到 GitHub 仓库
3. 使用 Vercel、Netlify 或其他平台部署

## 🔧 API 集成

### DeepSeek API 配置

1. 访问 [DeepSeek 官网](https://platform.deepseek.com) 注册账号
2. 获取 API Key
3. 在项目中配置密钥

### API 使用示例

```typescript
const response = await fetch(DEEPSEEK_API_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
  },
  body: JSON.stringify({
    model: 'deepseek-chat',
    messages: [
      { role: 'user', content: prompt }
    ],
    temperature: 0.7,
    max_tokens: 4000
  })
});
```

## 🔒 安全配置

### Row Level Security (RLS)

项目使用 Supabase RLS 确保数据安全：

- 用户只能访问自己的 profiles、styles 和 works
- 所有表都启用了 RLS 策略
- API 调用需要有效的 JWT token

### 认证配置

在 Supabase 认证设置中：

1. **邮箱确认**：开发测试期间可关闭
2. **重定向 URL**：配置允许的重定向域名
3. **JWT 过期时间**：根据需要调整

## 📈 性能优化

1. **代码分割**：使用 React.lazy 实现路由级代码分割
2. **缓存策略**：TanStack Query 提供智能缓存
3. **API 优化**：合理使用 Supabase 实时订阅
4. **文本处理优化**：大文本分段处理，避免超时

## 🐛 常见问题

### Q: 用户注册后无法创建 profile
A: 检查 `handle_new_user` 触发器是否正确创建和启用

### Q: API 调用失败
A: 验证 DeepSeek API Key 是否正确配置且有足够额度

### Q: 样式显示异常
A: 确认 Tailwind CSS 配置正确，检查 purge 设置

### Q: 认证状态不同步
A: 检查 `onAuthStateChange` 监听器是否正确设置

### Q: 翻译文案显示为键名
A: 确认 LanguageContext 中包含了所有必要的翻译键

### Q: AI 检测功能无响应
A: 检查文本长度是否满足最小要求（50字符以上）

## 🆕 最新更新

### v2.1.0 (2025-01-21)
- 新增 AI 内容检测器功能
- 完善作品管理系统，支持收藏和详情查看
- 优化人性化改写算法，提升文本自然度
- 修复翻译文案显示问题
- 改进错误处理和用户反馈机制

### v2.0.0 (2025-01-20)
- 重构风格分析引擎
- 新增风格模板保存和复用功能
- 完善用户认证和权限管理
- 优化界面交互体验

## 📄 许可证

本项目基于 MIT 许可证开源。

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📞 联系支持

如果您在部署过程中遇到问题，请：

1. 查看 [Lovable 文档](https://docs.lovable.dev/)
2. 访问 [Supabase 文档](https://supabase.com/docs)
3. 在项目 Issues 中报告问题

---

**注意**：本项目使用 AI 技术，请确保遵循相关法律法规和平台使用条款。
