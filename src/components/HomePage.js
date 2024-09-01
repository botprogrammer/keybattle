import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } =
        e.currentTarget.getBoundingClientRect();

      const x = ((clientX - left) / width) * 100;
      const y = ((clientY - top) / height) * 100;

      document.documentElement.style.setProperty("--mouse-x", `${x}%`);
      document.documentElement.style.setProperty("--mouse-y", `${y}%`);
    };

    const container = document.querySelector(".homepage-container");
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  return (
    <div className="homepage-container">
      <h1 className="game-title">Keyboard Conqueror</h1>
      <div className="game-modes">
        <div className="mode-card" onClick={() => navigate("/timed")}>
          <h2>Timed Mode</h2>
          <p>Test your typing speed against the clock</p>
          <ul>
            <li>Customizable time limit</li>
            <li>Word count tracking</li>
            <li>Real-time feedback</li>
          </ul>
        </div>
        <div className="mode-card" onClick={() => navigate("/race")}>
          <h2>Race Battle Mode</h2>
          <p>Race against time with bonus seconds</p>
          <ul>
            <li>Multiple difficulty levels</li>
            <li>Score multiplier system</li>
            <li>High score tracking</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
// edit 13950
// edit 17704
// edit 14550
// edit 28140
// edit 26555
// edit 16739
// edit 7627
// edit 28502
// edit 12382
// edit 31712
// edit 11023
// edit 15707
// edit 22070
// edit 12140
// edit 11293
// edit 2453
// edit 13986
// edit 24257
// edit 592
// edit 17562
