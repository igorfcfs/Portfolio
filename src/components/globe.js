import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import styled, { keyframes } from 'styled-components';
import { useSpring } from 'react-spring';
import { useDrag } from 'react-use-gesture';
import { useIntl } from 'gatsby-plugin-intl';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const blink = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
`;

const CanvasContainer = styled.div`
  width: 100%;
  height: 600px;
  position: relative;
  // background: transparent;
  background: var(--navy);
  cursor: grab;
  touch-action: none;

  /* Faz o canvas aparecer suavemente */
  canvas {
    opacity: ${({ isLoaded }) => (isLoaded ? 1 : 0)};
    transition: opacity 1s ease-in-out;
  }
`;

const Loader = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: var(--font-mono);
  font-size: var(--fz-md);
  color: var(--green);
  display: flex;
  align-items: center;
  gap: 10px;
  animation: ${blink} 1.5s infinite;
  
  &:before {
    content: '> ';
    color: var(--green);
  }
`;

const ButtonContainer = styled.div`
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  display: flex;
  gap: 15px;
  animation: ${fadeIn} 0.5s ease-in;
`;

const ActionButton = styled.button`
  ${({ theme }) => theme.mixins.button};
  background: rgba(10, 25, 47, 0.85);
  backdrop-filter: blur(5px);
  padding: 12px 20px;
  font-size: 13px;
  border: 1px solid var(--green);
`;

const MARKERS = [
  { id: 'usp', name: 'USP', coords: [-46.730, -23.560] },
  { id: 'ufabc', name: 'UFABC', coords: [-46.528, -23.645] },
  { id: 'harvard', name: 'Harvard', coords: [-71.110, 42.374] },
];

