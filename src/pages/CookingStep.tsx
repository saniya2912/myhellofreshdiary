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
    let interval: number | undefined
    if (timerRunning) {
      interval = window.setInterval(() => {
        setElapsedSeconds(prev => prev + 1)
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [timerRunning])

  if (!step) {
    return (
      <div className="text-center p-10 text-red-600 font-semibold">
        Step not found
      </div>
    )
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
    <main className="min-h-screen max-w-4xl mx-auto flex flex-col p-6 sm:p-10 bg-green-50 rounded-lg shadow-lg font-sans">
      {/* Step Image */}
      <img
        src="https://media.hellofresh.com/c_fit,f_auto,fl_lossy,h_500,q_50,w_1024/hellofresh_s3/image/HF_Y25_R33_W27_UK_L40220-3_Main_high-feafedea.jpg"
        alt={step.title}
        className="w-full h-64 sm:h-96 object-cover rounded-lg mb-8 shadow-md"
      />

      {/* Header */}
      <header className="mb-8 text-center sm:text-left">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-green-900 mb-4 tracking-tight">
          {step.title}
        </h2>
        <p className="text-lg sm:text-xl text-green-800 leading-relaxed">
          {step.description}
        </p>
      </header>

      {/* Timer Section */}
      <section className="flex flex-col sm:flex-row items-center justify-between bg-green-100 rounded-lg p-6 mb-10 shadow-inner">
        <div className="mb-4 sm:mb-0 text-center sm:text-left">
          <p className="text-3xl font-mono font-semibold text-green-900">
            ⏱ {formatTime(elapsedSeconds)}
          </p>
          <p className="text-sm text-green-700 mt-1">Elapsed time</p>
        </div>

        <div className="flex space-x-4">
          {!timerRunning ? (
            <button
              onClick={handleStartTimer}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md shadow focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            >
              Start Timer
            </button>
          ) : (
            <button
              onClick={handleStopTimer}
              className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md shadow focus:outline-none focus:ring-2 focus:ring-yellow-300 transition"
            >
              Pause Timer
            </button>
          )}
          <button
            onClick={handleResetTimer}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-md shadow focus:outline-none focus:ring-2 focus:ring-red-400 transition"
          >
            Reset Timer
          </button>
        </div>
      </section>

      {/* Spacer to push button to bottom */}
      <div className="flex-grow" />

      {/* Next Step Button */}
      <button
        onClick={handleNextStep}
        disabled={timerRunning}
        className={`w-full py-4 rounded-md text-white font-semibold text-lg transition ${
          timerRunning
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-700 hover:bg-green-800'
        }`}
      >
        Next Step & Open Survey
      </button>
    </main>
  )
}
