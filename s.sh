#!/bin/bash

# Указанная директория (по умолчанию текущая)
DIR="${1:-.}"

# Рекурсивно проходим по файлам, используя find для гибкого исключения
# директорий и файлов.
find "$DIR" \
    -type d \( \
        -name ".git" -o \
        -name "node_modules" -o \
        -name "vendor" -o \
        -name "dist" -o \
        -name "build" -o \
        -name "target" -o \
        -name "out" -o \
        -name ".vscode" -o \
        -name ".idea" -o \
        -name "__pycache__" \
    \) -prune \
    -o \
    -type f \
    ! -name "package-lock.json" \
    ! -name "yarn.lock" \
    ! -name "*.log" \
    ! -name "*.DS_Store" \
    ! -name "Thumbs.db" \
    ! -name ".env" \
    ! -name "*.min.*" \
    -print \
| while read -r file; do
    echo "// $file"
    echo -e "\n\r"
    cat "$file"
    echo -e "\n\r\n\r\n\r"
done