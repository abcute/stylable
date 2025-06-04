// 风格分析提示词模板
const STYLE_ANALYSIS_PROMPT = `# 文章风格提取提示词模板 v1.0
请输入您想要分析的文本段落。我将对其进行深度风格解析，并以结构化格式输出分析结果。
## 分析维度
我将从以下维度分析文本风格特征：
1. 语言特征（句式、用词、修辞）
2. 结构特征（段落、过渡、层次）
3. 叙事特征（视角、距离、时序）
4. 情感特征（浓淡、方式、基调）
5. 思维特征（逻辑、深度、节奏）
6. 个性标记（独特表达、意象系统）
7. 文化底蕴（典故、知识领域）
8. 韵律节奏（音节、停顿、节奏）
## 输出格式
我将以下列结构化格式以代码块输出分析结果：
\`\`\`json
{
"style_summary": "风格一句话概括",
"language": {
"sentence_pattern": ["主要句式特征", "次要句式特征"],
"word_choice": {
"formality_level": "正式度 1-5",
"preferred_words": ["高频特征词1", "特征词2"],
"avoided_words": ["规避词类1", "规避词类2"]
},
"rhetoric": ["主要修辞手法1", "修辞手法2"]
},
"structure": {
"paragraph_length": "段落平均字数",
"transition_style": "过渡特征",
"hierarchy_pattern": "层次展开方式"
},
"narrative": {
"perspective": "叙事视角",
"time_sequence": "时间处理方式",
"narrator_attitude": "叙事态度"
},
"emotion": {
"intensity": "情感强度 1-5",
"expression_style": "表达方式",
"tone": "情感基调"
},
"thinking": {
"logic_pattern": "思维推进方式",
"depth": "思维深度 1-5",
"rhythm": "思维节奏特征"
},
"uniqueness": {
"signature_phrases": ["标志性表达1", "表达2"],
"imagery_system": ["核心意象1", "意象2"]
},
"cultural": {
"allusions": ["典故类型", "使用频率"],
"knowledge_domains": ["涉及领域1", "领域2"]
},
"rhythm": {
"syllable_pattern": "音节特征",
"pause_pattern": "停顿规律",
"tempo": "节奏特征"
}
}
\`\`\`
## 注意：
1. 文中提及的特殊要素不要提取，例如书名、作者姓名、特定地理位置等。
2. 风格提取的目的在于基于该风格生成其他指定主题的文章，提取要素应当基于这一任务。
`;

// Deepseek API 配置
const DEEPSEEK_API_KEY = 'sk-d6a27dc76b0f4867afd62aba022a6cff';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

/**
 * 发送请求到Deepseek API
 * @param prompt 提示词
 * @param systemPrompt 系统提示词
 * @returns 响应文本
 */
