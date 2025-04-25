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
    daysLeft
  }) => {
  return (
    <StyledWrapper>
      <section className="container">
        <div className="card-container">
          <div className="card-content">
            <div className="card-title">
              <span className="title">{title}</span>
            </div>
            <div className="card-body">
              <p style={{ color: '#9ef', fontSize: '0.85em' }}>{description}</p>
              <p style={{ color: '#ff4da6', fontWeight: 'bold' }}>{status} • {daysLeft} days left</p>
              <div style={{ width: '100%', backgroundColor: '#222', height: '0.5em', borderRadius: '0.25em' }}>
                <div style={{ width: `${(progress / goal) * 100}%`, backgroundColor: '#39FF14', height: '100%', borderRadius: '0.25em' }}></div>
              </div>
              <p style={{ color: '#ccc', fontSize: '0.75em' }}>{progress} / {goal}</p>
            </div>
            <div className="card-footer">
              <span className="title">View Details</span>
            </div>
          </div>
        </div>
      </section>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
  }
  .card-container {
    filter: drop-shadow(0 0 1rem #00f) drop-shadow(0 0 1rem #ff00ff);
    animation: blinkShadowsFilter 6s ease-in-out infinite;
  }
  .card-content {
    display: grid;
    grid-template-rows: auto 1fr auto;
    align-items: center;
    text-align: center;
    background-color: hsl(296, 59%, 10%);
    width: 16rem;
    aspect-ratio: 9/14;
    padding: 1rem;
    clip-path: polygon(0 0, 85% 0, 100% 14%, 100% 60%, 92% 65%, 93% 77%, 99% 80%, 99% 90%, 89% 100%, 0 100%);
    position: relative;
  }
  .card-content::after {
    content: "";
    position: absolute;
    top: 2%;
    left: 2%;
    width: 96%;
    height: 96%;
    box-shadow: inset 0px 0px 30px 40px hsl(296, 59%, 10%);
    clip-path: inherit;
    background: repeating-linear-gradient(to bottom, transparent 0%, rgba(64, 144, 181, 0.4) 1px, rgba(0, 0, 0, 0.8) 3px);
    z-index: 0;
  }
  .card-title {
    background: linear-gradient(90deg, transparent 0%, rgba(102, 224, 255, 0.3) 50%, transparent 100%);
    padding: 0.5rem;
    z-index: 1;
  }
  .title {
    color: #66e0ff;
    font-family: 'Orbitron', sans-serif;
    font-weight: bold;
    font-size: 1em;
  }
  .card-body {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    z-index: 1;
  }
  .card-footer {
    z-index: 1;
    margin-top: 1rem;
  }

  @keyframes blinkShadowsFilter {
    0%, 100% {
      filter: drop-shadow(0 0 0.75rem #39f) drop-shadow(0 0 0.75rem #f0f);
    }
    50% {
      filter: drop-shadow(0 0 1.5rem #39f) drop-shadow(0 0 1.5rem #f0f);
    }
  }
`;

export default QuestCard;
