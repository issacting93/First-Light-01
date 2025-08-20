import React, { useEffect, useRef, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface SoundShapeLanguageProps {
  onEndTransmission?: () => void;
  onTerminalMessage?: (message: string) => void;
  className?: string;
}

interface Point {
  x: number;
  y: number;
  radius: number;
  draggable: boolean;
}

interface WaveformEditorProps {
  onAttributeChange: (attributes: {
    frequency: number;
    amplitude: number;
    timbre: number;
    envelope: number;
  }) => void;
}

export interface WaveformEditorHandle {
  reset: () => void;
  randomize: () => void;
}

interface PreloaderCanvasProps {
  className?: string;
}

const WaveformEditor = forwardRef<WaveformEditorHandle, WaveformEditorProps>(
  ({ onAttributeChange }: WaveformEditorProps, ref: React.Ref<WaveformEditorHandle>) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [padding] = useState(40);
  const [scaleRange] = useState({ min: -3, max: 3 });

  const initializePoints = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const width = canvas.width;
    const height = canvas.height;
    
    const usableWidth = width - (padding * 2);
    const gridSpacing = usableWidth / 8;
    
    const newPoints: Point[] = [
      { x: padding + gridSpacing * 1, y: height * 0.5, radius: 8, draggable: true },
      { x: padding + gridSpacing * 3, y: height * 0.5, radius: 8, draggable: true },
      { x: padding + gridSpacing * 5, y: height * 0.5, radius: 8, draggable: true },
      { x: padding + gridSpacing * 7, y: height * 0.5, radius: 8, draggable: true }
    ];
    
    setPoints(newPoints);
  }, [padding]);

  const resizeCanvas = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const container = canvas.parentElement;
    if (!container) return;
    
    const containerWidth = container.clientWidth - 4;
    const maxWidth = Math.min(800, containerWidth);
    
    canvas.width = maxWidth;
    canvas.height = 200;
    
    initializePoints();
  }, [initializePoints]);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  const screenYToScale = useCallback((screenY: number) => {
    const usableHeight = 400 - (padding * 2);
    const normalizedY = (screenY - padding) / usableHeight;
    const scaleValue = scaleRange.max - (normalizedY * (scaleRange.max - scaleRange.min));
    return Math.round(scaleValue * 10) / 10;
  }, [padding, scaleRange]);

  const scaleToScreenY = useCallback((scaleValue: number) => {
    const usableHeight = 400 - (padding * 2);
    const normalizedY = (scaleRange.max - scaleValue) / (scaleRange.max - scaleRange.min);
    return padding + (normalizedY * usableHeight);
  }, [padding, scaleRange]);

  const interpolateSpline = useCallback((t: number, p0: Point, p1: Point, p2: Point, p3: Point) => {
    const t2 = t * t;
    const t3 = t2 * t;
    
    const c0 = -0.5 * t3 + t2 - 0.5 * t;
    const c1 = 1.5 * t3 - 2.5 * t2 + 1;
    const c2 = -1.5 * t3 + 2 * t2 + 0.5 * t;
    const c3 = 0.5 * t3 - 0.5 * t2;
    
    return {
      x: c0 * p0.x + c1 * p1.x + c2 * p2.x + c3 * p3.x,
      y: c0 * p0.y + c1 * p1.y + c2 * p2.y + c3 * p3.y
    };
  }, []);

  const draw = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = 'rgba(255, 240, 230, 0.1)';
    ctx.lineWidth = 1;
    
    // Draw Y-axis scale grid lines
    for (let scale = scaleRange.min; scale <= scaleRange.max; scale++) {
      const y = scaleToScreenY(scale);
      
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
      
      ctx.fillStyle = 'rgba(194, 184, 178, 0.8)';
      ctx.font = '12px "TheGoodMonolith", monospace';
      ctx.textAlign = 'right';
      ctx.fillText(scale.toString(), padding - 10, y + 4);
    }
    
    // Draw X-axis grid lines
    const usableWidth = canvas.width - (padding * 2);
    const gridSpacing = usableWidth / 8;
    for (let i = 0; i <= 8; i++) {
      const x = padding + (gridSpacing * i);
      
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, canvas.height - padding);
      ctx.stroke();
    }
    
    // Draw center line
    ctx.strokeStyle = 'rgba(255, 78, 66, 0.5)';
    ctx.lineWidth = 2;
    const centerY = scaleToScreenY(0);
    ctx.beginPath();
    ctx.moveTo(padding, centerY);
    ctx.lineTo(canvas.width - padding, centerY);
    ctx.stroke();
    
    // Draw waveform
    if (points.length >= 2) {
      ctx.strokeStyle = '#ff4e42';
      ctx.lineWidth = 3;
      ctx.beginPath();
      
      const startPoint = { x: padding, y: canvas.height * 0.5, radius: 6, draggable: false };
      const endPoint = { x: canvas.width - padding, y: canvas.height * 0.5, radius: 6, draggable: false };
      const allPoints = [startPoint, ...points, endPoint];
      
      ctx.moveTo(startPoint.x, startPoint.y);
      
      const segments = 200;
      for (let i = 0; i < segments; i++) {
        const t = i / (segments - 1);
        const segmentIndex = Math.floor(t * (allPoints.length - 1));
        
        if (segmentIndex >= allPoints.length - 1) break;
        
        const p0 = segmentIndex > 0 ? allPoints[segmentIndex - 1] : allPoints[0];
        const p1 = allPoints[segmentIndex];
        const p2 = allPoints[segmentIndex + 1];
        const p3 = segmentIndex < allPoints.length - 2 ? allPoints[segmentIndex + 2] : allPoints[allPoints.length - 1];
        
        const localT = (t * (allPoints.length - 1)) - segmentIndex;
        const point = interpolateSpline(localT, p0, p1, p2, p3);
        
        ctx.lineTo(point.x, point.y);
      }
      
      ctx.stroke();
    }
    
    // Draw points
    points.forEach((point: Point, index: number) => {
      if (selectedPoint === index && isDragging) {
        ctx.fillStyle = '#ff4e42';
        ctx.lineWidth = 3;
      } else if (selectedPoint === index) {
        ctx.fillStyle = '#c2362f';
        ctx.lineWidth = 2;
      } else {
        ctx.fillStyle = '#ff4e42';
        ctx.lineWidth = 2;
      }
      
      ctx.beginPath();
      ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#ff4e42';
      ctx.font = '12px "TheGoodMonolith", monospace';
      ctx.textAlign = 'center';
      ctx.fillText((index + 1).toString(), point.x, point.y + 4);
    });
  }, [points, selectedPoint, isDragging, padding, scaleRange, scaleToScreenY, interpolateSpline]);

  useEffect(() => {
    draw();
  }, [draw]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      if (!point.draggable) continue;
      
      const distance = Math.sqrt((x - point.x) ** 2 + (y - point.y) ** 2);
      
      if (distance <= point.radius) {
        setSelectedPoint(i);
        setIsDragging(true);
        break;
      }
    }
  }, [points]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || selectedPoint === null || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleY = canvas.height / rect.height;
    const y = (e.clientY - rect.top) * scaleY;
    
    const minY = padding;
    const maxY = canvas.height - padding;
    const clampedY = Math.max(minY, Math.min(maxY, y));
    
    setPoints((prev: Point[]) => {
      const newPoints = [...prev];
      newPoints[selectedPoint] = { ...newPoints[selectedPoint], y: clampedY };
      return newPoints;
    });
  }, [isDragging, selectedPoint, padding]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setSelectedPoint(null);
  }, []);

  // Update attributes when points change
  useEffect(() => {
    const attributes = ['frequency', 'amplitude', 'timbre', 'envelope'];
    const newAttributes: Record<string, number> = {};
    
    points.forEach((point: Point, index: number) => {
      const scaleValue = screenYToScale(point.y);
      const attributeId = attributes[index];
      if (attributeId) {
        newAttributes[attributeId] = scaleValue;
      }
    });
    
    onAttributeChange(newAttributes as {
      frequency: number;
      amplitude: number;
      timbre: number;
      envelope: number;
    });
  }, [points, screenYToScale, onAttributeChange]);

  // Expose reset and randomize methods via ref
  useImperativeHandle(ref, () => ({
    reset() {
      const centerY = scaleToScreenY(0);
      setPoints((p: Point[]) => p.map((pt: Point) => ({ ...pt, y: centerY })));
    },
    randomize() {
      const randY = () => scaleToScreenY(Math.random() * 6 - 3);
      setPoints((p: Point[]) => p.map((pt: Point) => ({ ...pt, y: randY() })));
    },
  }), [scaleToScreenY]);

  return (
    <div className="waveformContainer">
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: 'crosshair' }}
      />
    </div>
  );
});

