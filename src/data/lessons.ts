import type { Lesson } from '../types'

export const lessons: Lesson[] = [
  {
    id: 1,
    title: 'Знакомство с Java',
    description: 'Первая программа, JDK и структура кода',
    duration: '20 мин',
    icon: '01',
    theory: [
      'Java — объектно-ориентированный язык программирования. Исходный код компилируется в байт-код, который выполняет виртуальная машина JVM.',
      'Каждая программа состоит из классов. Метод main является точкой входа: именно с него начинается выполнение приложения.',
      'Команда System.out.println выводит значение в консоль и переводит курсор на новую строку.',
    ],
    code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Привет, Java!");
    }
}`,
    quiz: [
      { question: 'Как называется точка входа в Java-программу?', options: ['start', 'main', 'run', 'init'], correct: 1 },
      { question: 'Что выполняет байт-код Java?', options: ['JVM', 'HTML', 'Браузер', 'Git'], correct: 0 },
    ],
    task: 'Напишите программу, которая выводит две строки: ваше имя и текст «Я изучаю Java».',
    hint: 'Используйте System.out.println два раза.',
    solution: `public class Main {
    public static void main(String[] args) {
        System.out.println("Алексей");
        System.out.println("Я изучаю Java");
    }
}`,
  },
  {
    id: 2,
    title: 'Переменные и типы',
    description: 'Числа, строки, символы и логические значения',
    duration: '25 мин',
    icon: '02',
    theory: [
      'Переменная хранит значение определённого типа. Перед использованием указываются тип, имя и начальное значение.',
      'Основные типы: int для целых чисел, double для дробных, boolean для логических значений, char для одного символа и String для текста.',
      'Оператор + складывает числа, а при работе со строками объединяет текст.',
    ],
    code: `String name = "Анна";
int age = 19;
double average = 4.7;
boolean student = true;

System.out.println(name + ", " + age);`,
    quiz: [
      { question: 'Какой тип хранит целые числа?', options: ['String', 'boolean', 'int', 'double'], correct: 2 },
      { question: 'Как записывается строка?', options: ["'Java'", '"Java"', '[Java]', '{Java}'], correct: 1 },
    ],
    task: 'Создайте переменные product, price и count. Выведите название товара и итоговую стоимость.',
    hint: 'Итоговая стоимость вычисляется как price * count.',
    solution: `String product = "Книга";
double price = 450.0;
int count = 2;
double total = price * count;
System.out.println(product + ": " + total);`,
  },
  {
    id: 3,
    title: 'Условия',
    description: 'Ветвление программы с if, else и switch',
    duration: '25 мин',
    icon: '03',
    theory: [
      'Условный оператор if выполняет блок кода, только если выражение в круглых скобках истинно.',
      'С помощью else задаётся альтернативный блок. Несколько вариантов можно проверить конструкцией else if.',
      'Для сравнения используются операторы ==, !=, >, <, >= и <=. Логические условия объединяются операторами && и ||.',
    ],
    code: `int temperature = 18;

if (temperature >= 25) {
    System.out.println("Жарко");
} else if (temperature >= 15) {
    System.out.println("Тепло");
} else {
    System.out.println("Холодно");
}`,
    quiz: [
      { question: 'Какой оператор означает «и»?', options: ['||', '&&', '!=', '=='], correct: 1 },
      { question: 'Как проверить равенство?', options: ['=', '===', '==', '!='], correct: 2 },
    ],
    task: 'По значению переменной score выведите оценку: 90–100 — «Отлично», 70–89 — «Хорошо», иначе — «Нужно повторить».',
    hint: 'Начинайте проверку с самого большого значения.',
    solution: `int score = 82;
if (score >= 90) {
    System.out.println("Отлично");
} else if (score >= 70) {
    System.out.println("Хорошо");
} else {
    System.out.println("Нужно повторить");
}`,
  },
  {
    id: 4,
    title: 'Циклы',
    description: 'Повторение действий с for и while',
    duration: '30 мин',
    icon: '04',
    theory: [
      'Цикл for удобен, когда заранее известно количество повторений. Он содержит начальное значение, условие и изменение счётчика.',
      'Цикл while выполняется, пока условие истинно. Важно изменять переменные условия, иначе цикл станет бесконечным.',
      'Оператор break завершает цикл, а continue переходит к следующей итерации.',
    ],
    code: `int sum = 0;

for (int i = 1; i <= 5; i++) {
    sum += i;
}

