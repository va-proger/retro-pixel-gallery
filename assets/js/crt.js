// -------------------------------------------------------------
// crt.js — CRT шум, скан-линии и WebGL-эффекты
// -------------------------------------------------------------

import { CONFIG } from './config.js';
import { log } from './utils.js';

/**
 * Инициализация CRT Noise
 */
export function initCRT() {
    const canvas = document.getElementById("noise");
    if (!canvas) return;

    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    resize();

    window.addEventListener("resize", resize);

    const gl = canvas.getContext("webgl", { premultipliedAlpha: false });

    if (!gl) {
        log("WebGL недоступен — включён fallback 2D шум");
        initFallbackNoise(canvas);
        return;
    }

    initWebGLNoise(gl, canvas);
}

/* -------------------------------------------------------------
   FALLBACK 2D NOISE
------------------------------------------------------------- */
function initFallbackNoise(canvas) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    (function loop() {
        const w = canvas.width;
        const h = canvas.height;
        const img = ctx.createImageData(w, h);
        const buf = img.data;

        for (let i = 0; i < buf.length; i += 4) {
            const v = Math.random() * 255;
            buf[i] = buf[i + 1] = buf[i + 2] = v;
            buf[i + 3] = 35; // прозрачность шума
        }
        ctx.putImageData(img, 0, 0);
        requestAnimationFrame(loop);
    })();
}

/* -------------------------------------------------------------
   WEBGL NOISE
------------------------------------------------------------- */
function initWebGLNoise(gl, canvas) {
    log("Запуск WebGL CRT Noise…");

    const vsSrc = `
        attribute vec2 a_position;
        varying vec2 v_uv;
        void main() {
            v_uv = (a_position + 1.0) * 0.5;
            gl_Position = vec4(a_position, 0.0, 1.0);
        }
    `;

    const fsSrc = `
        precision mediump float;
        varying vec2 v_uv;
        uniform float u_time;

        float hash(vec2 p) {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }

        void main() {
            float n = hash(v_uv * (u_time * 40.0) + u_time);
            gl_FragColor = vec4(vec3(n), ${CONFIG.NOISE_INTENSITY});
        }
    `;

    // создаём шейдеры
    const vs = compileShader(gl, gl.VERTEX_SHADER, vsSrc);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSrc);

    if (!vs || !fs) return;

    const program = createProgram(gl, vs, fs);
    gl.useProgram(program);

    const posLoc = gl.getAttribLocation(program, "a_position");
    const timeLoc = gl.getUniformLocation(program, "u_time");

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            -1, -1,
            1, -1,
            -1,  1,
            1,  1
        ]),
        gl.STATIC_DRAW
    );

    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // рендер кадра
    function render(time) {
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.uniform1f(timeLoc, time * 0.001);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

/* -------------------------------------------------------------
   ШЕЙДЕРНЫЕ УТИЛИТЫ
------------------------------------------------------------- */

function compileShader(gl, type, source) {
    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

function createProgram(gl, vs, fs) {
    const program = gl.createProgram();

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Program error:", gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
    }

    return program;
}
