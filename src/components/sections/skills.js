import React from 'react';
import styled, { keyframes } from 'styled-components';

// --- IMPORTANDO ÍCONES (Baseado no seu currículo PDF) ---
import { FaJava, FaNodeJs, FaPython, FaReact, FaDocker, FaGitAlt, FaHtml5, FaCss3Alt, FaAngular } from 'react-icons/fa';
import { SiSpringboot, SiHibernate, SiExpress, SiDjango, SiFlask, SiPostgresql, SiMysql, SiMongodb, SiFirebase, SiTypescript, SiJavascript, SiCplusplus, SiPandas } from 'react-icons/si';

// --- DADOS DAS SKILLS (Extraídos do CV) ---
const SKILLS_DATA = [
  // Backend & Languages
  { name: 'Java', icon: <FaJava /> },
  { name: 'Spring Boot', icon: <SiSpringboot /> },
  { name: 'Hibernate', icon: <SiHibernate /> },
  { name: 'Node.js', icon: <FaNodeJs /> },
  { name: 'Express.js', icon: <SiExpress /> },
  { name: 'Python', icon: <FaPython /> },
  { name: 'Django', icon: <SiDjango /> },
  { name: 'Flask', icon: <SiFlask /> },
  
  // Frontend
  { name: 'React', icon: <FaReact /> },
  { name: 'TypeScript', icon: <SiTypescript /> },
  { name: 'Angular', icon: <FaAngular /> },
  { name: 'HTML5', icon: <FaHtml5 /> },
  { name: 'CSS3', icon: <FaCss3Alt /> },
  { name: 'JavaScript', icon: <SiJavascript /> },
  
  // Data & DB
  { name: 'PostgreSQL', icon: <SiPostgresql /> },
  { name: 'MySQL', icon: <SiMysql /> },
  { name: 'MongoDB', icon: <SiMongodb /> },
  { name: 'Firebase', icon: <SiFirebase /> },
  { name: 'Pandas', icon: <SiPandas /> },

  // Tools & DevOps
  { name: 'Docker', icon: <FaDocker /> },
  { name: 'Git', icon: <FaGitAlt /> },
];

// --- ANIMAÇÃO ---
const scroll = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

const SkillsContainer = styled.div`
  width: 100vw;
  position: relative;
  left: 50%;
  transform: translateX(-50%);

  margin-top: 60px;
  margin-bottom: 20px;

  background: var(--surface-tint);
  padding: 30px 0;

  mask-image: linear-gradient(
    to right,
    transparent,
    black 10%,
    black 90%,
    transparent
  );
`;

const ScrollTrack = styled.div`
  display: flex;
  gap: 24px;
  width: max-content;
  animation: ${scroll} 60s linear infinite; /* Roda constante */
  
  /* O segredo: NÃO pausar no hover, apenas desacelerar um pouco se quiser (opcional) */
  /* &:hover { animation-play-state: paused; } <--- REMOVIDO */
`;

const SkillCard = styled.div`
  /* Design Glassmorphism */
  background: var(--glass-bg);
  backdrop-filter: blur(5px);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  
  padding: 15px 30px;
  min-width: 160px;
  height: 80px;
  
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  
  user-select: none; /* Impede seleção de texto */
  transition: all 0.3s ease;
  cursor: default;

  /* Efeito Glow ao passar o mouse no CARD (mas o trilho continua andando) */
  &:hover {
    background: rgba(100, 255, 218, 0.1); /* Verde bem suave */
    border-color: var(--green);
    box-shadow: 0 0 20px rgba(100, 255, 218, 0.2);
    transform: translateY(-5px) scale(1.05);
    
    svg, span {
      color: var(--green);
      filter: drop-shadow(0 0 5px rgba(100, 255, 218, 0.5));
    }
  }

  svg {
    width: 32px;
    height: 32px;
    color: var(--light-slate);
    transition: all 0.3s ease;
  }

  span {
    color: var(--lightest-slate);
    font-size: 14px;
    font-family: var(--font-mono);
    font-weight: 600;
    letter-spacing: 0.5px;
    transition: all 0.3s ease;
  }
`;

const Skills = () => (
  <SkillsContainer>
    <ScrollTrack>
      {/* Bloco 1 */}
      {SKILLS_DATA.map((skill, i) => (
        <SkillCard key={`orig-${i}`}>
          {skill.icon}
          <span>{skill.name}</span>
        </SkillCard>
      ))}
      
      {/* Bloco 2 (Duplicado para infinito) */}
      {SKILLS_DATA.map((skill, i) => (
        <SkillCard key={`dup-${i}`} aria-hidden="true">
          {skill.icon}
          <span>{skill.name}</span>
        </SkillCard>
      ))}
    </ScrollTrack>
  </SkillsContainer>
);

export default Skills;