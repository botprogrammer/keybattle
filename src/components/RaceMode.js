import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import wordList from "./WordList";
import Footer from "./Footer";
import soundPlay from "../soundPlay.mp3";
import ding from "../ding.mp3";
import gameOver from "../gameOver.mp3";

function RaceMode() {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(
    localStorage.getItem("highscore") || 0
  );
  const [counter, setCounter] = useState(5);
  const [timer, setTimer] = useState("");
  const [mount, setMount] = useState(true);
  const [level, setLevel] = useState(localStorage.getItem("level") || "medium");
  const [increment, setIncrement] = useState(incrementChange(level));
  const [word, setWord] = useState(selectWord());
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [typedWord, setTypedWord] = useState("");
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  const updateHighScore = useCallback(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("highscore", score);
    }
  }, [score, highScore]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (!mount) {
      setMount(true);
      ticker();
    }
    if (counter === 0) {
      clearInterval(timer);
      updateHighScore();
      if (isSoundEnabled) {
        new Audio(gameOver).play();
      }
    }
  }, [counter, mount, timer, updateHighScore, isSoundEnabled]);

  function ticker() {
    const interval = setInterval(() => {
      setCounter((prevCount) => prevCount - 1);
    }, 1000);
    setTimer(interval);
  }

  function handleChange({ currentTarget: input }) {
    const typedText = input.value;
    setTypedWord(typedText);

    if (isSoundEnabled) {
      new Audio(soundPlay).play();
    }

    if (typedText === word) {
      if (isSoundEnabled) {
        new Audio(ding).play();
      }
      setWord(selectWord());
      setScore((prevScore) => prevScore + 1);
      input.value = "";
      setTypedWord("");
      setCounter((prevCount) => prevCount + increment);
    }
  }

  function incrementChange(type) {
    const bonusTime = type === "hard" ? 1 : type === "medium" ? 2 : 3;
    return bonusTime;
  }

  function difficultyChange({ currentTarget: option }) {
    const bonusTime = incrementChange(option.value);
    const difficultyLevel = option.value;
    localStorage.setItem("level", difficultyLevel);
    setIncrement(bonusTime);
    setLevel(difficultyLevel);
    setWord(selectWord());
    setTypedWord("");
  }

  function selectWord() {
    const list = wordList[level];
    const item = Math.floor(Math.random() * list.length);
    return list[item];
  }

  function handleStart() {
    setMount(false);
    setCounter(5);
    setScore(0);
    setTypedWord("");
  }

  const renderWord = () => {
    return word.split("").map((char, index) => {
      const isTyped = index < typedWord.length;
      const isCorrect = isTyped && typedWord[index] === char;
      return (
        <React.Fragment key={index}>
          {index === typedWord.length && <span className="caret">|</span>}
          <span
            className={`char ${
              isTyped ? (isCorrect ? "correct" : "incorrect") : "untyped"
            }`}
          >
            {char}
          </span>
        </React.Fragment>
      );
    });
  };

  return (
    <div
      className="race-mode"
      style={{
        background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(226, 183, 20, 0.15) 0%, rgba(22, 22, 24, 0) 50%)`,
      }}
    >
      <div className="race-mode-content">
        <button className="back-button" onClick={() => navigate("/")}>
          ← Back to Home
        </button>

        {counter === 0 ? (
          <div className="game-results">
            <h2>Game Over!</h2>
            <div className="results-grid">
              <div className="result-card">
                <span className="result-label">Final Score</span>
                <span className="result-value">{score}</span>
              </div>
              <div className="result-card">
                <span className="result-label">High Score</span>
                <span className="result-value">{highScore}</span>
              </div>
            </div>
            <button className="retry-button" onClick={handleStart}>
              Race Again
            </button>
          </div>
        ) : mount === true && !timer ? (
          <div className="game-setup">
            <h1>Race Battle Mode</h1>
            <div className="setup-options">
              <div className="option-group">
                <label>Difficulty Level</label>
                <select
                  className="difficulty-select"
                  onChange={difficultyChange}
                  value={level}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div className="option-group">
                <label className="sound-toggle">
                  <input
                    type="checkbox"
                    checked={isSoundEnabled}
                    onChange={() => setIsSoundEnabled(!isSoundEnabled)}
                  />
                  <span>Sound Effects</span>
                </label>
              </div>
            </div>
            <div className="game-info">
              <div className="info-card">
                <h3>How to Play</h3>
                <p>Type words correctly to earn bonus time!</p>
                <ul>
                  <li>Easy: +3 seconds per word</li>
                  <li>Medium: +2 seconds per word</li>
                  <li>Hard: +1 second per word</li>
                </ul>
              </div>
            </div>
            <button className="start-button" onClick={handleStart}>
              Start Race
            </button>
          </div>
        ) : (
          <div className="game-play">
            <div className="game-header">
              <div className="score-display">
                <span className="score-label">Score</span>
                <span className="score-value">{score}</span>
              </div>
              <div className="timer-display">
                <span className="timer-label">Time</span>
                <span className="timer-value">{counter}s</span>
              </div>
              <div className="highscore-display">
                <span className="highscore-label">High Score</span>
                <span className="highscore-value">{highScore}</span>
              </div>
            </div>

            <div className="typing-area">
              <div className="word-display">{renderWord()}</div>
              <input
                type="text"
                onChange={handleChange}
                placeholder="Type the word..."
                autoFocus
                className="typing-input"
              />
            </div>
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
}

export default RaceMode;
// edit 14307
// edit 7345
// edit 10159
// edit 14685
// edit 17211
// edit 31309
// edit 24948
// edit 28717