System.out.println(sum);`,
    quiz: [
      { question: 'Какой цикл удобен при известном количестве повторений?', options: ['if', 'switch', 'for', 'try'], correct: 2 },
      { question: 'Что делает break?', options: ['Пропускает итерацию', 'Завершает цикл', 'Начинает цикл', 'Удаляет переменную'], correct: 1 },
    ],
    task: 'С помощью цикла выведите чётные числа от 2 до 20.',
    hint: 'Увеличивайте счётчик сразу на 2.',
    solution: `for (int i = 2; i <= 20; i += 2) {
    System.out.println(i);
}`,
  },
  {
    id: 5,
    title: 'Массивы',
    description: 'Хранение наборов данных и работа с индексами',
    duration: '30 мин',
    icon: '05',
    theory: [
      'Массив хранит несколько значений одного типа. Размер массива задаётся при создании и не меняется.',
      'Индексация начинается с нуля. Первый элемент имеет индекс 0, а последний — length - 1.',
      'Перебрать все элементы можно обычным for или сокращённым циклом for-each.',
    ],
    code: `int[] scores = {78, 92, 85, 67};
int max = scores[0];

for (int score : scores) {
    if (score > max) max = score;
}

System.out.println(max);`,
    quiz: [
      { question: 'Какой индекс у первого элемента?', options: ['-1', '0', '1', '2'], correct: 1 },
      { question: 'Как получить размер массива?', options: ['size()', 'count', 'length', 'getSize()'], correct: 2 },
    ],
    task: 'Найдите среднее значение элементов массива {4, 8, 15, 16, 23, 42}.',
    hint: 'Сложите элементы в цикле и разделите сумму на array.length.',
    solution: `int[] numbers = {4, 8, 15, 16, 23, 42};
int sum = 0;
for (int number : numbers) {
    sum += number;
}
double average = (double) sum / numbers.length;
System.out.println(average);`,
  },
  {
    id: 6,
    title: 'Методы',
    description: 'Повторное использование кода и параметры',
    duration: '30 мин',
    icon: '06',
    theory: [
      'Метод — именованный блок кода, который выполняет отдельную задачу. Методы помогают не повторять одинаковый код.',
      'Параметры передают значения внутрь метода. Тип перед именем метода определяет возвращаемое значение.',
      'Если результат не возвращается, используется тип void. Оператор return возвращает значение и завершает метод.',
    ],
    code: `static int square(int number) {
    return number * number;
}

public static void main(String[] args) {
    int result = square(6);
    System.out.println(result);
}`,
    quiz: [
      { question: 'Какое слово возвращает результат?', options: ['send', 'result', 'return', 'back'], correct: 2 },
      { question: 'Что означает void?', options: ['Метод ничего не возвращает', 'Пустой параметр', 'Ошибка', 'Ноль'], correct: 0 },
    ],
    task: 'Создайте метод max, который принимает два целых числа и возвращает большее.',
    hint: 'Внутри метода используйте if или тернарный оператор.',
    solution: `static int max(int a, int b) {
    if (a > b) {
        return a;
    }
    return b;
}`,
  },
  {
    id: 7,
    title: 'Классы и объекты',
    description: 'Основы объектно-ориентированного подхода',
    duration: '35 мин',
    icon: '07',
    theory: [
      'Класс описывает свойства и поведение сущности. Объект — конкретный экземпляр класса со своими значениями полей.',
      'Поля хранят состояние объекта, а методы описывают его действия. Объект создаётся оператором new.',
      'Конструктор вызывается при создании объекта и обычно задаёт начальные значения полей.',
    ],
    code: `class Student {
    String name;
    int course;

    Student(String name, int course) {
        this.name = name;
        this.course = course;
    }

    void introduce() {
        System.out.println(name + ", курс " + course);
    }
}`,
    quiz: [
      { question: 'Как создаётся объект?', options: ['create', 'new', 'make', 'class'], correct: 1 },
      { question: 'Что хранит состояние объекта?', options: ['Поля', 'Пакеты', 'Импорты', 'Комментарии'], correct: 0 },
    ],
    task: 'Создайте класс Book с полями title и author, конструктором и методом printInfo.',
    hint: 'Конструктор называется так же, как класс.',
    solution: `class Book {
    String title;
    String author;

    Book(String title, String author) {
        this.title = title;
        this.author = author;
    }

    void printInfo() {
        System.out.println(title + " — " + author);
    }
}`,
  },
  {
    id: 8,
    title: 'Наследование',
    description: 'Расширение классов и полиморфизм',
    duration: '35 мин',
    icon: '08',
    theory: [
      'Наследование позволяет создать новый класс на основе существующего. Для этого используется ключевое слово extends.',
      'Дочерний класс получает доступные поля и методы родителя и может добавлять собственные.',
      'Переопределение метода позволяет изменить поведение в дочернем классе. Аннотация @Override помогает обнаружить ошибку.',
    ],
    code: `class Animal {
    void speak() {
        System.out.println("Звук");
    }
}