WaveformEditor.displayName = 'WaveformEditor';

const PreloaderCanvas: React.FC<PreloaderCanvasProps> = ({ className = "" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    let time = 0;
    let lastTime = 0;
    const maxRadius = 80;
    const circleCount = 5;
    const dotCount = 24;

    const animate = (timestamp: number) => {
      if (!lastTime) lastTime = timestamp;
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      time += deltaTime * 0.001;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Center dot
      ctx.beginPath();
      ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 78, 66, 0.9)";
      ctx.fill();
      
      // Expanding circles
      for (let c = 0; c < circleCount; c++) {
        const circlePhase = (time * 0.3 + c / circleCount) % 1;
        const radius = circlePhase * maxRadius;
        const opacity = 1 - circlePhase;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 78, 66, ${opacity * 0.2})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Dots on circles
        for (let i = 0; i < dotCount; i++) {
          const angle = (i / dotCount) * Math.PI * 2;
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;
          const size = 2 * (1 - circlePhase * 0.5);
          
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(x, y);
          ctx.strokeStyle = `rgba(255, 78, 66, ${opacity * 0.1})`;
          ctx.lineWidth = 1;
          ctx.stroke();
          
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 78, 66, ${opacity * 0.9})`;
          ctx.fill();
        }
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className={`preloaderCanvasContainer ${className}`}>
      <canvas 
        ref={canvasRef}
        className="preloaderCanvas"
        width={180} 
        height={180}
        style={{
          border: '1px solid #ff4e42',
          borderRadius: '50%'
        }}
      />
    </div>
  );
};

export const SoundShapeLanguage: React.FC<SoundShapeLanguageProps> = ({ 
  onEndTransmission,
  onTerminalMessage,
  className = ""
}: SoundShapeLanguageProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const threeContainerRef = useRef<HTMLDivElement>(null);
  const waveformRef = useRef<WaveformEditorHandle>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Three.js variables - matching vanilla JS structure
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const soundShapeObjectRef = useRef<THREE.Group | null>(null);
  const clockRef = useRef<THREE.Clock>(new THREE.Clock());
  const updateSoundShapeRef = useRef<((time: number) => void) | null>(null);

  // Sound shape parameters - matching vanilla JS variables
  const [rotationSpeed, setRotationSpeed] = useState(1.0);
  const [resolution, setResolution] = useState(1.0);
  const [size, setSize] = useState(1.0);
  const [pointedness, setPointedness] = useState(1.0);

  // State for attributes (from waveform)
  const [attributes, setAttributes] = useState({
    frequency: 0.0,
    amplitude: 0.0,
    timbre: 0.0,
    envelope: 0.0
  });

  const [shapeAnalysis, setShapeAnalysis] = useState({
    waveDensity: 1.0,
    surfaceComplexity: 1.0,
    animationSpeed: 1.0,
    shapeSignature: 'NEUTRAL'
  });

  const showNotification = useCallback((message: string) => {
    // Create temporary notification
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(30, 26, 24, 0.9);
      border: 1px solid rgba(255, 78, 66, 0.3);
      color: #ff4e42;
      padding: 1rem 2rem;
      border-radius: 5px;
      z-index: 1000;
      opacity: 0;
      transition: opacity 0.3s;
      pointer-events: none;
      font-family: "TheGoodMonolith", monospace;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = '1';
    }, 10);
    
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }, []);

  // Initialize Three.js - matching vanilla JS structure
  const initThreeJS = useCallback(() => {
    console.log('🔍 initThreeJS called');
    
    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Camera setup - using window dimensions like vanilla JS
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 8);
    cameraRef.current = camera;
    
    // Renderer setup - using window dimensions like vanilla JS
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    if (threeContainerRef.current) {
      threeContainerRef.current.appendChild(renderer.domElement);
    }
    rendererRef.current = renderer;
    
    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.rotateSpeed = 0.5;
    controls.zoomSpeed = 0.7;
    controls.panSpeed = 0.8;
    controls.minDistance = 3;
    controls.maxDistance = 20;
    controlsRef.current = controls;
    
    // Lighting - matching vanilla JS
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);
    
    // Create sound shape
    createSoundShapeObject();
    
    // Animation loop - matching vanilla JS structure
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      const time = clockRef.current.getElapsedTime();
      
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      // Update shader uniforms - matching vanilla JS
      if (updateSoundShapeRef.current) {
        updateSoundShapeRef.current(time);
      }
      
      // Rotate the sound shape based on rotation speed - matching vanilla JS
      if (soundShapeObjectRef.current) {
        soundShapeObjectRef.current.rotation.y += 0.005 * rotationSpeed;
        soundShapeObjectRef.current.rotation.z += 0.002 * rotationSpeed;
      }
      
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    
    animate();
    
    // Handle window resize - matching vanilla JS
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Return cleanup function
    return () => {
      // Cancel animation frame
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      
      // Remove event listeners
      window.removeEventListener('resize', handleResize);
      
      // Dispose of Three.js resources
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (threeContainerRef.current && rendererRef.current.domElement) {
          threeContainerRef.current.removeChild(rendererRef.current.domElement);
        }
      }
      
      // Clear refs
      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
      controlsRef.current = null;
      soundShapeObjectRef.current = null;
      updateSoundShapeRef.current = null;
    };
  }, [rotationSpeed]);

  // Create sound shape object - matching vanilla JS structure
  const createSoundShapeObject = useCallback(() => {
    console.log('🔍 createSoundShapeObject called');
    if (!sceneRef.current) return;
    
    if (soundShapeObjectRef.current) {
      // Properly dispose of old geometry and materials
      const mesh = soundShapeObjectRef.current.children[0] as THREE.Mesh;
      if (mesh) {
        mesh.geometry?.dispose();
        if ('material' in mesh && 'dispose' in mesh.material) {
          (mesh.material as THREE.Material).dispose();
        }
      }
      sceneRef.current.remove(soundShapeObjectRef.current);
    }
    
    const soundShapeObject = new THREE.Group();
    soundShapeObjectRef.current = soundShapeObject;
    
    const baseRadius = 2;
    
    // Calculate resolution based on parameter value - matching vanilla JS
    const geometryResolution = Math.max(0, Math.floor(resolution * 4));
    const sphereRadius = baseRadius * size;
    const outerGeometry = new THREE.IcosahedronGeometry(sphereRadius, geometryResolution);
    
    // GLSL Shaders - identical to vanilla JS
    const vertexShader = `
      uniform float time;
      uniform float pointedness;
      
      varying vec3 vNormal;
      varying vec3 vPosition;
      
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
      
      float snoise(vec3 v) {
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
        
        vec3 i  = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);
        
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);
        
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;
        
        i = mod289(i);
        vec4 p = permute(permute(permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0));
              
        float n_ = 0.142857142857;
        vec3 ns = n_ * D.wyz - D.xzx;
        
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
        
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);
        
        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        
        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);
        
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
        
        vec3 p0 = vec3(a0.xy, h.x);
        vec3 p1 = vec3(a0.zw, h.y);
        vec3 p2 = vec3(a1.xy, h.z);
        vec3 p3 = vec3(a1.zw, h.w);
        
        vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;
        
        vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m*m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
      }
      
      void main() {
        vNormal = normalize(normalMatrix * normal);
        
        float slowTime = time * 0.3;
        vec3 pos = position;
        
        // Use Simplex noise for base distortion like the reference
        float noise = snoise(vec3(position.x * 0.5, position.y * 0.5, position.z * 0.5 + slowTime));
        
        // Apply linear scaling like the reference project
        float distortion = noise * 0.3 * pointedness;
        
        // Add different effects based on pointedness value
        if (pointedness > 1.5) {
          // High pointedness: add sharp angular effects
          float angularFactor = (pointedness - 1.5) * 2.0;
          distortion += sin(position.x * 12.0) * sin(position.y * 12.0) * sin(position.z * 12.0) * angularFactor * 0.2;
        } else if (pointedness < 0.5) {
          // Low pointedness: add smooth wavy effects
          float wavyFactor = 0.5 - pointedness;
          distortion += sin(position.x * 4.0 + slowTime) * sin(position.y * 4.0 + slowTime) * sin(position.z * 4.0 + slowTime) * wavyFactor * 0.3;
        }
        
        // Apply distortion along normal direction with linear scaling
        pos += normal * distortion;
        
        vPosition = pos;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float time;
      uniform vec3 color;
      
      varying vec3 vNormal;
      varying vec3 vPosition;
      
      void main() {
        // Pulsing effect
        float pulse = 0.8 + 0.2 * sin(time * 2.0);
        
        // Ensure wireframe is always visible with consistent color
        vec3 finalColor = color * pulse;
        
        // High alpha for wireframe visibility
        float alpha = 0.9;
        
        gl_FragColor = vec4(finalColor, alpha);
      }
    `;

    const outerMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pointedness: { value: pointedness },
        color: { value: new THREE.Color(0xff4e42) }
      },
      vertexShader,
      fragmentShader,
      wireframe: true,
      transparent: true
    });
    
    const outerSphere = new THREE.Mesh(outerGeometry, outerMaterial);
    soundShapeObject.add(outerSphere);
    
    sceneRef.current.add(soundShapeObject);
    
    // Return update function - matching vanilla JS structure
    updateSoundShapeRef.current = (time: number) => {
      outerMaterial.uniforms.time.value = time;
      outerMaterial.uniforms.pointedness.value = pointedness;
    };
    
    // Debug logging
    console.log('🔍 Three.js Object Created:', {
      baseRadius: 2,
      geometryResolution,
      sphereRadius,
      objectPosition: soundShapeObject.position,
      cameraPosition: cameraRef.current?.position,
      sceneChildren: sceneRef.current.children.length
    });
  }, [resolution, size, pointedness]);

  // Handle attribute change - matching vanilla JS parameter mapping
  const handleAttributeChange = useCallback((newAttributes: any) => {
    if (!newAttributes) {
      console.warn('handleAttributeChange called with undefined newAttributes');
      return;
    }
    
    setAttributes(newAttributes);
    
    // Map waveform values to 3D parameters - matching vanilla JS mapping
    const attributes = ['frequency', 'amplitude', 'timbre', 'envelope'];
    
    // Map each attribute directly - matching vanilla JS structure
    attributes.forEach((attributeId, index) => {
      const scaleValue = newAttributes[attributeId] || 0;
      const displayValue = scaleValue;
      
      // Map waveform values to 3D sphere attributes - matching vanilla JS
      if (index === 0) { // Frequency -> Rotation Speed
        const newRotationSpeed = ((displayValue + 3) / 6) * 4.9 + 0.1;
        setRotationSpeed(newRotationSpeed);
        if (onTerminalMessage) {
          onTerminalMessage(`ROTATION SPEED ADJUSTED: ${displayValue.toFixed(1)}`);
        }
      } else if (index === 1) { // Amplitude -> Pointedness
        const newPointedness = ((displayValue + 3) / 6) * 2.4 + 0.1;
        setPointedness(newPointedness);
        if (onTerminalMessage) {
          onTerminalMessage(`POINTEDNESS ADJUSTED: ${displayValue.toFixed(1)}`);
        }
      } else if (index === 2) { // Timbre -> Resolution
        const newResolution = ((displayValue + 3) / 6) * 2 + 1;
        setResolution(newResolution);
        // Immediate geometry recreation - matching vanilla JS
        setTimeout(() => createSoundShapeObject(), 0);
        if (onTerminalMessage) {
          onTerminalMessage(`RESOLUTION ADJUSTED: ${displayValue.toFixed(1)}`);
        }
      } else if (index === 3) { // Envelope -> Size
        const newSize = ((displayValue + 3) / 6) * 0.5 + 0.5;
        setSize(newSize);
        // Immediate geometry recreation - matching vanilla JS
        setTimeout(() => createSoundShapeObject(), 0);
        if (onTerminalMessage) {
          onTerminalMessage(`SIZE ADJUSTED: ${displayValue.toFixed(1)}`);
        }
      }
    });
    
    // Update shape analysis
    const waveDensity = (newAttributes.frequency || 0) * 2.0;
    const surfaceComplexity = (newAttributes.timbre || 0) * 1.5;
    const animationSpeed = (newAttributes.envelope || 0) * 0.8;
    
    let signature = "NEUTRAL";
    if ((newAttributes.amplitude || 0) > 2.0 && (newAttributes.frequency || 0) > 3.0) signature = "INTENSE";
    else if ((newAttributes.amplitude || 0) < 0.5 && (newAttributes.frequency || 0) < 0.5) signature = "CALM";
    else if ((newAttributes.timbre || 0) > 2.0) signature = "COMPLEX";
    else if ((newAttributes.envelope || 0) > 2.0) signature = "DYNAMIC";
    else if ((newAttributes.frequency || 0) > 3.0) signature = "RAPID";
    else if ((newAttributes.amplitude || 0) > 2.0) signature = "POWERFUL";
    
    setShapeAnalysis({
      waveDensity,
      surfaceComplexity,
      animationSpeed,
      shapeSignature: signature
    });
    
    const freq = (newAttributes.frequency || 0).toFixed(1);
    const amp = (newAttributes.amplitude || 0).toFixed(1);
    const timb = (newAttributes.timbre || 0).toFixed(1);
    const env = (newAttributes.envelope || 0).toFixed(1);
    
    if (onTerminalMessage) {
      onTerminalMessage(`ATTRIBUTES UPDATED: F=${freq}, A=${amp}, T=${timb}, E=${env}`);
    }
  }, [onTerminalMessage, createSoundShapeObject]);

  const handleReset = useCallback(() => {
    waveformRef.current?.reset();
    
    // Set actual values to defaults - matching vanilla JS
    setRotationSpeed(1.0);
    setResolution(1.0);
    setSize(1.0);
    setPointedness(1.0);
    
    // Recreate the object to update geometry - matching vanilla JS
    setTimeout(() => createSoundShapeObject(), 0);
    
    if (onTerminalMessage) {
      onTerminalMessage("PARAMETERS RESET TO DEFAULT VALUES.");
    }
    showNotification("PARAMETERS RESET");
  }, [onTerminalMessage, showNotification, createSoundShapeObject]);

  const handleRandomize = useCallback(() => {
    waveformRef.current?.randomize();
    
    if (onTerminalMessage) {
      onTerminalMessage("PARAMETERS RANDOMIZED.");
    }
    showNotification("PARAMETERS RANDOMIZED");
  }, [onTerminalMessage, showNotification]);

  const handleEndTransmission = useCallback(() => {
    if (onTerminalMessage) {
      onTerminalMessage("INITIATING END TRANSMISSION SEQUENCE...");
    }
    showNotification("END TRANSMISSION INITIATED");
    
    // Add fade out animation like vanilla JS
    const container = containerRef.current;
    const threeContainer = threeContainerRef.current;
    const soundShapePanel = document.querySelector('.soundShapePanel');
    const shapeInfoPanel = document.querySelector('.shapeInfoPanel');
    
    if (container && threeContainer) {
      [container, threeContainer, soundShapePanel, shapeInfoPanel].forEach(element => {
        if (element) {
          (element as HTMLElement).style.transition = 'opacity 1s ease-out';
          (element as HTMLElement).style.opacity = '0';
        }
      });
    }
    
    setTimeout(() => {
      if (onTerminalMessage) {
        onTerminalMessage("TRANSMISSION COMPLETE. REDIRECTING TO FINAL INTERFACE.");
      }
      
      setTimeout(() => {
        if (onEndTransmission) {
          onEndTransmission();
        }
      }, 1000);
    }, 2000);
  }, [onTerminalMessage, showNotification, onEndTransmission]);

  useEffect(() => {
    // Hide loading screen after delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  // Initialize Three.js after loading is complete
  useEffect(() => {
    console.log('🔍 Loading state changed:', { isLoading });
    if (!isLoading) {
      console.log('🚀 Initializing Three.js...');
      initThreeJS();
    }
  }, [isLoading, initThreeJS]);

  return (
    <div className={`soundShapeLanguage ${className}`} ref={containerRef}>
      <style>{`
        .soundShapeLanguage {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background: #080C10;
          color: #f3ede9;
          font-family: "TheGoodMonolith", monospace;
        }

        .loadingOverlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #080C10;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          transition: opacity 0.5s ease-out;
        }

        .loadingContainer {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
        }

        .loadingText {
          color: #ff4e42;
          font-size: 1.2rem;
          text-align: center;
          letter-spacing: 0.1em;
        }

        .threeContainer { 
          width: 100%;
          height: 100%;
          z-index: 1;
          cursor: grab;
          top: 0;
          left: 0;
        }

        .threeContainer:active {
          cursor: grabbing;
        }

        .threeContainer canvas {
          width: 100% !important;
          height: 100% !important;
          display: block;
        }

        .gridOverlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(to right, rgba(255,240,230,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,240,230,0.05) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
          z-index: 0;
        }

        .interfaceContainer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 10;
          pointer-events: none;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background: rgba(8, 12, 16, 0.8);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 78, 66, 0.3);
        }

        .headerItem {
          color: #ff4e42;
          font-size: 0.9rem;
          letter-spacing: 0.1em;
          text-align: center;
        }

        .soundShapePanel { 
          bottom: 2rem;
          left: 2rem;
          width: 400px;
          background: rgba(30, 26, 24, 0.9);
          border: 1px solid rgba(255, 78, 66, 0.3);
          border-radius: 8px;
          backdrop-filter: blur(10px);
          z-index: 10;
          pointer-events: auto;
        }

        .panelHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1rem;
          background: rgba(0, 0, 0, 0.3);
          border-bottom: 1px solid rgba(255, 78, 66, 0.2);
          border-radius: 8px 8px 0 0;
        }

        .panelTitle {
          color: #ff4e42;
          font-size: 0.8rem;
          font-weight: bold;
          letter-spacing: 0.1em;
        }

        .dragHandle {
          color: #ff4e42;
          cursor: move;
          font-size: 1.2rem;
        }

        .waveformContainer {
          padding: 1rem;
        }

        .attributeContainer {
          padding: 0 1rem 1rem;
        }

        .attributeFrame {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
          padding: 0.75rem;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
        }

        .attributeItem {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #c2b8b2;
          font-size: 0.75rem;
        }

        .attributeValue {
          color: #ff4e42;
          font-weight: bold;
        }

        .buttons {
          display: flex;
          gap: 0.5rem;
          padding: 1rem;
          border-top: 1px solid rgba(255, 78, 66, 0.2);
        }

        .btn {
          flex: 1;
          padding: 0.5rem 1rem;
          background: rgba(255, 78, 66, 0.1);
          border: 1px solid rgba(255, 78, 66, 0.3);
          color: #ff4e42;
          font-family: "TheGoodMonolith", monospace;
          font-size: 0.75rem;
          font-weight: bold;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.2s ease;
          border-radius: 4px;
        }

        .btn:hover {
          background: rgba(255, 78, 66, 0.2);
          border-color: rgba(255, 78, 66, 0.5);
        }

        .btn:active {
          background: rgba(255, 78, 66, 0.3);
        }

        .endTransmissionBtn {
          background: rgba(255, 78, 66, 0.2);
          border-color: rgba(255, 78, 66, 0.5);
        }

        .shapeInfoPanel {
          position: absolute;
          top: 6rem;
          right: 2rem;
          width: 300px;
          background: rgba(30, 26, 24, 0.9);
          border: 1px solid rgba(255, 78, 66, 0.3);
          border-radius: 8px;
          backdrop-filter: blur(10px);
          z-index: 10;
          pointer-events: auto;
        }

        .shapeReadouts {
          padding: 1rem;
        }

        .dataRow {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
          padding: 0.25rem 0;
        }

        .dataLabel {
          color: #c2b8b2;
          font-size: 0.75rem;
          font-weight: bold;
        }

        .dataValue {
          color: #ff4e42;
          font-size: 0.75rem;
          font-weight: bold;
        }

        .preloaderCanvasContainer {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .preloaderCanvas {
          border: 1px solid #ff4e42;
          border-radius: 50%;
        }
      `}</style>

      {/* Loading Screen */}
      {isLoading && (
        <div className="loadingOverlay">
          <div className="loadingContainer">
            <PreloaderCanvas />
            <div className="loadingText">INITIALIZING SOUND SHAPE INTERFACE</div>
          </div>
        </div>
      )}

      {/* Only render content when not loading */}
      {!isLoading && (
        <>
          {/* Three.js Container */}
          <div className="threeContainer" ref={threeContainerRef}></div>
          
          {/* Grid overlay background */}
          <div className="gridOverlay"></div>
          
      
          {/* Waveform Control Panel */}
          <div className="soundShapePanel">
            <WaveformEditor ref={waveformRef} onAttributeChange={handleAttributeChange} />
            
            {/* Attribute frame */}
            <div className="attributeContainer">
              <div className="attributeFrame">
                <span className="attributeItem">
                  <strong>Frequency:</strong>
                  <span className="attributeValue animate-pulse">{(attributes?.frequency || 0).toFixed(1)}</span>
                </span>
                <span className="attributeItem">
                  <strong>Amplitude:</strong>
                  <span className="attributeValue animate-pulse">{(attributes?.amplitude || 0).toFixed(1)}</span>
                </span>
                <span className="attributeItem">
                  <strong>Timbre:</strong>
                  <span className="attributeValue animate-pulse">{(attributes?.timbre || 0).toFixed(1)}</span>
                </span>
                <span className="attributeItem">
                  <strong>Envelope:</strong>
                  <span className="attributeValue animate-pulse">{(attributes?.envelope || 0).toFixed(1)}</span>
                </span>
              </div>
            </div>

            <div className="buttons">
              <button 
                className="btn" 
                onClick={handleRandomize}
                aria-label="Randomize waveform parameters"
              >
                RANDOMIZE
              </button>
              <button 
                className="btn" 
                onClick={handleReset}
                aria-label="Reset waveform parameters to default"
              >
                RESET
              </button>
              <button 
                className="btn endTransmissionBtn" 
                onClick={handleEndTransmission}
                aria-label="End transmission and redirect to final interface"
              >
                END TRANSMISSION
              </button>
            </div>
          </div>

          {/* Shape Analysis Panel */}
          <div className="shapeInfoPanel">
            <div className="panelHeader">
              <span className="panelTitle">SHAPE ANALYSIS</span>
            </div>
            <div className="shapeReadouts">
              <div className="dataRow">
                <span className="dataLabel">WAVE DENSITY:</span>
                <span className="dataValue">{(shapeAnalysis?.waveDensity || 0).toFixed(1)}</span>
              </div>
              <div className="dataRow">
                <span className="dataLabel">SURFACE COMPLEXITY:</span>
                <span className="dataValue">{(shapeAnalysis?.surfaceComplexity || 0).toFixed(1)}</span>
              </div>
              <div className="dataRow">
                <span className="dataLabel">ANIMATION SPEED:</span>
                <span className="dataValue">{(shapeAnalysis?.animationSpeed || 0).toFixed(1)}</span>
              </div>
              <div className="dataRow">
                <span className="dataLabel">SHAPE SIGNATURE:</span>
                <span className="dataValue">{shapeAnalysis?.shapeSignature || 'NEUTRAL'}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}; 