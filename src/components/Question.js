'use client'

import { useState, useEffect } from 'react';

const COUNTDOWN_TIME = 10;

export default function Question({ famoso, onAnswer, questionNumber, totalQuestions, currentScore }) {
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
      setTimeout(() => {
        onAnswer(age);
      }, 1500);
    }
  };

  const getButtonColor = (age) => {
    if (!isAnswered) return 'bg-blue-500 hover:bg-blue-700';
    if (age === famoso.edad && (selectedAge === age || showCorrect)) return 'bg-green-500 hover:bg-green-500';
    if (age === selectedAge) return 'bg-red-500 hover:bg-red-500';
    return 'bg-blue-500 hover:bg-blue-500';
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-2">
        Pregunta {questionNumber}
      </h2>
      
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
            className={`${getButtonColor(age)} text-white font-bold py-2 px-4 rounded transition duration-300`}
            disabled={isAnswered}
          >
            {age} años
          </button>
        ))}
      </div>
    </div>
  );
}