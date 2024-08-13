'use client'

import { useState, useEffect } from 'react';

const COUNTDOWN_TIME = 10;

export default function Question({ famoso, onAnswer, questionNumber, totalQuestions, currentScore, fails }) {
  const [options, setOptions] = useState([]);
  const [selectedAge, setSelectedAge] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showCorrect, setShowCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(COUNTDOWN_TIME);

  useEffect(() => {
    const correctAge = famoso.edad;
    const ages = [correctAge];
    while (ages.length < 4) {
      const randomAge = Math.floor(Math.random() * (correctAge + 20 - (correctAge - 20) + 1) + (correctAge - 20));
      if (!ages.includes(randomAge) && randomAge > 0) {
        ages.push(randomAge);
      }
    }
    setOptions(ages.sort(() => Math.random() - 0.5));
    setSelectedAge(null);
    setIsAnswered(false);
    setShowCorrect(false);
    setTimeLeft(COUNTDOWN_TIME);
  }, [famoso]);

  useEffect(() => {
    if (timeLeft > 0 && !isAnswered) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isAnswered) {
      handleAnswer(null);
    }
  }, [timeLeft, isAnswered]);

  const handleAnswer = (age) => {
    if (isAnswered) return;
  
    setSelectedAge(age);
    setIsAnswered(true);
    if (age !== famoso.edad) {
      setTimeout(() => {
        setShowCorrect(true);
        setTimeout(() => {
          onAnswer(age);
        }, 1000);
      }, 500);
    } else {
      onAnswer(age); // Llamar a onAnswer inmediatamente si la respuesta es correcta
    }
  };

  const getButtonColor = (age) => {
    if (!isAnswered) return 'bg-transparent ';
    if (age === famoso.edad && (selectedAge === age || showCorrect)) return 'bg-green-900 ';
    if (age === selectedAge) return 'bg-red-900 ';
    return 'bg-transparent ';
  };

  return (
    <div className="text-center">
      <div className='flex flex-row gap-4 justify-center mb-4'>
      <h2 className="text-2xl  mb-2">
        Preguntas <span className='font-bold'>{questionNumber}</span>
      </h2>
      <h2 className="text-2xl font-bold mb-2">
        Fallos <span className='font-bold'>{fails}</span>
      </h2>

      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000 ease-linear" 
          style={{ width: `${(timeLeft / COUNTDOWN_TIME) * 100}%` }}
        ></div>
      </div>
      <img
        src={famoso.imagen}
        alt={famoso.nombre}
        className="w-64 h-64 object-cover mx-auto mb-4 rounded-full"
      />
      <p className="text-xl mb-4">¿Qué edad tiene {famoso.nombre}?</p>
      <div className="grid grid-cols-2 gap-4">
        {options.map((age, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(age)}
            className={`${getButtonColor(age)} text-white font-bold py-8 px-12 rounded transition duration-300  border border-slate-100`}
            disabled={isAnswered}
          >
            {age} años
          </button>
        ))}
      </div>
    </div>
  );
}