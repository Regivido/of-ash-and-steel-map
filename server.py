#!/usr/bin/env python3
"""
Сервер для запуска интерактивной карты Of Ash and Steel
"""

import http.server
import socketserver
import webbrowser
import os
import sys
import time
from pathlib import Path

PORT = 8000
INDEX_FILE = "index.html"
HOST = "localhost"

class CORSRequestHandler(http.server.SimpleHTTPRequestHandler):
    """HTTP-обработчик с поддержкой CORS"""
    
    def end_headers(self):
        # Добавляем заголовки CORS для разрешения загрузки JSON
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()
    
    def log_message(self, format, *args):
        """Кастомизируем логирование"""
        timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
        print(f"[{timestamp}] {args[0]} {args[1]} {args[2]}")

def check_requirements():
    """Проверяем наличие необходимых файлов"""
    required_files = [INDEX_FILE, "script.js", "style.css"]
    missing_files = []
    
    for file in required_files:
        if not os.path.exists(file):
            missing_files.append(file)
    
    if missing_files:
        print("❌ Ошибка: отсутствуют необходимые файлы:")
        for file in missing_files:
            print(f"   - {file}")
        return False
    
    print("✅ Все необходимые файлы найдены")
    return True

def start_server():
    """Запускаем HTTP сервер"""
    print("=" * 50)
    print("СЕРВЕР ДЛЯ ИНТЕРАКТИВНОЙ КАРТЫ OF ASH AND STEEL")
    print("=" * 50)
    print()
    
    if not check_requirements():
        print("\n❌ Исправьте ошибки и запустите снова")
        input("Нажмите Enter для выхода...")
        return
    
    # Меняем рабочую директорию на директорию скрипта
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    try:
        # Создаем сервер
        handler = CORSRequestHandler
        with socketserver.TCPServer(("", PORT), handler) as httpd:
            print(f"✅ Сервер запущен на http://{HOST}:{PORT}")
            print(f"📁 Рабочая директория: {script_dir}")
            print()
            print("📄 Основные файлы:")
            print(f"   - Карта: http://{HOST}:{PORT}/")
            print(f"   - JSON данные: http://{HOST}:{PORT}/tags.json")
            print(f"   - Скрипт: http://{HOST}:{PORT}/script.js")
            print(f"   - Стили: http://{HOST}:{PORT}/style.css")
            print()
            print("🔧 Инструменты:")
            print("   - Для остановки сервера нажмите Ctrl+C")
            print("   - Для перезагрузки страницы в браузере нажмите F5")
            print()
            
            # Автоматически открываем браузер
            try:
                url = f"http://{HOST}:{PORT}"
                print(f"🌐 Открываю браузер...")
                webbrowser.open(url)
                print(f"✅ Браузер открыт по адресу: {url}")
            except Exception as e:
                print(f"⚠️  Не удалось открыть браузер автоматически: {e}")
                print(f"   Откройте вручную: {url}")
            
            print("\n" + "=" * 50)
            print("Журнал запросов:")
            print("=" * 50)
            
            try:
                httpd.serve_forever()
            except KeyboardInterrupt:
                print("\n\n⏹️  Сервер остановлен пользователем")
                httpd.server_close()
                
    except OSError as e:
        if e.errno == 10048:
            print(f"\n❌ Ошибка: Порт {PORT} уже используется!")
            print("   Возможно, сервер уже запущен в другом окне")
            print("   Закройте другое окно или измените порт в server.py")
        else:
            print(f"\n❌ Ошибка запуска сервера: {e}")
    except Exception as e:
        print(f"\n❌ Неожиданная ошибка: {e}")

if __name__ == "__main__":
    try:
        start_server()
    except KeyboardInterrupt:
        print("\n\n👋 До свидания!")
    finally:
        input("\nНажмите Enter для выхода...")