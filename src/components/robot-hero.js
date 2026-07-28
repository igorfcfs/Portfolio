import React, { useMemo, useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
// Imported from their concrete submodules (not the `@react-three/drei` barrel)
// because the barrel's index.js unconditionally pulls in Stats.js, which
// references a `three/examples/js/...` path removed by modern three's
// package.json "exports" map and breaks the whole bundle.
import { Environment } from '@react-three/drei/core/Environment';
import { ContactShadows } from '@react-three/drei/core/ContactShadows';
import * as THREE from 'three';
import { usePrefersReducedMotion } from '@hooks';

// Decorative desktop-only companion for the hero section. Ported from a
// Next.js/Tailwind/shadcn demo down to plain R3F + JS — the navbar/CTA
// chrome from the original demo was dropped since the site has its own nav.

// Not written as `class HeartCurve extends THREE.Curve` on purpose: three.js
// ships Curve as a real (untranspiled) ES class, and Babel's down-level
// `super()` codegen calls it as a plain function, which native classes
// reject with "Class constructor Curve cannot be invoked without 'new'".
// Reflect.construct sidesteps that by doing the construction ourselves.
function HeartCurve() {
  return Reflect.construct(THREE.Curve, [], HeartCurve);
}
HeartCurve.prototype = Object.create(THREE.Curve.prototype);
HeartCurve.prototype.constructor = HeartCurve;
HeartCurve.prototype.getPoint = function (t, optionalTarget = new THREE.Vector3()) {
  t = t * Math.PI * 2;
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);

  return optionalTarget.set(x * 0.002, (y + 6) * 0.002, 0);
};

const sharedHeartCurve = new HeartCurve();

function ResponsiveGroup({ children }) {
  const { viewport } = useThree();
  const scale = Math.min(1.1, viewport.width / 3.5);
  return <group scale={scale}>{children}</group>;
}

function GlassCapsule({ color, power, intensity }) {
  const materialRef = useRef(null);

  const uniforms = useMemo(
    () => ({
      color: { value: new THREE.Color('#ffffff') },
      power: { value: 2.5 },
      intensity: { value: 0.6 },
    }),
    []
  );

  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.color.value.set(color);
      materialRef.current.uniforms.power.value = power;
      materialRef.current.uniforms.intensity.value = intensity;
    }
  });

  return (
    <mesh>
      <sphereGeometry args={[0.3, 64, 64, 0, Math.PI * 2, 0, Math.PI]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={`
          varying vec3 vNormal;
          varying vec3 vViewPosition;
          void main() {
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            vViewPosition = -mvPosition.xyz;
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          uniform vec3 color;
          uniform float power;
          uniform float intensity;
          varying vec3 vNormal;
          varying vec3 vViewPosition;
          void main() {
            vec3 normal = normalize(vNormal);
            vec3 viewDir = normalize(vViewPosition);
            float fresnel = 1.0 - max(dot(viewDir, normal), 0.0);
            fresnel = pow(fresnel, power);
            gl_FragColor = vec4(color, fresnel * intensity);
          }
        `}
        transparent={true}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

const earBaseMat = new THREE.MeshStandardMaterial({ color: '#f0f0f0', roughness: 0.5 });
const earRingMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.3 });
const earCenterMat = new THREE.MeshStandardMaterial({ color: '#cccccc', roughness: 0.8 });
const antennaBaseMat = new THREE.MeshStandardMaterial({ color: '#999999', roughness: 0.4, metalness: 0.5 });
const antennaStickMat = new THREE.MeshStandardMaterial({ color: '#d0d0d0', roughness: 0.4, metalness: 0.2 });
const antennaTipMat = new THREE.MeshStandardMaterial({ color: '#ff3366', roughness: 0.2, toneMapped: false });

