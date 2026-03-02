"use client";
import { useEffect, useRef, useCallback } from "react";

export default function FPSGame() {
  const mountRef = useRef(null);
  const gameRef = useRef(null);

  const initGame = useCallback((container) => {
    // ── Dynamic Three.js load ──────────────────────
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    script.onload = () => startEngine(container);
    document.head.appendChild(script);

    function startEngine(container) {
      const THREE = window.THREE;

      // ── Renderer ────────────────────────────────
      const canvas = document.createElement("canvas");
      container.appendChild(canvas);
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

      const handleResize = () => {
        renderer.setSize(container.clientWidth, container.clientHeight);
        cam.aspect = container.clientWidth / container.clientHeight;
        cam.updateProjectionMatrix();
      };
      window.addEventListener("resize", handleResize);

      // ── Scene & Camera ──────────────────────────
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0d0d1a);
      scene.fog = new THREE.FogExp2(0x0d0d1a, 0.022);

      const cam = new THREE.PerspectiveCamera(
        80,
        container.clientWidth / container.clientHeight,
        0.05,
        150,
      );
      cam.position.set(0, 1.75, 0);
      scene.add(cam);

      // ── Lights ──────────────────────────────────
      scene.add(new THREE.AmbientLight(0x223344, 0.55));
      const addSpot = (x, y, z, col = 0xffeedd, pw = 1.5, d = 22) => {
        const l = new THREE.PointLight(col, pw, d);
        l.position.set(x, y, z);
        l.castShadow = true;
        l.shadow.mapSize.set(512, 512);
        scene.add(l);
        const m = new THREE.Mesh(
          new THREE.SphereGeometry(0.12, 6, 6),
          new THREE.MeshBasicMaterial({ color: col }),
        );
        m.position.copy(l.position);
        scene.add(m);
      };
      addSpot(-12, 4.5, -12);
      addSpot(12, 4.5, -12);
      addSpot(-12, 4.5, 12);
      addSpot(12, 4.5, 12);
      addSpot(0, 4.5, 0, 0xaaccff, 1.0);
      addSpot(-5, 4.5, 20, 0xff9944, 1.2);

      // ── Materials ───────────────────────────────
      const M = (c, r = 0.85, m = 0.05) =>
        new THREE.MeshStandardMaterial({
          color: c,
          roughness: r,
          metalness: m,
        });
      const mWall = M(0x2a2a3e, 0.9),
        mWall2 = M(0x3a2a2a, 0.9);
      const mCrate = M(0x5c3d1e, 0.9),
        mCrate2 = M(0x4a5a2a, 0.9);
      const mMetal = M(0x445566, 0.35, 0.8),
        mConc = M(0x3a3a4a, 0.95);

      // ── Map ─────────────────────────────────────
      const walls = [];
      const mkBox = (w, h, d, mat, x, y, z, isWall = false) => {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
        mesh.position.set(x, y, z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        scene.add(mesh);
        if (isWall)
          walls.push({
            minX: x - w / 2 - 0.45,
            maxX: x + w / 2 + 0.45,
            minZ: z - d / 2 - 0.45,
            maxZ: z + d / 2 + 0.45,
          });
        return mesh;
      };

      // Floor tiles
      for (let tx = -5; tx <= 5; tx++)
        for (let tz = -5; tz <= 5; tz++) {
          mkBox(
            6,
            0.2,
            6,
            M((tx + tz) % 2 === 0 ? 0x1a1a2a : 0x151525, 0.95),
            tx * 6,
            -0.1,
            tz * 6,
          );
        }
      mkBox(65, 0.2, 65, M(0x141424, 0.98), 0, 5, 0); // ceiling

      // Outer walls
      mkBox(65, 5.2, 0.4, mWall2, 0, 2.5, -32, true);
      mkBox(65, 5.2, 0.4, mWall2, 0, 2.5, 32, true);
      mkBox(0.4, 5.2, 65, mWall2, -32, 2.5, 0, true);
      mkBox(0.4, 5.2, 65, mWall2, 32, 2.5, 0, true);

      // Interior walls
      [
        [18, 5, 0.5, mWall, -7, 2.5, -10],
        [14, 5, 0.5, mWall, 9, 2.5, 5],
        [0.5, 5, 16, mWall, -16, 2.5, 3],
        [0.5, 5, 13, mWall, 16, 2.5, -4],
        [12, 5, 0.5, mWall, 9, 2.5, -19],
        [0.5, 5, 11, mWall, -9, 2.5, 16],
        [8, 5, 0.5, mWall, -22, 2.5, 10],
        [0.5, 5, 8, mWall, 22, 2.5, 18],
      ].forEach(([w, h, d, m, x, y, z]) => mkBox(w, h, d, m, x, y, z, true));

      // Crates
      [
        [-5, 0, -5],
        [5, 0, -8],
        [-8, 0, 5],
        [10, 0, 10],
        [-18, 0, -18],
        [18, 0, -20],
        [20, 0, 15],
        [-22, 0, 8],
        [3, 0, 20],
        [-15, 0, 15],
        [12, 0, -5],
        [-6, 0, 12],
        [0, 0, -20],
        [25, 0, 5],
        [-25, 0, -5],
      ].forEach(([x, , z], i) => {
        const w = 1.2 + ((i * 7) % 3) * 0.6,
          h = 0.8 + ((i * 11) % 3) * 0.5;
        mkBox(w, h, w, i % 2 ? mCrate2 : mCrate, x, h / 2, z, true);
        if (i % 3 === 0)
          mkBox(w * 0.9, h * 0.7, w * 0.9, mCrate, x, h * 1.55, z, false);
      });

      // Barrels
      [
        [6, 0, -15],
        [-20, 0, 0],
        [0, 0, 22],
        [-10, 0, -22],
        [22, 0, -10],
      ].forEach(([x, , z]) => {
        const mesh = new THREE.Mesh(
          new THREE.CylinderGeometry(0.38, 0.42, 1.15, 10),
          mMetal,
        );
        mesh.position.set(x, 0.6, z);
        mesh.castShadow = true;
        scene.add(mesh);
        walls.push({
          minX: x - 0.8,
          maxX: x + 0.8,
          minZ: z - 0.8,
          maxZ: z + 0.8,
        });
      });

      // Pillars
      [-16, -8, 0, 8, 16].forEach((px) =>
        [-16, 0, 16].forEach((pz) => {
          if (Math.abs(px) < 4 && Math.abs(pz) < 4) return;
          if ((px + pz) % 8 === 0) mkBox(1.2, 5, 1.2, mConc, px, 2.5, pz, true);
        }),
      );

      // ── Weapon viewmodel ────────────────────────
      const wg = new THREE.Group();
      cam.add(wg);
      [
        [0.07, 0.09, 0.52, 0x111111, 0.25, 0.85, 0.19, -0.18, -0.35],
        [0.035, 0.035, 0.38, 0x222222, 0.2, 0.9, 0.19, -0.145, -0.65],
        [0.055, 0.13, 0.055, 0x3a2010, 0.9, 0, 0.19, -0.28, -0.32],
        [0.045, 0.17, 0.11, 0x181818, 0.4, 0.6, 0.19, -0.285, -0.4],
        [0.055, 0.065, 0.17, 0x3a2010, 0.9, 0, 0.19, -0.21, -0.12],
        [0.07, 0.025, 0.14, 0x111111, 0.3, 0.8, 0.19, -0.157, -0.38],
      ].forEach(([w, h, d, c, r, m, x, y, z]) => {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), M(c, r, m));
        mesh.position.set(x, y, z);
        wg.add(mesh);
      });
      const fl3 = new THREE.Mesh(
        new THREE.SphereGeometry(0.07, 6, 6),
        new THREE.MeshBasicMaterial({
          color: 0xffaa00,
          transparent: true,
          opacity: 0,
        }),
      );
      fl3.position.set(0.19, -0.145, -0.87);
      wg.add(fl3);

      // ── Enemies ─────────────────────────────────
      const enemies = [];
      const spawnEnemy = (x, z) => {
        const g = new THREE.Group();
        [
          [0.58, 1.05, 0.32, 0x243a24, 0.9, 0, 0, 0.53, 0],
          [0.32, 0.32, 0.32, 0xc0a070, 0.8, 0, 0, 1.24, 0],
          [0.35, 0.18, 0.35, 0x1a2a1a, 0.8, 0.1, 0, 1.47, 0],
          [0.05, 0.05, 0.38, 0x111111, 0.3, 0.9, 0.36, 0.78, 0.18],
          [0.2, 0.75, 0.22, 0x243a24, 0.9, 0, 0.38, 0.22, 0],
          [0.2, 0.75, 0.22, 0x243a24, 0.9, 0, -0.38, 0.22, 0],
        ].forEach(([w, h, d, c, r, m, px, py, pz]) => {
          const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(w, h, d),
            M(c, r, m),
          );
          mesh.position.set(px, py, pz);
          mesh.castShadow = true;
          g.add(mesh);
        });
        const hbg = new THREE.Mesh(
          new THREE.PlaneGeometry(0.65, 0.07),
          new THREE.MeshBasicMaterial({
            color: 0x00ff41,
            side: THREE.DoubleSide,
          }),
        );
        hbg.position.set(0, 1.88, 0);
        g.add(hbg);
        g.position.set(x, 0, z);
        scene.add(g);
        return {
          g,
          hbg,
          hpMat: hbg.material,
          hp: 100,
          maxHp: 100,
          spd: 1.4 + Math.random() * 2,
          state: "patrol",
          pAngle: Math.random() * Math.PI * 2,
          pTimer: 0,
          shootT: 0,
          alertT: 0,
          alive: true,
          legSw: Math.random() * Math.PI * 2,
        };
      };

      const spawnAll = () => {
        enemies.forEach((e) => scene.remove(e.g));
        enemies.length = 0;
        [
          [-22, -18],
          [-18, -22],
          [22, -18],
          [18, -22],
          [-25, 10],
          [-25, -5],
          [25, 10],
          [25, -5],
          [0, -25],
          [0, 25],
          [-15, 22],
          [15, 22],
        ].forEach(([x, z]) => enemies.push(spawnEnemy(x, z)));
      };

      // ── Player state ────────────────────────────
      const P = {
        hp: 100,
        ammo: 30,
        reserve: 90,
        kills: 0,
        yaw: 0,
        pitch: 0,
        reloading: false,
        reloadT: 0,
        reloadDur: 1.9,
        shootCd: 0,
        fireRate: 0.095,
        alive: true,
        startT: 0,
      };

      // ── Input ───────────────────────────────────
      const keys = {};
      let locked = false,
        recoilY = 0,
        recoilX = 0,
        shakeAmt = 0,
        shakeDur = 0,
        bobT = 0;

      const onKeyDown = (e) => {
        keys[e.code] = true;
        if (e.code === "KeyR" && !P.reloading && P.ammo < 30 && P.reserve > 0)
          doReload();
      };
      const onKeyUp = (e) => {
        keys[e.code] = false;
      };
      const onMouseMove = (e) => {
        if (!locked) return;
        P.yaw -= e.movementX * 0.0017;
        P.pitch -= e.movementY * 0.0017;
        P.pitch = Math.max(-1.15, Math.min(1.15, P.pitch));
      };
      const onMouseDown = (e) => {
        if (e.button === 0 && gameOn && locked) tryShoot();
      };
      const onPLC = () => {
        locked = document.pointerLockElement === canvas;
      };
      const onCanvasClick = () => {
        if (gameOn) canvas.requestPointerLock();
      };

      document.addEventListener("keydown", onKeyDown);
      document.addEventListener("keyup", onKeyUp);
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mousedown", onMouseDown);
      document.addEventListener("pointerlockchange", onPLC);
      canvas.addEventListener("click", onCanvasClick);

      // ── Raycaster ───────────────────────────────
      const ray = new THREE.Raycaster();

      const tryShoot = () => {
        if (!P.alive || P.reloading || P.shootCd > 0) return;
        if (P.ammo <= 0) {
          doReload();
          return;
        }
        P.ammo--;
        P.shootCd = P.fireRate;
        updateAmmoHUD();
        muzzleFlash();
        recoilY += 0.022;
        recoilX += (Math.random() - 0.5) * 0.009;
        ray.setFromCamera(new THREE.Vector2(0, 0), cam);
        const targets = [];
        enemies.forEach((e) => {
          if (e.alive) e.g.children.forEach((c) => targets.push(c));
        });
        const hits = ray.intersectObjects(targets);
        if (hits.length) {
          const e = enemies.find(
            (en) => en.alive && en.g.children.includes(hits[0].object),
          );
          if (e) {
            damageEnemy(
              e,
              hits[0].object === e.g.children[1]
                ? 100
                : 20 + Math.random() * 15,
            );
            showHitmark();
          }
        }
        if (P.ammo === 0 && P.reserve > 0) doReload();
      };

      const damageEnemy = (e, dmg) => {
        if (!e.alive) return;
        e.hp = Math.max(0, e.hp - dmg);
        const r = e.hp / e.maxHp;
        e.hbg.scale.x = r;
        e.hpMat.color.setHSL(r * 0.33, 1, 0.5);
        if (e.hp <= 0) {
          e.alive = false;
          e.g.rotation.x = Math.PI / 2;
          e.g.position.y = -0.5;
          P.kills++;
          updateKillsHUD();
          addKillFeed();
        } else {
          e.state = "chase";
          e.alertT = 10;
        }
      };

      const doReload = () => {
        if (P.reloading || P.reserve <= 0) return;
        P.reloading = true;
        P.reloadT = 0;
        setUI("reload-wrap", "show", true);
      };

      // ── Collision ───────────────────────────────
      const blocked = (nx, nz) => {
        if (nx < -31 || nx > 31 || nz < -31 || nz > 31) return true;
        return walls.some(
          (w) => nx > w.minX && nx < w.maxX && nz > w.minZ && nz < w.maxZ,
        );
      };

      // ── Enemy AI ────────────────────────────────
      const updateEnemies = (dt) => {
        const px = cam.position.x,
          pz = cam.position.z;
        enemies.forEach((e) => {
          if (!e.alive) return;
          e.hbg.lookAt(cam.position);
          e.g.lookAt(px, e.g.position.y, pz);
          const dx = px - e.g.position.x,
            dz = pz - e.g.position.z;
          const dist = Math.sqrt(dx * dx + dz * dz);
          if (e.alertT > 0) e.alertT -= dt;
          e.state = dist < 28 || e.alertT > 0 ? "chase" : "patrol";
          if (e.state === "patrol") {
            e.pTimer -= dt;
            if (e.pTimer < 0) {
              e.pAngle = Math.random() * Math.PI * 2;
              e.pTimer = 2 + Math.random() * 3;
            }
            const mx = Math.cos(e.pAngle) * e.spd * 0.45 * dt,
              mz = Math.sin(e.pAngle) * e.spd * 0.45 * dt;
            if (!blocked(e.g.position.x + mx, e.g.position.z))
              e.g.position.x += mx;
            if (!blocked(e.g.position.x, e.g.position.z + mz))
              e.g.position.z += mz;
          }
          if (e.state === "chase") {
            if (dist > 2.2) {
              const nx = e.g.position.x + (dx / dist) * e.spd * dt,
                nz = e.g.position.z + (dz / dist) * e.spd * dt;
              if (!blocked(nx, e.g.position.z)) e.g.position.x = nx;
              if (!blocked(e.g.position.x, nz)) e.g.position.z = nz;
            }
            e.legSw += dt * 6;
            if (e.g.children[4])
              e.g.children[4].position.z = Math.sin(e.legSw) * 0.15;
            if (e.g.children[5])
              e.g.children[5].position.z = Math.sin(e.legSw + Math.PI) * 0.15;
            e.shootT -= dt;
            if (e.shootT <= 0 && dist < 18) {
              e.shootT = 1.2 + Math.random() * 2;
              if (Math.random() < Math.max(0.15, 1 - dist / 22)) {
                P.hp = Math.max(0, P.hp - (7 + Math.random() * 11));
                updateHpHUD();
                showDmg();
                shakeAmt = 0.07;
                shakeDur = 0.18;
                if (P.hp <= 0) playerDie();
              }
            }
          }
        });
      };

      const playerDie = () => {
        P.alive = false;
        locked = false;
        document.exitPointerLock();
        setTimeout(() => showOverlay("dead"), 700);
      };

      // ── Radar ───────────────────────────────────
      const rcEl = document.getElementById("g-rc");
      const rc = rcEl?.getContext("2d");
      const drawRadar = () => {
        if (!rc) return;
        rc.clearRect(0, 0, 110, 110);
        rc.save();
        rc.beginPath();
        rc.arc(55, 55, 54, 0, Math.PI * 2);
        rc.clip();
        rc.strokeStyle = "rgba(0,255,65,0.08)";
        rc.lineWidth = 1;
        [20, 35, 50].forEach((r) => {
          rc.beginPath();
          rc.arc(55, 55, r, 0, Math.PI * 2);
          rc.stroke();
        });
        rc.beginPath();
        rc.moveTo(55, 1);
        rc.lineTo(55, 109);
        rc.stroke();
        rc.beginPath();
        rc.moveTo(1, 55);
        rc.lineTo(109, 55);
        rc.stroke();
        rc.fillStyle = "#00ff41";
        rc.beginPath();
        rc.arc(55, 55, 4, 0, Math.PI * 2);
        rc.fill();
        rc.save();
        rc.translate(55, 55);
        rc.rotate(-P.yaw);
        rc.fillStyle = "#00ff41";
        rc.beginPath();
        rc.moveTo(0, -9);
        rc.lineTo(-4, 2);
        rc.lineTo(4, 2);
        rc.closePath();
        rc.fill();
        rc.restore();
        enemies.forEach((e) => {
          if (!e.alive) return;
          const dx = e.g.position.x - cam.position.x,
            dz = e.g.position.z - cam.position.z;
          const cos = Math.cos(P.yaw),
            sin = Math.sin(P.yaw);
          const rx = dx * cos - dz * sin,
            rz = dx * sin + dz * cos;
          rc.fillStyle = "#ff3333";
          rc.beginPath();
          rc.arc(55 + rx * 1.57, 55 + rz * 1.57, 3, 0, Math.PI * 2);
          rc.fill();
        });
        rc.restore();
      };

      const DIRS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
      const updateCompass = () => {
        const el = document.getElementById("g-cdir");
        if (el)
          el.textContent =
            DIRS[Math.round((-P.yaw / (Math.PI * 2)) * 8 + 8) % 8];
      };

      // ── HUD helpers ─────────────────────────────
      const setUI = (id, cls, add) => {
        const el = document.getElementById(id);
        if (el) add ? el.classList.add(cls) : el.classList.remove(cls);
      };
      const setText = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
      };

      const updateAmmoHUD = () => {
        setText("g-ammo", P.ammo);
        setText("g-ammo-res", "/ " + P.reserve);
        const dd = document.getElementById("g-dots");
        if (dd) {
          dd.innerHTML = "";
          for (let i = 0; i < 30; i++) {
            const d = document.createElement("div");
            d.className = "g-dot" + (i < P.ammo ? " live" : "");
            dd.appendChild(d);
          }
        }
      };
      const updateHpHUD = () => {
        setText("g-hp", Math.ceil(P.hp));
        const bar = document.getElementById("g-hpbar");
        if (bar) {
          bar.style.width = P.hp + "%";
          bar.style.background =
            P.hp > 50
              ? "linear-gradient(90deg,#00ff41,#00cc33)"
              : P.hp > 25
                ? "linear-gradient(90deg,#ffcc00,#ff8800)"
                : "linear-gradient(90deg,#ff3333,#cc0000)";
        }
      };
      const updateKillsHUD = () => setText("g-kills", P.kills);
      const muzzleFlash = () => {
        const f = document.getElementById("g-flash");
        if (f) {
          f.classList.remove("pop");
          void f.offsetWidth;
          f.classList.add("pop");
        }
        fl3.material.opacity = 1;
        setTimeout(() => (fl3.material.opacity = 0), 55);
        const c = document.getElementById("g-cross");
        if (c) {
          c.classList.remove("shoot");
          void c.offsetWidth;
          c.classList.add("shoot");
        }
      };
      const showHitmark = () => {
        const h = document.getElementById("g-hit");
        if (h) {
          h.classList.remove("show");
          void h.offsetWidth;
          h.classList.add("show");
        }
      };
      const showDmg = () => {
        const d = document.getElementById("g-dmg");
        if (d) {
          d.style.opacity = "1";
          setTimeout(() => (d.style.opacity = "0"), 280);
        }
      };
      const addKillFeed = () => {
        const f = document.getElementById("g-feed");
        if (!f) return;
        const e = document.createElement("div");
        e.className = "g-kentry";
        e.textContent = "Siz ☠ Dushman";
        f.appendChild(e);
        setTimeout(() => e.remove(), 3000);
        while (f.children.length > 4) f.removeChild(f.firstChild);
      };

      // ── Overlay helpers ─────────────────────────
      const showOverlay = (type) => {
        gameOn = false;
        const ol = document.getElementById("g-overlay");
        if (!ol) return;
        const h1 = ol.querySelector("h1"),
          p = ol.querySelector("p");
        const sr = document.getElementById("g-srow"),
          btn = document.getElementById("g-startbtn");
        if (type === "dead") {
          if (h1) h1.innerHTML = "<span>HALOK BO'LDINGIZ</span>";
          if (p) p.textContent = "Dushmanlar seni mag'lub etdi!";
          if (btn) btn.textContent = "QAYTA O'YNASH";
        } else if (type === "win") {
          if (h1) h1.innerHTML = "<span>G'ALABA!</span>";
          if (p) p.textContent = "Barcha dushmanlar yo'q qilindi!";
          if (btn) btn.textContent = "QAYTA O'YNASH";
        } else {
          if (h1) h1.innerHTML = "CS <span>STRIKE</span>";
          if (p) p.textContent = "3D FPS TAKTIK O'YIN";
          if (sr) sr.style.display = "none";
          if (ol) ol.style.display = "flex";
          return;
        }
        if (sr) {
          sr.style.display = "flex";
          setText("g-fk", P.kills);
          setText("g-ft", Math.floor((Date.now() - P.startT) / 1000) + "s");
        }
        if (ol) ol.style.display = "flex";
      };

      const startGame = () => {
        Object.assign(P, {
          hp: 100,
          ammo: 30,
          reserve: 90,
          kills: 0,
          alive: true,
          yaw: 0,
          pitch: 0,
          reloading: false,
          reloadT: 0,
          shootCd: 0,
          startT: Date.now(),
        });
        cam.position.set(0, 1.75, 0);
        recoilY = 0;
        recoilX = 0;
        bobT = 0;
        shakeAmt = 0;
        shakeDur = 0;
        updateAmmoHUD();
        updateHpHUD();
        updateKillsHUD();
        setUI("g-reload", "show", false);
        const feed = document.getElementById("g-feed");
        if (feed) feed.innerHTML = "";
        const sr = document.getElementById("g-srow");
        if (sr) sr.style.display = "none";
        const ol = document.getElementById("g-overlay");
        if (ol) ol.style.display = "none";
        spawnAll();
        gameOn = true;
        lastT = performance.now();
        canvas.requestPointerLock();
        requestAnimationFrame(loop);
      };

      const btn = document.getElementById("g-startbtn");
      if (btn) btn.addEventListener("click", startGame);

      // ── Game loop ────────────────────────────────
      let gameOn = false,
        lastT = 0;

      const loop = (ts) => {
        if (!gameOn) return;
        const dt = Math.min((ts - lastT) / 1000, 0.05);
        lastT = ts;
        if (P.alive) update(dt);
        renderer.render(scene, cam);
        requestAnimationFrame(loop);
      };

      const update = (dt) => {
        const sprint = keys["ShiftLeft"] || keys["ShiftRight"];
        const spd = sprint ? 8.5 : 5.0;
        const fwd = new THREE.Vector3(-Math.sin(P.yaw), 0, -Math.cos(P.yaw));
        const rgt = new THREE.Vector3(Math.cos(P.yaw), 0, -Math.sin(P.yaw));
        let mx = 0,
          mz = 0;
        if (keys["KeyW"] || keys["ArrowUp"]) {
          mx += fwd.x;
          mz += fwd.z;
        }
        if (keys["KeyS"] || keys["ArrowDown"]) {
          mx -= fwd.x;
          mz -= fwd.z;
        }
        if (keys["KeyA"] || keys["ArrowLeft"]) {
          mx -= rgt.x;
          mz -= rgt.z;
        }
        if (keys["KeyD"] || keys["ArrowRight"]) {
          mx += rgt.x;
          mz += rgt.z;
        }
        const len = Math.sqrt(mx * mx + mz * mz);
        if (len > 0) {
          mx /= len;
          mz /= len;
        }
        if (!blocked(cam.position.x + mx * spd * dt, cam.position.z))
          cam.position.x += mx * spd * dt;
        if (!blocked(cam.position.x, cam.position.z + mz * spd * dt))
          cam.position.z += mz * spd * dt;

        const moving = len > 0;
        if (moving) bobT += dt * (sprint ? 14 : 8);
        wg.position.y +=
          ((moving ? Math.sin(bobT) * (sprint ? 0.014 : 0.007) - 0.02 : -0.02) -
            wg.position.y) *
          0.12;
        wg.position.x +=
          ((moving
            ? Math.cos(bobT * 0.5) * (sprint ? 0.014 : 0.007) * 0.5
            : 0) -
            wg.position.x) *
          0.12;

        cam.rotation.order = "YXZ";
        cam.rotation.y = P.yaw;
        cam.rotation.x = P.pitch + recoilY * 0.4;
        recoilY *= 0.82;
        recoilX *= 0.82;

        if (shakeDur > 0) {
          shakeDur -= dt;
          cam.position.y = 1.75 + (Math.random() - 0.5) * shakeAmt;
        } else cam.position.y += (1.75 - cam.position.y) * 0.25;

        if (keys["Space"]) tryShoot();
        P.shootCd = Math.max(0, P.shootCd - dt);

        if (P.reloading) {
          P.reloadT += dt;
          const fill = document.getElementById("g-rfill");
          if (fill) fill.style.width = (P.reloadT / P.reloadDur) * 100 + "%";
          if (P.reloadT >= P.reloadDur) {
            const take = Math.min(30 - P.ammo, P.reserve);
            P.ammo += take;
            P.reserve -= take;
            P.reloading = false;
            setUI("g-reload", "show", false);
            updateAmmoHUD();
          }
        }

        updateEnemies(dt);
        drawRadar();
        updateCompass();
        if (enemies.every((e) => !e.alive))
          setTimeout(() => showOverlay("win"), 500);
      };

      // Store cleanup
      gameRef.current = {
        cleanup: () => {
          gameOn = false;
          document.removeEventListener("keydown", onKeyDown);
          document.removeEventListener("keyup", onKeyUp);
          document.removeEventListener("mousemove", onMouseMove);
          document.removeEventListener("mousedown", onMouseDown);
          document.removeEventListener("pointerlockchange", onPLC);
          canvas.removeEventListener("click", onCanvasClick);
          window.removeEventListener("resize", handleResize);
          renderer.dispose();
          if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
          document.exitPointerLock?.();
        },
      };

      showOverlay("start");
    } // end startEngine
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;
    initGame(container);
    return () => {
      gameRef.current?.cleanup?.();
    };
  }, [initGame]);

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        background: "#000",
        overflow: "hidden",
        fontFamily: "'Courier New',monospace",
      }}
    >
      {/* Three.js canvas mount */}
      <div ref={mountRef} style={{ position: "absolute", inset: 0 }} />

      {/* ── UI OVERLAY ───────────────────────── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 10,
        }}
      >
        {/* Crosshair */}
        <div
          id="g-cross"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: 24,
            height: 24,
          }}
        >
          <style>{`
            #g-cross::before,#g-cross::after{content:'';position:absolute;background:#00ff41;box-shadow:0 0 5px #00ff41;}
            #g-cross::before{width:2px;height:100%;left:50%;transform:translateX(-50%);}
            #g-cross::after{height:2px;width:100%;top:50%;transform:translateY(-50%);}
            #g-cross.shoot{animation:cShoot 0.1s ease-out;}
            @keyframes cShoot{0%{transform:translate(-50%,-50%) scale(2);}100%{transform:translate(-50%,-50%) scale(1);}}
            .g-kentry{font-size:12px;color:#fff;background:rgba(0,0,0,0.55);border-left:3px solid #ff3333;padding:2px 10px;animation:kfade 3s ease-out forwards;}
            @keyframes kfade{0%,70%{opacity:1}100%{opacity:0}}
            #g-hit.show{animation:hshow 0.35s ease-out forwards;}
            @keyframes hshow{0%{opacity:1;transform:translate(-50%,-50%) scale(1.3);}100%{opacity:0;transform:translate(-50%,-50%) scale(0.8);}}
            #g-flash.pop{animation:fpop 0.08s ease-out forwards;}
            @keyframes fpop{0%{opacity:1}100%{opacity:0}}
            .g-dot{width:4px;height:9px;background:#555;border-radius:1px;display:inline-block;margin:1px;}
            .g-dot.live{background:#ffcc00;}
          `}</style>
          <div
            style={{
              position: "absolute",
              width: 3,
              height: 3,
              background: "#00ff41",
              borderRadius: "50%",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
            }}
          />
        </div>

        {/* Hit marker */}
        <svg
          id="g-hit"
          viewBox="0 0 28 28"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: 28,
            height: 28,
            opacity: 0,
          }}
        >
          <line
            x1="0"
            y1="0"
            x2="9"
            y2="9"
            stroke="#ff8800"
            strokeWidth="2.5"
          />
          <line
            x1="19"
            y1="0"
            x2="28"
            y2="9"
            stroke="#ff8800"
            strokeWidth="2.5"
          />
          <line
            x1="0"
            y1="28"
            x2="9"
            y2="19"
            stroke="#ff8800"
            strokeWidth="2.5"
          />
          <line
            x1="19"
            y1="28"
            x2="28"
            y2="19"
            stroke="#ff8800"
            strokeWidth="2.5"
          />
        </svg>

        {/* Flash */}
        <div
          id="g-flash"
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(255,200,80,0.07)",
            opacity: 0,
            pointerEvents: "none",
          }}
        />
        <div
          id="g-dmg"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at center,transparent 40%,rgba(255,0,0,0.65) 100%)",
            opacity: 0,
            transition: "opacity 0.1s",
            pointerEvents: "none",
          }}
        />

        {/* Compass */}
        <div
          style={{
            position: "absolute",
            top: 14,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(0,0,0,0.65)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 4,
            padding: "4px 16px",
            fontSize: 11,
            color: "#555",
            letterSpacing: 3,
          }}
        >
          N &nbsp; NE &nbsp;{" "}
          <span
            id="g-cdir"
            style={{ color: "#00ff41", fontWeight: 700, fontSize: 13 }}
          >
            E
          </span>{" "}
          &nbsp; SE &nbsp; S
        </div>

        {/* Kill feed + score */}
        <div
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            textAlign: "right",
          }}
        >
          <div
            id="g-feed"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              alignItems: "flex-end",
              marginBottom: 6,
            }}
          />
          <div style={{ fontSize: 11, color: "#555", letterSpacing: 1 }}>
            KILLS:{" "}
            <span
              id="g-kills"
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#ff3333",
                textShadow: "0 0 8px #ff3333",
              }}
            >
              0
            </span>
          </div>
        </div>

        {/* Radar */}
        <div
          style={{
            position: "absolute",
            bottom: 80,
            right: 18,
            width: 110,
            height: 110,
            borderRadius: "50%",
            background: "rgba(0,18,0,0.8)",
            border: "1.5px solid rgba(0,255,65,0.35)",
            boxShadow: "0 0 14px rgba(0,255,65,0.12)",
            overflow: "hidden",
          }}
        >
          <canvas
            id="g-rc"
            width="110"
            height="110"
            style={{ borderRadius: "50%" }}
          />
        </div>

        {/* Reload bar */}
        <div
          id="g-reload"
          style={{
            position: "absolute",
            bottom: 68,
            left: "50%",
            transform: "translateX(-50%)",
            width: 160,
            display: "none",
          }}
        >
          <div
            style={{
              textAlign: "center",
              fontSize: 10,
              color: "#ffcc00",
              letterSpacing: 2,
              marginBottom: 4,
            }}
          >
            RELOADING
          </div>
          <div
            style={{
              height: 4,
              background: "rgba(255,255,255,0.1)",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <div
              id="g-rfill"
              style={{
                height: "100%",
                width: "0%",
                background: "linear-gradient(90deg,#ffcc00,#ff8800)",
                borderRadius: 2,
              }}
            />
          </div>
          <style>{`#g-reload.show{display:block!important;}`}</style>
        </div>

        {/* HUD bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "14px 22px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            background:
              "linear-gradient(0deg,rgba(0,0,0,0.72) 0%,transparent 100%)",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 10,
                color: "#555",
                letterSpacing: 2,
                marginBottom: 3,
              }}
            >
              ❤ HEALTH
            </div>
            <div
              style={{
                width: 160,
                height: 6,
                background: "rgba(255,255,255,0.1)",
                borderRadius: 3,
                overflow: "hidden",
                marginBottom: 4,
              }}
            >
              <div
                id="g-hpbar"
                style={{
                  height: "100%",
                  width: "100%",
                  background: "linear-gradient(90deg,#00ff41,#00cc33)",
                  borderRadius: 3,
                  transition: "width 0.3s,background 0.3s",
                }}
              />
            </div>
            <div
              id="g-hp"
              style={{
                fontSize: 30,
                fontWeight: 700,
                color: "#00ff41",
                textShadow: "0 0 10px #00ff41",
              }}
            >
              100
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: 11,
                color: "#555",
                letterSpacing: 3,
                marginBottom: 2,
              }}
            >
              AK-47
            </div>
            <div>
              <span
                id="g-ammo"
                style={{
                  fontSize: 38,
                  fontWeight: 700,
                  color: "#fff",
                  textShadow: "0 0 8px rgba(255,255,255,0.3)",
                }}
              >
                30
              </span>
              <span
                id="g-ammo-res"
                style={{ fontSize: 18, color: "#555", marginLeft: 4 }}
              >
                / 90
              </span>
            </div>
            <div
              id="g-dots"
              style={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                maxWidth: 120,
                marginTop: 3,
                justifyContent: "flex-end",
              }}
            />
          </div>
        </div>

        {/* Key hints */}
        <div
          style={{
            position: "absolute",
            bottom: 90,
            left: 18,
            fontSize: 10,
            color: "rgba(255,255,255,0.18)",
            lineHeight: 1.9,
            letterSpacing: 1,
          }}
        >
          W/A/S/D — Harakat
          <br />
          MOUSE — Qarash
          <br />
          LMB/SPACE — O'q
          <br />
          R — Reload
          <br />
          SHIFT — Yugurish
        </div>
      </div>

      {/* ── START / DEATH OVERLAY ────────────── */}
      <div
        id="g-overlay"
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.9)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 20,
          pointerEvents: "auto",
        }}
      >
        <style>{`
          #g-overlay h1{font-size:52px;font-weight:900;letter-spacing:6px;color:#fff;text-shadow:0 0 30px rgba(255,50,50,0.5);margin-bottom:6px;font-family:'Courier New',monospace;}
          #g-overlay h1 span{color:#ff3333;}
          #g-overlay p{color:#666;font-size:13px;letter-spacing:2px;margin-bottom:36px;font-family:'Courier New',monospace;}
          #g-startbtn{padding:13px 50px;background:linear-gradient(135deg,#cc0000,#ff3333);color:#fff;border:none;border-radius:3px;font-family:'Courier New',monospace;font-size:15px;font-weight:700;letter-spacing:3px;cursor:pointer;text-transform:uppercase;box-shadow:0 0 28px rgba(255,0,0,0.4);transition:all 0.2s;}
          #g-startbtn:hover{transform:scale(1.05);box-shadow:0 0 40px rgba(255,0,0,0.6);}
        `}</style>
        <h1>
          CS <span>STRIKE</span>
        </h1>
        <p>3D FPS TAKTIK O'YIN</p>
        <div id="g-srow" style={{ display: "none", gap: 40, marginBottom: 28 }}>
          <div style={{ textAlign: "center" }}>
            <div
              id="g-fk"
              style={{
                fontSize: 34,
                fontWeight: 700,
                color: "#ff3333",
                fontFamily: "'Courier New',monospace",
              }}
            >
              0
            </div>
            <div style={{ fontSize: 10, color: "#555", letterSpacing: 2 }}>
              KILLS
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              id="g-ft"
              style={{
                fontSize: 34,
                fontWeight: 700,
                color: "#ff3333",
                fontFamily: "'Courier New',monospace",
              }}
            >
              0s
            </div>
            <div style={{ fontSize: 10, color: "#555", letterSpacing: 2 }}>
              VAQT
            </div>
          </div>
        </div>
        <button id="g-startbtn">O'YINNI BOSHLASH</button>
      </div>
    </div>
  );
}
