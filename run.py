#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
3岁儿童英语学习应用启动脚本
"""

import os
import sys
import webbrowser
import time
from threading import Timer

def open_browser():
    """在浏览器中打开应用"""
    webbrowser.open('http://127.0.0.1:5000/')

def main():
    """主函数"""
    # 检查必要的目录是否存在
    print("检查应用环境...")
    os.makedirs('static/images', exist_ok=True)
    os.makedirs('static/audio_cache', exist_ok=True)
    
    print("启动儿童英语学习应用...")
    # 延迟1秒后自动打开浏览器
    Timer(1, open_browser).start()
    
    # 启动Flask应用
    from app import app
    app.run(debug=True)

if __name__ == "__main__":
    main() 