const Globe = ({ targetCoords }) => {
  const intl = useIntl();
  const canvasRef = useRef(null);
  const [landData, setLandData] = useState(null);
  const [isGlobe, setIsGlobe] = useState(true);
  const simulationRef = useRef(null);
  
  const state = useRef({
    rotation: [46.7, 23.5], 
    isDragging: false,
    isAnimating: false,
    nodes: MARKERS.map(m => ({ ...m, x: 0, y: 0 }))
  });

  const [{ t }, api] = useSpring(() => ({ 
    t: 0, 
    config: { mass: 1, tension: 120, friction: 26 } 
  }));

  useEffect(() => {
    // Carrega o JSON do mundo
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(r => r.json())
      .then(world => {
        // Simula um delay pequeno se quiser testar o loader (remova em produção)
        // setTimeout(() => {
          setLandData(topojson.feature(world, world.objects.countries));
        // }, 2000);
      })
      .catch(err => console.error("Erro ao carregar mapa:", err));
  }, []);

  // --- LÓGICA DE VOO ---
  useEffect(() => {
    if (targetCoords && !state.current.isDragging && landData) {
      state.current.isAnimating = true;
      const destRotation = [-targetCoords[0], -targetCoords[1]];
      const interpolate = d3.interpolate(state.current.rotation, destRotation);
      const duration = 1500;
      const startTime = performance.now();

      const animateStep = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        state.current.rotation = interpolate(ease);

        if (progress < 1) {
          requestAnimationFrame(animateStep);
        } else {
          state.current.isAnimating = false;
        }
      };
      requestAnimationFrame(animateStep);
    }
  }, [targetCoords, landData]);

  useEffect(() => {
    api.start({ t: isGlobe ? 0 : 1 });
  }, [isGlobe, api]);

  const bind = useDrag(({ offset: [x, y], down }) => {
    state.current.isDragging = down;
    if (state.current.isAnimating) return; 

    const sensitivity = 0.4;
    if (down) {
      const currentT = t.get();
      const lat = currentT < 0.5 ? Math.max(-89, Math.min(89, -y * sensitivity)) : -y * sensitivity;
      state.current.rotation = [x * sensitivity + 46.7, lat + 23.5];
    }
  });

  useEffect(() => {
    if (!landData) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!simulationRef.current) {
      simulationRef.current = d3.forceSimulation(state.current.nodes)
        .force("collide", d3.forceCollide().radius(22))
        .force("charge", d3.forceManyBody().strength(-35))
        .stop();
    }

    let animationFrameId;

    const render = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      const dpr = window.devicePixelRatio || 2;
      
      if (canvas.width !== width * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        context.scale(dpr, dpr);
      }
      context.clearRect(0, 0, width, height);

      const currentT = t.get();
      
      if (!state.current.isDragging && !state.current.isAnimating && currentT < 0.1) {
        state.current.rotation[0] += 0.08;
      }

      const rawInterpolate = (lambda, phi) => {
        const p0 = d3.geoOrthographicRaw(lambda, phi);
        const p1 = d3.geoEquirectangularRaw(lambda, phi);
        return [(1 - currentT) * p0[0] + currentT * p1[0], (1 - currentT) * p0[1] + currentT * p1[1]];
      };

      const scale = (1 - currentT) * (height / 2.3) + currentT * (height / 6.5);

      const projection = d3.geoProjection(rawInterpolate)
        .rotate(state.current.rotation)
        .scale(scale)
        .translate([width / 2, height / 2])
        .clipAngle(180)
        .precision(0.1);

      if (currentT > 0.8) {
        projection.clipExtent([[0, 0], [width, height]]);
      } else {
        projection.clipExtent(null);
      }

      const path = d3.geoPath(projection, context);

      // Grade
      context.beginPath();
      context.strokeStyle = `rgba(100, 255, 218, 0.08)`;
      path(d3.geoGraticule()());
      context.stroke();

      // Países
      context.beginPath();
      context.strokeStyle = `rgba(100, 255, 218, ${0.4 + (currentT * 0.6)})`;
      context.lineWidth = 1;
      path(landData);
      context.stroke();

      // Nodes
      state.current.nodes.forEach(node => {
        const coords = projection(node.coords);
        if (coords) {
          node.targetX = coords[0];
          node.targetY = coords[1];
          const dist = Math.hypot(node.x - coords[0], node.y - coords[1]);
          if (dist > 100) { node.x = coords[0]; node.y = coords[1]; }
        }
      });

      const sim = simulationRef.current;
      sim.force("x", d3.forceX(d => d.targetX).strength(0.2));
      sim.force("y", d3.forceY(d => d.targetY).strength(0.2));
      sim.alpha(1).tick();

      state.current.nodes.forEach(node => {
        const center = projection(node.coords);
        if (!center) return;

        const distance = d3.geoDistance(node.coords, [-state.current.rotation[0], -state.current.rotation[1]]);
        const isVisible = currentT > 0.5 || distance < 1.57;

        if (isVisible) {
          context.beginPath();
          context.moveTo(center[0], center[1]);
          context.lineTo(node.x, node.y);
          context.strokeStyle = 'rgba(100, 255, 218, 0.2)';
          context.stroke();

          context.beginPath();
          context.arc(center[0], center[1], 2, 0, 2 * Math.PI);
          context.fillStyle = '#64ffda';
          context.fill();

          context.fillStyle = 'rgba(2, 12, 27, 0.85)';
          const textWidth = context.measureText(node.name).width;
          context.fillRect(node.x - textWidth/2 - 6, node.y - 10, textWidth + 12, 20);
          
          context.fillStyle = '#64ffda';
          context.font = '11px "SF Mono", "Fira Code", monospace';
          context.textAlign = 'center';
          context.fillText(node.name, node.x, node.y + 4);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [landData, t]);

  // Labels Traduzidas
  const labelUnroll = intl.formatMessage({ id: 'academic_languages_unroll' });
  const labelForm = intl.formatMessage({ id: 'academic_languages_form' });
  const labelReset = intl.formatMessage({ id: 'academic_languages_reset' });
  const labelLoading = intl.formatMessage({ id: 'academic_languages_loading' });

  return (
    <CanvasContainer {...bind()} isLoaded={!!landData}>
      {/* LOADER: Só aparece se landData for null */}
      {!landData && (
        <Loader>
          {labelLoading}
        </Loader>
      )}

      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
      
      {/* BOTÕES: Só aparecem quando o globo carregar */}
      {landData && (
        <ButtonContainer>
          <ActionButton onClick={() => setIsGlobe(!isGlobe)}>
            {isGlobe ? labelUnroll : labelForm}
          </ActionButton>
          <ActionButton onClick={() => { state.current.rotation = [46.7, 23.5]; setIsGlobe(true); }}>
            {labelReset}
          </ActionButton>
        </ButtonContainer>
      )}
    </CanvasContainer>
  );
};

export default Globe;