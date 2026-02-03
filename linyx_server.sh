#!/bin/bash

# start_server.sh
echo "========================================"
echo "Запуск сервера для интерактивной карты"
echo "========================================"
echo ""

# Проверяем Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Ошибка: Python3 не найден!"
    echo "Установите Python3:"
    echo "  macOS: brew install python3"
    echo "  Ubuntu/Debian: sudo apt install python3"
    echo "  Fedora: sudo dnf install python3"
    exit 1
fi

echo "✅ Python3 найден: $(python3 --version)"
echo ""

# Проверяем файлы
required_files=("index.html" "script.js" "style.css")
missing_files=()

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -gt 0 ]; then
    echo "❌ Отсутствуют файлы:"
    for file in "${missing_files[@]}"; do
        echo "   - $file"
    done
    exit 1
fi

echo "✅ Все файлы на месте"
echo ""

# Запускаем сервер
echo "🚀 Запускаю сервер..."
echo ""
echo "========================================"
echo "Сервер запущен!"
echo "========================================"
echo ""
echo "🌐 Откройте в браузере:"
echo "   http://localhost:8000"
echo ""
echo "⚡ Для остановки сервера нажмите Ctrl+C"
echo ""

# Запускаем Python сервер
python3 -m http.server 8000

echo ""
echo "👋 Сервер остановлен"