function RobotEar({ position, scale = 1, isLeft = false }) {
  const dir = isLeft ? -1 : 1;

  return (
    <group position={position} scale={scale}>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow material={earBaseMat}>
        <cylinderGeometry args={[0.04, 0.04, 0.025, 32]} />
      </mesh>

      <mesh position={[dir * 0.012, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow material={earRingMat}>
        <torusGeometry args={[0.032, 0.008, 16, 32]} />
      </mesh>

      <mesh position={[dir * 0.012, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow material={earCenterMat}>
        <cylinderGeometry args={[0.03, 0.03, 0.005, 32]} />
      </mesh>

      <group position={[dir * 0.015, 0.035, 0]} rotation={[-0.4, 0, 0]}>
        <mesh position={[0, 0.01, 0]} castShadow receiveShadow material={antennaBaseMat}>
          <cylinderGeometry args={[0.006, 0.008, 0.02, 16]} />
        </mesh>
        <mesh position={[0, 0.06, 0]} castShadow receiveShadow material={antennaStickMat}>
          <cylinderGeometry args={[0.003, 0.003, 0.1, 8]} />
        </mesh>
        <mesh position={[0, 0.11, 0]} castShadow receiveShadow material={antennaTipMat}>
          <sphereGeometry args={[0.006, 16, 16]} />
        </mesh>
      </group>
    </group>
  );
}

const eyeMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(2, 2, 2), toneMapped: false, transparent: true });
const heartMat = new THREE.MeshBasicMaterial({ color: '#ff3366', toneMapped: false });

function RobotEye({ position, rotation, scale = 1, blinkDuration = 0.15, blinkCycle = 3.0, isLovedRef }) {
  const groupRef = useRef(null);
  const normalEyesRef = useRef(null);
  const heartEyeRef = useRef(null);

  useFrame(({ clock }) => {
    if (!groupRef.current || !normalEyesRef.current || !heartEyeRef.current) return;

    const isHeart = isLovedRef.current;

    normalEyesRef.current.visible = !isHeart;
    heartEyeRef.current.visible = isHeart;

    const cycle = clock.getElapsedTime() % blinkCycle;

    let targetScaleY = 1;

    if (cycle < blinkDuration && !isHeart) {
      const progress = cycle / blinkDuration;
      const blinkClose = Math.sin(progress * Math.PI);

      targetScaleY = Math.max(0.05, 1.0 - blinkClose);
    }

    groupRef.current.scale.set(scale, scale * targetScaleY, scale);
  });

  const { topPath, bottomPath } = useMemo(() => {
    const w = 0.025;
    const h = 0.035;
    const r = 0.02;
    const g = 0.005;

    const tPath = new THREE.CurvePath();
    tPath.add(new THREE.LineCurve3(new THREE.Vector3(-w, g, 0), new THREE.Vector3(-w, h - r, 0)));
    tPath.add(
      new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(-w, h - r, 0),
        new THREE.Vector3(-w, h, 0),
        new THREE.Vector3(-w + r, h, 0)
      )
    );
    tPath.add(new THREE.LineCurve3(new THREE.Vector3(-w + r, h, 0), new THREE.Vector3(w - r, h, 0)));
    tPath.add(
      new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(w - r, h, 0),
        new THREE.Vector3(w, h, 0),
        new THREE.Vector3(w, h - r, 0)
      )
    );
    tPath.add(new THREE.LineCurve3(new THREE.Vector3(w, h - r, 0), new THREE.Vector3(w, g, 0)));

    const bPath = new THREE.CurvePath();
    bPath.add(new THREE.LineCurve3(new THREE.Vector3(-w, -g, 0), new THREE.Vector3(-w, -(h - r), 0)));
    bPath.add(
      new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(-w, -(h - r), 0),
        new THREE.Vector3(-w, -h, 0),
        new THREE.Vector3(-w + r, -h, 0)
      )
    );
    bPath.add(new THREE.LineCurve3(new THREE.Vector3(-w + r, -h, 0), new THREE.Vector3(w - r, -h, 0)));
    bPath.add(
      new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(w - r, -h, 0),
        new THREE.Vector3(w, -h, 0),
        new THREE.Vector3(w, -(h - r), 0)
      )
    );
    bPath.add(new THREE.LineCurve3(new THREE.Vector3(w, -(h - r), 0), new THREE.Vector3(w, -g, 0)));

    return { topPath: tPath, bottomPath: bPath };
  }, []);

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <mesh ref={heartEyeRef} visible={false} material={heartMat}>
        <tubeGeometry args={[sharedHeartCurve, 64, 0.0035, 8, true]} />
      </mesh>

      <group ref={normalEyesRef}>
        <mesh material={eyeMat}>
          <tubeGeometry args={[topPath, 20, 0.0035, 8, false]} />
        </mesh>
        <mesh material={eyeMat}>
          <tubeGeometry args={[bottomPath, 20, 0.0035, 8, false]} />
        </mesh>
      </group>
    </group>
  );
}

