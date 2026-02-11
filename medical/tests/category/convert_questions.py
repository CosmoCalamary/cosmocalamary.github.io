#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Скрипт для конвертации вопросов из различных форматов в questions.txt
Поддерживает: CSV, Excel (XLSX), JSON, простой текст
"""

import sys
import os

def convert_from_csv(input_file, output_file='questions.txt'):
    """
    Конвертация из CSV файла
    Формат CSV: Вопрос,Вариант_A,Вариант_B,Вариант_C,Вариант_D,Правильный
    """
    import csv
    
    with open(input_file, 'r', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        with open(output_file, 'w', encoding='utf-8') as output:
            for row in reader:
                output.write(f"Q: {row['Вопрос']}\n")
                
                # Динамически добавляем варианты ответов
                for letter in 'ABCDEFGHIJ':
                    key = f'Вариант_{letter}'
                    if key in row and row[key].strip():
                        output.write(f"{letter}: {row[key]}\n")
                
                output.write(f"CORRECT: {row['Правильный']}\n\n")
    
    print(f"✅ Конвертация завершена! Создан файл: {output_file}")


def convert_from_excel(input_file, output_file='questions.txt'):
    """
    Конвертация из Excel файла
    Колонки: Вопрос | Вариант_A | Вариант_B | Вариант_C | Вариант_D | Правильный
    """
    try:
        import openpyxl
    except ImportError:
        print("❌ Ошибка: Установите openpyxl через: pip install openpyxl")
        return
    
    wb = openpyxl.load_workbook(input_file)
    ws = wb.active
    
    with open(output_file, 'w', encoding='utf-8') as output:
        # Пропускаем заголовок (первая строка)
        for row in ws.iter_rows(min_row=2, values_only=True):
            if not row[0]:  # Пропускаем пустые строки
                continue
            
            output.write(f"Q: {row[0]}\n")
            
            # Варианты ответов (колонки 1-5)
            letters = 'ABCDE'
            for i, letter in enumerate(letters):
                if i + 1 < len(row) and row[i + 1]:
                    output.write(f"{letter}: {row[i + 1]}\n")
            
            # Правильный ответ (последняя заполненная колонка)
            correct = row[-1] if row[-1] else 'A'
            output.write(f"CORRECT: {correct}\n\n")
    
    print(f"✅ Конвертация завершена! Создан файл: {output_file}")


def convert_from_json(input_file, output_file='questions.txt'):
    """
    Конвертация из JSON файла
    Формат: [{"question": "...", "answers": ["A", "B", "C"], "correct": "A"}]
    """
    import json
    
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    with open(output_file, 'w', encoding='utf-8') as output:
        for item in data:
            output.write(f"Q: {item['question']}\n")
            
            letters = 'ABCDEFGHIJ'
            for i, answer in enumerate(item['answers']):
                output.write(f"{letters[i]}: {answer}\n")
            
            output.write(f"CORRECT: {item['correct']}\n\n")
    
    print(f"✅ Конвертация завершена! Создан файл: {output_file}")


def convert_from_text(input_file, output_file='questions.txt'):
    """
    Конвертация из простого текстового файла
    Формат: каждый вопрос разделен двойным переносом строки
    Первая строка - вопрос
    Следующие строки - варианты (автоматически помечаются A, B, C...)
    Последняя строка - номер правильного ответа (1, 2, 3) или буква (A, B, C)
    """
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    questions = content.strip().split('\n\n')
    
    with open(output_file, 'w', encoding='utf-8') as output:
        for q_block in questions:
            lines = [l.strip() for l in q_block.split('\n') if l.strip()]
            if len(lines) < 3:
                continue
            
            # Первая строка - вопрос
            output.write(f"Q: {lines[0]}\n")
            
            # Средние строки - варианты ответов
            letters = 'ABCDEFGHIJ'
            for i, answer in enumerate(lines[1:-1]):
                output.write(f"{letters[i]}: {answer}\n")
            
            # Последняя строка - правильный ответ
            correct = lines[-1]
            # Если это число, конвертируем в букву
            if correct.isdigit():
                correct = letters[int(correct) - 1]
            output.write(f"CORRECT: {correct}\n\n")
    
    print(f"✅ Конвертация завершена! Создан файл: {output_file}")


def show_help():
    """Показать справку по использованию"""
    help_text = """
📚 Конвертер вопросов для медицинского тренажера

Использование:
    python convert_questions.py <входной_файл> [выходной_файл]

Поддерживаемые форматы:
    📄 CSV  (.csv)   - Вопрос,Вариант_A,Вариант_B,Вариант_C,Правильный
    📊 Excel (.xlsx) - Аналогично CSV в виде таблицы
    🔤 JSON (.json)  - [{"question": "...", "answers": [...], "correct": "A"}]
    📝 Text (.txt)   - Простой текст с разделением двойным переносом

Примеры:

1. Из CSV:
    python convert_questions.py questions.csv

2. Из Excel:
    python convert_questions.py questions.xlsx questions.txt

3. Из JSON:
    python convert_questions.py data.json

Формат CSV/Excel:
-----------------
Вопрос | Вариант_A | Вариант_B | Вариант_C | Вариант_D | Правильный
Что?   | Ответ 1   | Ответ 2   | Ответ 3   | Ответ 4   | A
Как?   | Так       | Не так    | Иначе     | Никак     | B,C

Формат простого текста:
-----------------------
Вопрос номер 1?
Первый вариант
Второй вариант
Третий вариант
A

Вопрос номер 2?
Вариант A
Вариант B
Вариант C
Вариант D
B,C

Примечания:
    • Для множественного выбора: CORRECT: A,B,C
    • Файлы должны быть в кодировке UTF-8
    • Пустые строки игнорируются
"""
    print(help_text)


def main():
    if len(sys.argv) < 2 or sys.argv[1] in ['-h', '--help', 'help']:
        show_help()
        return
    
    input_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else 'questions.txt'
    
    if not os.path.exists(input_file):
        print(f"❌ Ошибка: Файл '{input_file}' не найден!")
        return
    
    # Определяем формат по расширению
    ext = os.path.splitext(input_file)[1].lower()
    
    print(f"🔄 Начинаю конвертацию из {ext} формата...")
    
    try:
        if ext == '.csv':
            convert_from_csv(input_file, output_file)
        elif ext in ['.xlsx', '.xls']:
            convert_from_excel(input_file, output_file)
        elif ext == '.json':
            convert_from_json(input_file, output_file)
        elif ext == '.txt':
            convert_from_text(input_file, output_file)
        else:
            print(f"❌ Неподдерживаемый формат: {ext}")
            print("Поддерживаются: .csv, .xlsx, .json, .txt")
            return
        
        # Проверяем результат
        with open(output_file, 'r', encoding='utf-8') as f:
            content = f.read()
            num_questions = content.count('Q:')
            print(f"📊 Конвертировано вопросов: {num_questions}")
            
    except Exception as e:
        print(f"❌ Ошибка при конвертации: {e}")
        import traceback
        traceback.print_exc()


if __name__ == '__main__':
    main()
