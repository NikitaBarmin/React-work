import { useState, useEffect, useReducer, useRef } from 'react'
import Form from './components/Form'
import SmartNote from './components/SmartNote';
import { INITIAL_DATE, timerReducer } from './components/timer/timerReducer';
import Timer from './components/timer/Timer';
import { ThemeContextProvider } from './context/theme.context';
import ThemeButton from './components/ThemeButton';

function App() {
  const [rateNum, setRateNum] = useState(() => {
    const savedData = localStorage.getItem('rating');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        return Array.isArray(parsed) ? parsed : []
      } catch (error) {
        console.log(`Ошибка: ${error}`)
        return []
      }
    }
    return []
  })

  const [state, dispatchFn] = useReducer(timerReducer, INITIAL_DATE)
  const { seconds, isRunning } = state;
  const intervalRef = useRef(null)

  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60).toString().padStart(2, '0')
    const seconds = Math.floor(secs % 60).toString().padStart(2, '0')
    return `${minutes}:${seconds}`
  }

  const handleToggleTime = () => {
    if (!isRunning) {
      dispatchFn({ type: 'TICK' })
    }
    dispatchFn({ type: isRunning ? 'STOP' : 'START' })
  }

  const handleReset = () => {
    dispatchFn({ type: 'RESET' })
  }

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        dispatchFn({ type: 'TICK' })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    return () => {
      clearInterval(intervalRef.current)
    }
  }, [isRunning])
  /* Очень важная вещь: почему именно useRef, а не let timer внутри эффекта.
  В отличие от debounce-таймаута (как в форме с валидацией ошибок), здесь нам нужен
  ОДИН постоянный интервал пока isRunning=true, и гарантированная очистка при stop.
  Если использовать let intervalId внутри useEffect:
  При быстрых кликах Start/Stop/Start создаются разные замыкания с разными ID.
  Каждый cleanup знает только "свой" ID → старые интервалы не очищаются.
  Результат: множественные тики (секунды прыгают по 2-3), или тикает после Stop (утечка).
  В debounce (таймаут на 2 сек) let работает, потому что:
  Эффект перезапускается часто (при каждом изменении поля).
  Каждый новый эффект отменяет старый таймаут (желаемое поведение — перезапуск таймера).
  Нет нужды в "постоянной памяти" ID между редкими запусками.
  Здесь же ref даёт "единую коробочку" для ID на весь жизненный цикл компонента —
  /все cleanup'ы и код эффекта видят один и тот же current. */

  const addNumber = (num) => {
    setRateNum(prev => [...prev, num])
  }
  const reduceNumber = () => {
    const sum = rateNum.reduce((acc, num) => acc + num, 0)
    return sum / rateNum.length
  }

  useEffect(() => {
    const data = JSON.stringify(rateNum)
    if (rateNum.length > 0) {
      localStorage.setItem('rating', data) // без этой строки при удалении всех элементов все равно в ls останется ключ data с пустым массив, некритично но улчше чтобы его не было. Делает поведение предсказуемым: есть данные — ключ есть, нет — ключа нет.
    }
  }, [rateNum])



  return (
    <ThemeContextProvider>
      <div>
        <ThemeButton />
        <Form
          onSubmit={addNumber}
        />
        <div>
          Средняя оценка отзывов: {rateNum.length ? reduceNumber().toFixed(1) : 'Нет оценки'}
          {rateNum.length > 0 &&
            <span
              style={{ color: 'gold' }}
            >★</span>}
        </div>
        <SmartNote />
        <Timer
          time={formatTime(seconds)}
          resetTime={handleReset}
          toggleTime={handleToggleTime}
          isRunning={isRunning}
        />
      </div>
    </ThemeContextProvider>

  )
}

export default App