class Dog extends Animal {
    @Override
    void speak() {
        System.out.println("Гав");
    }
}`,
    quiz: [
      { question: 'Какое слово задаёт наследование?', options: ['implements', 'inherits', 'extends', 'superclass'], correct: 2 },
      { question: 'Какая аннотация отмечает переопределение?', options: ['@Method', '@Override', '@Replace', '@New'], correct: 1 },
    ],
    task: 'Создайте класс Employee и дочерний класс Manager, переопределяющий метод getRole.',
    hint: 'Метод getRole должен возвращать строку.',
    solution: `class Employee {
    String getRole() {
        return "Сотрудник";
    }
}

class Manager extends Employee {
    @Override
    String getRole() {
        return "Руководитель";
    }
}`,
  },
  {
    id: 9,
    title: 'Коллекции',
    description: 'Динамические списки и словари',
    duration: '35 мин',
    icon: '09',
    theory: [
      'Коллекции хранят группы объектов и могут менять размер. ArrayList сохраняет порядок элементов и допускает дубликаты.',
      'HashSet хранит уникальные элементы, а HashMap — пары ключ-значение.',
      'В угловых скобках указывается тип элементов. Это защищает программу от добавления значений неправильного типа.',
    ],
    code: `List<String> languages = new ArrayList<>();
languages.add("Java");
languages.add("Kotlin");
languages.add("Python");

for (String language : languages) {
    System.out.println(language);
}`,
    quiz: [
      { question: 'Какая коллекция хранит пары ключ-значение?', options: ['ArrayList', 'HashSet', 'HashMap', 'Queue'], correct: 2 },
      { question: 'Как добавить элемент в список?', options: ['push()', 'insert()', 'add()', 'put()'], correct: 2 },
    ],
    task: 'Создайте список из пяти чисел, удалите одно число и выведите оставшиеся.',
    hint: 'Используйте ArrayList<Integer> и методы add и remove.',
    solution: `List<Integer> numbers = new ArrayList<>();
numbers.add(3);
numbers.add(7);
numbers.add(11);
numbers.add(15);
numbers.add(19);
numbers.remove(Integer.valueOf(11));
System.out.println(numbers);`,
  },
  {
    id: 10,
    title: 'Итоговый проект',
    description: 'Консольный трекер учебных задач',
    duration: '45 мин',
    icon: '10',
    theory: [
      'Финальная работа объединяет переменные, условия, циклы, методы, классы и коллекции.',
      'Разделяйте программу на небольшие методы. Каждый метод должен выполнять одну понятную задачу.',
      'Сначала опишите данные, затем основные действия пользователя и только после этого пишите код.',
    ],
    code: `class Task {
    String title;
    boolean completed;

    Task(String title) {
        this.title = title;
    }

    void complete() {
        completed = true;
    }
}`,
    quiz: [
      { question: 'Зачем делить программу на методы?', options: ['Чтобы было больше строк', 'Для понятности и повторного использования', 'Чтобы не создавать классы', 'Для изменения языка'], correct: 1 },
      { question: 'Что лучше сделать перед написанием кода?', options: ['Удалить JDK', 'Описать данные и действия', 'Создать бесконечный цикл', 'Скопировать проект'], correct: 1 },
    ],
    task: 'Создайте класс Task с названием и статусом. Добавьте задачи в список, отметьте одну выполненной и выведите все задачи со статусом.',
    hint: 'Используйте класс Task, ArrayList<Task> и цикл for-each.',
    solution: `List<Task> tasks = new ArrayList<>();
tasks.add(new Task("Повторить массивы"));
tasks.add(new Task("Решить задачу"));
tasks.get(0).complete();

for (Task task : tasks) {
    String status = task.completed ? "готово" : "в работе";
    System.out.println(task.title + " — " + status);
}`,
  },
]
