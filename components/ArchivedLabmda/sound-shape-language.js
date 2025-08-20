import * as THREE from "https://esm.sh/three@0.175.0";
import { OrbitControls } from "https://esm.sh/three@0.175.0/examples/jsm/controls/OrbitControls.js";

document.addEventListener("DOMContentLoaded", function () {
  // Initialize loading screen
  setupExpandingCirclesPreloader();
  
  // Sound shape parameters
  let rotationSpeed = 1.0;
  let resolution = 1.0;
  let size = 1.0;
  let pointedness = 1.0;
  
  // Three.js variables
  let scene, camera, renderer, controls;
  let soundShapeObject;
  let clock = new THREE.Clock();
  let updateSoundShape;
  
  // UI state
  let isInitialized = false;

  function setupExpandingCirclesPreloader() {
    const canvas = document.getElementById("preloader-canvas");
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    let time = 0;
    let lastTime = 0;
    const maxRadius = 80;
    const circleCount = 5;
    const dotCount = 24;

    function animate(timestamp) {
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
      
      if (document.getElementById("loading-overlay").style.display !== "none") {
        requestAnimationFrame(animate);
      }
    }
    requestAnimationFrame(animate);
  }

  function initThreeJS() {
    // Scene setup
    scene = new THREE.Scene();
    
    // Camera setup
    camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 8);
    
    // Renderer setup
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById("three-container").appendChild(renderer.domElement);
    
    // Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.rotateSpeed = 0.5;
    controls.zoomSpeed = 0.7;
    controls.panSpeed = 0.8;
    controls.minDistance = 3;
    controls.maxDistance = 20;
    
    // Simplified lighting for wireframe visibility
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);
    
    // Create sound shape
    createSoundShapeObject();
    
    // Event listeners
    window.addEventListener("resize", onWindowResize);
    
    // Start animation loop
    animate();
  }

  function createSoundShapeObject() {
    if (soundShapeObject) {
      scene.remove(soundShapeObject);
    }
    
    soundShapeObject = new THREE.Group();
    const baseRadius = 2;
    
    // Calculate resolution based on slider value
    const geometryResolution = Math.max(0, Math.floor(resolution * 4));
    const sphereRadius = baseRadius * size;
    const outerGeometry = new THREE.IcosahedronGeometry(sphereRadius, geometryResolution);
    
    const outerMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pointedness: { value: pointedness },
        color: { value: new THREE.Color(0xff4e42) }
      },
      vertexShader: `
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
      `,
      fragmentShader: `
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
      `,
      wireframe: true,
      transparent: true
    });
    
    const outerSphere = new THREE.Mesh(outerGeometry, outerMaterial);
    soundShapeObject.add(outerSphere);
    
    scene.add(soundShapeObject);
    
    // Return update function
    return function updateSoundShape(time) {
      outerMaterial.uniforms.time.value = time;
      outerMaterial.uniforms.pointedness.value = pointedness;
    };
  }

  function updateShapeAnalysis() {
    // Calculate derived metrics
    const waveDensity = frequency * 2.0;
    const surfaceComplexity = timbre * 1.5;
    const animationSpeed = envelope * 0.8;
    
    // Determine shape signature based on parameters
    let signature = "NEUTRAL";
    if (amplitude > 2.0 && frequency > 3.0) signature = "INTENSE";
    else if (amplitude < 0.5 && frequency < 0.5) signature = "CALM";
    else if (timbre > 2.0) signature = "COMPLEX";
    else if (envelope > 2.0) signature = "DYNAMIC";
    else if (frequency > 3.0) signature = "RAPID";
    else if (amplitude > 2.0) signature = "POWERFUL";
    
    // Update UI
    document.getElementById("wave-density").textContent = waveDensity.toFixed(1);
    document.getElementById("surface-complexity").textContent = surfaceComplexity.toFixed(1);
    document.getElementById("animation-speed").textContent = animationSpeed.toFixed(1);
    document.getElementById("shape-signature").textContent = signature;
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function animate() {
    requestAnimationFrame(animate);
    
    const time = clock.getElapsedTime();
    
    controls.update();
    
    if (updateSoundShape) {
      updateSoundShape(time);
    }
    
    // Rotate the sound shape based on rotation speed
    if (soundShapeObject) {
      soundShapeObject.rotation.y += 0.005 * rotationSpeed;
      soundShapeObject.rotation.z += 0.002 * rotationSpeed;
    }
    
    renderer.render(scene, camera);
  }

  function updateTimestamp() {
    const now = new Date();
    const timeString = now.toTimeString().split(' ')[0];
    document.getElementById("timestamp").textContent = `TIME: ${timeString}`;
  }

  function addTerminalMessage(message, isCommand = false) {
    const terminal = document.getElementById("terminal-content");
    const line = document.createElement("div");
    line.className = isCommand ? "terminal-line command-line" : "terminal-line";
    line.textContent = message;
    terminal.appendChild(line);
    terminal.scrollTop = terminal.scrollHeight;
  }

  function showNotification(message) {
    // Create notification element if it doesn't exist
    let notification = document.getElementById("notification");
    if (!notification) {
      notification = document.createElement("div");
      notification.id = "notification";
      notification.className = "notification";
      notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--panel-bg);
        border: 1px solid var(--panel-border);
        color: var(--accent-primary);
        padding: 1rem 2rem;
        border-radius: 5px;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s;
        pointer-events: none;
      `;
      document.body.appendChild(notification);
    }
    
    notification.textContent = message;
    notification.style.opacity = 1;
    setTimeout(() => {
      notification.style.opacity = 0;
    }, 3000);
  }

  // Initialize the application
  function init() {
    initThreeJS();
    updateSoundShape = createSoundShapeObject();
    
    // Update timestamp every second
    setInterval(updateTimestamp, 1000);
    
    // Hide loading screen
    setTimeout(() => {
      document.getElementById("loading-overlay").style.opacity = "0";
      setTimeout(() => {
        document.getElementById("loading-overlay").style.display = "none";
      }, 500);
    }, 2000);
    
    isInitialized = true;
    addTerminalMessage("SOUND SHAPE INTERFACE INITIALIZED.");
    showNotification("INTERFACE READY");
  }

  // WaveformEditor class for the waveform component
  class WaveformEditor {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas.getContext('2d');
      this.points = [];
      this.selectedPoint = null;
      this.isDragging = false;
      
      // Set canvas size to match container
      this.resizeCanvas();
      
      // Initialize with 4 points
      this.initializePoints();
      this.setupEventListeners();
      this.draw();
      
      // Handle window resize
      window.addEventListener('resize', () => {
        this.resizeCanvas();
        this.initializePoints();
        this.draw();
      });
    }
    
    resizeCanvas() {
      const container = this.canvas.parentElement;
      const containerWidth = container.clientWidth - 4; // Account for border only
      const maxWidth = Math.min(800, containerWidth);
      this.canvas.width = maxWidth;
      this.canvas.height = 200;
    }
    
    initializePoints() {
      const width = this.canvas.width;
      const height = this.canvas.height;
      
      // Add padding to prevent waveform from touching edges
      const padding = 40;
      const usableWidth = width - (padding * 2);
      const usableHeight = height - (padding * 2);
      
      // Create 4 draggable points aligned with mesh intersections (2 columns per point)
      const gridSpacing = usableWidth / 8; // 8 columns total
      this.points = [
        { x: padding + gridSpacing * 1, y: height * 0.5, radius: 8, draggable: true }, // Point 1 at column 1
        { x: padding + gridSpacing * 3, y: height * 0.5, radius: 8, draggable: true }, // Point 2 at column 3
        { x: padding + gridSpacing * 5, y: height * 0.5, radius: 8, draggable: true }, // Point 3 at column 5
        { x: padding + gridSpacing * 7, y: height * 0.5, radius: 8, draggable: true }  // Point 4 at column 7
      ];
      
      // Add fixed endpoints at the padded edges, middle height
      this.startPoint = { x: padding, y: height * 0.5, radius: 6, draggable: false };
      this.endPoint = { x: width - padding, y: height * 0.5, radius: 6, draggable: false };
      
      // Store padding and scale info for coordinate conversion
      this.padding = padding;
      this.scaleRange = { min: -3, max: 3 };
    }
    
    setupEventListeners() {
      this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
      this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
      this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
      
      // Prevent context menu
      this.canvas.addEventListener('contextmenu', e => e.preventDefault());
    }
    
    onMouseDown(e) {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
      
      // Check if clicking on a draggable point
      for (let i = 0; i < this.points.length; i++) {
        const point = this.points[i];
        if (!point.draggable) continue;
        
        const distance = Math.sqrt((x - point.x) ** 2 + (y - point.y) ** 2);
        
        if (distance <= point.radius) {
          this.selectedPoint = i;
          this.isDragging = true;
          break;
        }
      }
    }
    
    onMouseMove(e) {
      if (!this.isDragging || this.selectedPoint === null) return;
      
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
      
      // Constrain to padded area
      const minY = this.padding;
      const maxY = this.canvas.height - this.padding;
      const clampedY = Math.max(minY, Math.min(maxY, y));
      
      // Only allow Y-axis movement (X stays fixed)
      this.points[this.selectedPoint].y = clampedY;
      
      this.draw();
      this.updateAttributeFrames();
    }
    
    onMouseUp() {
      this.isDragging = false;
      this.selectedPoint = null;
    }
    
    // Convert screen Y coordinate to scale value
    screenYToScale(screenY) {
      const usableHeight = this.canvas.height - (this.padding * 2);
      const normalizedY = (screenY - this.padding) / usableHeight;
      const scaleValue = this.scaleRange.max - (normalizedY * (this.scaleRange.max - this.scaleRange.min));
      return Math.round(scaleValue * 10) / 10; // Round to 1 decimal place
    }
    
    // Convert scale value to screen Y coordinate
    scaleToScreenY(scaleValue) {
      const usableHeight = this.canvas.height - (this.padding * 2);
      const normalizedY = (this.scaleRange.max - scaleValue) / (this.scaleRange.max - this.scaleRange.min);
      return this.padding + (normalizedY * usableHeight);
    }
    
    // Catmull-Rom spline interpolation
    interpolateSpline(t, p0, p1, p2, p3) {
      const t2 = t * t;
      const t3 = t2 * t;
      
      // Catmull-Rom matrix coefficients
      const c0 = -0.5 * t3 + t2 - 0.5 * t;
      const c1 = 1.5 * t3 - 2.5 * t2 + 1;
      const c2 = -1.5 * t3 + 2 * t2 + 0.5 * t;
      const c3 = 0.5 * t3 - 0.5 * t2;
      
      return {
        x: c0 * p0.x + c1 * p1.x + c2 * p2.x + c3 * p3.x,
        y: c0 * p0.y + c1 * p1.y + c2 * p2.y + c3 * p3.y
      };
    }
    
    draw() {
      // Clear canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Draw grid
      this.drawGrid();
      
      // Draw waveform curve
      this.drawWaveform();
      
      // Draw control points
      this.drawPoints();
    }
    
    drawGrid() {
      this.ctx.strokeStyle = 'rgba(255, 240, 230, 0.1)';
      this.ctx.lineWidth = 1;
      
      // Draw Y-axis scale grid lines
      for (let scale = this.scaleRange.min; scale <= this.scaleRange.max; scale++) {
        const y = this.scaleToScreenY(scale);
        
        // Draw horizontal grid line
        this.ctx.beginPath();
        this.ctx.moveTo(this.padding, y);
        this.ctx.lineTo(this.canvas.width - this.padding, y);
        this.ctx.stroke();
        
        // Draw Y-axis label
        this.ctx.fillStyle = 'rgba(194, 184, 178, 0.8)';
        this.ctx.font = '12px "TheGoodMonolith", monospace';
        this.ctx.textAlign = 'right';
        this.ctx.fillText(scale.toString(), this.padding - 10, y + 4);
      }
      
      // Draw X-axis grid lines (vertical lines) - 2 columns per point
      const usableWidth = this.canvas.width - (this.padding * 2);
      const gridSpacing = usableWidth / 8; // 8 columns total (2 per point for 4 points)
      for (let i = 0; i <= 8; i++) {
        const x = this.padding + (gridSpacing * i);
        
        this.ctx.beginPath();
        this.ctx.moveTo(x, this.padding);
        this.ctx.lineTo(x, this.canvas.height - this.padding);
        this.ctx.stroke();
      }
      
      // Draw center line (0) with accent color
      this.ctx.strokeStyle = 'rgba(255, 78, 66, 0.5)';
      this.ctx.lineWidth = 2;
      const centerY = this.scaleToScreenY(0);
      this.ctx.beginPath();
      this.ctx.moveTo(this.padding, centerY);
      this.ctx.lineTo(this.canvas.width - this.padding, centerY);
      this.ctx.stroke();
    }
    
    drawWaveform() {
      if (this.points.length < 2) return;
      
      // Draw waveform with project's accent color
      this.ctx.strokeStyle = '#ff4e42';
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      
      // Start from the left edge (startPoint)
      this.ctx.moveTo(this.startPoint.x, this.startPoint.y);
      
      // Create extended points array including start and end points
      const allPoints = [this.startPoint, ...this.points, this.endPoint];
      
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
        const point = this.interpolateSpline(localT, p0, p1, p2, p3);
        
        this.ctx.lineTo(point.x, point.y);
      }
      
      this.ctx.stroke();
    }
    
    drawPoints() {
      // Draw draggable points
      this.points.forEach((point, index) => {
        // Draw point with different colors for selected state
        if (this.selectedPoint === index && this.isDragging) {
          this.ctx.fillStyle = '#ff4e42'; // Project accent color when dragging
          this.ctx.lineWidth = 3;
        } else if (this.selectedPoint === index) {
          this.ctx.fillStyle = '#c2362f'; // Darker accent when selected
          this.ctx.lineWidth = 2;
        } else {
          this.ctx.fillStyle = '#ff4e42'; // Lighter accent when normal
          this.ctx.lineWidth = 2;
        }
        
        this.ctx.beginPath();
        this.ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw point number
        this.ctx.fillStyle = '#ff4e42';
        this.ctx.font = '12px "TheGoodMonolith", monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(index + 1, point.x, point.y + 4);
      });
    }
    
    updateAttributeFrames() {
      const attributes = ['frequency', 'amplitude', 'timbre', 'envelope'];
      
      this.points.forEach((point, index) => {
        const scaleValue = this.screenYToScale(point.y);
        const attributeId = attributes[index];
        const valueElement = document.getElementById(`${attributeId}-value`);
        
        if (valueElement) {
          valueElement.textContent = scaleValue.toFixed(1);
        }
        
        // Update 3D sphere attributes based on waveform values
        const displayValue = scaleValue;
        
        // Map waveform values to 3D sphere attributes
        if (index === 0) { // Frequency -> Rotation Speed
          rotationSpeed = ((displayValue + 3) / 6) * 4.9 + 0.1;
          addTerminalMessage(`ROTATION SPEED ADJUSTED: ${displayValue.toFixed(1)}`);
        } else if (index === 1) { // Amplitude -> Pointedness
          pointedness = ((displayValue + 3) / 6) * 2.4 + 0.1;
          addTerminalMessage(`POINTEDNESS ADJUSTED: ${displayValue.toFixed(1)}`);
        } else if (index === 2) { // Timbre -> Resolution
          resolution = ((displayValue + 3) / 6) * 2 + 1;
          updateSoundShape = createSoundShapeObject();
          addTerminalMessage(`RESOLUTION ADJUSTED: ${displayValue.toFixed(1)}`);
        } else if (index === 3) { // Envelope -> Size
          size = ((displayValue + 3) / 6) * 0.5 + 0.5; // Map -3..3 to 0.5..1.0 (current 1.0 becomes max)
          updateSoundShape = createSoundShapeObject();
          addTerminalMessage(`SIZE ADJUSTED: ${displayValue.toFixed(1)}`);
        }
      });
    }
    
    reset() {
      this.initializePoints();
      this.draw();
      this.updateAttributeFrames();
    }
  }
  
  // Initialize waveform editor
  let waveformEditor;
  
  function initWaveform() {
    waveformEditor = new WaveformEditor('waveformCanvas');
    waveformEditor.updateAttributeFrames();
  }
  
  // Initialize waveform when page loads
  window.addEventListener('load', initWaveform);

  // Button event listeners
  document.getElementById("reset-btn").addEventListener("click", function() {
    // Reset waveform to center positions
    if (waveformEditor) {
      waveformEditor.reset();
    }
    
    // Set actual values to defaults
    rotationSpeed = 1.0;
    resolution = 1.0;
    size = 1.0;
    pointedness = 1.0;
    
    // Recreate the object to update geometry
    updateSoundShape = createSoundShapeObject();
    addTerminalMessage("PARAMETERS RESET TO DEFAULT VALUES.");
    showNotification("PARAMETERS RESET");
  });

  document.getElementById("randomize-btn").addEventListener("click", function() {
    // Randomize waveform points
    if (waveformEditor) {
      waveformEditor.points.forEach((point, index) => {
        const randomY = waveformEditor.padding + Math.random() * (waveformEditor.canvas.height - waveformEditor.padding * 2);
        point.y = randomY;
      });
      waveformEditor.draw();
      waveformEditor.updateAttributeFrames();
    }
    
    addTerminalMessage("PARAMETERS RANDOMIZED.");
    showNotification("PARAMETERS RANDOMIZED");
  });

  document.getElementById("end-transmission-btn").addEventListener("click", function() {
    addTerminalMessage("INITIATING END TRANSMISSION SEQUENCE...");
    showNotification("END TRANSMISSION INITIATED");
    
    // Add a delay before transitioning to create dramatic effect
    setTimeout(() => {
      addTerminalMessage("TRANSMISSION COMPLETE. REDIRECTING TO FINAL INTERFACE.");
      
      // Fade out the current interface
      const container = document.getElementById('three-container');
      const interfaceContainer = document.querySelector('.interface-container');
      const soundShapePanel = document.querySelector('.sound-shape-panel');
      const shapeInfoPanel = document.querySelector('.shape-info-panel');
      const terminalPanel = document.querySelector('.terminal-panel');
      
      [container, interfaceContainer, soundShapePanel, shapeInfoPanel, terminalPanel].forEach(element => {
        if (element) {
          element.style.transition = 'opacity 1s ease-out';
          element.style.opacity = '0';
        }
      });
      
      // Redirect to end game page after fade out
      setTimeout(() => {
        window.location.href = 'end-game.html';
      }, 1000);
    }, 2000);
  });

  // Initialize the application
  init();
}); 