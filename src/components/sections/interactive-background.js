import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { palette, hexToRgb } from '@styles/palette';

const CanvasWrapper = styled.canvas`
  display: block;
  position: fixed; /* Fica fixo no fundo enquanto vc rola a página */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1; /* Garante que fique ATRÁS de tudo */
  pointer-events: none; /* Deixa o clique passar para os botões abaixo */
  background: var(--navy); /* Cor de fundo base */
`;

// Reads the current theme so the particle network stays a soft accent
// on dark backgrounds but doesn't turn into a busy, low-contrast mess on light ones.
// The rgb triplets come straight from palette.js, so a new accent color there
// updates the particles too — nothing here is a separately-maintained color.
const getThemeColors = () => {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  const theme = isLight ? palette.light : palette.dark;
  return isLight
    ? { rgb: hexToRgb(theme.accent), dotAlpha: 0.45, lineAlpha: 0.35 }
    : { rgb: hexToRgb(theme.accent), dotAlpha: 1, lineAlpha: 1 };
};

const InteractiveBackground = () => {
  const canvasRef = useRef(null);
  const colorsRef = useRef({ rgb: '100, 255, 218', dotAlpha: 1, lineAlpha: 1 });

  useEffect(() => {
    colorsRef.current = getThemeColors();

    const observer = new MutationObserver(() => {
      colorsRef.current = getThemeColors();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Configurações do Efeito
    let particlesArray;
    const numberOfParticles = 80; // Quantidade de pontos (diminua se travar)
    const connectionDistance = 120; // Distância para criar linhas entre o cursor e as partículas
    const mouseRadius = 150; // Área de reação do mouse

    // Usuários que preferem menos movimento continuam com a rede visível,
    // só sem a deriva automática e o brilho pulsante das partículas.
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Ajusta o tamanho do canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const mouse = { x: null, y: null };
    let time = 0;
    const ripples = []; // Ondas geradas por clique

    // Rastreia o mouse
    const handleMouseMove = event => {
      mouse.x = event.x;
      mouse.y = event.y;
    };

    // Clique gera uma onda expansiva no ponto tocado — feedback vistoso
    // e imediato, mas pontual (não é uma animação contínua em loop).
    const handleClick = event => {
      ripples.push({ x: event.clientX, y: event.clientY, radius: 0, alpha: 0.6 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    // Classe da Partícula
    class Particle {
      constructor(x, y, directionX, directionY, size) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.twinklePhase = Math.random() * Math.PI * 2;
        this.twinkleSpeed = 0.6 + Math.random() * 1.4;
      }

      // Método para desenhar
      draw() {
        const { rgb, dotAlpha } = colorsRef.current;
        const twinkle = prefersReducedMotion ? 1 : 0.6 + 0.4 * Math.sin(time * this.twinkleSpeed + this.twinklePhase);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = `rgba(${rgb}, ${dotAlpha * twinkle})`;
        ctx.fill();
      }

      // Método para atualizar movimento
      update() {
        // Verifica bordas da tela e inverte direção
        if (this.x > canvas.width || this.x < 0) {
          this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.directionY = -this.directionY;
        }

        if (!prefersReducedMotion) {
          // Repulsão suave: quanto mais perto do cursor, mais forte o empurrão
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (mouse.x !== null && distance < mouseRadius && distance > 0) {
            const force = (mouseRadius - distance) / mouseRadius;
            this.x += (dx / distance) * force * 3;
            this.y += (dy / distance) * force * 3;
          }

          // Move a partícula
          this.x += this.directionX;
          this.y += this.directionY;
        }

        this.draw();
      }
    }

    // Inicializa as partículas
    function init() {
      particlesArray = [];
      for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 1) - 0.5; // Velocidade aleatória
        let directionY = (Math.random() * 1) - 0.5;

        particlesArray.push(new Particle(x, y, directionX, directionY, size));
      }
    }

    // Loop de Animação
    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      time += 0.016;
      ctx.clearRect(0, 0, innerWidth, innerHeight);

      drawCursorGlow();

      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
      }
      connect();
      drawRipples();
    }

    // Brilho suave que segue o cursor, dando profundidade ao fundo
    function drawCursorGlow() {
      if (mouse.x === null) {
        return;
      }
      const { rgb } = colorsRef.current;
      const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, mouseRadius);
      gradient.addColorStop(0, `rgba(${rgb}, 0.12)`);
      gradient.addColorStop(1, `rgba(${rgb}, 0)`);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, mouseRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Ondas expansivas nascidas de um clique — feedback pontual, não decorativo em loop
    function drawRipples() {
      const { rgb } = colorsRef.current;
      for (let i = ripples.length - 1; i >= 0; i--) {
        const ripple = ripples[i];
        ripple.radius += 4;
        ripple.alpha -= 0.015;

        if (ripple.alpha <= 0) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${rgb}, ${ripple.alpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    // Desenha as linhas entre partículas próximas
    function connect() {
      let opacityValue = 1;
      const { rgb, lineAlpha } = colorsRef.current;
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                         ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));

          if (distance < (canvas.width/7) * (canvas.height/7)) {
            opacityValue = (1 - (distance / 15000)) * lineAlpha;
            ctx.strokeStyle = `rgba(${rgb}, ${opacityValue})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }

        // Conecta a partícula ao cursor quando está por perto — reforça a
        // sensação de rede "viva" que reage a quem está usando o site.
        if (mouse.x !== null) {
          const mdx = particlesArray[a].x - mouse.x;
          const mdy = particlesArray[a].y - mouse.y;
          const mouseDistance = Math.sqrt(mdx * mdx + mdy * mdy);

          if (mouseDistance < connectionDistance) {
            const mouseOpacity = (1 - mouseDistance / connectionDistance) * lineAlpha;
            ctx.strokeStyle = `rgba(${rgb}, ${mouseOpacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }
    }

    // Redimensionamento da tela
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    });

    init();
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, []);

  return <CanvasWrapper ref={canvasRef} />;
};

export default InteractiveBackground;