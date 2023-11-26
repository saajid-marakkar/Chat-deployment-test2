import React, { useEffect, useRef, useState } from 'react';

const SnowAnimation = () => {
    const shaderRef = useRef(null);
    const [o, setO] = useState({
        current: 0,
        force: 0.1,
        target: 0.1,
        min: 0.1,
        max: 0.25,
        easing: 0.005,
    });

    useEffect(() => {
        class ShaderProgram {
            createBuffers(data) {
                const gl = this.gl;
                const buffers = this.data.buffers = data;
                const values = this.buffers = {};

                Object.keys(buffers).forEach(name => {
                    const buffer = buffers[name];

                    buffer.buffer = this.createBuffer('a_' + name, buffer.size);

                    Object.defineProperty(values, name, {
                        set: data => {
                            buffers[name].data = data;
                            this.setBuffer(name, data);

                            if (name === 'position') {
                                this.count = buffers.position.data.length / 3;
                            }
                        },
                        get: () => buffers[name].data
                    });
                });
            }

            createBuffer(name, size) {
                const gl = this.gl;
                const program = this.program;

                const index = gl.getAttribLocation(program, name);
                const buffer = gl.createBuffer();

                gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
                gl.enableVertexAttribArray(index);
                gl.vertexAttribPointer(index, size, gl.FLOAT, false, 0, 0);

                return buffer;
            }

            setBuffer(name, data) {
                const gl = this.gl;
                const buffers = this.data.buffers;

                if (name == null && !gl.bindBuffer(gl.ARRAY_BUFFER, null)) return;

                gl.bindBuffer(gl.ARRAY_BUFFER, buffers[name].buffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
            }

            updateBuffers() {
                const gl = this.gl;
                const buffers = this.buffers;

                Object.keys(buffers).forEach(name =>
                    buffers[name] = buffers.data
                );

                this.setBuffer(null);
            }
            createShader(type, source) {
                const gl = this.gl;
                const shader = gl.createShader(type);

                gl.shaderSource(shader, source);
                gl.compileShader(shader);

                if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                    return shader;
                } else {
                    console.log(gl.getShaderInfoLog(shader));
                    gl.deleteShader(shader);
                }
            }
            createProgram(vertex, fragment) {
                const gl = this.gl;

                const vertexShader = this.createShader(gl.VERTEX_SHADER, vertex);
                const fragmentShader = this.createShader(gl.FRAGMENT_SHADER, fragment);

                const program = gl.createProgram();

                gl.attachShader(program, vertexShader);
                gl.attachShader(program, fragmentShader);
                gl.linkProgram(program);

                if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
                    gl.useProgram(program);
                    this.program = program;
                } else {
                    console.log(gl.getProgramInfoLog(program));
                    gl.deleteProgram(program);
                }
            }

            constructor(holder, options = {}) {
                options = Object.assign({
                    antialias: false,
                    depthTest: false,
                    mousemove: false,
                    autosize: true,
                    msaa: 0,
                    vertex: `
            precision highp float;

            attribute vec4 a_position;
            attribute vec4 a_color;

            uniform float u_time;
            uniform vec2 u_resolution;
            uniform vec2 u_mousemove;
            uniform mat4 u_projection;

            varying vec4 v_color;

            void main() {

              gl_Position = u_projection * a_position;
              gl_PointSize = (10.0 / gl_Position.w) * 100.0;

              v_color = a_color;

            }
          `,
                    fragment: `
            precision highp float;

            uniform sampler2D u_texture;
            uniform int u_hasTexture;

            varying vec4 v_color;

            void main() {

              if ( u_hasTexture == 1 ) {

                gl_FragColor = v_color * texture2D(u_texture, gl_PointCoord);

              } else {

                gl_FragColor = v_color;

              }

            }
          `,
                    uniforms: {},
                    buffers: {},
                    camera: {},
                    texture: null,
                    onUpdate: (() => { }),
                    onResize: (() => { }),
                }, options);

                const uniforms = Object.assign({
                    time: { type: 'float', value: 0 },
                    hasTexture: { type: 'int', value: 0 },
                    resolution: { type: 'vec2', value: [0, 0] },
                    mousemove: { type: 'vec2', value: [0, 0] },
                    projection: { type: 'mat4', value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
                }, options.uniforms);

                const buffers = Object.assign({
                    position: { size: 3, data: [] },
                    color: { size: 4, data: [] },
                }, options.buffers);

                const camera = Object.assign({
                    fov: 60,
                    near: 1,
                    far: 10000,
                    aspect: 1,
                    z: 100,
                    perspective: true,
                }, options.camera);

                const canvas = document.createElement('canvas');
                const gl = canvas.getContext('webgl', { antialias: options.antialias });
                if (!gl) return false;

                this.count = 0;
                this.gl = gl;
                this.canvas = canvas;
                this.camera = camera;
                this.holder = holder;
                this.msaa = options.msaa;
                this.onUpdate = options.onUpdate;
                this.onResize = options.onResize;
                this.data = {};

                holder.appendChild(canvas);

                this.createProgram(options.vertex, options.fragment);

                this.createBuffers(buffers);
                this.createUniforms(uniforms);

                this.updateBuffers();
                this.updateUniforms();

                this.createTexture(options.texture);

                gl.enable(gl.BLEND);
                gl.enable(gl.CULL_FACE);
                gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
                gl[options.depthTest ? 'enable' : 'disable'](gl.DEPTH_TEST);

                if (options.autosize)
                    window.addEventListener('resize', (e) => this.resize(e), false);
                if (options.mousemove)
                    window.addEventListener('mousemove', (e) => this.mousemove(e), false);

                this.resize();

                this.update = this.update.bind(this);
                this.time = { start: performance.now(), old: performance.now() };
                this.update();
            }

            mousemove(e) {
                let x = e.pageX / this.width * 2 - 1;
                let y = e.pageY / this.height * 2 - 1;

                this.uniforms.mousemove = [x, y];
            }

            resize(e) {
                const holder = this.holder;
                const canvas = this.canvas;
                const gl = this.gl;

                const width = this.width = holder.offsetWidth;
                const height = this.height = holder.offsetHeight;
                const aspect = this.aspect = width / height;
                const dpi = this.dpi = Math.max(this.msaa ? 2 : 1, devicePixelRatio);

                canvas.width = width * dpi;
                canvas.height = height * dpi;
                canvas.style.width = width + 'px';
                canvas.style.height = height + 'px';

                gl.viewport(0, 0, width * dpi, height * dpi);
                gl.clearColor(0, 0, 0, 0);

                this.uniforms.resolution = [width, height];
                this.uniforms.projection = this.setProjection(aspect);

                this.onResize(width, height, dpi);
            }

            // ... (include the rest of the ShaderProgram class)

            update() {
                const gl = this.gl;

                const now = performance.now();
                const elapsed = (now - this.time.start) / 5000;
                const delta = now - this.time.old;
                this.time.old = now;

                this.uniforms.time = elapsed;

                if (this.count > 0) {
                    gl.drawArrays(gl.POINTS, 0, this.count);
                }

                this.onUpdate(delta);

                requestAnimationFrame(this.update);
            }
        }

        const options = {
            depthTest: false,
            texture:
                'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" height="64" width="64"%3E%3Cfilter id="f1" x="-150%25" y="-150%25" width="300%25" height="300%25"%3E%3CfeGaussianBlur in="SourceGraphic" stdDeviation="7" /%3E%3C/filter%3E%3Cellipse cx="32" cy="32" rx="10" ry="15" style="fill:%23fff" filter="url(%23f1)" /%3E%3C/svg%3E',
            uniforms: {
                worldSize: { type: 'vec3', value: [0, 0, 0] },
                gravity: { type: 'float', value: 100 },
                wind: { type: 'float', value: 0 },
            },
            buffers: {
                size: { size: 1, data: [] },
                rotation: { size: 3, data: [] },
                speed: { size: 3, data: [] },
            },
            vertex: `
        precision highp float;

        attribute vec4 a_position;
        attribute vec4 a_color;
        attribute vec3 a_rotation;
        attribute vec3 a_speed;
        attribute float a_size;

        uniform float u_time;
        uniform vec2 u_mousemove;
        uniform vec2 u_resolution;
        uniform mat4 u_projection;
        uniform vec3 u_worldSize;
        uniform float u_gravity;
        uniform float u_wind;

        varying vec4 v_color;
        varying float v_rotation;

        void main() {
          v_color = a_color;
          v_rotation = a_rotation.x + u_time * a_rotation.y;

          vec3 pos = a_position.xyz;

          pos.x = mod(pos.x + u_time + u_wind * a_speed.x, u_worldSize.x * 2.0) - u_worldSize.x;
          pos.y = mod(pos.y - u_time * a_speed.y * u_gravity, u_worldSize.y * 2.0) - u_worldSize.y;

          pos.x += sin(u_time * a_speed.z) * a_rotation.z;
          pos.z += cos(u_time * a_speed.z) * a_rotation.z;

          gl_Position = u_projection * vec4( pos.xyz, a_position.w );
          gl_PointSize = ( a_size / gl_Position.w ) * 100.0;
        }
      `,
            fragment: `
        precision highp float;

        uniform sampler2D u_texture;

        varying vec4 v_color;
        varying float v_rotation;

        void main() {
          vec2 rotated = vec2(
            cos(v_rotation) * (gl_PointCoord.x - 0.5) + sin(v_rotation) * (gl_PointCoord.y - 0.5) + 0.5,
            cos(v_rotation) * (gl_PointCoord.y - 0.5) - sin(v_rotation) * (gl_PointCoord.x - 0.5) + 0.5
          );

          vec4 snowflake = texture2D(u_texture, rotated);
          gl_FragColor = vec4(snowflake.rgb, snowflake.a * v_color.a);
        }
      `,
            onResize(e, t, a) {
                let n = [],
                    o = [],
                    i = [],
                    r = [],
                    s = [],
                    l = (e / t) * 110;
                Array.from({ length: (e / t) * 7e3 }, (e) => {
                    n.push(-l + Math.random() * l * 2, 110 * Math.random() * 2 - 110, 80 * Math.random() * 2);
                    s.push(1 + Math.random(), 1 + Math.random(), 10 * Math.random());
                    r.push(2 * Math.random() * Math.PI, 20 * Math.random(), 10 * Math.random());
                    o.push(1, 1, 1, 0.1 + 0.2 * Math.random());
                    i.push(5 * Math.random() * 5 * ((t * a) / 1e3));
                });
                this.uniforms.worldSize = [l, 110, 80];
                this.buffers.position = n;
                this.buffers.color = o;
                this.buffers.rotation = r;
                this.buffers.size = i;
                this.buffers.speed = s;
            },
            onUpdate(e) {
                o.force += (o.target - o.force) * o.easing;
                o.current += o.force * (0.2 * e);
                this.uniforms.wind = o.current;
                if (Math.random() > 0.995) o.target = (o.min + Math.random() * (o.max - o.min)) * (Math.random() > 0.5 ? -1 : 1);
            },
        };

        shaderRef.current = new ShaderProgram(document.querySelector("#snow"), options);

        return () => {
            // Cleanup logic if needed
        };
    }, []);

    return <div id="snow" />;
};

export default SnowAnimation;
