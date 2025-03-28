# 儿童英语学习应用

这是一个专为3岁儿童设计的英语学习网页应用，通过简单有趣的互动方式帮助幼儿学习基础英语单词，涵盖日常生活常见类别。应用使用Python Flask后端和现代前端技术，集成百度语音API实现单词发音功能。

## 功能特点

### 单词学习模块
- 8大基础类别：动物、食物、家庭成员、身体部位、日常用品、颜色、数字、动作
- 双语单词卡片（英文/中文），支持翻转效果
- 百度语音API支持的英文和中文发音
- 精美图片配合学习

### 互动游戏模块
- 配对游戏：匹配单词和图片
- 听音识图：听单词音频，选择对应图片
- 涂色游戏：学习颜色单词

### 家长控制面板
- 学习进度追踪
- 学习时间设置
- 简单数据统计

## 技术栈

### 后端
- Python 3.x
- Flask Web框架
- 百度语音合成API

### 前端
- HTML5, CSS3, JavaScript
- 响应式设计，适配多种设备

## 安装和使用

### 前提条件
- Python 3.6+
- 百度开发者账号（用于语音API）

### 安装步骤

1. 克隆仓库
```bash
git clone https://github.com/yourusername/kids-english-learning.git
cd kids-english-learning
```

2. 安装依赖包
```bash
pip install -r requirements.txt
```

3. 配置百度API（可选）
在`app.py`中更新您的百度API密钥：
```python
BAIDU_API_KEY = '您的API密钥'
BAIDU_SECRET_KEY = '您的密钥'
```

4. 运行应用
```bash
python run.py
```

5. 在浏览器中访问
```
http://localhost:5001
```

## 项目结构

```
kids-english-learning/
├── app.py              # 主应用文件
├── run.py              # 启动脚本
├── word_data.py        # 单词数据
├── requirements.txt    # 依赖包
├── progress.json       # 学习进度数据
├── static/             # 静态资源
│   ├── css/            # 样式表
│   ├── js/             # JavaScript文件
│   ├── images/         # 图片资源
│   └── audio_cache/    # 语音缓存（自动生成）
└── templates/          # HTML模板
    ├── base.html       # 基础模板
    ├── index.html      # 首页
    ├── learn.html      # 学习页面
    ├── game.html       # 游戏页面
    └── parent.html     # 家长控制面板
```

## 定制化

### 添加新单词
编辑`word_data.py`文件，在相应类别中添加新单词：
```python
{
    "word": "新单词",
    "translation": "翻译",
    "image": "图片文件名.png"  # 将图片放在static/images/目录下
}
```

### 修改样式
编辑`static/css/style.css`自定义应用外观。

## 贡献指南
欢迎通过Pull Request贡献代码。请确保遵循以下准则：
1. 保持代码简单易懂，适合初学者
2. 添加适当的注释
3. 遵循现有的代码风格

## 许可证
MIT License

## 致谢
- 百度AI平台提供的语音合成服务
- 所有贡献者和测试者