import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  const handleStart = () => {
    navigate('/step/0')
  }

  return (
    <main className="min-h-screen bg-green-50 flex flex-col items-center justify-center px-6 py-12 font-sans">
      {/* HelloFresh Logo */}
      <img
        src="https://media.hellofresh.com/w_96,q_100,f_auto,c_limit,fl_lossy/hellofresh_website/logo/Hello_Fresh_Lockup.png"
        alt="HelloFresh Logo"
        className="mb-8 w-48 sm:w-56"
      />

      {/* Title */}
      <h1 className="text-4xl sm:text-5xl font-extrabold text-green-900 mb-4 text-center">
        Welcome to My HelloFresh Diary
      </h1>

      {/* Description */}
      <p className="text-green-800 text-lg sm:text-xl max-w-xl text-center mb-10 leading-relaxed">
        Track your cooking steps and complete the surveys after each step.  
        Make your cooking experience fun, organized, and delicious!
      </p>

      {/* Start Button */}
      <button
        onClick={handleStart}
        className="px-8 py-4 bg-green-700 hover:bg-green-800 text-white rounded-lg text-lg font-semibold shadow-lg transition focus:outline-none focus:ring-4 focus:ring-green-400"
      >
        Start Cooking
      </button>
    </main>
  )
}
