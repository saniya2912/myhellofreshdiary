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

  useEffect(() => {
    const times = JSON.parse(localStorage.getItem('stepTimes') || '{}')
    if (step && times[step.id]) {
      setElapsedSeconds(times[step.id])
    } else {
      setElapsedSeconds(0)
    }
  }, [step])

  useEffect(() => {
    if (!step) return
    const times = JSON.parse(localStorage.getItem('stepTimes') || '{}')
    times[step.id] = elapsedSeconds
    localStorage.setItem('stepTimes', JSON.stringify(times))
  }, [elapsedSeconds, step])

  useEffect(() => {
    // Use number type for browser setInterval ID
    let interval: number | undefined
    if (timerRunning) {
      interval = window.setInterval(() => {
        setElapsedSeconds(prev => prev + 1)
      }, 1000)
    }
    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [timerRunning])

  if (!step) {
    return <div className="text-center p-10 text-red-600 font-semibold">Step not found</div>
  }

  const handleStartTimer = () => setTimerRunning(true)
  const handleStopTimer = () => setTimerRunning(false)
  const handleResetTimer = () => {
    setTimerRunning(false)
    setElapsedSeconds(0)
  }

  const handleNextStep = () => {
    setTimerRunning(false)

    const formWindow = window.open(step.formUrl, '_blank', 'width=600,height=600')

    if (formWindow) {
      const checkWindowClosed = window.setInterval(() => {
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
      if (stepNumber + 1 < steps.length) {
        navigate(`/step/${stepNumber + 1}`)
      } else {
        navigate('/summary')
      }
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-3xl font-semibold mb-4">{step.title}</h2>
      <p className="mb-6 text-lg text-gray-700 dark:text-gray-300">{step.description}</p>

      <div className="mb-6">
        <p className="text-xl font-mono mb-3">Elapsed time: {formatTime(elapsedSeconds)}</p>

        <div className="flex space-x-3 justify-center">
          {!timerRunning ? (
            <button
              onClick={handleStartTimer}
              className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Start Timer
            </button>
          ) : (
            <button
              onClick={handleStopTimer}
              className="px-5 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
            >
              Pause Timer
            </button>
          )}

          <button
            onClick={handleResetTimer}
            className="px-5 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Reset Timer
          </button>
        </div>
      </div>

      <button
        onClick={handleNextStep}
        disabled={timerRunning}
        className={`w-full py-3 rounded text-white transition ${
          timerRunning
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        Next Step & Open Survey
      </button>
    </div>
  )
}
