import { FormEvent, useEffect, useMemo, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleUserRound,
  Code2,
  Flame,
  GraduationCap,
  Lightbulb,
  LockKeyhole,
  LogOut,
  Menu,
  Play,
  Sparkles,
  Trophy,
  X,
} from 'lucide-react'
import { lessons } from './data/lessons'
import { supabase } from './lib/supabase'
import type { Lesson, Progress } from './types'

type View = 'home' | 'dashboard' | 'lesson'
type AuthMode = 'login' | 'register'

const emptyProgress = (): Progress[] =>
  lessons.map((lesson) => ({
    lesson_id: lesson.id,
    completed: false,
    quiz_score: 0,
    task_answer: '',
  }))

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<View>('home')
  const [currentLesson, setCurrentLesson] = useState(lessons[0])
  const [progress, setProgress] = useState<Progress[]>(emptyProgress)
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<AuthMode>('login')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
    })
    return () => data.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) {
      setProgress(emptyProgress())
      return
    }
    supabase
      .from('lesson_progress')
      .select('lesson_id, completed, quiz_score, task_answer')
      .eq('user_id', session.user.id)
      .then(({ data }) => {
        if (!data) return
        setProgress(
          emptyProgress().map((item) => data.find((row) => row.lesson_id === item.lesson_id) ?? item),
        )
      })
  }, [session])

  const completedCount = progress.filter((item) => item.completed).length
  const percent = completedCount * 10

  const openCourse = () => {
    if (!session) {
      setAuthMode('register')
      setAuthOpen(true)
      return
    }
    setView('dashboard')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openLesson = (lesson: Lesson) => {
    setCurrentLesson(lesson)
    setView('lesson')
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const saveProgress = async (lessonId: number, values: Partial<Progress>) => {
    if (!session) return
    const current = progress.find((item) => item.lesson_id === lessonId)!
    const next = { ...current, ...values }
    setProgress((items) => items.map((item) => (item.lesson_id === lessonId ? next : item)))
    await supabase.from('lesson_progress').upsert(
      {
        user_id: session.user.id,
        lesson_id: lessonId,
        completed: next.completed,
        quiz_score: next.quiz_score,
        task_answer: next.task_answer,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,lesson_id' },
    )
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setView('home')
  }

  if (loading) {
    return (
      <div className="loader-screen">
        <div className="loader-mark">JT</div>
      </div>
    )
  }

  return (
    <div className="app">
      {view === 'home' && (
        <Home
          session={session}
          onStart={openCourse}
          onLogin={() => {
            setAuthMode('login')
            setAuthOpen(true)
          }}
          onDashboard={() => setView('dashboard')}
        />
      )}
      {view === 'dashboard' && session && (
        <Dashboard
          email={session.user.email ?? ''}
          progress={progress}
          completedCount={completedCount}
          percent={percent}
          onHome={() => setView('home')}
          onLesson={openLesson}
          onLogout={logout}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
        />
      )}
      {view === 'lesson' && session && (
        <LessonPage
          lesson={currentLesson}
          progress={progress.find((item) => item.lesson_id === currentLesson.id)!}
          allProgress={progress}
          onSave={saveProgress}
          onBack={() => setView('dashboard')}
          onLesson={openLesson}
          onHome={() => setView('home')}
          onLogout={logout}
          email={session.user.email ?? ''}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
        />
      )}
      {authOpen && (
        <AuthModal
          mode={authMode}
          onMode={setAuthMode}
          onClose={() => setAuthOpen(false)}
          onSuccess={() => {
            setAuthOpen(false)
            setView('dashboard')
          }}
        />
      )}
    </div>
  )
}

function Logo({ onClick }: { onClick: () => void }) {
  return (
    <button className="logo" onClick={onClick}>
      <span className="logo-mark">JT</span>
      <span>JavaTeacher</span>
    </button>
  )
}

function Home({
  session,
  onStart,
  onLogin,
  onDashboard,
}: {
  session: Session | null
  onStart: () => void
  onLogin: () => void
  onDashboard: () => void
}) {
  return (
    <>
      <header className="home-header">
        <Logo onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
        <nav>
          <a href="#program">Программа</a>
          <a href="#about">О курсе</a>
        </nav>
        {session ? (
          <button className="button button-dark button-small" onClick={onDashboard}>
            Мой курс <ArrowRight size={16} />
          </button>
        ) : (
          <button className="button button-ghost button-small" onClick={onLogin}>
            Войти
          </button>
        )}
      </header>

      <main>
        <section className="hero">
          <div className="hero-glow hero-glow-one" />
          <div className="hero-glow hero-glow-two" />
          <div className="hero-content">
            <div className="eyebrow"><Sparkles size={15} /> Курс для начинающих</div>
            <h1>Освой Java<br /><span>с первого шага</span></h1>
            <p>Понятная теория, живые примеры и практика в каждом уроке. Пройди путь от первой строки кода до собственного проекта.</p>
            <div className="hero-actions">
              <button className="button button-primary" onClick={onStart}>
                Начать обучение <ArrowRight size={18} />
              </button>
              <a className="button button-light" href="#program">
                <Play size={17} fill="currentColor" /> Смотреть программу
              </a>
            </div>
            <div className="hero-note">
              <span className="avatar-stack"><i>J</i><i>A</i><i>M</i></span>
              <span><b>10 уроков</b><br />для уверенного старта</span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="code-window">
              <div className="window-top"><i /><i /><i /><span>Main.java</span></div>
              <pre><code><span className="code-pink">public class</span> <span className="code-blue">Main</span> {'{'}{`\n`}  <span className="code-pink">public static void</span> <span className="code-yellow">main</span>(String[] args) {'{'}{`\n`}    System.out.println(<span className="code-green">"Hello, Java!"</span>);{`\n`}  {'}'}{`\n`}{'}'}</code></pre>
              <div className="code-result"><CheckCircle2 size={16} /> Программа выполнена успешно</div>
            </div>
            <div className="float-card float-card-top"><Flame size={20} /><span><b>7 дней</b> подряд</span></div>
            <div className="float-card float-card-bottom"><Trophy size={20} /><span><b>+100 XP</b> за урок</span></div>
          </div>
        </section>

        <section className="benefits" id="about">
          <article><span><BookOpen size={22} /></span><div><h3>Без лишней теории</h3><p>Только то, что пригодится на практике</p></div></article>
          <article><span><Code2 size={22} /></span><div><h3>Практика в каждом уроке</h3><p>Закрепляй знания на реальных задачах</p></div></article>
          <article><span><Trophy size={22} /></span><div><h3>Видимый прогресс</h3><p>Следи за результатами и двигайся дальше</p></div></article>
        </section>

        <section className="program-section" id="program">
          <div className="section-heading">
            <div><span className="section-kicker">Программа курса</span><h2>10 шагов до уверенной Java</h2></div>
            <p>Каждый урок рассчитан на 20–45 минут. Учись в своём темпе, возвращайся к материалу в любое время.</p>
          </div>
          <div className="program-grid">
            {lessons.map((lesson) => (
              <article className="program-card" key={lesson.id}>
                <span className="lesson-number">{lesson.icon}</span>
                <div><h3>{lesson.title}</h3><p>{lesson.description}</p><small>{lesson.duration}</small></div>
                <ChevronRight size={19} />
              </article>
            ))}
          </div>
          <button className="button button-primary program-button" onClick={onStart}>
            Начать с первого урока <ArrowRight size={18} />
          </button>
        </section>

        <section className="cta-section">
          <div><span className="section-kicker light-kicker">Готовы начать?</span><h2>Первая программа ближе,<br />чем кажется</h2><p>Создайте аккаунт и начните обучение бесплатно.</p></div>
          <button className="button button-white" onClick={onStart}>Начать обучение <ArrowRight size={18} /></button>
        </section>
      </main>

      <footer><Logo onClick={() => window.scrollTo({ top: 0 })} /><span>Интерактивный курс Java для начинающих</span><small>© 2026 JavaTeacher</small></footer>
    </>
  )
}

function CourseHeader({
  email,
  onHome,
  onLogout,
  onMenu,
}: {
  email: string
  onHome: () => void
  onLogout: () => void
  onMenu: () => void
}) {
  return (
    <header className="course-header">
      <button className="mobile-menu" onClick={onMenu}><Menu size={22} /></button>
      <Logo onClick={onHome} />
      <div className="account">
        <span className="account-icon"><CircleUserRound size={20} /></span>
        <span className="account-email">{email}</span>
        <button title="Выйти" onClick={onLogout}><LogOut size={18} /></button>
      </div>
    </header>
  )
}

function Sidebar({
  progress,
  activeId,
  onLesson,
  open,
  onClose,
}: {
  progress: Progress[]
  activeId?: number
  onLesson: (lesson: Lesson) => void
  open: boolean
  onClose: () => void
}) {
  return (
    <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
      <div className="sidebar-title"><span>Содержание курса</span><button onClick={onClose}><X size={20} /></button></div>
      <div className="sidebar-lessons">
        {lessons.map((lesson, index) => {
          const item = progress.find((p) => p.lesson_id === lesson.id)!
          const previousDone = index === 0 || progress[index - 1].completed
          const unlocked = previousDone || item.completed
          return (
            <button
              key={lesson.id}
              className={`${activeId === lesson.id ? 'active' : ''} ${item.completed ? 'done' : ''}`}
              onClick={() => unlocked && onLesson(lesson)}
              disabled={!unlocked}
            >
              <span>{item.completed ? <Check size={16} /> : unlocked ? lesson.icon : <LockKeyhole size={14} />}</span>
              <div><small>Урок {lesson.id}</small><b>{lesson.title}</b></div>
            </button>
          )
        })}
      </div>
      <div className="sidebar-help"><Lightbulb size={20} /><div><b>Есть вопрос?</b><span>Вернитесь к теории и изучите пример ещё раз.</span></div></div>
    </aside>
  )
}

function Dashboard({
  email,
  progress,
  completedCount,
  percent,
  onHome,
  onLesson,
  onLogout,
  menuOpen,
  setMenuOpen,
}: {
  email: string
  progress: Progress[]
  completedCount: number
  percent: number
  onHome: () => void
  onLesson: (lesson: Lesson) => void
  onLogout: () => void
  menuOpen: boolean
  setMenuOpen: (value: boolean) => void
}) {
  const nextLesson = lessons.find((lesson) => !progress[lesson.id - 1].completed) ?? lessons[9]
  const name = email.split('@')[0]
  return (
    <div className="course-shell">
      <CourseHeader email={email} onHome={onHome} onLogout={onLogout} onMenu={() => setMenuOpen(true)} />
      <Sidebar progress={progress} onLesson={onLesson} open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main className="dashboard-main">
        <section className="welcome">
          <div><span className="section-kicker">Личный кабинет</span><h1>Привет, {name}!</h1><p>Продолжайте обучение — каждый урок приближает вас к цели.</p></div>
          <div className="level-badge"><GraduationCap size={25} /><div><small>Ваш уровень</small><b>{completedCount < 4 ? 'Новичок' : completedCount < 8 ? 'Ученик' : 'Практик'}</b></div></div>
        </section>

        <section className="progress-panel">
          <div className="progress-ring" style={{ '--progress': `${percent * 3.6}deg` } as React.CSSProperties}><span>{percent}%</span></div>
          <div className="progress-info"><small>Общий прогресс</small><h2>{completedCount} из 10 уроков пройдено</h2><div className="bar"><i style={{ width: `${percent}%` }} /></div><p>{completedCount === 10 ? 'Курс завершён. Отличная работа!' : `До завершения курса осталось ${10 - completedCount} уроков`}</p></div>
          <div className="progress-stat"><span><Flame size={18} /></span><div><b>{completedCount}</b><small>уроков</small></div></div>
          <div className="progress-stat"><span><Trophy size={18} /></span><div><b>{completedCount * 100}</b><small>опыта</small></div></div>
        </section>

        <section className="continue-section">
          <div className="content-heading"><div><span className="section-kicker">Продолжить обучение</span><h2>{nextLesson.title}</h2><p>{nextLesson.description}</p></div><span className="big-number">{nextLesson.icon}</span></div>
          <div className="continue-card">
            <div className="continue-icon"><Code2 size={32} /></div>
            <div><small>Урок {nextLesson.id} · {nextLesson.duration}</small><h3>{nextLesson.title}</h3><p>{nextLesson.theory[0]}</p></div>
            <button className="button button-primary" onClick={() => onLesson(nextLesson)}>Открыть урок <ArrowRight size={18} /></button>
          </div>
        </section>

        <section className="all-lessons">
          <div className="content-heading"><div><span className="section-kicker">Весь курс</span><h2>Программа обучения</h2></div></div>
          <div className="dashboard-grid">
            {lessons.map((lesson, index) => {
              const item = progress[index]
              const unlocked = index === 0 || progress[index - 1].completed || item.completed
              return (
                <button className={`dashboard-lesson ${item.completed ? 'completed' : ''}`} key={lesson.id} disabled={!unlocked} onClick={() => onLesson(lesson)}>
                  <span className="lesson-tile-number">{item.completed ? <Check size={19} /> : unlocked ? lesson.icon : <LockKeyhole size={17} />}</span>
                  <div><small>Урок {lesson.id} · {lesson.duration}</small><h3>{lesson.title}</h3><p>{lesson.description}</p></div>
                  <ChevronRight size={20} />
                </button>
              )
            })}
          </div>
        </section>
      </main>
    </div>
  )
}

function LessonPage({
  lesson,
  progress,
  allProgress,
  onSave,
  onBack,
  onLesson,
  onHome,
  onLogout,
  email,
  menuOpen,
  setMenuOpen,
}: {
  lesson: Lesson
  progress: Progress
  allProgress: Progress[]
  onSave: (lessonId: number, values: Partial<Progress>) => Promise<void>
  onBack: () => void
  onLesson: (lesson: Lesson) => void
  onHome: () => void
  onLogout: () => void
  email: string
  menuOpen: boolean
  setMenuOpen: (value: boolean) => void
}) {
  const [answers, setAnswers] = useState<number[]>(lesson.quiz.map(() => -1))
  const [quizChecked, setQuizChecked] = useState(progress.quiz_score > 0)
  const [taskAnswer, setTaskAnswer] = useState(progress.task_answer)
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setAnswers(lesson.quiz.map(() => -1))
    setQuizChecked(progress.quiz_score > 0)
    setTaskAnswer(progress.task_answer)
    setShowHint(false)
    setShowSolution(false)
    setSaved(false)
  }, [lesson.id, progress.quiz_score, progress.task_answer])

  const score = useMemo(() => answers.filter((answer, index) => answer === lesson.quiz[index].correct).length, [answers, lesson.quiz])
  const canCheck = answers.every((answer) => answer >= 0)

  const checkQuiz = async () => {
    if (!canCheck) return
    setQuizChecked(true)
    await onSave(lesson.id, { quiz_score: score })
  }

  const finishLesson = async () => {
    await onSave(lesson.id, { completed: true, quiz_score: Math.max(score, progress.quiz_score), task_answer: taskAnswer })
    setSaved(true)
  }

  const next = lessons[lesson.id]

  return (
    <div className="course-shell">
      <CourseHeader email={email} onHome={onHome} onLogout={onLogout} onMenu={() => setMenuOpen(true)} />
      <Sidebar progress={allProgress} activeId={lesson.id} onLesson={onLesson} open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main className="lesson-main">
        <button className="back-link" onClick={onBack}><ArrowLeft size={17} /> Назад к курсу</button>
        <div className="lesson-heading">
          <div><span className="section-kicker">Урок {lesson.id} из 10 · {lesson.duration}</span><h1>{lesson.title}</h1><p>{lesson.description}</p></div>
          <span>{lesson.icon}</span>
        </div>

        <section className="lesson-block">
          <div className="block-title"><span><BookOpen size={20} /></span><div><small>Часть 1</small><h2>Коротко о главном</h2></div></div>
          <div className="theory-list">
            {lesson.theory.map((paragraph, index) => <p key={index}><b>{index + 1}</b>{paragraph}</p>)}
          </div>
          <div className="code-block"><div><span>Пример</span><small>Java</small></div><pre><code>{lesson.code}</code></pre></div>
        </section>

        <section className="lesson-block">
          <div className="block-title"><span><CheckCircle2 size={20} /></span><div><small>Часть 2</small><h2>Проверьте себя</h2></div></div>
          <div className="quiz-list">
            {lesson.quiz.map((question, questionIndex) => (
              <div className="quiz-question" key={question.question}>
                <h3>{questionIndex + 1}. {question.question}</h3>
                <div className="quiz-options">
                  {question.options.map((option, optionIndex) => {
                    let state = ''
                    if (quizChecked && optionIndex === question.correct) state = 'correct'
                    if (quizChecked && answers[questionIndex] === optionIndex && optionIndex !== question.correct) state = 'wrong'
                    return (
                      <button
                        className={`${answers[questionIndex] === optionIndex ? 'selected' : ''} ${state}`}
                        key={option}
                        onClick={() => !quizChecked && setAnswers((items) => items.map((value, index) => index === questionIndex ? optionIndex : value))}
                      >
                        <span>{String.fromCharCode(65 + optionIndex)}</span>{option}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="quiz-footer">
            {quizChecked && <div className={`quiz-result ${score === lesson.quiz.length ? 'perfect' : ''}`}><Trophy size={20} /> Верных ответов: {score} из {lesson.quiz.length}</div>}
            {!quizChecked && <button className="button button-dark" disabled={!canCheck} onClick={checkQuiz}>Проверить ответы</button>}
            {quizChecked && <button className="button button-light" onClick={() => { setQuizChecked(false); setAnswers(lesson.quiz.map(() => -1)) }}>Попробовать снова</button>}
          </div>
        </section>

        <section className="lesson-block">
          <div className="block-title"><span><Code2 size={20} /></span><div><small>Часть 3</small><h2>Практическое задание</h2></div></div>
          <div className="task-card"><span><GraduationCap size={22} /></span><p>{lesson.task}</p></div>
          <div className="editor"><div className="editor-top"><span>Решение.java</span><small>Java</small></div><textarea value={taskAnswer} onChange={(event) => setTaskAnswer(event.target.value)} spellCheck={false} placeholder="Введите решение здесь..." /></div>
          <div className="task-actions">
            <button className="hint-button" onClick={() => setShowHint((value) => !value)}><Lightbulb size={17} /> {showHint ? 'Скрыть подсказку' : 'Показать подсказку'}</button>
            <button className="hint-button" onClick={() => setShowSolution((value) => !value)}><Code2 size={17} /> {showSolution ? 'Скрыть решение' : 'Показать решение'}</button>
          </div>
          {showHint && <div className="hint-box"><Lightbulb size={19} /><p>{lesson.hint}</p></div>}
          {showSolution && <div className="code-block solution"><div><span>Пример решения</span><small>Java</small></div><pre><code>{lesson.solution}</code></pre></div>}
        </section>

        <section className={`finish-card ${saved || progress.completed ? 'finished' : ''}`}>
          <div><span><Trophy size={25} /></span><div><h2>{saved || progress.completed ? 'Урок пройден' : 'Завершите урок'}</h2><p>{saved || progress.completed ? 'Результат сохранён в вашем профиле.' : 'Сохраните решение и откройте следующий урок.'}</p></div></div>
          {!(saved || progress.completed) && <button className="button button-primary" onClick={finishLesson} disabled={!taskAnswer.trim()}>Завершить урок <Check size={18} /></button>}
          {(saved || progress.completed) && next && <button className="button button-primary" onClick={() => onLesson(next)}>Следующий урок <ArrowRight size={18} /></button>}
          {(saved || progress.completed) && !next && <button className="button button-primary" onClick={onBack}>К результатам <Trophy size={18} /></button>}
        </section>
      </main>
    </div>
  )
}

function AuthModal({
  mode,
  onMode,
  onClose,
  onSuccess,
}: {
  mode: AuthMode
  onMode: (mode: AuthMode) => void
  onClose: () => void
  onSuccess: () => void
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setMessage('')
    if (mode === 'register' && password !== confirm) {
      setError('Пароли не совпадают')
      return
    }
    if (password.length < 6) {
      setError('Пароль должен содержать не менее 6 символов')
      return
    }
    setBusy(true)
    if (mode === 'login') {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
      setBusy(false)
      if (authError) setError('Неверная почта или пароль')
      else onSuccess()
      return
    }
    const { data, error: authError } = await supabase.auth.signUp({ email, password })
    setBusy(false)
    if (authError) {
      setError(authError.message === 'User already registered' ? 'Пользователь с такой почтой уже существует' : authError.message)
    } else if (data.session) {
      onSuccess()
    } else {
      setMessage('Проверьте почту и подтвердите регистрацию')
    }
  }

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div className="auth-modal" onMouseDown={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X size={21} /></button>
        <div className="auth-mark"><span>JT</span></div>
        <h2>{mode === 'login' ? 'С возвращением' : 'Начните обучение'}</h2>
        <p>{mode === 'login' ? 'Войдите, чтобы продолжить курс' : 'Создайте аккаунт и сохраните прогресс'}</p>
        <form onSubmit={submit}>
          <label>Электронная почта<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="student@mail.ru" required /></label>
          <label>Пароль<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Не менее 6 символов" required /></label>
          {mode === 'register' && <label>Повторите пароль<input type="password" value={confirm} onChange={(event) => setConfirm(event.target.value)} placeholder="Повторите пароль" required /></label>}
          {error && <div className="auth-error">{error}</div>}
          {message && <div className="auth-message">{message}</div>}
          <button className="button button-primary auth-submit" disabled={busy}>{busy ? 'Подождите...' : mode === 'login' ? 'Войти' : 'Создать аккаунт'}</button>
        </form>
        <div className="auth-switch">
          {mode === 'login' ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
          <button onClick={() => onMode(mode === 'login' ? 'register' : 'login')}>{mode === 'login' ? 'Зарегистрироваться' : 'Войти'}</button>
        </div>
      </div>
    </div>
  )
}

export default App
