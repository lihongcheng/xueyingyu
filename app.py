import os
import logging
import hashlib
import requests
from flask import Flask, request, jsonify, send_file, render_template, redirect, url_for
from flask_cors import CORS

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # 启用跨域请求

# 创建音频缓存目录
AUDIO_CACHE_DIR = os.path.join(os.path.dirname(__file__), 'static', 'audio_cache')
os.makedirs(AUDIO_CACHE_DIR, exist_ok=True)

# 百度API配置
BAIDU_API_KEY = 'xx'
BAIDU_SECRET_KEY = 'xx'

def get_baidu_token():
    """获取百度API访问令牌"""
    try:
        token_url = "https://aip.baidubce.com/oauth/2.0/token"
        params = {
            "grant_type": "client_credentials",
            "client_id": BAIDU_API_KEY,
            "client_secret": BAIDU_SECRET_KEY
        }
        response = requests.post(token_url, params=params)
        if response.status_code == 200:
            return response.json().get("access_token")
        else:
            logger.error(f"百度API令牌获取失败: {response.text}")
            return None
    except Exception as e:
        logger.error(f"获取百度令牌出错: {str(e)}")
        return None

@app.route('/')
def index():
    """主页"""
    return render_template('index.html')

@app.route('/learn/<category>')
def learn_category(category):
    """学习特定分类的单词"""
    return render_template('learn.html', category=category)

@app.route('/game/<game_type>')
def play_game(game_type):
    """玩指定类型的游戏"""
    return render_template('game.html', game_type=game_type)

@app.route('/parent')
def parent_dashboard():
    """家长控制面板"""
    return render_template('parent.html')

@app.route('/api/words')
def get_words():
    """获取单词列表API"""
    category = request.args.get('category', 'all')
    from word_data import get_words_by_category
    words = get_words_by_category(category)
    return jsonify(words)

@app.route('/api/speech')
def text_to_speech():
    """文本转语音API"""
    text = request.args.get('text', '')
    lang = request.args.get('lang', 'auto')  # 语言参数：auto, zh, en
    skip_cache = request.args.get('skip_cache', False) == 'true'
    
    if not text:
        return jsonify({'error': '缺少文本参数'}), 400
    
    try:
        # 自动检测语言
        if lang == 'auto':
            # 简单的语言检测逻辑：如果包含中文字符则视为中文
            contains_chinese = any('\u4e00' <= char <= '\u9fff' for char in text)
            lang = 'zh' if contains_chinese else 'en'
        
        # 使用MD5哈希值代替直接文本命名，避免特殊字符问题
        text_hash = hashlib.md5((text + lang).encode('utf-8')).hexdigest()
        cache_filename = os.path.join(AUDIO_CACHE_DIR, f"{text_hash}.mp3")
        
        # 记录缓存路径和文本内容的映射，方便调试
        logger.info(f"尝试获取音频: '{text}' (语言: {lang}) -> 缓存路径: {cache_filename}")
        
        # 检查缓存
        if not skip_cache and os.path.exists(cache_filename):
            logger.info(f"从缓存返回音频: '{text}'")
            response = send_file(cache_filename, mimetype='audio/mp3')
            # 添加no-cache头，避免浏览器缓存
            response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
            response.headers['Pragma'] = 'no-cache'
            response.headers['Expires'] = '0'
            return response
        
        # 调用百度API
        token = get_baidu_token()
        if not token:
            logger.warning("未能获取百度API令牌，使用备选方案")
            return jsonify({'error': '语音服务暂不可用'}), 503
        
        url = "https://tsn.baidu.com/text2audio"
        
        # 根据语言设置不同参数
        if lang == 'zh':
            # 中文语音参数
            params = {
                'tex': text,
                'tok': token,
                'cuid': 'kids_english_app',
                'ctp': 1,
                'lan': 'zh',  # 中文
                'spd': 3,     # 语速，可选0-15，中文适合稍慢
                'pit': 5,     # 音调，可选0-15
                'vol': 15,    # 音量，可选0-15
                'per': 3,     # 发音人, 0:女声(默认)，1:男声，4:女童声
                'aue': 3      # 音频格式，3:mp3格式
            }
        else:
            # 英文语音参数
            params = {
                'tex': text,
                'tok': token,
                'cuid': 'kids_english_app',
                'ctp': 1,
                'lan': 'en',  # 英语
                'spd': 4,     # 语速，可选0-15，英文适合稍快
                'pit': 5,     # 音调，可选0-15
                'vol': 15,    # 音量，可选0-15
                'per': 3,     # 发音人, 3:英文男声
                'aue': 3      # 音频格式，3:mp3格式
            }
        
        logger.info(f"请求百度语音API: '{text}' (语言: {lang})")
        response = requests.get(url, params=params, stream=True)
        
        if response.headers.get('Content-Type') == 'audio/mp3':
            # 保存到缓存
            with open(cache_filename, 'wb') as f:
                for chunk in response.iter_content(chunk_size=1024):
                    if chunk:
                        f.write(chunk)
            
            logger.info(f"生成音频成功: '{text}'")
            response = send_file(cache_filename, mimetype='audio/mp3')
            # 添加no-cache头，避免浏览器缓存
            response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
            response.headers['Pragma'] = 'no-cache'
            response.headers['Expires'] = '0'
            return response
        else:
            logger.error(f"百度语音合成失败: {response.text}")
            return jsonify({'error': '语音生成失败'}), 500
    
    except Exception as e:
        logger.error(f"文本转语音出错: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/progress', methods=['GET', 'POST'])
def handle_progress():
    """处理学习进度"""
    if request.method == 'GET':
        # 从简单的JSON文件中读取进度数据
        try:
            if os.path.exists('progress.json'):
                with open('progress.json', 'r') as f:
                    import json
                    return jsonify(json.load(f))
            else:
                return jsonify({"learned_words": 0, "time_spent": 0, "last_category": None})
        except Exception as e:
            logger.error(f"读取进度数据出错: {str(e)}")
            return jsonify({"error": str(e)}), 500
    else:  # POST
        try:
            import json
            data = request.json
            with open('progress.json', 'w') as f:
                json.dump(data, f)
            return jsonify({"status": "success"})
        except Exception as e:
            logger.error(f"保存进度数据出错: {str(e)}")
            return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001) 