function generatePbrTexturesAsync() {
  return new Promise(resolve => {
    setTimeout(() => {
      const size = 512;
      const canvasC = document.createElement('canvas');
      const canvasB = document.createElement('canvas');
      canvasC.width = canvasB.width = size;
      canvasC.height = canvasB.height = size;
      const ctxC = canvasC.getContext('2d');
      const ctxB = canvasB.getContext('2d');

      if (ctxC && ctxB) {
        ctxC.fillStyle = '#dcdcdc';
        ctxC.fillRect(0, 0, size, size);
        ctxB.fillStyle = '#808080';
        ctxB.fillRect(0, 0, size, size);

        for (let i = 0; i < 10000; i++) {
          const x = Math.random() * size;
          const y = Math.random() * size;
          const r = 0.5 + Math.random() * 1.5;
          const isDark = Math.random() > 0.15;

          ctxC.beginPath();
          ctxC.arc(x, y, r, 0, Math.PI * 2);
          ctxC.fillStyle = isDark ? '#222222' : '#dddddd';
          ctxC.fill();

          ctxB.beginPath();
          ctxB.arc(x, y, r, 0, Math.PI * 2);
          ctxB.fillStyle = isDark ? '#000000' : '#ffffff';
          ctxB.fill();
        }
      }

      const texC = new THREE.CanvasTexture(canvasC);
      const texB = new THREE.CanvasTexture(canvasB);
      texC.wrapS = texB.wrapS = THREE.RepeatWrapping;
      texC.wrapT = texB.wrapT = THREE.RepeatWrapping;

      texC.repeat.set(6, 3);
      texB.repeat.set(6, 3);
      texC.needsUpdate = true;
      texB.needsUpdate = true;

      resolve({ colorMap: texC, bumpMap: texB });
    }, 0);
  });
}

