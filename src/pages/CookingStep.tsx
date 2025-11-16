import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { steps } from '../data/steps'

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export default function CookingStep() {
  const { stepIndex } = useParams<{ stepIndex: string }>()
  const navigate = useNavigate()

  const stepNumber = parseInt(stepIndex ?? '0')
  const step = steps[stepNumber]

  const [timerRunning, setTimerRunning] = useState(false)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  // Load elapsed time from localStorage when step changes
  useEffect(() => {
    const times = JSON.parse(localStorage.getItem('stepTimes') || '{}')
    if (step && times[step.id]) {
      setElapsedSeconds(times[step.id])
    } else {
      setElapsedSeconds(0)
    }
  }, [step])

  // Save elapsed time to localStorage when it changes
  useEffect(() => {
    if (!step) return
    const times = JSON.parse(localStorage.getItem('stepTimes') || '{}')
    times[step.id] = elapsedSeconds
    localStorage.setItem('stepTimes', JSON.stringify(times))
  }, [elapsedSeconds, step])

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timer
    if (timerRunning) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [timerRunning])

  if (!step) {
    return <div>Step not found</div>
  }

  const handleStartTimer = () => setTimerRunning(true)
  const handleStopTimer = () => setTimerRunning(false)
  const handleResetTimer = () => {
    setTimerRunning(false)
    setElapsedSeconds(0)
  }

  // New handleNextStep with popup + close detection
  const handleNextStep = () => {
    setTimerRunning(false) // pause timer

    const formWindow = window.open(step.formUrl, '_blank', 'width=600,height=600')

    if (formWindow) {
      const checkWindowClosed = setInterval(() => {
        if (formWindow.closed) {
          clearInterval(checkWindowClosed)
          if (stepNumber + 1 < steps.length) {
            navigate(`/step/${stepNumber + 1}`)
          } else {
            navigate('/summary')
          }
        }
      }, 500)
    } else {
      // Popup blocked or failed, navigate immediately
      if (stepNumber + 1 < steps.length) {
        navigate(`/step/${stepNumber + 1}`)
      } else {
        navigate('/summary')
      }
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>{step.title}</h2>
      <p>{step.description}</p>

      <div>
        <p>Elapsed time: {formatTime(elapsedSeconds)}</p>

        {!timerRunning ? (
          <button onClick={handleStartTimer} style={{ marginRight: 10 }}>
            Start Timer
          </button>
        ) : (
          <button onClick={handleStopTimer} style={{ marginRight: 10 }}>
            Pause Timer
          </button>
        )}

        <button onClick={handleResetTimer}>Reset Timer</button>
      </div>

      <button onClick={handleNextStep} disabled={timerRunning} style={{ marginTop: 20 }}>
        Next Step & Open Survey
      </button>
    </div>
  )
}
