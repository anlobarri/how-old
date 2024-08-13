'use client';

import { useState, useEffect } from 'react';
import Question from './Question';
import confetti from "canvas-confetti"

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export default function Quiz() {
  const [famosos, setFamosos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [fail, setFail] = useState(0);

  useEffect(() => {
    async function loadFamosos() {
      const res = await fetch('/data.json');
      const data = await res.json();
      setFamosos(shuffleArray([...data]));
    }
    loadFamosos();
  }, []);

  const handleAnswer = (selectedAge) => {
    if (selectedAge === famosos[currentIndex].edad) {
      confetti()
      setScore(score + 1);
    }
    else{
      setFail(fail + 1)
    }
    
    setCurrentIndex(currentIndex + 1);
  };

  const restartQuiz = () => {
    setFamosos(shuffleArray([...famosos]));
    setCurrentIndex(0);
    setScore(0);
    setFail(0);
  };

  if (famosos.length === 0) return <div>Cargando...</div>;
  if (fail >= 3) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">¡Juego terminado!</h2>
        <p className="text-xl mb-4">Tu puntuación final: <span>{score}</span></p>
        <button
          onClick={restartQuiz}
          className="bg-transparent text-white font-bold py-2 px-4 rounded border border-slate-100 mt-8"
        >
          Jugar de nuevo
        </button>
      </div>
    );
  }

  return (
    <Question
      famoso={famosos[currentIndex]}
      onAnswer={handleAnswer}
      questionNumber={currentIndex + 1}
      totalQuestions={famosos.length}
      currentScore={score}
      fails={fail}
    />
  );
}