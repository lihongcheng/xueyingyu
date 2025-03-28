/**
 * 英语学习应用主要JavaScript文件
 * 为3岁儿童设计的简单交互功能
 */

// 音频播放功能
function playAudio(word, lang = 'auto') {
    // 创建音频URL，添加语言参数
    const audioUrl = `/api/speech?text=${encodeURIComponent(word)}&lang=${lang}`;
    
    // 创建新的音频元素
    const audio = new Audio(audioUrl);
    
    // 播放音频
    audio.play().catch(error => {
        console.error('音频播放失败:', error);
    });
}

// 初始化单词卡片功能
function initWordCards() {
    // 获取所有单词卡片
    const wordCards = document.querySelectorAll('.word-card');
    
    // 为每个卡片添加点击事件，实现翻转效果
    wordCards.forEach(card => {
        card.addEventListener('click', function() {
            this.classList.toggle('flipped');
        });
    });
    
    // 为正面的音频按钮添加点击事件（播放英文）
    const frontAudioButtons = document.querySelectorAll('.audio-btn-front');
    frontAudioButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // 阻止事件冒泡，防止触发卡片翻转
            e.stopPropagation();
            
            // 获取单词文本并播放英文
            const word = this.getAttribute('data-word');
            if (word) {
                playAudio(word, 'en');
                
                // 添加简单的动画效果
                this.classList.add('bounce');
                setTimeout(() => {
                    this.classList.remove('bounce');
                }, 1000);
            }
        });
    });
    
    // 为背面的音频按钮添加点击事件（播放中文）
    const backAudioButtons = document.querySelectorAll('.audio-btn-back');
    backAudioButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // 阻止事件冒泡，防止触发卡片翻转
            e.stopPropagation();
            
            // 获取翻译文本并播放中文
            const translation = this.getAttribute('data-translation');
            if (translation) {
                playAudio(translation, 'zh');
                
                // 添加简单的动画效果
                this.classList.add('bounce');
                setTimeout(() => {
                    this.classList.remove('bounce');
                }, 1000);
            }
        });
    });

    // 处理图片显示
    document.querySelectorAll('.word-image').forEach(img => {
        // 设置错误处理函数，在图片加载失败时显示占位符
        img.onerror = function() {
            const word = this.getAttribute('data-word') || '图片';
            const placeholder = document.createElement('div');
            placeholder.className = 'placeholder-image';
            placeholder.textContent = word;
            this.parentNode.replaceChild(placeholder, this);
        };
    });
}

