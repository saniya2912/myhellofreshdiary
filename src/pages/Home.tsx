import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  const handleStart = () => {
    navigate('/step/0')
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Welcome to My HelloFresh Diary</h1>
      <p>Track your cooking steps and complete the surveys after each step.</p>
      <button onClick={handleStart}>Start Cooking</button>
    </div>
  )
}