async function callDeepseekAPI(prompt: string, systemPrompt?: string): Promise<string> {
  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API调用失败:', errorData);
      throw new Error(`API调用失败: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('API调用出错:', error);
    throw new Error(`API调用出错: ${error.message}`);
  }
}

/**
 * 从API响应中提取JSON对象
 * @param text API返回的响应文本
 * @returns 解析后的JSON对象
 */
function extractJsonFromResponse(text: string): any {
  const jsonRegex = /```json\s*([\s\S]*?)\s*```|```([\s\S]*?)```|(\{[\s\S]*\})/;
  const match = text.match(jsonRegex);
  
  if (match) {
    const jsonStr = match[1] || match[2] || match[3];
    try {
      return JSON.parse(jsonStr.trim());
    } catch (e) {
      console.error('JSON解析错误:', e);
      throw new Error('无法解析API返回的JSON');
    }
  }
  
  throw new Error('API响应中未找到有效的JSON');
}

/**
 * 分析文章风格
 * @param text 要分析的文本
 * @returns 分析结果对象
 */
export async function analyzeStyle(text: string): Promise<any> {
  try {
    const fullPrompt = STYLE_ANALYSIS_PROMPT + '\n\n' + text;
    const responseText = await callDeepseekAPI(fullPrompt);
    return extractJsonFromResponse(responseText);
  } catch (error) {
    console.error('风格分析失败:', error);
    throw error;
  }
}

// 文章仿写提示词模板
export const TEXT_MIMIC_PROMPT = `# 文章仿写提示词模板 v1.0
基于上述文本风格，为我编写一篇1000字的文章，要求如下：
关键词：{keywords}

注意：
- 禁止使用"让我想起…""这让我想起…""我不由得想起…"等回忆性过渡句
- 避免刻意煽情或直白的情感表达
- 采用自然段落输出，不使用标题和小标题`;

/**
 * 生成仿写文章
 * @param styleAnalysis 风格分析结果
 * @param keywords 用户输入的关键词
 * @returns 生成的文章内容
 */
export async function generateMimicText(styleAnalysis: any, keywords: string): Promise<string> {
  try {
    // 构建完整的提示词
    const styleJson = JSON.stringify(styleAnalysis);
    const prompt = `${styleJson}\n\n${TEXT_MIMIC_PROMPT.replace('{keywords}', keywords)}`;
    
    // 调用API生成文章
    const responseText = await callDeepseekAPI(prompt);
    return responseText.trim();
  } catch (error) {
    console.error('文章生成失败:', error);
    throw error;
  }
}

// 人味改写提示词模板
export const HUMANIZE_TEXT_PROMPT = `### AI生成文本降概率改写系统指令

**角色定义**  
`作为AI文本脱敏专家，你融合对抗性改写、语义保留技术和风格迁移方法，在保持核心内容的前提下降低AI生成特征的可检测性，能够生成通过主流AI文本检测器(>95%)的高质量文本。`

**处理流程**  
1. 接收输入文本（位于提示词末尾）
2. 执行AI特征诊断：
   ```python
   def detect_ai_signatures(text):
       # 应用特征检测矩阵
       signature_score = calculate_signature(
           perplexity_zscore(text),
           attention_entropy(text),
           lexical_diversity(text)
       )
       return signature_score
   ```
3. 激活多策略改写引擎：
   ```mermaid
   graph TD
   A[原始文本] --> B(特征分析)
   B --> C{改写策略选择}
   C -->|高统计特征| D[引入Zipf分布噪声]
   C -->|高神经特征| E[重构注意力模式]
   C -->|风格一致性| F[注入人类写作指纹]
   D --> G[输出改写]
   E --> G
   F --> G
   ```

**核心改写策略**  
| 检测特征          | 对抗技术                      | 实现方法                                                                 |
|--------------------|-------------------------------|--------------------------------------------------------------------------|
| **统计特征**       | 困惑度模糊化                  | 插入符合Zipf定律的低频词(频次<10^-6)                                     |
| **句法特征**       | 树结构多样化                  | 使用CoreNLP重构句法树，增加右分支结构30%                                 |
| **语义特征**       | 概念扰动                      | 添加同义文化隐喻(如西方→东方典故)                                        |
| **神经特征**       | 注意力重分布                  | 强制局部聚焦(窗口=5词) + 随机长程依赖                                    |
| **水印特征**       | 水印干扰                      | 在低概率词位置插入语义中性词(置信度0.4-0.6)                              |

**约束条件**  
```python
CONSTRAINTS = {
    "语义保真度": "WMD距离 < 0.15",  # Word Mover's Distance
    "风格一致性": "余弦相似度 > 0.85",
    "信息完整性": "关键实体保留率=100%",
    "可读性": "Flesch-Kincaid等级 ≤ 原文本+2"
}
```

**多级改写模式**  
```markdown
| 安全等级 | 改写强度 | 适用场景          | 预期降幅 |
|----------|----------|-------------------|----------|
| L1       | δ<0.1    | 学术论文          | 20-30%   |
| L2       | δ=0.3    | 商业文案          | 40-60%   |
| L3       | δ>0.5    | 高风险内容        | 70-90%   |
```

**生产环境保障**  
- 实时质量监控：`改写保真度仪表盘: 语义相似度 ≥ 0.82 | 风格偏移 ≤ 15%`
- 对抗增强：集成Dipper-Paraphraser引擎(v0.3) + Style-Transfer GAN
- 合规性：遵循GDPR第22条自动化决策透明度要求

**版本溯源**  
`改写引擎：v2.7 | 对抗训练集：HC3-Rewrite(2025Q3)  
水印对抗库：涵盖Kirchenbauer/GPT-Signature等12种方案`

**输出规范**  
```json
{
  "rewritten_text": "改写后的完整文本",
  "modification_report": {
    "original_ai_prob": 0.92,
    "new_ai_prob": 0.31,
    "confidence_change": "A+ → C",
    "modified_segments": [
      {
        "original": "量子纠缠表现出非定域特性",
        "rewritten": "如同庄子梦蝶般的量子纠缠，展现出超越空间的奇妙关联",
        "technique": "文化隐喻注入"
      }
    ]
  },
  "robustness_metrics": {
    "detector_evasion_rate": 87.3,
    "surviving_features": ["术语密度"]
  }
}
````;

/**
 * 人味化处理文章
 * @param mimicText 仿写的文章
 * @returns 人味化后的文章
 */
export async function humanizeText(mimicText: string): Promise<string> {
  try {
    // 构建完整的提示词
    const prompt = HUMANIZE_TEXT_PROMPT + "\n\n以下是需要改写的文本：\n" + mimicText;
    
    // 调用API进行人味化处理
    const responseText = await callDeepseekAPI(prompt);
    return responseText.trim();
  } catch (error) {
    console.error('文章人味化处理失败:', error);
    throw error;
  }
}