function RobotPrototype({
  neckParams = {
    baseR: 0.215,
    baseH: -0.05,
    midR: 0.28,
    midH: 0.02,
    lipBottomR: 0.295,
    lipBottomH: 0.045,
    lipTopR: 0.27,
    lipTopH: 0.055,
    innerR: 0.1,
    innerDropH: 0,
  },
  bodyParams = { bodyBevelR: 0.235, bodyBevelY: 0.34, bodyBevelT: 0.025 },
}) {
  const isLovedRef = useRef(false);
  const timeoutRef = useRef(null);
  const bodyRef = useRef(null);
  const headRef = useRef(null);

  const [textures, setTextures] = useState({ colorMap: null, bumpMap: null });

  const design = {
    pantallaColor: '#00ffc6',
    pantallaGrosor: 3.8,
    pantallaBrillo: 1.2,
    separacionOjos: 0.07,
    tamañoOrejas: 1.3,
    escalaOjos: 1.1,
    parpadeoFrecuencia: 3.0,
    parpadeoDuracion: 0.45,
    colorChasis: '#ffffff',
    alturaCabeza: 0.6,
  };

  const config = {
    moveSpeed: 0.35,
    bodyRotSpeed: 10.0,
    headRotSpeed: 20.0,
    bodyTiltX: 0.0,
    bodyTiltY: 0.95,
    headLookX: 0.3,
    headLookY: 1.8,
  };

  useFrame((state, delta) => {
    if (!bodyRef.current || !headRef.current) return;

    const dt = Math.min(delta, 0.1);

    const tx = state.mouse.x;
    const ty = state.mouse.y;

    const maxMoveX = state.viewport.width / 3.5;
    const targetPosX = tx * maxMoveX;
    bodyRef.current.position.x = THREE.MathUtils.lerp(bodyRef.current.position.x, targetPosX, config.moveSpeed * dt);

    const relativeX = tx - bodyRef.current.position.x / 2.5;

    const bodyTargetRotY = -relativeX * config.bodyTiltY;

    const bodyTargetRotX = relativeX * relativeX * config.bodyTiltX - ty * 0.25;

    const bodyTargetRotZ = -relativeX * 0.15;

    bodyRef.current.rotation.y = THREE.MathUtils.lerp(bodyRef.current.rotation.y, bodyTargetRotY, config.bodyRotSpeed * dt);
    bodyRef.current.rotation.x = THREE.MathUtils.lerp(bodyRef.current.rotation.x, bodyTargetRotX, config.bodyRotSpeed * dt);
    bodyRef.current.rotation.z = THREE.MathUtils.lerp(bodyRef.current.rotation.z, bodyTargetRotZ, config.bodyRotSpeed * dt);

    const headTargetRotY = relativeX * config.headLookY;
    const headTargetRotX = -ty * config.headLookX;

    headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, headTargetRotY, config.headRotSpeed * dt);
    headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, headTargetRotX, config.headRotSpeed * dt);
  });

  useEffect(() => {
    let mounted = true;
    let generatedMaps = null;

    generatePbrTexturesAsync().then(res => {
      if (mounted) {
        generatedMaps = res;
        setTextures(res);
      } else {
        res.colorMap.dispose();
        res.bumpMap.dispose();
      }
    });

    return () => {
      mounted = false;

      if (generatedMaps) {
        generatedMaps.colorMap.dispose();
        generatedMaps.bumpMap.dispose();
      }
    };
  }, []);

  const handlePointerDown = e => {
    e.stopPropagation();
    isLovedRef.current = true;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      isLovedRef.current = false;
    }, 2000);
  };

  const neckProfile = useMemo(() => {
    const points = [];

    points.push(new THREE.Vector2(neckParams.innerR, neckParams.baseH));
    points.push(new THREE.Vector2(neckParams.baseR, neckParams.baseH));
    points.push(new THREE.Vector2(neckParams.midR, neckParams.midH));
    points.push(new THREE.Vector2(neckParams.lipBottomR, neckParams.lipBottomH));
    points.push(new THREE.Vector2(neckParams.lipTopR, neckParams.lipTopH));
    points.push(new THREE.Vector2(neckParams.innerR, neckParams.lipTopH));
    points.push(new THREE.Vector2(neckParams.innerR, neckParams.lipTopH - neckParams.innerDropH));
    return points;
  }, [neckParams]);

  const headMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#000000',
      roughness: 1.0,
      metalness: 0.0,
      envMapIntensity: 0,
    });
  }, []);

  if (!textures.colorMap) return null;

  return (
    <group
      ref={bodyRef}
      position={[0, -0.3, 0]}
      onPointerDown={handlePointerDown}
      onPointerOver={() => (document.body.style.cursor = 'pointer')}
      onPointerOut={() => (document.body.style.cursor = 'auto')}
    >
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.43, 64, 64, 0, Math.PI * 2, Math.PI * 0.15, Math.PI * 0.85]} />
        <meshStandardMaterial
          color={design.colorChasis}
          map={textures.colorMap || undefined}
          bumpMap={textures.bumpMap || undefined}
          bumpScale={0.005}
          roughness={1.0}
          metalness={0.0}
          envMapIntensity={0.0}
        />
      </mesh>

      {bodyParams.bodyBevelT > 0 && (
        <mesh position={[0, bodyParams.bodyBevelY, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
          <torusGeometry args={[bodyParams.bodyBevelR, bodyParams.bodyBevelT, 32, 64]} />
          <meshStandardMaterial
            color={design.colorChasis}
            map={textures.colorMap || undefined}
            bumpMap={textures.bumpMap || undefined}
            bumpScale={0.005}
            roughness={1.0}
            metalness={0.0}
            envMapIntensity={0.0}
          />
        </mesh>
      )}

      <mesh position={[0, 0.38, 0]} receiveShadow castShadow>
        <latheGeometry args={[neckProfile, 64]} />
        <meshStandardMaterial
          color={design.colorChasis}
          map={textures.colorMap || undefined}
          bumpMap={textures.bumpMap || undefined}
          bumpScale={0.005}
          roughness={1.0}
          metalness={0.0}
          envMapIntensity={0.0}
        />
      </mesh>

      <group ref={headRef} position={[0, design.alturaCabeza, 0]}>
        <mesh material={headMat} castShadow receiveShadow>
          <sphereGeometry args={[0.28, 64, 64, 0, Math.PI * 2, 0, Math.PI]} />
        </mesh>

        <GlassCapsule color={design.pantallaColor} power={design.pantallaGrosor} intensity={design.pantallaBrillo} />

        <group position={[0, -0.02, 0.29]}>
          <RobotEye
            position={[-design.separacionOjos, 0, 0]}
            rotation={[0, -0.2, 0]}
            scale={design.escalaOjos}
            blinkDuration={design.parpadeoDuracion}
            blinkCycle={design.parpadeoFrecuencia}
            isLovedRef={isLovedRef}
          />
          <RobotEye
            position={[design.separacionOjos, 0, 0]}
            rotation={[0, 0.2, 0]}
            scale={design.escalaOjos}
            blinkDuration={design.parpadeoDuracion}
            blinkCycle={design.parpadeoFrecuencia}
            isLovedRef={isLovedRef}
          />
        </group>

        <RobotEar position={[-0.29, 0, 0]} isLeft={true} scale={design.tamañoOrejas} />
        <RobotEar position={[0.29, 0, 0]} isLeft={false} scale={design.tamañoOrejas} />
      </group>
    </group>
  );
}

