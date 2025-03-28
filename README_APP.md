# 3岁儿童英语学习应用

这是一款专为3岁儿童设计的英语学习Web应用程序，提供单词学习和互动游戏功能。

## 功能特点

1. **单词学习**：按类别学习常见英语单词，包括动物、食物、颜色等8个分类
2. **语音发音**：通过百度语音API提供准确的英语发音
3. **互动游戏**：包含配对游戏、听音识图和涂色游戏三种类型
4. **家长控制**：查看学习进度和设置使用时间

## 技术架构

- 后端：Python + Flask
- 前端：HTML5 + CSS3 + JavaScript
- 语音服务：百度语音合成API

## 安装步骤

1. 安装Python环境 (Python 3.6+)

2. 安装依赖包：
   ```
   pip install -r requirements.txt
   ```

3. 配置百度API密钥：
   在`app.py`中，找到以下代码行并替换为您的百度语音API密钥：
   ```python
   BAIDU_API_KEY = 'XXX'  # 替换为您的API KEY
   BAIDU_SECRET_KEY = 'XXX'  # 替换为您的SECRET KEY
   ```

4. 准备图片资源：
   - 在`static/images`目录中放置单词对应的图片
   - 确保图片名称与`word_data.py`中的定义一致

## 运行应用

```
python app.py
```

应用将在 http://127.0.0.1:5000/ 上运行。

## 目录结构

```
/                    # 项目根目录
├── app.py           # 主应用程序文件
├── word_data.py     # 单词数据模块
├── requirements.txt # 依赖项列表
├── static/          # 静态资源
│   ├── css/         # CSS样式表
│   ├── js/          # JavaScript文件
│   ├── images/      # 图片资源
│   └── audio_cache/ # 音频缓存目录
└── templates/       # HTML模板
    ├── base.html    # 基础模板
    ├── index.html   # 首页
    ├── learn.html   # 学习页面
    ├── game.html    # 游戏页面
    └── parent.html  # 家长面板
```

## 注意事项

1. 应用需要网络连接以使用百度语音API
2. 首次使用时会自动创建必要的目录和文件
3. 学习进度会存储在`progress.json`文件中 