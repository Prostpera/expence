'use client';

import React from 'react';
import styled from 'styled-components';

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
  return (
    <StyledWrapper>
      <div className="container">
        <div className="input-container">
          <div className="input-content">
            <div className="input-dist">
              <div className="input-type">
                <div className="input-is">{title}</div>
                <div className="input-is">{description}</div>
                <div className="input-is">{status} • {daysLeft} days left</div>
                <div className="input-is">
                  <div style={{ width: '100%', backgroundColor: '#222', height: '0.5em', borderRadius: '0.25em' }}>
                    <div style={{ width: `${(progress / goal) * 100}%`, backgroundColor: '#39FF14', height: '100%', borderRadius: '0.25em' }}></div>
                  </div>
                  <div style={{ color: '#ccc', fontSize: '0.75em' }}>{progress} / {goal}</div>
                </div>
                <button className="submit">View Details</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
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
    content: "";
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