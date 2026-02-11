import requests
from bs4 import BeautifulSoup

url = "https://www.cpkmetod.ru/test_atest/lab_delo_v_rentg.html"
resp = requests.get(url)
resp.encoding = resp.apparent_encoding  # на всякий случай для русского текста
html = resp.text
soup = BeautifulSoup(html, "html.parser")

# 1) Найдём блоки с вопросами.
# Часто они оформлены как div, table, tr, fieldset и т.п.
# Начнём с поиска всех <li class="choice">, а вопрос возьмём из ближайшего «заголовка» перед ними.
all_choices = soup.find_all("li", class_=["correct", "incorrect"])

questions = []  # список: { "q": "...", "answers": [("A", "text", is_correct), ...] }

letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
current_question = None

for li in all_choices:
    # Ищем текст вопроса выше по дереву: поднимаемся к родителю, пока не найдём что-то похожее на вопрос
    parent = li.parent
    q_text = None

    # Пытаемся найти вопрос в родительских элементах (h3, h4, b, strong, p и т.п.)
    p = parent
    while p is not None and q_text is None:
        # 1) Популярный вариант: вопрос может быть в теге с классом вроде 'qtext' или 'question'
        cand = p.find(["div", "p", "span", "td", "th", "b", "strong"], class_=lambda c: c and "q" in c.lower())
        if cand and cand.get_text(strip=True):
            q_text = cand.get_text(strip=True)
            break

        # 2) Или прямо перед списком li есть текстовый элемент (p, div, b, strong)
        prev = p.find_previous(["p", "div", "td", "th", "b", "strong"])
        if prev and prev.get_text(strip=True):
            q_text = prev.get_text(strip=True)
            break

        p = p.parent

    # Если это первый вариант ответа нового вопроса или вопрос сменился — создаём новую запись
    if current_question is None or (q_text and q_text != current_question["q"]):
        current_question = {
            "q": q_text if q_text else "Вопрос (текст не найден)",
            "answers": []
        }
        questions.append(current_question)

    # Текст варианта ответа
    a_text = li.get_text(" ", strip=True)

    # Индекс варианта для буквы (A, B, C...)
    idx = len(current_question["answers"])
    letter = letters[idx] if idx < len(letters) else f"X{idx}"

    is_correct = "correct" in (li.get("class") or [])

    current_question["answers"].append((letter, a_text, is_correct))

# Теперь печатаем в нужном формате
for q in questions:
    print(f"Q: {q['q']}")
    correct_letters = []
    for letter, text, is_correct in q["answers"]:
        print(f"{letter}: {text}")
        if is_correct:
            correct_letters.append(letter)
    if correct_letters:
        print(f"CORRECT: {','.join(correct_letters)}")
    else:
        print("CORRECT:")  # если вдруг не нашлось
    print()
