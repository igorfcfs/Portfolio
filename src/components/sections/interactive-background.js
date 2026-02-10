import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

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

const InteractiveBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Configurações do Efeito
    let particlesArray;
    const numberOfParticles = 80; // Quantidade de pontos (diminua se travar)
    const connectionDistance = 120; // Distância para criar linhas
    const mouseRadius = 150; // Área de reação do mouse

    // Ajusta o tamanho do canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let mouse = {
      x: null,
      y: null,
      radius: (canvas.height / 80) * (canvas.width / 80),
    };

    // Rastreia o mouse
    const handleMouseMove = (event) => {
      mouse.x = event.x;
      mouse.y = event.y;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Classe da Partícula
    class Particle {
      constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
      }

      // Método para desenhar
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = '#64ffda'; // Var(--green)
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

        // Verifica colisão com o mouse
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseRadius + this.size) {
          if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
            this.x += 2; // Empurra pra direita
          }
          if (mouse.x > this.x && this.x > this.size * 10) {
            this.x -= 2; // Empurra pra esquerda
          }
          if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
            this.y += 2;
          }
          if (mouse.y > this.y && this.y > this.size * 10) {
            this.y -= 2;
          }
        }

        // Move a partícula
        this.x += this.directionX;
        this.y += this.directionY;

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
        let color = '#64ffda';

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
      }
    }

    // Loop de Animação
    function animate() {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, innerWidth, innerHeight);

      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
      }
      connect();
    }

    // Desenha as linhas entre partículas próximas
    function connect() {
      let opacityValue = 1;
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                         ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
          
          if (distance < (canvas.width/7) * (canvas.height/7)) {
            opacityValue = 1 - (distance / 15000);
            ctx.strokeStyle = 'rgba(100, 255, 218,' + opacityValue + ')'; // Linha verde com transparência
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
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
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <CanvasWrapper ref={canvasRef} />;
};

export default InteractiveBackground;