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
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h1>HelloFresh Diary Timer</h1>
      <p style={{ fontSize: 24, fontFamily: "monospace" }}>
        Timer: {elapsedSeconds} seconds
      </p>

      {!isRunning ? (
        <button onClick={startTimer} style={{ marginRight: 10 }}>
          Start Timer
        </button>
      ) : (
        <button onClick={stopTimer} style={{ marginRight: 10 }}>
          Stop Timer
        </button>
      )}

      <button onClick={resetTimer}>Reset Timer</button>
    </div>
  );
}
