// ThreeBackground.jsx
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    // === RENDERER ===
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.offsetWidth, el.offsetHeight);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x03010f);
    scene.fog = new THREE.FogExp2(0x0a0520, 0.022);

    const camera = new THREE.PerspectiveCamera(75, el.offsetWidth / el.offsetHeight, 0.1, 300);
    camera.position.set(0, 0, 30);

    // === STARS ===
    const starCount = 2000;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starSize = new Float32Array(starCount);
    const starPhase = new Float32Array(starCount);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3]     = (Math.random() - 0.5) * 300;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 200;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 100 - 30;
      starSize[i]  = Math.random() * 2.5 + 0.5;
      starPhase[i] = Math.random() * Math.PI * 2;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute("size",     new THREE.BufferAttribute(starSize, 1));
    starGeo.setAttribute("phase",    new THREE.BufferAttribute(starPhase, 1));

    const starMat = new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 } },
      vertexShader: `
        attribute float size;
        attribute float phase;
        varying float vPhase;
        void main() {
          vPhase = phase;
          gl_PointSize = size * (0.7 + 0.3 * sin(phase));
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying float vPhase;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          if (d > 0.5) discard;
          float twinkle = 0.5 + 0.5 * sin(time * 1.8 + vPhase * 6.28);
          float alpha = (1.0 - d * 2.0) * twinkle;
          vec3 col = mix(vec3(0.8, 0.7, 1.0), vec3(1.0, 1.0, 1.0), twinkle);
          gl_FragColor = vec4(col, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
    });
    scene.add(new THREE.Points(starGeo, starMat));

    // === NEBULA BACKDROP ===
    const nebulaMat = new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 } },
      vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `
        varying vec2 vUv;
        uniform float time;
        float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        float noise(vec2 p) {
          vec2 i = floor(p); vec2 f = fract(p);
          float a = hash(i), b = hash(i + vec2(1,0)), c = hash(i + vec2(0,1)), d = hash(i + vec2(1,1));
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
        }
        void main() {
          vec2 uv = vUv - 0.5;
          float n  = noise(uv * 4.0 + time * 0.05);
          float n2 = noise(uv * 8.0 - time * 0.03);
          float glow = smoothstep(0.6, 0.0, length(uv) + n * 0.15);
          vec3 col = mix(vec3(0.04, 0.02, 0.28), vec3(0.22, 0.04, 0.45), n * 0.6 + n2 * 0.4);
          gl_FragColor = vec4(col, glow * 0.6);
        }
      `,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const nebulaMesh = new THREE.Mesh(new THREE.PlaneGeometry(220, 140), nebulaMat);
    nebulaMesh.position.z = -30;
    scene.add(nebulaMesh);

    // === CLOUDS ===
    scene.add(new THREE.AmbientLight(0x1a0040, 1.5));
    const cloudLight = new THREE.PointLight(0x5500aa, 1.5, 120);
    cloudLight.position.set(0, 0, -10);
    scene.add(cloudLight);

    function makeCloud(x, y, z, scale, opacity) {
      const grp = new THREE.Group();
      const count = Math.floor(Math.random() * 5) + 6;
      for (let i = 0; i < count; i++) {
        const r = (Math.random() * 3 + 1.5) * scale;
        const geo = new THREE.SphereGeometry(r, 7, 5);
        const mat = new THREE.MeshLambertMaterial({
          color: 0x2a1060,
          transparent: true,
          opacity,
          depthWrite: false,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(
          (Math.random() - 0.5) * 14 * scale,
          (Math.random() - 0.5) * 4 * scale,
          (Math.random() - 0.5) * 3
        );
        grp.add(mesh);
      }
      grp.position.set(x, y, z);
      grp.userData.speed = (Math.random() * 0.012 + 0.003) * (Math.random() < 0.5 ? 1 : -1);
      return grp;
    }

    const cloudDefs = [
      [-55, 13, -10, 1.4, 0.55], [-20, 19, -12, 1.8, 0.5], [15, 16, -8, 1.2, 0.48],
      [45,  11, -14, 1.6, 0.52], [-40, -9, -10, 1.1, 0.4],  [35, -8, -12, 1.3, 0.42],
      [-10,-15, -10, 1.5, 0.38], [65,   5, -15, 1.2, 0.45], [-65,  7, -12, 1.0, 0.40],
      [ 25,  21, -16, 2.0, 0.5], [-30, -5,  -9, 1.4, 0.44],
    ];
    const clouds = cloudDefs.map(([x, y, z, s, o]) => {
      const c = makeCloud(x, y, z, s, o);
      scene.add(c);
      return c;
    });

    // === LIGHTNING ===
    const lightningGroup = new THREE.Group();
    scene.add(lightningGroup);

    const flashLight = new THREE.PointLight(0x9966ff, 0, 100);
    scene.add(flashLight);

    function boltPoints(x, y, z, segs, spread) {
      const pts = [];
      let cx = x, cy = y, cz = z;
      const step = -28 / segs;
      for (let i = 0; i <= segs; i++) {
        pts.push(new THREE.Vector3(cx, cy, cz));
        cx += (Math.random() - 0.5) * spread;
        cz += (Math.random() - 0.5) * 1.5;
        cy += step;
      }
      return pts;
    }

    function spawnBranch(origin, dir) {
      const pts = [origin.clone()];
      let cur = origin.clone();
      for (let i = 0; i < 5; i++) {
        cur = cur.clone().add(new THREE.Vector3(
          dir.x + (Math.random() - 0.5) * 1.8,
          dir.y - Math.random() * 1.5,
          (Math.random() - 0.5) * 0.5
        ));
        pts.push(cur.clone());
      }
      const mat = new THREE.LineBasicMaterial({ color: 0xbb77ff, transparent: true, opacity: 0.75 });
      return { line: new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat), mat };
    }

    const activeBolts = [];

    function spawnLightning() {
      const x = (Math.random() - 0.5) * 90;
      const y = 22 + Math.random() * 8;
      const z = -4 + (Math.random() - 0.5) * 6;
      const segs = Math.floor(Math.random() * 10) + 12;
      const pts = boltPoints(x, y, z, segs, 2.8);
      const boltMat = new THREE.LineBasicMaterial({ color: 0xcc88ff, transparent: true, opacity: 1 });
      const boltLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), boltMat);
      lightningGroup.add(boltLine);

      // branches
      const branches = [];
      const branchCount = Math.floor(Math.random() * 4) + 2;
      for (let b = 0; b < branchCount; b++) {
        const idx = Math.floor(Math.random() * (pts.length - 3)) + 1;
        const dir = new THREE.Vector3((Math.random() - 0.5) * 3, -1.5, 0);
        const br = spawnBranch(pts[idx], dir);
        lightningGroup.add(br.line);
        branches.push(br);
      }

      flashLight.position.set(x, y, z - 2);
      flashLight.intensity = 14 + Math.random() * 8;
      flashLight.color.setHex(Math.random() < 0.5 ? 0x9966ff : 0xaaddff);

      // illuminate nearby clouds
      clouds.forEach(c => {
        const dist = c.position.distanceTo(new THREE.Vector3(x, y, z));
        if (dist < 50) {
          c.children.forEach(child => {
            child.material.color.setHex(0x7744cc);
            if (!child.material.emissive) child.material.emissive = new THREE.Color();
            child.material.emissive.setHex(0x3311aa);
            child.material.emissiveIntensity = 0.7;
            setTimeout(() => {
              child.material.color.setHex(0x2a1060);
              child.material.emissiveIntensity = 0;
            }, 200);
          });
        }
      });

      const duration = Math.random() * 200 + 80;
      activeBolts.push({ boltLine, boltMat, branches, startTime: Date.now(), duration });
    }

    let nextBolt = 0;
    function scheduleLightning(now) {
      if (now > nextBolt) {
        spawnLightning();
        if (Math.random() < 0.4) setTimeout(spawnLightning, Math.random() * 130 + 40);
        nextBolt = now + Math.random() * 3000 + 700;
      }
    }

    // === ANIMATION LOOP ===
    const clock = new THREE.Clock();
    let running = true;

    function animate() {
      if (!running) return;
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const t = clock.elapsedTime;
      const now = Date.now();

      starMat.uniforms.time.value = t;
      nebulaMat.uniforms.time.value = t;

      camera.position.x = Math.sin(t * 0.04) * 2.5;
      camera.position.y = Math.sin(t * 0.025) * 1.2;
      camera.lookAt(0, 0, 0);

      clouds.forEach(c => {
        c.position.x += c.userData.speed;
        if (c.position.x > 100) c.position.x = -100;
        if (c.position.x < -100) c.position.x = 100;
      });

      scheduleLightning(now);

      for (let i = activeBolts.length - 1; i >= 0; i--) {
        const b = activeBolts[i];
        const elapsed = now - b.startTime;
        const prog = elapsed / b.duration;
        if (prog >= 1) {
          lightningGroup.remove(b.boltLine);
          b.branches.forEach(br => lightningGroup.remove(br.line));
          activeBolts.splice(i, 1);
          flashLight.intensity = Math.max(0, flashLight.intensity - 0.5);
        } else {
          const flicker = 0.5 + 0.5 * Math.sin(elapsed * 0.14);
          const fade = 1 - Math.pow(prog, 0.5);
          b.boltMat.opacity = flicker * fade;
          b.branches.forEach(br => { br.mat.opacity = flicker * fade * 0.6; });
          flashLight.intensity = flicker * 12 * fade;
        }
      }

      renderer.render(scene, camera);
    }

    animate();

    const onResize = () => {
      camera.aspect = el.offsetWidth / el.offsetHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.offsetWidth, el.offsetHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      running = false;
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    />
  );
}