// 加载特定分类的单词
function loadCategoryWords(category) {
    const wordContainer = document.getElementById('word-container');
    if (!wordContainer) return;
    
    // 显示加载中
    wordContainer.innerHTML = '<div class="loading">加载中...</div>';
    
    // 请求单词数据
    fetch(`/api/words?category=${category}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                wordContainer.innerHTML = `<div class="error">${data.error}</div>`;
                return;
            }
            
            // 清空容器
            wordContainer.innerHTML = '';
            
            // 添加分类标题
            const categoryInfo = data.category_info;
            if (categoryInfo && categoryInfo.name) {
                const titleElement = document.getElementById('category-title');
                if (titleElement) {
                    titleElement.textContent = categoryInfo.name;
                }
            }
            
            // 更新学习进度
            updateLearningProgress(category, data.words.length);
            
            // 显示第一个单词
            if (data.words && data.words.length > 0) {
                // 保存单词列表到全局变量
                window.words = data.words;
                window.currentIndex = 0;
                
                // 显示第一个单词
                showWord(0);
                
                // 更新导航按钮状态
                updateNavButtons();
            } else {
                wordContainer.innerHTML = '<div class="error">该分类没有单词</div>';
            }
        })
        .catch(error => {
            console.error('获取单词数据出错:', error);
            wordContainer.innerHTML = '<div class="error">获取单词失败，请重试</div>';
        });
}

// 更新学习进度
function updateLearningProgress(category, wordCount) {
    // 获取现有进度
    fetch('/api/progress')
        .then(response => response.json())
        .then(data => {
            // 默认值处理
            const progress = {
                learned_words: data.learned_words || 0,
                time_spent: data.time_spent || 0,
                last_category: category,
                categories: data.categories || {}
            };
            
            // 更新当前分类
            if (!progress.categories[category]) {
                progress.categories[category] = {
                    viewed: 0,
                    completed: false
                };
            }
            
            // 增加浏览次数
            progress.categories[category].viewed += 1;
            
            // 如果浏览次数达到3次，标记为已完成
            if (progress.categories[category].viewed >= 3) {
                progress.categories[category].completed = true;
            }
            
            // 计算总学习单词数
            progress.learned_words = Object.keys(progress.categories)
                .filter(cat => progress.categories[cat].completed)
                .reduce((total, cat) => total + wordCount, 0);
            
            // 保存进度
            fetch('/api/progress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(progress)
            });
        })
        .catch(error => {
            console.error('更新进度失败:', error);
        });
}

// 初始化游戏功能
function initGame(gameType) {
    // 根据游戏类型执行不同的初始化
    switch (gameType) {
        case 'matching':
            initMatchingGame();
            break;
        case 'listening':
            initListeningGame();
            break;
        case 'coloring':
            initColoringGame();
            break;
        default:
            console.error('未知游戏类型');
    }
}

// 初始化匹配游戏
function initMatchingGame() {
    const gameContainer = document.getElementById('game-content');
    if (!gameContainer) return;
    
    // 随机选择一个分类
    const categories = ['animals', 'food', 'colors', 'things'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    
    // 获取单词
    fetch(`/api/words?category=${randomCategory}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                gameContainer.innerHTML = `<div class="error">${data.error}</div>`;
                return;
            }
            
            // 从单词中随机选择6个
            const words = data.words;
            const selectedWords = [];
            const usedIndexes = new Set();
            
            // 随机选择6个单词（或少于6个，如果单词总数不足）
            const selectionCount = Math.min(6, words.length);
            while (selectedWords.length < selectionCount) {
                const index = Math.floor(Math.random() * words.length);
                if (!usedIndexes.has(index)) {
                    usedIndexes.add(index);
                    selectedWords.push(words[index]);
                }
            }
            
            // 创建匹配对（单词和图片）
            const pairs = [];
            selectedWords.forEach(word => {
                // 单词卡片
                pairs.push({
                    id: `word-${word.word}`,
                    type: 'word',
                    word: word.word,
                    match: `image-${word.word}`
                });
                
                // 图片卡片
                pairs.push({
                    id: `image-${word.word}`,
                    type: 'image',
                    image: word.image,
                    word: word.word,
                    match: `word-${word.word}`
                });
            });
            
            // 打乱顺序
            shuffleArray(pairs);
            
            // 创建游戏HTML
            gameContainer.innerHTML = `
                <div class="game-score">匹配数: <span id="match-count">0</span>/${selectedWords.length}</div>
                <div class="matching-game" id="matching-game"></div>
            `;
            
            const matchingGame = document.getElementById('matching-game');
            
            // 添加卡片
            pairs.forEach(pair => {
                const card = document.createElement('div');
                card.classList.add('matching-card');
                card.setAttribute('data-id', pair.id);
                card.setAttribute('data-match', pair.match);
                card.setAttribute('data-word', pair.word);
                
                if (pair.type === 'word') {
                    card.textContent = pair.word;
                } else {
                    // 检查是否有图片
                    if (pair.image) {
                        card.innerHTML = `<img src="/static/images/${pair.image}" alt="${pair.word}" data-word="${pair.word}" class="word-image" style="max-width:80%; max-height:80%;">`;
                    } else {
                        // 使用占位符代替图片
                        card.innerHTML = `<div class="game-placeholder">${pair.word.charAt(0).toUpperCase()}</div>`;
                    }
                }
                
                matchingGame.appendChild(card);
            });
            
            // 添加卡片点击事件
            let selectedCard = null;
            let matchCount = 0;
            const matchCountElement = document.getElementById('match-count');
            
            document.querySelectorAll('.matching-card').forEach(card => {
                card.addEventListener('click', function() {
                    // 如果已经匹配过，或者正在匹配中，则忽略点击
                    if (this.classList.contains('matched') || this.classList.contains('selected')) {
                        return;
                    }
                    
                    // 标记为选中
                    this.classList.add('selected');
                    
                    // 如果是第一张卡片
                    if (!selectedCard) {
                        selectedCard = this;
                        // 播放单词音频
                        playAudio(this.getAttribute('data-word'));
                        return;
                    }
                    
                    // 如果是第二张卡片
                    const match1 = selectedCard.getAttribute('data-match');
                    const match2 = this.getAttribute('data-id');
                    
                    // 检查是否匹配
                    if (match1 === match2) {
                        // 匹配成功
                        selectedCard.classList.add('matched');
                        this.classList.add('matched');
                        matchCount++;
                        matchCountElement.textContent = matchCount;
                        
                        // 播放单词音频
                        playAudio(this.getAttribute('data-word'));
                        
                        // 添加成功动画
                        selectedCard.classList.add('bounce');
                        this.classList.add('bounce');
                        
                        // 检查游戏是否结束
                        if (matchCount === selectedWords.length) {
                            setTimeout(() => {
                                alert('恭喜你完成了匹配游戏！');
                                
                                // 显示重新开始按钮
                                const restartButton = document.createElement('button');
                                restartButton.classList.add('btn');
                                restartButton.textContent = '再玩一次';
                                restartButton.addEventListener('click', () => {
                                    initMatchingGame();
                                });
                                
                                gameContainer.appendChild(restartButton);
                            }, 1000);
                        }
                        
                        selectedCard = null;
                    } else {
                        // 匹配失败
                        setTimeout(() => {
                            selectedCard.classList.remove('selected');
                            this.classList.remove('selected');
                            selectedCard = null;
                        }, 1000);
                    }
                });
            });
        })
        .catch(error => {
            console.error('加载游戏失败:', error);
            gameContainer.innerHTML = '<div class="error">加载游戏失败，请重试</div>';
        });
}

