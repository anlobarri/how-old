'use client';

import { useState, useEffect } from 'react';
import Question from './Question';
import confetti from "canvas-confetti";
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import { FaCrown } from "react-icons/fa6";

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
  const [topUsers, setTopUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [gameEnded, setGameEnded] = useState(false);

  useEffect(() => {
    async function loadFamosos() {
      const res = await fetch('/data.json');
      const data = await res.json();
      setFamosos(shuffleArray([...data]));
    }

    async function loadTop() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('score', { ascending: false })
        .limit(5);
      setTopUsers(data);

      // Get the current user
      const { data: userData } = await supabase.auth.getUser();
      setUser(userData.user);
    }

    loadFamosos();
    loadTop();
  }, []);

  const handleAnswer = (selectedAge) => {
    if (selectedAge === famosos[currentIndex].edad) {
      confetti();
      setScore(score + 1);
    } else {
      setFail(fail + 1);
    }
    
    setCurrentIndex(currentIndex + 1);
  };

  const restartQuiz = () => {
    setFamosos(shuffleArray([...famosos]));
    setCurrentIndex(0);
    setScore(0);
    setFail(0);
    setGameEnded(false);
  };

  async function endGame() {
    if (user) {
      const supabase = createClient();
      
      // Get the user's current score from the database
      const { data, error } = await supabase
        .from('users')
        .select('score')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user score:', error);
        return;
      }

      const currentHighScore = data?.score || 0;

      // Only update if the new score is higher
      if (score > currentHighScore) {
        const { error: updateError } = await supabase
          .from('users')
          .update({ score: score })
          .eq('id', user.id);

        if (updateError) {
          console.error('Error updating score:', updateError);
        } else {
          console.log('Score updated successfully');
          
          // Fetch updated top users
          const { data: newTopUsers } = await supabase
            .from('users')
            .select('*')
            .order('score', { ascending: false })
            .limit(5);

          setTopUsers(newTopUsers);

          // Check if the user is in the top 5
          const isInTopFive = newTopUsers.some(topUser => topUser.id === user.id);
          if (isInTopFive) {
            toast('¡Has entrado en el top 5!');
            confetti();
          }
        }
      }
    }
    setGameEnded(true);
  }

  if (famosos.length === 0) return <div>Cargando...</div>;
  if (fail >= 3 && !gameEnded) {
    endGame(); // Call this function when the game ends
  }

  if (gameEnded) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">¡Juego terminado!</h2>
        <p className="text-xl mb-4">Tu puntuación final: <span>{score}</span></p>
        <button
          onClick={restartQuiz}
          className="btn"
        >
          Jugar de nuevo
        </button>
        <div className='mt-6 w-full'>
          <h2 className='text-yellow-500 text-2xl font-semibold inline-flex gap-2 items-center'>Top 5 <FaCrown />
          </h2>
          {topUsers.map((user, index) => (
            <div key={user.id} className='mt-4 flex'>
              <p><span className='text-2xl font-black'>{index + 1}. </span>{user.nickname} {user.score} puntos</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <Question
        famoso={famosos[currentIndex]}
        onAnswer={handleAnswer}
        questionNumber={currentIndex + 1}
        totalQuestions={famosos.length}
        currentScore={score}
        fails={fail}
      />
    </>
  );
}