'use client';

import React from 'react';
import styled from 'styled-components';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { useFeatureFlags } from '@/contexts/FeatureFlagsContext'; // 👈 toggle source

interface QuestCardProps {
  title: string;
  description: string;
  status: string;
  progress: number;
  goal: number;
  daysLeft: number;
}

const QuestCard: React.FC<QuestCardProps> = ({
  title,
  description,
  status,
  progress,
  goal,
  daysLeft,
}) => {
  const { awardQuestXp } = useUserProgress();
  const { requireCompletion, setRequireCompletion } = useFeatureFlags(); // 👈 read + set flag

  // can only complete if flag is off OR progress met
  const canComplete = !requireCompletion || progress >= goal;

  // XP reward (adjust however you like)
  const quest = {
    title,
    description,
    expReward: Math.max(50, Math.round(goal * 10)),
  };

  const handleComplete = () => {
    if (!canComplete) {
      alert('Finish the task to complete this quest (toggle testing mode to bypass).');
      return;
    }
    awardQuestXp(quest);
    alert(`Quest completed! You earned ${quest.expReward} XP.`);
  };

  return (
    <StyledWrapper>
      <div className="container">
        <div className="input-container">
          <div className="input-content">
            <div className="input-dist">
              <div className="input-type">
                <div className="input-is">{title}</div>
                <div className="input-is">{description}</div>
                <div className="input-is">
                  {status} • {daysLeft} days left
                </div>

                {/* Progress bar */}
                <div className="input-is">
                  <div
                    style={{
                      width: '100%',
                      backgroundColor: '#222',
                      height: '0.5em',
                      borderRadius: '0.25em',
                    }}
                  >
                    <div
                      style={{
                        width: `${(progress / goal) * 100}%`,
                        backgroundColor: '#39FF14',
                        height: '100%',
                        borderRadius: '0.25em',
                      }}
                    />
                  </div>
                  <div style={{ color: '#ccc', fontSize: '0.75em' }}>
                    {progress} / {goal}
                  </div>
                </div>

                {/* Card-level toggle */}
                <div className="input-is toggle-row" title="Testing helper">
                  <label className="toggle-label">
                    <input
                      type="checkbox"
                      checked={requireCompletion}
                      onChange={(e) => setRequireCompletion(e.target.checked)}
                      className="sr-only"
                    />
                    <span className={`switch ${requireCompletion ? 'on' : ''}`} />
                    <span className="toggle-text">Require task completion</span>
                  </label>
                </div>

                <div className="buttons">
                  <button className="submit">View Details</button>

                  <button
                    onClick={handleComplete}
                    className={`complete-btn ${canComplete ? 'glow' : 'disabled'}`}
                    disabled={!canComplete}
                    title={
                      canComplete
                        ? 'Complete Quest'
                        : 'Finish the task (or turn off the toggle) to complete'
                    }
                  >
                    Complete Quest
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .buttons {
    display: flex;
    justify-content: center;
    gap: 0.75rem;
  }

  .submit {
    color: #66e0ff;
    font-size: 1.1rem;
    border: none;
    background: none;
    font-family: 'Orbitron', sans-serif;
    font-weight: bold;
    margin: 10px 0 0;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .submit::before,
  .submit::after {
    content: '';
    width: 0%;
    height: 2px;
    background: #06aed8;
    display: block;
    transition: 0.5s;
  }

  .submit:hover::after,
  .submit:hover::before {
    width: 100%;
  }

  /* ===== Neon Complete Button ===== */
  .complete-btn {
    position: relative;
    background: transparent;
    color: #00ffff;
    font-family: 'Orbitron', sans-serif;
    font-weight: bold;
    font-size: 0.9rem;
    text-transform: uppercase;
    border: 2px solid #00ffff;
    border-radius: 6px;
    padding: 0.5em 1.2em;
    cursor: pointer;
    transition: all 0.25s ease;
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.3), inset 0 0 5px rgba(0, 255, 255, 0.2);
  }
  .complete-btn:hover {
    background: #00ffff;
    color: #0e0e1a;
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.6), 0 0 40px rgba(0, 255, 255, 0.3);
    transform: scale(1.03);
  }
  .complete-btn.disabled,
  .complete-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    filter: grayscale(30%);
    box-shadow: none;
    transform: none;
    background: transparent;
    color: #7ddcff;
  }

  @keyframes glowPulse {
    0%   { box-shadow: 0 0 10px rgba(0, 255, 255, 0.4); }
    50%  { box-shadow: 0 0 25px rgba(0, 255, 255, 0.8); }
    100% { box-shadow: 0 0 10px rgba(0, 255, 255, 0.4); }
  }
  .complete-btn.glow { animation: glowPulse 2s infinite ease-in-out; }

  /* ===== Toggle styles (card-level) ===== */
  .toggle-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: .75rem;
  }
  .toggle-label {
    display: inline-flex;
    align-items: center;
    gap: .5rem;
    cursor: pointer;
  }
  .switch {
    width: 38px;
    height: 20px;
    border-radius: 9999px;
    background: #2a2a3a;
    position: relative;
    transition: background 0.2s ease;
    box-shadow: inset 0 0 6px rgba(0,0,0,0.5);
  }
  .switch::after {
    content: '';
    width: 16px; height: 16px;
    background: #fff;
    border-radius: 9999px;
    position: absolute;
    top: 2px; left: 2px;
    transition: transform 0.2s ease;
  }
  .switch.on {
    background: #00bcd4;
  }
  .switch.on::after {
    transform: translateX(18px);
  }
  .toggle-text {
    color: #8bd7ff;
    font-size: 0.75rem;
    letter-spacing: .02em;
  }

  /* ===== Card base styles ===== */
  .container {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    flex-direction: column;
    gap: 1em;
    padding: 1rem;
  }

  .input-container {
    filter: drop-shadow(0 0 10px rgba(102, 224, 255, 0.3));
  }

  .input-content {
    position: relative;
    display: grid;
    align-items: center;
    text-align: center;
    padding: 1rem;
    clip-path: polygon(
      26% 0,
      31% 5%,
      61% 5%,
      66% 0,
      92% 0,
      100% 8%,
      100% 89%,
      91% 100%,
      7% 100%,
      0 92%,
      0 0
    );
    background: #0e0e1a;
    border: 2px solid #66e0ff;
  }

  .input-dist {
    z-index: 1;
    display: grid;
    align-items: center;
    text-align: center;
    width: 100%;
    padding: 1.2em;
  }

  .input-type {
    display: flex;
    flex-direction: column;
    gap: 1em;
    font-size: 1.1rem;
    background-color: transparent;
    width: 100%;
    border: none;
  }

  .input-is {
    color: #fff;
    font-size: 0.9rem;
    background-color: transparent;
    width: 100%;
    padding: 0.7em 0.5em;
    border-bottom: 1px solid hsl(221, 26%, 43%);
  }
`;

export default QuestCard;
