
const smokeVS = `
attribute vec2 position;
void main() {
    gl_Position = vec4(position, 0.0, 1.0);
}
`;

const smokeFS = `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_density;
uniform vec2 u_wind; // NEW: Directional wind force

// Simplex 2D noise
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// Fractal Brownian Motion for smoke structure
float fbm(vec2 p) {
    float f = 0.0;
    float w = 0.5;
    float t = u_time * 0.1; 
    
    // Apply wind drift to the coordinate space itself
    // "Up and Left" means (-x, -y) or similar motion
    // u_wind will shift the noise lookup
    p += u_wind * t * 2.0; 

    for (int i = 0; i < 5; i++) {
        f += w * snoise(p + t);
        p *= 2.0;
        w *= 0.5;
        p += vec2(t*0.5, -t*0.2); 
    }
    return f;
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st.x *= u_resolution.x / u_resolution.y;
    
    // Center coords
    vec2 p = st - vec2(0.5 * (u_resolution.x/u_resolution.y), 0.5);
    
    // Domain Warping for "rolling ink" feel
    float q = fbm(p * 3.0 + u_time * 0.05);
    float r = fbm(p * 3.0 + q + u_time * 0.1);
    float f = fbm(p * 2.0 + r);

    // Vignette / Containment mask to keep it a plume
    float dist = length(p);
    float mask = smoothstep(0.6, 0.1, dist); // Soft circular edge

    // Density curve
    // Enhance contrast to make it look like smoke wisps, not just noise
    float smoke = smoothstep(0.2, 0.9, f * mask); 
    
    // COLOR PALETTE
    // Base: dark grey/white
    vec3 baseColor = vec3(smoke * 0.9); 
    
    // Gold Highlight (Linear Gold: #c5a059 -> 0.77, 0.62, 0.35)
    // Only apply gold to the "densest" (brightest) parts of the smoke to simulate light catching it
    vec3 goldColor = vec3(0.77, 0.62, 0.35);
    
    // Mix: If smoke > 0.6, start tinting gold
    float goldMix = smoothstep(0.5, 1.0, smoke); 
    
    // Final Color Composition
    vec3 finalColor = mix(baseColor, goldColor, goldMix * 0.4); // 40% gold str at max
    
    // Ensure transparency in dark areas
    gl_FragColor = vec4(finalColor, smoke * u_density);
}
`;

class SmokeEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.gl = this.canvas.getContext('webgl');
        if (!this.gl) return;

        this.program = this.createProgram(smokeVS, smokeFS);
        this.positionLocation = this.gl.getAttribLocation(this.program, "position");
        this.resolutionLocation = this.gl.getUniformLocation(this.program, "u_resolution");
        this.timeLocation = this.gl.getUniformLocation(this.program, "u_time");
        this.densityLocation = this.gl.getUniformLocation(this.program, "u_density");
        this.windLocation = this.gl.getUniformLocation(this.program, "u_wind"); // NEW

        // State
        this.startTime = Date.now();
        this.speed = 1.0;
        this.simTime = 0;

        // Wind State
        this.targetWind = { x: 0.0, y: 0.0 }; // Calm
        this.currentWind = { x: 0.0, y: 0.0 };

        this.resize();
        window.addEventListener('resize', () => this.resize());

        this.setupQuad();
        this.render();
    }

    createShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error(this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    createProgram(vsSource, fsSource) {
        const vs = this.createShader(this.gl.VERTEX_SHADER, vsSource);
        const fs = this.createShader(this.gl.FRAGMENT_SHADER, fsSource);
        const program = this.gl.createProgram();
        this.gl.attachShader(program, vs);
        this.gl.attachShader(program, fs);
        this.gl.linkProgram(program);
        return program;
    }

    setupQuad() {
        const buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
            -1, -1,
            1, -1,
            -1, 1,
            -1, 1,
            1, -1,
            1, 1,
        ]), this.gl.STATIC_DRAW);
    }

    resize() {
        // High DPI support
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = this.canvas.clientWidth * dpr;
        this.canvas.height = this.canvas.clientHeight * dpr;
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }

    setSpeed(speed) {
        this.speed = speed;
    }

    // NEW: Trigger a breeze
    triggerBreeze(x, y) {
        this.targetWind = { x: x, y: y };
        // Increase speed slightly when wind blows
        this.speed = 2.0;
    }

    // NEW: Stop breeze
    stopBreeze() {
        this.targetWind = { x: 0.0, y: 0.0 };
        this.speed = 1.0;
    }

    render() {
        const now = Date.now();
        const dt = (now - this.lastFrameTime) || 16;
        this.lastFrameTime = now;

        // Custom time accumulation based on speed
        this.simTime += (dt * 0.001) * this.speed;

        // Smoothly interpolate wind
        // Lerp factor 0.05 for smooth transition
        this.currentWind.x += (this.targetWind.x - this.currentWind.x) * 0.05;
        this.currentWind.y += (this.targetWind.y - this.currentWind.y) * 0.05;

        this.gl.useProgram(this.program);

        this.gl.enableVertexAttribArray(this.positionLocation);
        this.gl.vertexAttribPointer(this.positionLocation, 2, this.gl.FLOAT, false, 0, 0);

        this.gl.uniform2f(this.resolutionLocation, this.canvas.width, this.canvas.height);
        this.gl.uniform1f(this.timeLocation, this.simTime);
        this.gl.uniform1f(this.densityLocation, 1.0);
        this.gl.uniform2f(this.windLocation, this.currentWind.x, this.currentWind.y); // Pass wind

        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);

        requestAnimationFrame(() => this.render());
    }
}

// Global accessor
window.initSmoke = function () {
    window.smokeInstance = new SmokeEngine('smoke-canvas');
};
