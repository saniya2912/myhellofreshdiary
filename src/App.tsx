import React, { useState, useRef, useEffect } from "react";

export default function App() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    if (isRunning) return;
    setIsRunning(true);
    timerRef.current = setInterval(() => {
      setElapsedSeconds((sec) => sec + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (!isRunning) return;
    setIsRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const resetTimer = () => {
    stopTimer();
    setElapsedSeconds(0);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
  <div className="max-w-md mx-auto p-5 text-center">
    <h1 className="text-2xl font-bold mb-4">HelloFresh Diary Timer</h1>
    <p className="text-xl font-mono mb-6">Timer: {elapsedSeconds} seconds</p>

    <div className="space-x-3">
      {!isRunning ? (
        <button
          onClick={startTimer}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          Start Timer
        </button>
      ) : (
        <button
          onClick={stopTimer}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
        >
          Stop Timer
        </button>
      )}

      <button
        onClick={resetTimer}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        Reset Timer
      </button>
    </div>
  </div>
);

}
