"""
单词数据模块，包含所有3岁儿童英语学习的单词及其分类
"""

# 单词库 - 按照README中定义的8个分类
WORDS = {
    "animals": [
        {"word": "cat", "translation": "猫", "image": "cat.png"},
        {"word": "dog", "translation": "狗", "image": "dog.png"},
        {"word": "bird", "translation": "鸟", "image": "bird.png"},
        {"word": "fish", "translation": "鱼", "image": "fish.png"},
        {"word": "duck", "translation": "鸭子", "image": "duck.png"},
        {"word": "pig", "translation": "猪", "image": "pig.png"},
        {"word": "cow", "translation": "牛", "image": "cow.png"},
        {"word": "horse", "translation": "马", "image": "horse.png"},
        {"word": "sheep", "translation": "羊", "image": "sheep.png"},
        {"word": "rabbit", "translation": "兔子", "image": "rabbit.png"}
    ],
    "food": [
        {"word": "apple", "translation": "苹果", "image": "apple.png"},
        {"word": "banana", "translation": "香蕉", "image": "banana.png"},
        {"word": "milk", "translation": "牛奶", "image": "milk.png"},
        {"word": "bread", "translation": "面包", "image": "bread.png"},
        {"word": "cookie", "translation": "饼干", "image": "cookie.png"},
        {"word": "egg", "translation": "鸡蛋", "image": "egg.png"},
        {"word": "water", "translation": "水", "image": "water.png"},
        {"word": "juice", "translation": "果汁", "image": "juice.png"},
        {"word": "cake", "translation": "蛋糕", "image": "cake.png"},
        {"word": "candy", "translation": "糖果", "image": "candy.png"}
    ],
    "family": [
        {"word": "mom", "translation": "妈妈", "image": "mom.png"},
        {"word": "dad", "translation": "爸爸", "image": "dad.png"},
        {"word": "baby", "translation": "婴儿", "image": "baby.png"},
        {"word": "grandma", "translation": "奶奶/外婆", "image": "grandma.png"},
        {"word": "grandpa", "translation": "爷爷/外公", "image": "grandpa.png"},
        {"word": "sister", "translation": "姐姐/妹妹", "image": "sister.png"},
        {"word": "brother", "translation": "哥哥/弟弟", "image": "brother.png"},
        {"word": "family", "translation": "家庭", "image": "family.png"}
    ],
    "body": [
        {"word": "eye", "translation": "眼睛", "image": "eye.png"},
        {"word": "nose", "translation": "鼻子", "image": "nose.png"},
        {"word": "mouth", "translation": "嘴巴", "image": "mouth.png"},
        {"word": "hand", "translation": "手", "image": "hand.png"},
        {"word": "foot", "translation": "脚", "image": "foot.png"},
        {"word": "ear", "translation": "耳朵", "image": "ear.png"},
        {"word": "hair", "translation": "头发", "image": "hair.png"},
        {"word": "head", "translation": "头", "image": "head.png"},
        {"word": "arm", "translation": "胳膊", "image": "arm.png"},
        {"word": "leg", "translation": "腿", "image": "leg.png"}
    ],
    "things": [
        {"word": "cup", "translation": "杯子", "image": "cup.png"},
        {"word": "chair", "translation": "椅子", "image": "chair.png"},
        {"word": "bed", "translation": "床", "image": "bed.png"},
        {"word": "book", "translation": "书", "image": "book.png"},
        {"word": "ball", "translation": "球", "image": "ball.png"},
        {"word": "toy", "translation": "玩具", "image": "toy.png"},
        {"word": "phone", "translation": "电话", "image": "phone.png"},
        {"word": "door", "translation": "门", "image": "door.png"},
        {"word": "table", "translation": "桌子", "image": "table.png"},
        {"word": "car", "translation": "汽车", "image": "car.png"}
    ],
    "colors": [
        {"word": "red", "translation": "红色", "image": "red.png"},
        {"word": "blue", "translation": "蓝色", "image": "blue.png"},
        {"word": "yellow", "translation": "黄色", "image": "yellow.png"},
        {"word": "green", "translation": "绿色", "image": "green.png"},
        {"word": "black", "translation": "黑色", "image": "black.png"},
        {"word": "white", "translation": "白色", "image": "white.png"},
        {"word": "orange", "translation": "橙色", "image": "orange.png"},
        {"word": "purple", "translation": "紫色", "image": "purple.png"},
        {"word": "pink", "translation": "粉色", "image": "pink.png"}
    ],
    "numbers": [
        {"word": "one", "translation": "一", "image": "one.png"},
        {"word": "two", "translation": "二", "image": "two.png"},
        {"word": "three", "translation": "三", "image": "three.png"},
        {"word": "four", "translation": "四", "image": "four.png"},
        {"word": "five", "translation": "五", "image": "five.png"},
        {"word": "six", "translation": "六", "image": "six.png"},
        {"word": "seven", "translation": "七", "image": "seven.png"},
        {"word": "eight", "translation": "八", "image": "eight.png"},
        {"word": "nine", "translation": "九", "image": "nine.png"},
        {"word": "ten", "translation": "十", "image": "ten.png"}
    ],
    "actions": [
        {"word": "run", "translation": "跑", "image": "run.png"},
        {"word": "jump", "translation": "跳", "image": "jump.png"},
        {"word": "eat", "translation": "吃", "image": "eat.png"},
        {"word": "sleep", "translation": "睡觉", "image": "sleep.png"},
        {"word": "sit", "translation": "坐", "image": "sit.png"},
        {"word": "play", "translation": "玩", "image": "play.png"},
        {"word": "walk", "translation": "走", "image": "walk.png"},
        {"word": "drink", "translation": "喝", "image": "drink.png"},
        {"word": "smile", "translation": "微笑", "image": "smile.png"},
        {"word": "dance", "translation": "跳舞", "image": "dance.png"}
    ]
}

# 分类的中文名称和图标映射
CATEGORIES = {
    "animals": {"name": "动物", "icon": "animal_icon.png"},
    "food": {"name": "食物", "icon": "food_icon.png"},
    "family": {"name": "家庭", "icon": "family_icon.png"},
    "body": {"name": "身体", "icon": "body_icon.png"},
    "things": {"name": "物品", "icon": "things_icon.png"},
    "colors": {"name": "颜色", "icon": "color_icon.png"},
    "numbers": {"name": "数字", "icon": "number_icon.png"},
    "actions": {"name": "动作", "icon": "action_icon.png"}
}

def get_words_by_category(category):
    """
    获取指定分类的单词
    
    Args:
        category: 单词分类，如果是'all'则返回所有分类
        
    Returns:
        如果是特定分类，返回该分类的单词列表
        如果是'all'，返回所有分类及其信息
    """
    if category == 'all':
        return {
            "categories": CATEGORIES,
            "total_words": sum(len(words) for words in WORDS.values())
        }
    elif category in WORDS:
        return {
            "category": category,
            "category_info": CATEGORIES.get(category, {"name": category, "icon": "default_icon.png"}),
            "words": WORDS[category]
        }
    else:
        return {"error": "分类不存在"} 