import { steps } from '../data/steps'
import { useEffect, useState } from 'react'

export default function Summary() {
  const [stepTimes, setStepTimes] = useState<Record<number, number>>({})

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('stepTimes') || '{}')
    setStepTimes(stored)
  }, [])

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Thank you for completing the cooking steps!</h1>
      <h2>Times recorded (seconds):</h2>
      <ul>
        {steps.map(step => (
          <li key={step.id}>
            {step.title}: {stepTimes[step.id] ?? 'N/A'}
          </li>
        ))}
      </ul>
    </div>
  )
}