function RobotCanvas() {
  return (
    <Canvas shadows camera={{ position: [0, 0.2, 6], fov: 40 }} gl={{ alpha: true }} style={{ background: 'transparent' }}>
      <ambientLight intensity={0.75} color="#ffffff" />

      <directionalLight position={[0, 6, 3]} intensity={0} color="#00ffe2" castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.0005}>
        <orthographicCamera attach="shadow-camera" args={[-1.5, 1.5, 1.5, -1.5, 0.1, 20]} />
      </directionalLight>

      <directionalLight position={[-5, 2, -5]} intensity={0} color="#dbdbdb" />

      <Suspense fallback={null}>
        <Environment preset="studio" blur={0.5} />

        <ResponsiveGroup>
          <ContactShadows position={[0, -0.79, 0]} opacity={0.5} scale={15} resolution={512} blur={1.7} far={2.5} color="#000000" />
          <RobotPrototype />
        </ResponsiveGroup>
      </Suspense>
    </Canvas>
  );
}

// Renders nothing on the server, on narrow viewports, and when the user
// prefers reduced motion — this is a decorative desktop-only extra, not
// content, so it's fine to skip it rather than fight SSR/perf for it.
const RobotHero = () => {
  const [shouldRender, setShouldRender] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setShouldRender(false);
      return undefined;
    }

    const checkSize = () => setShouldRender(window.innerWidth > 1080);
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, [prefersReducedMotion]);

  if (!shouldRender) return null;

  return <RobotCanvas />;
};

export default RobotHero;
