import React, { useState, useEffect } from "react";
import randomWords from "random-words";
import sound from "../soundPlay.mp3";
import spacebar from "../spacebar.mp3";
import gameOver from "../gameOver.mp3";
import Timer from "./Timer";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

function TimedMode() {
  const navigate = useNavigate();
  const [wordNums, setWordNums] = useState(100);
  const [seconds, setSeconds] = useState(60);
  const [words, setWords] = useState([]);
  const [timer, setTimer] = useState(seconds);
  const [inputWord, setInputWord] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [charIndex, setCharIndex] = useState(-1);
  const [char, setChar] = useState("");
  const [inCorrect, setInCorrect] = useState(0);
  const [status, setStatus] = useState("start");
  const [isChecked, setIsChecked] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (timer === 0 && status === "enable") {
      setStatus("disable");
      if (isChecked) {
        new Audio(gameOver).play();
      }
    }
  }, [timer, status, isChecked]);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const Normalplay = () => {
    new Audio(sound).play();
  };

  const Spacebar = () => {
    new Audio(spacebar).play();
  };

  const startTimer = () => {
    if (status === "disable") {
      setWords(generateWords());
      setWordIndex(0);
      setCorrect(0);
      setInCorrect(0);
      setStatus("enable");
      setCharIndex(-1);
      setChar("");
    }

    if (status === "start") {
      setStatus("enable");
      setWords(generateWords());
      let time = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer === 0) {
            setStatus("disable");
            clearInterval(time);
            setInputWord("");
          } else {
            return prevTimer - 1;
          }
        });
      }, 1000);
    }
  };

  const generateWords = () => {
    const wordsArray = [];
    while (wordsArray.length < wordNums) {
      const randomWord = randomWords();
      wordsArray.push(randomWord);
    }
    return wordsArray;
  };

  const handleInput = (event) => {
    if (event.key === " ") {
      checkMatch();
      setInputWord("");
      setWordIndex(wordIndex + 1);
      setCharIndex(-1);
      if (isChecked) {
        Spacebar();
      }
    } else if (event.key === "Backspace") {
      setCharIndex(charIndex - 1);
      setChar("");
      if (isChecked) {
        Normalplay();
      }
    } else {
      setCharIndex(charIndex + 1);
      setChar(event.key);
      if (isChecked) {
        Normalplay();
      }
    }
  };

  const checkMatch = () => {
    const wordToCompare = words[wordIndex];
    const doesItMatch = wordToCompare === inputWord.trim();
    if (doesItMatch) {
      setCorrect(correct + 1);
    } else {
      setInCorrect(inCorrect + 1);
    }
  };

  const getCharClass = (wordInd, CharInd, character) => {
    if (
      wordInd === wordIndex &&
      CharInd === charIndex &&
      char &&
      status !== "disable"
    ) {
      if (character === char) {
        return "has-background-success";
      } else {
        return "has-background-danger";
      }
    } else if (wordInd === wordIndex && charIndex >= words[wordIndex].length) {
      return "has-background-danger";
    }
  };

  const numberChange = (event) => {
    const inputValue = event.target.value;
    setSeconds(inputValue);
    setTimer(inputValue);
  };

  const wordNumChange = (event) => {
    const wordValue = event.target.value;
    setWordNums(wordValue);
  };

  return (
    <div
      className="timed-mode"
      style={{
        background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(226, 183, 20, 0.15) 0%, rgba(22, 22, 24, 0) 50%)`,
      }}
    >
      <div className="timed-mode-content">
        <button className="back-button" onClick={() => navigate("/")}>
          ← Back to Home
        </button>

        {status === "start" && (
          <div className="game-setup">
            <h1>Timed Mode</h1>
            <div className="setup-options">
              <div className="option-group">
                <label>Time (seconds)</label>
                <input
                  type="number"
                  value={seconds}
                  onChange={numberChange}
                  min="10"
                  max="300"
                />
              </div>
              <div className="option-group">
                <label>Word Count</label>
                <input
                  type="number"
                  value={wordNums}
                  onChange={wordNumChange}
                  min="10"
                  max="200"
                />
              </div>
              <div className="option-group">
                <label className="sound-toggle">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                  />
                  <span>Sound Effects</span>
                </label>
              </div>
            </div>
            <button className="start-button" onClick={startTimer}>
              Start Typing
            </button>
          </div>
        )}

        {status === "enable" && (
          <div className="game-play">
            <div className="game-header">
              <Timer status={status} timer={timer} />
              <div className="word-counter">
                Word {wordIndex + 1} of {wordNums}
              </div>
            </div>

            <div className="typing-area">
              <div className="words-display">
                {words.map((word, i) => (
                  <span
                    key={i}
                    className={`word ${i === wordIndex ? "current" : ""}`}
                  >
                    {word.split("").map((char, idx) => (
                      <span
                        key={idx}
                        className={`char ${getCharClass(i, idx, char)}`}
                      >
                        {char}
                      </span>
                    ))}
                    <span> </span>
                  </span>
                ))}
              </div>

              <input
                className="typing-input"
                placeholder="Start typing..."
                disabled={status === "disable"}
                type="text"
                onKeyDown={handleInput}
                value={inputWord}
                onChange={(event) => setInputWord(event.target.value)}
                autoFocus
              />
            </div>

            <button
              className="stop-button"
              onClick={() => window.location.reload()}
            >
              Stop Game
            </button>
          </div>
        )}

        {status === "disable" && (
          <div className="game-results">
            <h2>Game Over!</h2>
            <div className="results-grid">
              <div className="result-card">
                <span className="result-label">Words Per Minute</span>
                <span className="result-value">{correct + inCorrect}</span>
              </div>
              <div className="result-card">
                <span className="result-label">Accuracy</span>
                <span className="result-value">
                  {Math.round((correct / (correct + inCorrect)) * 100)}%
                </span>
              </div>
              <div className="result-card">
                <span className="result-label">Correct Words</span>
                <span className="result-value">{correct}</span>
              </div>
              <div className="result-card">
                <span className="result-label">Incorrect Words</span>
                <span className="result-value">{inCorrect}</span>
              </div>
            </div>
            <button
              className="retry-button"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        )}
        <Footer />
      </div>
    </div>
  );
}

export default TimedMode;
// edit 21665
// edit 10095
// edit 21338
// edit 14459
// edit 11360
// edit 30293
// edit 25999
// edit 14772
// edit 32638
// edit 13532
// edit 29589
// edit 32628
