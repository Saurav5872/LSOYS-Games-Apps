import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function App() {
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(
    parseInt(localStorage.getItem("bestScore")) || 0
  );
  const [timeLeft, setTimeLeft] = useState(3);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [round, setRound] = useState(1);
  const [targetPos, setTargetPos] = useState({ top: "50%", left: "50%" });
  const timerRef = useRef(null);

  // Start Game
const startGame = () => {
  setScore(0);
  setRound(1);
  setTimeLeft(3);   // always reset countdown to 3
  setIsRunning(true);
  setIsPaused(false);
  moveTarget();
};


  // Move Target Randomly
  const moveTarget = () => {
    const randomTop = Math.floor(Math.random() * 80) + 10; // keep inside screen
    const randomLeft = Math.floor(Math.random() * 80) + 10;
    setTargetPos({ top: `${randomTop}%`, left: `${randomLeft}%` });
  };

  // Handle target click
  const handleClick = () => {
    if (!isRunning || isPaused) return;
    setScore((prev) => prev + 1);
    setRound((prev) => prev + 1);
    setTimeLeft(Math.max(1, 3 - Math.floor(score / 5))); // faster each 5 points
    moveTarget();
  };

  // Timer loop
useEffect(() => {
  if (isRunning && !isPaused) {
    clearInterval(timerRef.current); // clear old timer

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }
  return () => clearInterval(timerRef.current);
}, [isRunning, isPaused, round]);


  // End Game
  const endGame = () => {
    setIsRunning(false);
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem("bestScore", score);
    }
  };

  // Pause / Resume
  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <h1 className="text-3xl font-bold mb-6">⚡ Reaction Speed Game ⚡</h1>

      <div className="mb-4">
        <p>Score: {score}</p>
        <p>Best Score: {bestScore}</p>
        <p>Round: {round}</p>
        <p>Time Left: {timeLeft}s</p>
      </div>

   {!isRunning ? (
  <button
    onClick={startGame}
    className="px-6 py-2 bg-green-500 rounded-lg hover:bg-green-600 transition"
  >
    {score > 0 ? "Restart Game" : "Start Game"}
  </button>
) : (
  <button
    onClick={togglePause}
    className="px-6 py-2 bg-yellow-500 rounded-lg hover:bg-yellow-600 transition"
  >
    {isPaused ? "Resume" : "Pause"}
  </button>
)}


      {/* Game area */}
      <div className="relative w-[90%] h-[60vh] mt-6 border border-gray-700 rounded-xl overflow-hidden bg-gray-800">
        {isRunning && !isPaused && (
          <motion.div
            onClick={handleClick}
            className="absolute w-12 h-12 bg-pink-500 rounded-full shadow-lg cursor-pointer"
            animate={{ top: targetPos.top, left: targetPos.left }}
            transition={{ type: "spring", stiffness: 120, damping: 15 }}
          />
        )}
      </div>

      {/* Restart button */}
      {!isRunning && score > 0 && (
        <button
          onClick={startGame}
          className="mt-6 px-6 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition"
        >
          Restart
        </button>
      )}

      {/* Leaderboard stub */}
      <div className="mt-8 bg-gray-700 p-4 rounded-lg w-64">
        <h2 className="font-bold mb-2">🏆 Leaderboard (Mock)</h2>
        <ul className="text-sm">
          <li>Player1 — 25</li>
          <li>Player2 — 20</li>
          <li>You — {bestScore}</li>
        </ul>
      </div>
    </div>
  );
}
