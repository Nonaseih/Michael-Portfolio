/**
 * @description      : HeroSection â€” self-contained with Hyperspeed + ShinyText inline
 * @author           : fortu
 * @version          : 3.0.0
 * @date             : 2026
 **/
import { useMemo, useEffect, useState, useRef, useCallback } from 'react'
import { motion, useMotionValue, useAnimationFrame, useTransform } from 'motion/react'
import * as THREE from 'three'
import { EffectComposer, EffectPass, RenderPass, SMAAEffect, SMAAPreset } from 'postprocessing'

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   TOKENS
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const GOLD        = '#c9a84c'
const GOLD_DIM    = '#7a5f28'
const GOLD_BRIGHT = '#e8c96a'
const MONO        = "'Share Tech Mono', monospace"
const SANS        = "'Rajdhani', sans-serif"

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   INJECTED CSS  (only pseudo-elements + keyframes)
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const HERO_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@300;400;500;600&display=swap');

  @keyframes heroBlink {
    0%,100%{opacity:1} 50%{opacity:0}
  }
  @keyframes heroScanX {
    0%  {transform:translateX(-200px)}
    100%{transform:translateX(110vw)}
  }

  /* Primary CTA */
  .h-btn{
    display:inline-flex;align-items:center;gap:10px;
    font-family:'Share Tech Mono',monospace;font-size:11px;letter-spacing:.16em;
    color:${GOLD};text-decoration:none;padding:13px 32px;
    border:1px solid rgba(201,168,76,.7);
    position:relative;overflow:hidden;
    transition:color .3s,border-color .3s;cursor:pointer;
  }
  .h-btn::before{
    content:'';position:absolute;inset:0;background:${GOLD};
    transform:translateX(-101%);transition:transform .38s cubic-bezier(.4,0,.2,1);z-index:0;
  }
  .h-btn:hover::before{transform:translateX(0)}
  .h-btn:hover{color:#080808!important;border-color:${GOLD}!important}
  .h-btn>span{position:relative;z-index:1;display:flex;align-items:center;gap:8px}

  /* Ghost CTA */
  .h-btn-g{
    display:inline-flex;align-items:center;gap:10px;
    font-family:'Share Tech Mono',monospace;font-size:11px;letter-spacing:.16em;
    color:rgba(201,168,76,.65);text-decoration:none;padding:13px 32px;
    border:1px solid rgba(201,168,76,.28);
    position:relative;overflow:hidden;
    transition:color .3s,border-color .3s;cursor:pointer;
  }
  .h-btn-g::before{
    content:'';position:absolute;inset:0;background:rgba(201,168,76,.08);
    transform:translateX(-101%);transition:transform .38s cubic-bezier(.4,0,.2,1);z-index:0;
  }
  .h-btn-g:hover::before{transform:translateX(0)}
  .h-btn-g:hover{color:${GOLD_BRIGHT}!important;border-color:${GOLD_BRIGHT}!important}
  .h-btn-g>span{position:relative;z-index:1;display:flex;align-items:center;gap:8px}

  /* Corner accents */
  .hc-tl{position:absolute;top:-1px;left:-1px;width:10px;height:10px;border-top:1px solid ${GOLD_BRIGHT};border-left:1px solid ${GOLD_BRIGHT};z-index:2;transition:width .3s,height .3s;pointer-events:none}
  .hc-tr{position:absolute;top:-1px;right:-1px;width:10px;height:10px;border-top:1px solid ${GOLD_BRIGHT};border-right:1px solid ${GOLD_BRIGHT};z-index:2;transition:width .3s,height .3s;pointer-events:none}
  .hc-bl{position:absolute;bottom:-1px;left:-1px;width:10px;height:10px;border-bottom:1px solid ${GOLD_BRIGHT};border-left:1px solid ${GOLD_BRIGHT};z-index:2;transition:width .3s,height .3s;pointer-events:none}
  .hc-br{position:absolute;bottom:-1px;right:-1px;width:10px;height:10px;border-bottom:1px solid ${GOLD_BRIGHT};border-right:1px solid ${GOLD_BRIGHT};z-index:2;transition:width .3s,height .3s;pointer-events:none}
  .h-frame:hover .hc-tl,.h-frame:hover .hc-tr,.h-frame:hover .hc-bl,.h-frame:hover .hc-br{width:20px;height:20px}

  /* Stat card hover */
  .h-stat{padding:10px 18px;border:1px solid rgba(201,168,76,.18);background:rgba(201,168,76,.04);transition:border-color .25s,background .25s}
  .h-stat:hover{border-color:rgba(201,168,76,.5)!important;background:rgba(201,168,76,.08)!important}

  /* Tag chips */
  .h-tag{display:inline-flex;align-items:center;gap:6px;font-family:'Share Tech Mono',monospace;font-size:11px;letter-spacing:.1em;color:rgba(201,168,76,.6);padding:5px 12px;border:1px solid rgba(201,168,76,.2);transition:color .25s,border-color .25s,background .25s}
  .h-tag:hover{color:${GOLD_BRIGHT};border-color:rgba(201,168,76,.5);background:rgba(201,168,76,.06)}

  /* Cursor blink */
  .h-cursor{display:inline-block;width:2px;height:.85em;background:${GOLD};margin-left:4px;vertical-align:middle;animation:heroBlink 1s step-end infinite}

  /* Scanline */
  .h-scan{position:absolute;top:0;left:0;width:180px;height:100%;background:linear-gradient(90deg,transparent,rgba(201,168,76,.035),transparent);animation:heroScanX 7s linear infinite;pointer-events:none;z-index:2}

  /* Hyperspeed container â€” must fill its parent */
  .hyperspeed-container{width:100%;height:100%}

  @media(max-width:860px){
    .h-cols{flex-direction:column!important}
    .h-right{width:100%!important;min-width:unset!important;align-items:center!important}
    .h-frame{width:280px!important;height:300px!important}
    .h-content{padding-top:52px!important}
  }
`

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   SHINY TEXT
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function ShinyText({
  text,
  disabled = false,
  speed = 2,
  color = '#b5b5b5',
  shineColor = '#ffffff',
  spread = 120,
  yoyo = false,
  pauseOnHover = false,
  direction = 'left',
  delay = 0,
}) {
  const [isPaused, setIsPaused] = useState(false)
  const progress    = useMotionValue(0)
  const elapsedRef  = useRef(0)
  const lastTimeRef = useRef(null)
  const dirRef      = useRef(direction === 'left' ? 1 : -1)
  const animDur     = speed * 1000
  const delayDur    = delay * 1000

  useAnimationFrame((time) => {
    if (disabled || isPaused) { lastTimeRef.current = null; return }
    if (lastTimeRef.current === null) { lastTimeRef.current = time; return }
    elapsedRef.current += time - lastTimeRef.current
    lastTimeRef.current = time

    if (yoyo) {
      const cycleDur  = animDur + delayDur
      const fullCycle = cycleDur * 2
      const ct        = elapsedRef.current % fullCycle
      if      (ct < animDur)               progress.set(dirRef.current === 1 ? (ct / animDur) * 100 : 100 - (ct / animDur) * 100)
      else if (ct < cycleDur)              progress.set(dirRef.current === 1 ? 100 : 0)
      else if (ct < cycleDur + animDur)    { const rt = ct - cycleDur; progress.set(dirRef.current === 1 ? 100 - (rt / animDur) * 100 : (rt / animDur) * 100) }
      else                                 progress.set(dirRef.current === 1 ? 0 : 100)
    } else {
      const cycleDur = animDur + delayDur
      const ct       = elapsedRef.current % cycleDur
      if (ct < animDur) progress.set(dirRef.current === 1 ? (ct / animDur) * 100 : 100 - (ct / animDur) * 100)
      else              progress.set(dirRef.current === 1 ? 100 : 0)
    }
  })

  useEffect(() => { dirRef.current = direction === 'left' ? 1 : -1; elapsedRef.current = 0; progress.set(0) }, [direction, progress])

  const backgroundPosition = useTransform(progress, (p) => `${150 - p * 2}% center`)
  const onEnter = useCallback(() => { if (pauseOnHover) setIsPaused(true)  }, [pauseOnHover])
  const onLeave = useCallback(() => { if (pauseOnHover) setIsPaused(false) }, [pauseOnHover])

  return (
    <motion.span
      style={{
        backgroundImage: `linear-gradient(${spread}deg,${color} 0%,${color} 35%,${shineColor} 50%,${color} 65%,${color} 100%)`,
        backgroundSize: '200% auto',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        display: 'inline-block',
        backgroundPosition,
      }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {text}
    </motion.span>
  )
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   HYPERSPEED
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const random    = (b) => Array.isArray(b) ? Math.random() * (b[1] - b[0]) + b[0] : Math.random() * b
const pickRandom = (a) => Array.isArray(a) ? a[Math.floor(Math.random() * a.length)] : a
const lerp      = (cur, tgt, spd = 0.1, lim = 0.001) => { let c = (tgt - cur) * spd; if (Math.abs(c) < lim) c = tgt - cur; return c }
const nsin      = (v) => Math.sin(v) * 0.5 + 0.5

function Hyperspeed({ effectOptions = {} }) {
  const containerRef = useRef(null)
  const appRef       = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    if (appRef.current) { appRef.current.dispose(); appRef.current = null }
    while (container.firstChild) container.removeChild(container.firstChild)

    /* â”€â”€ Distortion uniforms â”€â”€ */
    const turbulentUniforms = {
      uFreq: { value: new THREE.Vector4(4, 8, 8, 1) },
      uAmp:  { value: new THREE.Vector4(25, 5, 10, 10) },
    }

    const distortions = {
      turbulentDistortion: {
        uniforms: turbulentUniforms,
        getDistortion: `
          uniform vec4 uFreq; uniform vec4 uAmp;
          float nsin(float val){return sin(val)*.5+.5;}
          #define PI 3.14159265358979
          float getDistortionX(float p){return(cos(PI*p*uFreq.r+uTime)*uAmp.r+pow(cos(PI*p*uFreq.g+uTime*(uFreq.g/uFreq.r)),2.)*uAmp.g);}
          float getDistortionY(float p){return(-nsin(PI*p*uFreq.b+uTime)*uAmp.b+-pow(nsin(PI*p*uFreq.a+uTime/(uFreq.b/uFreq.a)),5.)*uAmp.a);}
          vec3 getDistortion(float p){return vec3(getDistortionX(p)-getDistortionX(0.0125),getDistortionY(p)-getDistortionY(0.0125),0.);}
        `,
        getJS: (progress, time) => {
          const f = turbulentUniforms.uFreq.value
          const a = turbulentUniforms.uAmp.value
          const gx = (p) => Math.cos(Math.PI*p*f.x+time)*a.x + Math.pow(Math.cos(Math.PI*p*f.y+time*(f.y/f.x)),2)*a.y
          const gy = (p) => -nsin(Math.PI*p*f.z+time)*a.z - Math.pow(nsin(Math.PI*p*f.w+time/(f.z/f.w)),5)*a.w
          return new THREE.Vector3(gx(progress)-gx(progress+.007), gy(progress)-gy(progress+.007), 0)
            .multiply(new THREE.Vector3(-2,-5,0)).add(new THREE.Vector3(0,0,-10))
        },
      },
    }

    const fallbackDistUniforms = {
      uDistortionX: { value: new THREE.Vector2(80,3) },
      uDistortionY: { value: new THREE.Vector2(-40,2.5) },
    }
    const fallbackDistVertex = `
      #define PI 3.14159265358979
      uniform vec2 uDistortionX; uniform vec2 uDistortionY;
      float nsin(float v){return sin(v)*.5+.5;}
      vec3 getDistortion(float p){
        p=clamp(p,0.,1.);
        return vec3(uDistortionX.r*nsin(p*PI*uDistortionX.g-PI/2.),uDistortionY.r*nsin(p*PI*uDistortionY.g-PI/2.),0.);
      }
    `

    /* â”€â”€ Shaders â”€â”€ */
    const carLightsVert = `
      #define USE_FOG;
      ${THREE.ShaderChunk.fog_pars_vertex}
      attribute vec3 aOffset; attribute vec3 aMetrics; attribute vec3 aColor;
      uniform float uTravelLength; uniform float uTime;
      varying vec2 vUv; varying vec3 vColor;
      #include <getDistortion_vertex>
      void main(){
        vec3 t=position.xyz;
        float radius=aMetrics.r,myLength=aMetrics.g,speed=aMetrics.b;
        t.xy*=radius; t.z*=myLength;
        t.z+=myLength-mod(uTime*speed+aOffset.z,uTravelLength);
        t.xy+=aOffset.xy;
        float progress=abs(t.z/uTravelLength);
        t.xyz+=getDistortion(progress);
        vec4 mvPos=modelViewMatrix*vec4(t,1.);
        gl_Position=projectionMatrix*mvPos;
        vUv=uv; vColor=aColor;
        ${THREE.ShaderChunk.fog_vertex}
      }
    `
    const carLightsFrag = `
      #define USE_FOG;
      ${THREE.ShaderChunk.fog_pars_fragment}
      varying vec3 vColor; varying vec2 vUv; uniform vec2 uFade;
      void main(){
        float alpha=smoothstep(uFade.x,uFade.y,vUv.x);
        gl_FragColor=vec4(vColor,alpha);
        if(gl_FragColor.a<0.0001)discard;
        ${THREE.ShaderChunk.fog_fragment}
      }
    `
    const sideStickVert = `
      #define USE_FOG;
      ${THREE.ShaderChunk.fog_pars_vertex}
      attribute float aOffset; attribute vec3 aColor; attribute vec2 aMetrics;
      uniform float uTravelLength; uniform float uTime;
      varying vec3 vColor;
      mat4 rotY(in float a){return mat4(cos(a),0,sin(a),0,0,1,0,0,-sin(a),0,cos(a),0,0,0,0,1);}
      #include <getDistortion_vertex>
      void main(){
        vec3 t=position.xyz;
        float w=aMetrics.x,h=aMetrics.y;
        t.xy*=vec2(w,h);
        float time=mod(uTime*60.*2.+aOffset,uTravelLength);
        t=(rotY(3.14/2.)*vec4(t,1.)).xyz;
        t.z+=-uTravelLength+time;
        float progress=abs(t.z/uTravelLength);
        t.xyz+=getDistortion(progress);
        t.y+=h/2.; t.x+=-w/2.;
        vec4 mvPos=modelViewMatrix*vec4(t,1.);
        gl_Position=projectionMatrix*mvPos;
        vColor=aColor;
        ${THREE.ShaderChunk.fog_vertex}
      }
    `
    const sideStickFrag = `
      #define USE_FOG;
      ${THREE.ShaderChunk.fog_pars_fragment}
      varying vec3 vColor;
      void main(){gl_FragColor=vec4(vColor,1.);${THREE.ShaderChunk.fog_fragment}}
    `
    const roadVert = `
      #define USE_FOG;
      uniform float uTime;
      ${THREE.ShaderChunk.fog_pars_vertex}
      uniform float uTravelLength; varying vec2 vUv;
      #include <getDistortion_vertex>
      void main(){
        vec3 t=position.xyz;
        vec3 d=getDistortion((t.y+uTravelLength/2.)/uTravelLength);
        t.x+=d.x; t.z+=d.y; t.y+=-1.*d.z;
        vec4 mvPos=modelViewMatrix*vec4(t,1.);
        gl_Position=projectionMatrix*mvPos;
        vUv=uv;
        ${THREE.ShaderChunk.fog_vertex}
      }
    `
    const islandFrag = `
      #define USE_FOG;
      varying vec2 vUv; uniform vec3 uColor; uniform float uTime;
      ${THREE.ShaderChunk.fog_pars_fragment}
      void main(){gl_FragColor=vec4(uColor,1.);${THREE.ShaderChunk.fog_fragment}}
    `
    const roadFrag = `
      #define USE_FOG;
      varying vec2 vUv; uniform vec3 uColor; uniform float uTime;
      uniform float uLanes; uniform vec3 uBrokenLinesColor,uShoulderLinesColor;
      uniform float uShoulderLinesWidthPercentage,uBrokenLinesLengthPercentage,uBrokenLinesWidthPercentage;
      ${THREE.ShaderChunk.fog_pars_fragment}
      void main(){
        vec2 uv=vUv; vec3 color=uColor;
        uv.y=mod(uv.y+uTime*.05,1.);
        float laneW=1./uLanes, blW=laneW*uBrokenLinesWidthPercentage;
        float bl=step(1.-blW,fract(uv.x*2.))*step(1.-uBrokenLinesLengthPercentage,fract(uv.y*10.));
        float sl=step(1.-blW,fract((uv.x-laneW*(uLanes-1.))*2.))+step(blW,uv.x);
        bl=mix(bl,sl,uv.x);
        color=mix(color,uBrokenLinesColor,bl);
        gl_FragColor=vec4(color,1.);
        ${THREE.ShaderChunk.fog_fragment}
      }
    `

    /* â”€â”€ Scene classes â”€â”€ */
    class CarLights {
      constructor(webgl, opts, colors, speed, fade) {
        this.webgl = webgl; this.options = opts
        this.colors = colors; this.speed = speed; this.fade = fade
      }
      init() {
        const opts = this.options
        const curve = new THREE.LineCurve3(new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,-1))
        const geo = new THREE.TubeGeometry(curve,40,1,8,false)
        const inst = new THREE.InstancedBufferGeometry().copy(geo)
        inst.instanceCount = opts.lightPairsPerRoadWay * 2
        const laneW = opts.roadWidth / opts.lanesPerRoad
        const aOffset=[],aMetrics=[],aColor=[]
        let colors = Array.isArray(this.colors) ? this.colors.map(c=>new THREE.Color(c)) : new THREE.Color(this.colors)
        for (let i=0;i<opts.lightPairsPerRoadWay;i++) {
          const radius=random(opts.carLightsRadius), length=random(opts.carLightsLength), speed=random(this.speed)
          const lane=i%opts.lanesPerRoad
          let lx=lane*laneW - opts.roadWidth/2 + laneW/2 + random(opts.carShiftX)*laneW
          const carW=random(opts.carWidthPercentage)*laneW
          const oy=random(opts.carFloorSeparation)+radius*1.3, oz=-random(opts.length)
          aOffset.push(lx-carW/2,oy,oz, lx+carW/2,oy,oz)
          aMetrics.push(radius,length,speed, radius,length,speed)
          const c=pickRandom(colors)
          aColor.push(c.r,c.g,c.b, c.r,c.g,c.b)
        }
        inst.setAttribute('aOffset',  new THREE.InstancedBufferAttribute(new Float32Array(aOffset),3,false))
        inst.setAttribute('aMetrics', new THREE.InstancedBufferAttribute(new Float32Array(aMetrics),3,false))
        inst.setAttribute('aColor',   new THREE.InstancedBufferAttribute(new Float32Array(aColor),3,false))
        const mat = new THREE.ShaderMaterial({
          fragmentShader: carLightsFrag, vertexShader: carLightsVert,
          transparent: true,
          uniforms: { uTime:{value:0}, uTravelLength:{value:opts.length}, uFade:{value:this.fade}, ...this.webgl.fogUniforms, ...opts.distortion.uniforms },
        })
        mat.onBeforeCompile = s => { s.vertexShader = s.vertexShader.replace('#include <getDistortion_vertex>', opts.distortion.getDistortion) }
        const mesh = new THREE.Mesh(inst, mat)
        mesh.frustumCulled = false
        this.webgl.scene.add(mesh)
        this.mesh = mesh
      }
      update(t) { this.mesh.material.uniforms.uTime.value = t }
    }

    class LightsSticks {
      constructor(webgl, opts) { this.webgl = webgl; this.options = opts }
      init() {
        const opts = this.options
        const geo = new THREE.PlaneGeometry(1,1)
        const inst = new THREE.InstancedBufferGeometry().copy(geo)
        inst.instanceCount = opts.totalSideLightSticks
        const step = opts.length / (opts.totalSideLightSticks - 1)
        const aOffset=[],aColor=[],aMetrics=[]
        let colors = Array.isArray(opts.colors.sticks) ? opts.colors.sticks.map(c=>new THREE.Color(c)) : new THREE.Color(opts.colors.sticks)
        for (let i=0;i<opts.totalSideLightSticks;i++) {
          const w=random(opts.lightStickWidth), h=random(opts.lightStickHeight)
          aOffset.push((i-1)*step*2 + step*Math.random())
          const c=pickRandom(colors)
          aColor.push(c.r,c.g,c.b)
          aMetrics.push(w,h)
        }
        inst.setAttribute('aOffset',  new THREE.InstancedBufferAttribute(new Float32Array(aOffset),1,false))
        inst.setAttribute('aColor',   new THREE.InstancedBufferAttribute(new Float32Array(aColor),3,false))
        inst.setAttribute('aMetrics', new THREE.InstancedBufferAttribute(new Float32Array(aMetrics),2,false))
        const mat = new THREE.ShaderMaterial({
          fragmentShader: sideStickFrag, vertexShader: sideStickVert,
          side: THREE.DoubleSide,
          uniforms: { uTravelLength:{value:opts.length}, uTime:{value:0}, ...this.webgl.fogUniforms, ...opts.distortion.uniforms },
        })
        mat.onBeforeCompile = s => { s.vertexShader = s.vertexShader.replace('#include <getDistortion_vertex>', opts.distortion.getDistortion) }
        const mesh = new THREE.Mesh(inst, mat)
        mesh.frustumCulled = false
        this.webgl.scene.add(mesh)
        this.mesh = mesh
      }
      update(t) { this.mesh.material.uniforms.uTime.value = t }
    }

    class Road {
      constructor(webgl, opts) { this.webgl = webgl; this.options = opts; this.uTime = {value:0} }
      createPlane(side, isRoad) {
        const opts = this.options
        const geo = new THREE.PlaneGeometry(isRoad ? opts.roadWidth : opts.islandWidth, opts.length, 20, 100)
        let uniforms = {
          uTravelLength:{value:opts.length},
          uColor:{value:new THREE.Color(isRoad ? opts.colors.roadColor : opts.colors.islandColor)},
          uTime:this.uTime,
        }
        if (isRoad) Object.assign(uniforms,{
          uLanes:{value:opts.lanesPerRoad},
          uBrokenLinesColor:{value:new THREE.Color(opts.colors.brokenLines)},
          uShoulderLinesColor:{value:new THREE.Color(opts.colors.shoulderLines)},
          uShoulderLinesWidthPercentage:{value:opts.shoulderLinesWidthPercentage},
          uBrokenLinesLengthPercentage:{value:opts.brokenLinesLengthPercentage},
          uBrokenLinesWidthPercentage:{value:opts.brokenLinesWidthPercentage},
        })
        const mat = new THREE.ShaderMaterial({
          fragmentShader: isRoad ? roadFrag : islandFrag, vertexShader: roadVert,
          side: THREE.DoubleSide,
          uniforms: { ...uniforms, ...this.webgl.fogUniforms, ...opts.distortion.uniforms },
        })
        mat.onBeforeCompile = s => { s.vertexShader = s.vertexShader.replace('#include <getDistortion_vertex>', opts.distortion.getDistortion) }
        const mesh = new THREE.Mesh(geo, mat)
        mesh.rotation.x = -Math.PI/2
        mesh.position.z = -opts.length/2
        mesh.position.x += (opts.islandWidth/2 + opts.roadWidth/2) * side
        this.webgl.scene.add(mesh)
        return mesh
      }
      init() { this.leftRoadWay=this.createPlane(-1,true); this.rightRoadWay=this.createPlane(1,true); this.island=this.createPlane(0,false) }
      update(t) { this.uTime.value = t }
    }

    class App {
      constructor(root, opts) {
        this.options = opts
        if (!opts.distortion) opts.distortion = { uniforms:fallbackDistUniforms, getDistortion:fallbackDistVertex }
        this.container = root
        this.renderer = new THREE.WebGLRenderer({ antialias:true, alpha:false, powerPreference:'high-performance' })
        this.renderer.setSize(root.offsetWidth, root.offsetHeight, false)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
        this.renderer.setClearColor(opts.colors.background, 1)
        this.composer = new EffectComposer(this.renderer)
        root.append(this.renderer.domElement)
        this.camera = new THREE.PerspectiveCamera(opts.fov, root.offsetWidth/root.offsetHeight, 0.1, 10000)
        this.camera.position.set(0, 8, -5)
        this.scene = new THREE.Scene()
        this.scene.background = new THREE.Color(opts.colors.background)
        const fog = new THREE.Fog(opts.colors.background, opts.length*.2, opts.length*500)
        this.scene.fog = fog
        this.fogUniforms = { fogColor:{value:fog.color}, fogNear:{value:fog.near}, fogFar:{value:fog.far} }
        this.clock = new THREE.Clock()
        this.disposed = false
        this.road = new Road(this, opts)
        this.leftCarLights  = new CarLights(this, opts, opts.colors.leftCars,  opts.movingAwaySpeed,    new THREE.Vector2(0, 1-opts.carLightsFade))
        this.rightCarLights = new CarLights(this, opts, opts.colors.rightCars, opts.movingCloserSpeed,  new THREE.Vector2(1, 0+opts.carLightsFade))
        this.leftSticks     = new LightsSticks(this, opts)
        this.fovTarget=opts.fov; this.speedUpTarget=0; this.speedUp=0; this.timeOffset=0
        this.tick=this.tick.bind(this); this.handleResize=this.handleResize.bind(this)
        this.onMouseDown=this.onMouseDown.bind(this); this.onMouseUp=this.onMouseUp.bind(this)
        this.onTouchStart=this.onTouchStart.bind(this); this.onTouchEnd=this.onTouchEnd.bind(this)
        window.addEventListener('resize', this.handleResize)
      }
      handleResize() {
        const w=this.container.offsetWidth, h=this.container.offsetHeight
        this.renderer.setSize(w,h); this.camera.aspect=w/h; this.camera.updateProjectionMatrix(); this.composer.setSize(w,h)
      }
      initPasses() {
        this.renderPass = new RenderPass(this.scene, this.camera)
        const smaa = new EffectPass(this.camera, new SMAAEffect({ preset:SMAAPreset.MEDIUM, searchImage:SMAAEffect.searchImageDataURL, areaImage:SMAAEffect.areaImageDataURL }))
        this.renderPass.renderToScreen = false; smaa.renderToScreen = true
        this.composer.addPass(this.renderPass); this.composer.addPass(smaa)
      }
      init() {
        this.initPasses()
        const opts = this.options
        this.road.init()
        this.leftCarLights.init();  this.leftCarLights.mesh.position.setX(-opts.roadWidth/2-opts.islandWidth/2)
        this.rightCarLights.init(); this.rightCarLights.mesh.position.setX(opts.roadWidth/2+opts.islandWidth/2)
        this.leftSticks.init();     this.leftSticks.mesh.position.setX(-(opts.roadWidth+opts.islandWidth/2))
        this.container.addEventListener('mousedown',  this.onMouseDown)
        this.container.addEventListener('mouseup',    this.onMouseUp)
        this.container.addEventListener('mouseout',   this.onMouseUp)
        this.container.addEventListener('touchstart', this.onTouchStart, {passive:true})
        this.container.addEventListener('touchend',   this.onTouchEnd,   {passive:true})
        this.tick()
      }
      onMouseDown() { this.fovTarget=this.options.fovSpeedUp; this.speedUpTarget=this.options.speedUp }
      onMouseUp()   { this.fovTarget=this.options.fov;        this.speedUpTarget=0 }
      onTouchStart() { this.onMouseDown() }
      onTouchEnd()   { this.onMouseUp() }
      update(delta) {
        const lp = Math.exp(-(-60*Math.log2(1-0.1))*delta)
        this.speedUp += lerp(this.speedUp, this.speedUpTarget, lp, 0.00001)
        this.timeOffset += this.speedUp * delta
        const time = this.clock.elapsedTime + this.timeOffset
        this.rightCarLights.update(time); this.leftCarLights.update(time)
        this.leftSticks.update(time);     this.road.update(time)
        let updateCam = false
        const fovChange = lerp(this.camera.fov, this.fovTarget, lp)
        if (fovChange !== 0) { this.camera.fov += fovChange*delta*6; updateCam=true }
        if (this.options.distortion.getJS) {
          const d = this.options.distortion.getJS(0.025, time)
          this.camera.lookAt(new THREE.Vector3(this.camera.position.x+d.x, this.camera.position.y+d.y, this.camera.position.z+d.z))
          updateCam = true
        }
        if (updateCam) this.camera.updateProjectionMatrix()
      }
      tick() {
        if (this.disposed) return
        const canvas = this.renderer.domElement
        if (canvas.clientWidth !== canvas.width || canvas.clientHeight !== canvas.height) {
          this.composer.setSize(canvas.clientWidth, canvas.clientHeight, false)
          this.camera.aspect = canvas.clientWidth / canvas.clientHeight
          this.camera.updateProjectionMatrix()
        }
        const delta = this.clock.getDelta()
        this.renderer.clear(); this.composer.render(delta); this.update(delta)
        requestAnimationFrame(this.tick)
      }
      dispose() {
        this.disposed = true
        window.removeEventListener('resize', this.handleResize)
        this.container.removeEventListener('mousedown',  this.onMouseDown)
        this.container.removeEventListener('mouseup',    this.onMouseUp)
        this.container.removeEventListener('mouseout',   this.onMouseUp)
        this.container.removeEventListener('touchstart', this.onTouchStart)
        this.container.removeEventListener('touchend',   this.onTouchEnd)
        this.scene.clear(); this.composer.dispose(); this.renderer.dispose()
      }
    }

    const defaults = {
      distortion:'turbulentDistortion', length:400, roadWidth:10, islandWidth:2, lanesPerRoad:3,
      fov:90, fovSpeedUp:150, speedUp:2, carLightsFade:0.4,
      totalSideLightSticks:20, lightPairsPerRoadWay:40,
      shoulderLinesWidthPercentage:.05, brokenLinesWidthPercentage:.1, brokenLinesLengthPercentage:.5,
      lightStickWidth:[.12,.5], lightStickHeight:[1.3,1.7],
      movingAwaySpeed:[60,80], movingCloserSpeed:[-120,-160],
      carLightsLength:[12,80], carLightsRadius:[.05,.14],
      carWidthPercentage:[.3,.5], carShiftX:[-.8,.8], carFloorSeparation:[0,5],
      colors:{
        roadColor:0x000000, islandColor:0x000000, background:0x000000,
        shoulderLines:0x131318, brokenLines:0x131318,
        leftCars:[0xf0c75e,0x8d783f,0xd7b457],
        rightCars:[0xc9a652,0x8d783f,0x6b5a31],
        sticks:0xf0c75e,
      },
    }

    const merged = { ...defaults, ...effectOptions, colors:{ ...defaults.colors, ...(effectOptions?.colors||{}) } }
    merged.distortion = distortions[merged.distortion] || { uniforms:fallbackDistUniforms, getDistortion:fallbackDistVertex }

    const app = new App(container, merged)
    appRef.current = app
    app.init()

    return () => { if (appRef.current) { appRef.current.dispose(); appRef.current=null } }
  }, [effectOptions])

  return <div className="hyperspeed-container" ref={containerRef} />
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   HERO DATA
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const STATS = [
  { value:'5+',  label:'Yrs Active'  },
  { value:'40+', label:'Engagements' },
  { value:'0',   label:'Breaches'    },
  { value:'⊕',   label:'Attack Surf.'},
]
const TAGS = [
  { icon:'◆', label:'Pen Testing'      },
  { icon:'◉', label:'Cloud Security'   },
  { icon:'⬡', label:'DevOps / CI-CD'   },
  { icon:'◎', label:'Threat Modelling' },
  { icon:'⊛', label:'SOC / Observe.'   },
  { icon:'⚙', label:'Hardening Arch.'  },
]
const fadeUp = { hidden:{opacity:0,y:26}, visible:{opacity:1,y:0} }
const t = (delay=0) => ({ duration:0.55, ease:[0.22,1,0.36,1], delay })

const hyperspeedOpts = {
  distortion:'turbulentDistortion', length:400, roadWidth:10, islandWidth:2, lanesPerRoad:3,
  fov:90, fovSpeedUp:150, speedUp:2, carLightsFade:0.4,
  totalSideLightSticks:20, lightPairsPerRoadWay:40,
  shoulderLinesWidthPercentage:.05, brokenLinesWidthPercentage:.1, brokenLinesLengthPercentage:.5,
  lightStickWidth:[.12,.5], lightStickHeight:[1.3,1.7],
  movingAwaySpeed:[60,80], movingCloserSpeed:[-120,-160],
  carLightsLength:[12,80], carLightsRadius:[.05,.14],
  carWidthPercentage:[.3,.5], carShiftX:[-.8,.8], carFloorSeparation:[0,5],
  colors:{
    roadColor:0x000000, islandColor:0x000000, background:0x000000,
    shoulderLines:0x131318, brokenLines:0x131318,
    leftCars:[0xf0c75e,0x8d783f,0xd7b457],
    rightCars:[0xc9a652,0x8d783f,0x6b5a31],
    sticks:0xf0c75e,
  },
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   HERO SECTION
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export default function HeroSection() {
  useEffect(() => {
    if (document.getElementById('hero-css')) return
    const s = document.createElement('style')
    s.id = 'hero-css'
    s.textContent = HERO_CSS
    document.head.appendChild(s)
  }, [])

  /* Memoised so Hyperspeed never re-mounts on parent re-render */
  const opts = useMemo(() => hyperspeedOpts, [])

  return (
    <section id="home" style={{
      position:'relative', minHeight:'100vh', background:'#000',
      overflow:'hidden', display:'flex', flexDirection:'column',
      marginTop:'-36px',
    }}>

      {/* â”€â”€ BG Layer 0: Hyperspeed â”€â”€ */}
      <div aria-hidden="true" style={{
        position:'absolute', inset:0, zIndex:0, pointerEvents:'none',
      }}>
        <Hyperspeed effectOptions={opts} />
      </div>

      {/* â”€â”€ BG Layer 1: Gradient vignette â”€â”€ */}
      <div aria-hidden="true" style={{
        position:'absolute', inset:0, zIndex:1, pointerEvents:'none',
        background:'linear-gradient(180deg,rgba(0,0,0,.5) 0%,rgba(0,0,0,.65) 50%,rgba(0,0,0,.93) 100%)',
      }} />

      {/* â”€â”€ BG Layer 2: Dot grid â”€â”€ */}
      <div aria-hidden="true" style={{
        position:'absolute', inset:0, zIndex:2, pointerEvents:'none', opacity:.14,
        backgroundImage:`radial-gradient(circle,${GOLD} 1px,transparent 1px)`,
        backgroundSize:'40px 40px',
      }} />

      {/* â”€â”€ BG Layer 2: Scanline sweep â”€â”€ */}
      <div className="h-scan" />

      {/* ── CONTENT — z-index 10, always on top ── */}
      <div className="h-content" style={{
        position:'relative', zIndex:10,
        width:'min(1120px,92vw)', margin:'0 auto',
        paddingTop:128, paddingBottom:72,
        flex:1, display:'flex', flexDirection:'column', justifyContent:'center',
      }}>

        {/* Eyebrow */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={t(.05)}
          style={{display:'flex',alignItems:'center',gap:12,marginBottom:24}}>
          <span style={{width:28,height:1,background:GOLD,opacity:.5,display:'block'}} />
          <span style={{fontFamily:MONO,fontSize:10,letterSpacing:'0.24em',color:GOLD_DIM}}>
            // PORTFOLIO â€” CYBERSECURITY &amp; DEVOPS
          </span>
          <span style={{width:28,height:1,background:GOLD,opacity:.5,display:'block'}} />
        </motion.div>

        {/* Two-column layout */}
        <div className="h-cols" style={{display:'flex',flexDirection:'row',gap:52,alignItems:'flex-start'}}>

          {/* â”€â”€ LEFT: copy â”€â”€ */}
          <div style={{flex:1,minWidth:0}}>

            {/* Name */}
            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={t(.12)}>
              <h1 style={{fontFamily:SANS,fontSize:'clamp(2.2rem,4.8vw,4rem)',fontWeight:300,letterSpacing:'0.08em',color:GOLD,margin:0,lineHeight:1.05,textTransform:'uppercase'}}>
                <ShinyText text="Otenaike Michael" speed={2} color={GOLD} shineColor="#fff" spread={120} direction="left" />
              </h1>
              <h1 style={{fontFamily:SANS,fontSize:'clamp(2.2rem,4.8vw,4rem)',fontWeight:600,letterSpacing:'0.08em',color:GOLD_BRIGHT,margin:'2px 0 0',lineHeight:1.05,textTransform:'uppercase'}}>
                Babatunde<span className="h-cursor" />
              </h1>
            </motion.div>

            {/* Role tags */}
            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={t(.22)}
              style={{display:'flex',flexWrap:'wrap',gap:8,margin:'20px 0 28px'}}>
              {['Cybersecurity Engineer','Ethical Hacker','DevOps Specialist'].map(r => (
                <span key={r} className="h-tag"><span style={{color:GOLD,fontSize:9}}>â—†</span> {r}</span>
              ))}
            </motion.div>

            {/* Bio */}
            <motion.p initial="hidden" animate="visible" variants={fadeUp} transition={t(.30)}
              style={{fontFamily:SANS,fontSize:'clamp(1rem,1.15vw,1.1rem)',fontWeight:400,lineHeight:1.72,color:'rgba(245,245,245,.78)',margin:'0 0 12px',maxWidth:540}}>
              Cybersecurity engineer and DevOps specialist delivering secure, resilient, and
              high-performance digital platforms through offensive testing, hardening-first
              architecture, and automation that reduces risk across every release cycle.
            </motion.p>
            <motion.p initial="hidden" animate="visible" variants={fadeUp} transition={t(.36)}
              style={{fontFamily:SANS,fontSize:'clamp(.92rem,1.05vw,1rem)',fontWeight:400,lineHeight:1.72,color:'rgba(185,185,185,.6)',margin:'0 0 32px',maxWidth:500}}>
              Practical work across penetration testing, cloud security, CI/CD protection,
              and production observability â€” translating complex security challenges into
              measurable outcomes and maintainable engineering practices.
            </motion.p>

            {/* CTAs */}
            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={t(.44)}
              style={{display:'flex',gap:14,flexWrap:'wrap'}}>
              <a href="#footer" className="h-btn">
                <span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 4 10 9 10-9"/>
                  </svg>
                  LET'S WORK TOGETHER
                </span>
              </a>
              <a href="#projects" className="h-btn-g">
                <span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                  </svg>
                  VIEW CASE STUDIES
                </span>
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={t(.52)}
              style={{display:'flex',gap:10,marginTop:36,flexWrap:'wrap'}}>
              {STATS.map(({value,label}) => (
                <div key={label} className="h-stat">
                  <div style={{fontFamily:MONO,fontSize:22,color:GOLD_BRIGHT,lineHeight:1,marginBottom:4}}>{value}</div>
                  <div style={{fontFamily:SANS,fontSize:11,letterSpacing:'0.1em',color:GOLD_DIM,textTransform:'uppercase'}}>{label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* â”€â”€ RIGHT: image + tags â”€â”€ */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={t(.2)}
            className="h-right"
            style={{width:360,minWidth:300,display:'flex',flexDirection:'column',alignItems:'center',gap:18}}>

            <div className="h-frame" style={{
              position:'relative', width:320, height:360,
              border:'1px solid rgba(201,168,76,.35)',
              background:'rgba(10,10,10,.92)',
              display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:10,
            }}>
              <span className="hc-tl"/><span className="hc-tr"/>
              <span className="hc-bl"/><span className="hc-br"/>
              <div style={{position:'absolute',inset:14,border:'1px solid rgba(201,168,76,.07)',pointerEvents:'none'}} />
              <svg viewBox="0 0 24 24" fill="none" width={50} height={50}>
                <path d="m12 3 7 4v5c0 4.2-2.5 7.7-7 9-4.5-1.3-7-4.8-7-9V7l7-4Z" stroke={GOLD} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="m9.5 12 1.8 1.8 3.2-3.6" stroke={GOLD} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{fontFamily:MONO,fontSize:10,letterSpacing:'0.22em',color:GOLD_DIM}}>CLIENT IMAGE</span>
              <div style={{position:'absolute',bottom:0,left:0,right:0,padding:'7px 14px',borderTop:'1px solid rgba(201,168,76,.13)',display:'flex',justifyContent:'space-between'}}>
                <span style={{fontFamily:MONO,fontSize:9,letterSpacing:'0.16em',color:GOLD_DIM}}>OTENAIKE.M</span>
                <span style={{fontFamily:MONO,fontSize:9,letterSpacing:'0.1em', color:GOLD_DIM}}>SEC // DEV</span>
              </div>
            </div>

            <div style={{display:'flex',flexWrap:'wrap',gap:7,justifyContent:'center'}}>
              {TAGS.map(({icon,label}) => (
                <span key={label} className="h-tag"><span style={{color:GOLD,fontSize:10}}>{icon}</span>{label}</span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={t(.62)}
          style={{marginTop:52,display:'flex',alignItems:'center',gap:14}}>
          <div style={{flex:1,height:1,background:'linear-gradient(90deg,rgba(201,168,76,.3),transparent)'}} />
          <span style={{fontFamily:MONO,fontSize:9,letterSpacing:'0.22em',color:GOLD_DIM}}>SCROLL TO EXPLORE</span>
          <div style={{width:18,height:30,border:'1px solid rgba(201,168,76,.28)',borderRadius:9,display:'flex',justifyContent:'center',paddingTop:5}}>
            <div style={{width:2,height:7,background:GOLD,borderRadius:2,animation:'heroBlink 1.6s ease-in-out infinite'}} />
          </div>
          <div style={{flex:1,height:1,background:'linear-gradient(90deg,transparent,rgba(201,168,76,.3))'}} />
        </motion.div>
      </div>
    </section>
  )
}