// 听音识图游戏
function initListeningGame() {
    const gameContainer = document.getElementById('game-content');
    if (!gameContainer) return;
    
    // 随机选择一个分类
    const categories = ['animals', 'food', 'colors', 'things'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    
    // 获取单词
    fetch(`/api/words?category=${randomCategory}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                gameContainer.innerHTML = `<div class="error">${data.error}</div>`;
                return;
            }
            
            // 随机选择4个单词
            const words = data.words;
            const selectedWords = [];
            const usedIndexes = new Set();
            
            // 随机选择4个单词（或少于4个，如果单词总数不足）
            const selectionCount = Math.min(4, words.length);
            while (selectedWords.length < selectionCount) {
                const index = Math.floor(Math.random() * words.length);
                if (!usedIndexes.has(index)) {
                    usedIndexes.add(index);
                    selectedWords.push(words[index]);
                }
            }
            
            // 创建游戏HTML
            gameContainer.innerHTML = `
                <div class="game-instruction">听单词，找图片</div>
                <button id="play-word" class="btn btn-secondary">播放单词</button>
                <div class="listening-game" id="listening-game"></div>
                <div class="game-score">得分: <span id="score">0</span></div>
            `;
            
            const listeningGame = document.getElementById('listening-game');
            
            // 添加图片选项
            selectedWords.forEach(word => {
                const card = document.createElement('div');
                card.classList.add('matching-card');
                card.setAttribute('data-word', word.word);
                
                // 检查是否有图片
                if (word.image) {
                    card.innerHTML = `<img src="/static/images/${word.image}" alt="${word.word}" data-word="${word.word}" class="word-image" style="max-width:80%; max-height:80%;">`;
                } else {
                    // 使用占位符替代图片
                    card.innerHTML = `<div class="game-placeholder">${word.word.charAt(0).toUpperCase()}</div>`;
                }
                
                listeningGame.appendChild(card);
            });
            
            // 游戏状态
            let currentWord = null;
            let score = 0;
            const scoreElement = document.getElementById('score');
            
            // 开始新一轮
            function startNewRound() {
                // 随机选择一个单词
                const randomIndex = Math.floor(Math.random() * selectedWords.length);
                currentWord = selectedWords[randomIndex].word;
                
                // 播放单词音频
                playAudio(currentWord);
            }
            
            // 播放按钮点击事件
            document.getElementById('play-word').addEventListener('click', () => {
                if (currentWord) {
                    playAudio(currentWord);
                }
            });
            
            // 添加图片点击事件
            document.querySelectorAll('.matching-card').forEach(card => {
                card.addEventListener('click', function() {
                    if (!currentWord) return;
                    
                    const selectedWord = this.getAttribute('data-word');
                    
                    if (selectedWord === currentWord) {
                        // 答对了
                        score++;
                        scoreElement.textContent = score;
                        
                        // 添加成功动画
                        this.classList.add('bounce');
                        
                        // 延迟开始下一轮
                        setTimeout(() => {
                            this.classList.remove('bounce');
                            startNewRound();
                        }, 1000);
                    } else {
                        // 答错了
                        this.classList.add('wrong');
                        setTimeout(() => {
                            this.classList.remove('wrong');
                        }, 1000);
                    }
                });
            });
            
            // 开始第一轮
            startNewRound();
        })
        .catch(error => {
            console.error('加载游戏失败:', error);
            gameContainer.innerHTML = '<div class="error">加载游戏失败，请重试</div>';
        });
}

// 简单的颜色填充游戏
function initColoringGame() {
    const gameContainer = document.getElementById('game-content');
    if (!gameContainer) return;
    
    // 创建游戏HTML
    gameContainer.innerHTML = `
        <div class="game-instruction">选择颜色，填充图形</div>
        <div class="color-palette" id="color-palette"></div>
        <div class="coloring-canvas-container">
            <svg id="coloring-canvas" width="600" height="400" viewBox="0 0 600 400">
                <rect x="50" y="50" width="100" height="100" fill="white" stroke="black" class="coloring-shape" />
                <circle cx="300" cy="100" r="50" fill="white" stroke="black" class="coloring-shape" />
                <polygon points="500,50 550,150 450,150" fill="white" stroke="black" class="coloring-shape" />
                <rect x="50" y="200" width="150" height="100" fill="white" stroke="black" class="coloring-shape" />
                <ellipse cx="300" cy="250" rx="70" ry="50" fill="white" stroke="black" class="coloring-shape" />
                <polygon points="450,200 550,200 500,300" fill="white" stroke="black" class="coloring-shape" />
            </svg>
        </div>
    `;
    
    // 颜色选择板
    const colorPalette = document.getElementById('color-palette');
    const colors = [
        {name: "red", value: "#FF6B6B"},
        {name: "blue", value: "#4ECDC4"},
        {name: "yellow", value: "#FFE66D"},
        {name: "green", value: "#7CED63"},
        {name: "purple", value: "#C56BFF"},
        {name: "orange", value: "#FF9A3E"}
    ];
    
    // 添加颜色选项
    colors.forEach(color => {
        const colorBtn = document.createElement('div');
        colorBtn.classList.add('color-btn');
        colorBtn.style.backgroundColor = color.value;
        colorBtn.setAttribute('data-color', color.value);
        colorBtn.setAttribute('data-name', color.name);
        colorPalette.appendChild(colorBtn);
    });
    
    // 当前选择的颜色
    let currentColor = null;
    
    // 颜色选择事件
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // 取消之前的选择
            document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('selected'));
            
            // 设置新选择
            this.classList.add('selected');
            currentColor = this.getAttribute('data-color');
            
            // 播放颜色名称
            playAudio(this.getAttribute('data-name'));
        });
    });
    
    // 图形填充事件
    document.querySelectorAll('.coloring-shape').forEach(shape => {
        shape.addEventListener('click', function() {
            if (currentColor) {
                this.setAttribute('fill', currentColor);
            }
        });
    });
}

// 洗牌数组函数
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 页面加载完成后执行初始化
document.addEventListener('DOMContentLoaded', function() {
    // 设置全局变量
    window.words = [];
    window.currentIndex = 0;
    
    // 获取当前页面类型
    const pageType = document.body.getAttribute('data-page');
    
    // 根据页面类型执行不同的初始化
    switch (pageType) {
        case 'home':
            // 首页初始化
            initHomePage();
            break;
        case 'learn':
            // 学习页面初始化
            const category = document.body.getAttribute('data-category');
            if (category) {
                loadCategoryWords(category);
            }
            break;
        case 'game':
            // 游戏页面初始化
            const gameType = document.body.getAttribute('data-game');
            if (gameType) {
                initGame(gameType);
            }
            break;
        case 'parent':
            // 家长控制面板初始化
            loadParentDashboard();
            break;
    }
});

// 初始化首页
function initHomePage() {
    const categoryGrid = document.getElementById('category-grid');
    if (!categoryGrid) return;
    
    // 获取分类数据
    fetch('/api/words?category=all')
        .then(response => response.json())
        .then(data => {
            // 清空加载提示
            categoryGrid.innerHTML = '';
            
            // 添加每个分类
            Object.keys(data.categories).forEach(categoryKey => {
                const category = data.categories[categoryKey];
                
                const categoryItem = document.createElement('a');
                categoryItem.classList.add('category-item');
                categoryItem.href = `/learn/${categoryKey}`;
                
                // 尝试加载图标，如果失败则使用占位符
                try {
                    const iconPath = `/static/images/${category.icon}`;
                    const img = new Image();
                    img.onload = function() {
                        categoryItem.innerHTML = `
                            <img src="${iconPath}" alt="${category.name}">
                            <div class="category-name">${category.name}</div>
                        `;
                    };
                    img.onerror = function() {
                        categoryItem.innerHTML = `
                            <div class="placeholder-icon">${category.name.charAt(0)}</div>
                            <div class="category-name">${category.name}</div>
                        `;
                    };
                    img.src = iconPath;
                } catch (e) {
                    categoryItem.innerHTML = `
                        <div class="placeholder-icon">${category.name.charAt(0)}</div>
                        <div class="category-name">${category.name}</div>
                    `;
                }
                
                categoryGrid.appendChild(categoryItem);
            });
        })
        .catch(error => {
            console.error('获取分类数据失败:', error);
            categoryGrid.innerHTML = '<div class="error">加载分类失败，请重试</div>';
        });
}

// 加载家长控制面板数据
function loadParentDashboard() {
    const progressContainer = document.getElementById('progress-container');
    if (!progressContainer) return;
    
    // 获取进度数据
    fetch('/api/progress')
        .then(response => response.json())
        .then(data => {
            // 默认值处理
            const progress = {
                learned_words: data.learned_words || 0,
                time_spent: data.time_spent || 0,
                last_category: data.last_category || null,
                categories: data.categories || {}
            };
            
            // 获取所有分类
            fetch('/api/words?category=all')
                .then(response => response.json())
                .then(categoriesData => {
                    // 创建进度HTML
                    let html = `
                        <div class="progress-summary">
                            <p>已学习单词：${progress.learned_words}</p>
                            <p>最近学习分类：${progress.last_category ? categoriesData.categories[progress.last_category].name : '无'}</p>
                        </div>
                        <h3>分类学习进度</h3>
                    `;
                    
                    // 添加各个分类的进度
                    Object.keys(categoriesData.categories).forEach(category => {
                        const categoryInfo = categoriesData.categories[category];
                        const categoryProgress = progress.categories[category] || { viewed: 0, completed: false };
                        const progressPercent = categoryProgress.completed ? 100 : (categoryProgress.viewed * 33);
                        
                        html += `
                            <div class="progress-item">
                                <div class="progress-label">
                                    <span>${categoryInfo.name}</span>
                                    <span>${progressPercent}%</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${progressPercent}%"></div>
                                </div>
                            </div>
                        `;
                    });
                    
                    // 添加设置选项
                    html += `
                        <div class="settings">
                            <h3>学习设置</h3>
                            <div class="setting-item">
                                <label for="time-limit">每日学习时间限制（分钟）</label>
                                <input type="number" id="time-limit" min="5" max="60" value="30">
                            </div>
                            <button id="save-settings" class="btn">保存设置</button>
                        </div>
                    `;
                    
                    progressContainer.innerHTML = html;
                    
                    // 保存设置按钮事件
                    document.getElementById('save-settings').addEventListener('click', function() {
                        const timeLimit = document.getElementById('time-limit').value;
                        alert(`设置已保存！每日学习时间限制：${timeLimit}分钟`);
                    });
                });
        })
        .catch(error => {
            console.error('加载进度数据失败:', error);
            progressContainer.innerHTML = '<div class="error">加载进度数据失败，请重试</div>';
        });
}

// 显示指定索引的单词
function showWord(index) {
    if (!window.words || index < 0 || index >= window.words.length) return;
    
    window.currentIndex = index;
    const word = window.words[index];
    
    const wordContainer = document.getElementById('word-container');
    if (!wordContainer) return;
    
    wordContainer.innerHTML = '';
    
    // 创建单词卡片
    const cardElement = document.createElement('div');
    cardElement.classList.add('word-card');
    
    // 检查是否有图片数据
    let imageContent = '';
    if (word.image) {
        // 使用图片
        imageContent = `<img src="/static/images/${word.image}" alt="${word.word}" data-word="${word.word}" class="word-image">`;
    } else {
        // 使用占位符
        imageContent = `<div class="placeholder-image">${word.word}</div>`;
    }
    
    cardElement.innerHTML = `
        <div class="word-card-inner">
            <div class="word-card-front">
                ${imageContent}
                <div class="word-text">${word.word}</div>
                <button class="audio-btn audio-btn-front" data-word="${word.word}">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 9V15H7L12 20V4L7 9H3Z" fill="white"/>
                        <path d="M16.5 12C16.5 10.23 15.48 8.71 14 7.97V16.02C15.48 15.29 16.5 13.77 16.5 12Z" fill="white"/>
                        <path d="M14 3.23V5.29C16.89 6.15 19 8.83 19 12C19 15.17 16.89 17.85 14 18.71V20.77C18.01 19.86 21 16.28 21 12C21 7.72 18.01 4.14 14 3.23Z" fill="white"/>
                    </svg>
                </button>
            </div>
            <div class="word-card-back">
                ${imageContent}
                <div class="word-translation">${word.translation}</div>
                <button class="audio-btn audio-btn-back" data-translation="${word.translation}">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 9V15H7L12 20V4L7 9H3Z" fill="white"/>
                        <path d="M16.5 12C16.5 10.23 15.48 8.71 14 7.97V16.02C15.48 15.29 16.5 13.77 16.5 12Z" fill="white"/>
                        <path d="M14 3.23V5.29C16.89 6.15 19 8.83 19 12C19 15.17 16.89 17.85 14 18.71V20.77C18.01 19.86 21 16.28 21 12C21 7.72 18.01 4.14 14 3.23Z" fill="white"/>
                    </svg>
                </button>
            </div>
        </div>
    `;
    
    wordContainer.appendChild(cardElement);
    
    // 初始化卡片功能
    initWordCards();
    
    // 自动播放单词发音
    setTimeout(() => {
        playAudio(word.word, 'en');
    }, 500);
}

// 更新导航按钮状态
function updateNavButtons() {
    const prevBtn = document.getElementById('previous-word');
    const nextBtn = document.getElementById('next-word');
    
    if (!prevBtn || !nextBtn || !window.words) return;
    
    prevBtn.disabled = window.currentIndex === 0;
    nextBtn.disabled = window.currentIndex === window.words.length - 1;
    
    prevBtn.style.opacity = prevBtn.disabled ? 0.5 : 1;
    nextBtn.style.opacity = nextBtn.disabled ? 0.5 : 1;
}