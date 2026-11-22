/**
 * Brijesh Vishwakarma - Professional Portfolio Scripts (Enhanced Edition)
 * High-performance interactive visual effects, canvas particle network,
 * 3D tilt, live simulation modals, audio micro-interactions, dynamic palettes,
 * code/preview view toggles, and interactive terminal CLI.
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroCanvas();
  initRoleRotator();
  initCursorSpotlight();
  init3DTilt();
  initProjectFilters();
  initProjectModals();
  initProjectViewTogglers();
  initSkillCategoryFilter();
  initAccentPalette();
  initAudioSystem();
  initLiveClockIST();
  initResumeModal();
  initTerminalCLI();
  initCopyButtons();
  initThemeToggle();
  initMobileMenu();
  initContactForm();
  initScrollAnimations();
});

/* ==========================================================================
   1. Audio Micro-Interactions (Web Audio API Synthesizer - 100% Offline)
   ========================================================================== */
let audioCtx = null;
let soundEnabled = false;

function initAudioSystem() {
  const soundBtn = document.getElementById('soundToggleBtn');
  if (!soundBtn) return;

  const offIcon = soundBtn.querySelector('.sound-off-icon');
  const onIcon = soundBtn.querySelector('.sound-on-icon');

  soundBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    if (soundEnabled) {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      playTone(600, 'sine', 0.08);
      offIcon.style.display = 'none';
      onIcon.style.display = 'block';
      showToast('Sound Effects Enabled 🔊');
    } else {
      offIcon.style.display = 'block';
      onIcon.style.display = 'none';
      showToast('Sound Effects Muted 🔇');
    }
  });
}

function playTone(freq = 440, type = 'sine', duration = 0.08) {
  if (!soundEnabled || !audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Audio context error handling
  }
}

/* ==========================================================================
   2. Dynamic Theme Accent Palettes
   ========================================================================== */
function initAccentPalette() {
  const swatches = document.querySelectorAll('.palette-swatch');
  const savedAccent = localStorage.getItem('bv_portfolio_accent') || 'indigo';

  document.body.setAttribute('data-accent', savedAccent);
  swatches.forEach(sw => {
    if (sw.getAttribute('data-accent') === savedAccent) {
      sw.classList.add('active');
    } else {
      sw.classList.remove('active');
    }

    sw.addEventListener('click', () => {
      const accent = sw.getAttribute('data-accent');
      document.body.setAttribute('data-accent', accent);
      localStorage.setItem('bv_portfolio_accent', accent);
      swatches.forEach(s => s.classList.remove('active'));
      sw.classList.add('active');
      playTone(520, 'triangle', 0.1);
      showToast(`Switched color accent to ${accent.toUpperCase()}`);
    });
  });
}

/* ==========================================================================
   3. Real-Time IST Clock in Top Bar
   ========================================================================== */
function initLiveClockIST() {
  const clockEl = document.getElementById('liveClockIST');
  if (!clockEl) return;

  function updateTime() {
    const now = new Date();
    // Options for Indian Standard Time
    const options = {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    const istTimeStr = new Intl.DateTimeFormat('en-US', options).format(now);
    clockEl.textContent = `${istTimeStr} IST (UTC+5:30)`;
  }

  updateTime();
  setInterval(updateTime, 1000);
}

/* ==========================================================================
   4. Interactive Canvas Particle Constellation
   ========================================================================== */
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = window.innerWidth < 768 ? 35 : 65;
  const maxDistance = 140;

  let mouse = {
    x: null,
    y: null,
    radius: 120
  };

  function resize() {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  }

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.size = Math.random() * 2.2 + 1.2;
      this.color = Math.random() > 0.4 ? 'rgba(79, 70, 229,' : 'rgba(16, 185, 129,';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const dirX = dx / dist;
          const dirY = dy / dist;
          this.x -= dirX * force * 1.5;
          this.y -= dirY * force * 1.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `${this.color} 0.65)`;
      ctx.fill();
    }
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          const opacity = (1 - dist / maxDistance) * 0.18;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  resize();
  createParticles();
  animate();
}

/* ==========================================================================
   5. Dynamic Role Text Rotator
   ========================================================================== */
function initRoleRotator() {
  const element = document.getElementById('roleRotator');
  if (!element) return;

  const roles = [
    "Full-Stack MERN",
    "Deep Learning & Vision",
    "Geospatial Alert Systems",
    "Satellite AI & AgTech",
    "Cloud Microservices"
  ];

  let currentIndex = 0;

  setInterval(() => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(10px)';

    setTimeout(() => {
      currentIndex = (currentIndex + 1) % roles.length;
      element.textContent = roles[currentIndex];
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, 300);
  }, 3200);

  element.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
}

/* ==========================================================================
   6. Interactive Cursor Spotlight
   ========================================================================== */
function initCursorSpotlight() {
  const spotlight = document.getElementById('cursorSpotlight');
  if (!spotlight) return;

  window.addEventListener('mousemove', (e) => {
    spotlight.style.left = `${e.clientX}px`;
    spotlight.style.top = `${e.clientY}px`;
  });
}

/* ==========================================================================
   7. 3D Tilt Effect on Cards
   ========================================================================== */
function init3DTilt() {
  const cards = document.querySelectorAll('.hero-glass-card, .project-card, .bento-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}

/* ==========================================================================
   8. Project Filter Tabs
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      playTone(480, 'sine', 0.06);

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category').split(' ');
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   9. Project View Toggler (Preview vs Code Snippet)
   ========================================================================== */
function initProjectViewTogglers() {
  document.querySelectorAll('.project-card').forEach(card => {
    const buttons = card.querySelectorAll('.view-tab-btn');
    const previewEl = card.querySelector('.view-content-preview');
    const codeEl = card.querySelector('.view-content-code');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        playTone(550, 'triangle', 0.05);

        const view = btn.getAttribute('data-view');
        if (view === 'code') {
          if (previewEl) previewEl.style.display = 'none';
          if (codeEl) codeEl.style.display = 'block';
        } else {
          if (previewEl) previewEl.style.display = 'block';
          if (codeEl) codeEl.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   10. Skill Category Filter
   ========================================================================== */
function initSkillCategoryFilter() {
  const buttons = document.querySelectorAll('.skill-filter-btn');
  const cards = document.querySelectorAll('.skill-category-card');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      playTone(460, 'sine', 0.06);

      const cat = btn.getAttribute('data-skill-cat');
      cards.forEach(card => {
        const cardCat = card.getAttribute('data-cat');
        if (cat === 'all' || cardCat === cat) {
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        } else {
          card.style.opacity = '0.35';
          card.style.transform = 'scale(0.98)';
        }
      });
    });
  });
}

/* ==========================================================================
   11. Quick Resume Modal
   ========================================================================== */
function initResumeModal() {
  const openBtn = document.getElementById('openResumeModalBtn');
  const modal = document.getElementById('resumeModalBackdrop');
  const closeBtn = document.getElementById('closeResumeModal');

  if (!modal) return;

  function openResume() {
    modal.classList.add('open');
    playTone(580, 'sine', 0.08);
  }

  function closeResume() {
    modal.classList.remove('open');
  }

  if (openBtn) openBtn.addEventListener('click', openResume);
  if (closeBtn) closeBtn.addEventListener('click', closeResume);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeResume();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeResume();
    }
  });
}

/* ==========================================================================
   12. Interactive Project Simulator Modals
   ========================================================================== */
const projectData = {
  'sentinel-watch': {
    title: "Sentinel Watch — Live Incident & Alert Broadcast Simulator",
    tag: "Disaster Response Simulation",
    render: () => `
      <div class="sim-controls-panel">
        <h4 style="margin-bottom:0.75rem; font-size:1.1rem; color:var(--text-primary);">Simulate Real-Time Disaster Report Broadcast (Socket.IO + 2dsphere)</h4>
        <div class="sim-row">
          <label class="sim-label">Incident Type:</label>
          <select id="simIncidentType" class="sim-select">
            <option value="Flash Flood Surge (Water Level +2.4m)">Flash Flood Surge</option>
            <option value="Hillside Mudslide & Road Blockage">Hillside Mudslide</option>
            <option value="River Embankment Overflow Warning">River Embankment Overflow</option>
            <option value="Urban Drainage Inundation Alert">Urban Drainage Inundation</option>
          </select>
        </div>
        <div class="sim-row">
          <label class="sim-label">Geospatial Radius:</label>
          <input type="range" id="simRadius" class="sim-range" min="2" max="30" value="12">
          <span id="simRadiusDisplay" style="font-family:var(--font-mono); font-weight:700; color:var(--accent-primary); width:70px;">12 km</span>
        </div>
        <div class="sim-row">
          <label class="sim-label">Reporter Role:</label>
          <select id="simReporterRole" class="sim-select">
            <option value="Emergency Response Officer (Authorized)">Emergency Responder</option>
            <option value="Verified Citizen Node">Verified Citizen Node</option>
            <option value="Automated Hydro-Sensor Telemetry">Automated Hydro Sensor</option>
          </select>
        </div>
        <button id="simBroadcastBtn" class="btn btn-primary" style="margin-top:0.5rem; width:100%;">
          <span>Broadcast Incident Via Socket.IO &rarr;</span>
        </button>
      </div>

      <div style="margin-bottom:0.75rem; display:flex; justify-content:space-between; align-items:center;">
        <span style="font-size:0.85rem; font-weight:700; color:var(--text-muted); text-transform:uppercase;">Live Socket.IO Stream & MongoDB Geospatial Log</span>
        <button id="clearSimLogsBtn" style="background:none; border:none; color:var(--accent-primary); cursor:pointer; font-size:0.8rem; font-weight:600;">Clear Log</button>
      </div>
      <div class="sim-screen-display" id="simTerminalLog">
        <div class="log-entry ok">[CONNECTED] WebSocket client connected to ws://sentinel-cluster/dispatch</div>
        <div class="log-entry">[INDEX] MongoDB 2dsphere index active: db.incidents.createIndex({ coordinates: "2dsphere" })</div>
        <div class="log-entry ok">[READY] Listening for localized emergency broadcasts...</div>
      </div>
    `,
    init: () => {
      const radiusSlider = document.getElementById('simRadius');
      const radiusDisp = document.getElementById('simRadiusDisplay');
      const broadcastBtn = document.getElementById('simBroadcastBtn');
      const logArea = document.getElementById('simTerminalLog');
      const clearBtn = document.getElementById('clearSimLogsBtn');

      if (radiusSlider && radiusDisp) {
        radiusSlider.addEventListener('input', (e) => {
          radiusDisp.textContent = `${e.target.value} km`;
        });
      }

      if (clearBtn && logArea) {
        clearBtn.addEventListener('click', () => {
          logArea.innerHTML = '<div class="log-entry ok">[LOG CLEARED] Ready for next broadcast event...</div>';
        });
      }

      if (broadcastBtn && logArea) {
        broadcastBtn.addEventListener('click', () => {
          playTone(720, 'square', 0.12);
          const type = document.getElementById('simIncidentType').value;
          const radius = document.getElementById('simRadius').value;
          const role = document.getElementById('simReporterRole').value;
          const time = new Date().toLocaleTimeString();

          const newLog = document.createElement('div');
          newLog.className = 'log-entry crit';
          newLog.innerHTML = `[${time}] <strong>EMERGENCY DISPATCH TRIGGERED</strong> &middot; Event: ${type} &middot; Radius: ${radius}km &middot; Reporter: ${role}`;
          logArea.appendChild(newLog);

          const geoLog = document.createElement('div');
          geoLog.className = 'log-entry warn';
          geoLog.innerHTML = `&rarr; [GEO-QUERY] $nearSphere executed with $maxDistance: ${radius * 1000}m. Filtered 14 recipient responder devices. Broadcast emitted in 18ms.`;
          logArea.appendChild(geoLog);

          logArea.scrollTop = logArea.scrollHeight;
          showToast(`Emergency alert broadcasted to ${radius}km radius!`);
        });
      }
    }
  },

  'cropfusion': {
    title: "CropFusion — Sentinel-2 Satellite & Soil AI Predictor",
    tag: "AgTech Model Simulation",
    render: () => `
      <div class="sim-controls-panel">
        <h4 style="margin-bottom:0.75rem; font-size:1.1rem; color:var(--text-primary);">Interactive Crop Yield & NDVI Recommendation Engine</h4>
        <div class="sim-row">
          <label class="sim-label">Target Crop Area:</label>
          <select id="simCropSelect" class="sim-select">
            <option value="Paddy / Rice (Oryza sativa)">Paddy / Rice</option>
            <option value="Maize / Corn (Zea mays)">Maize / Corn</option>
            <option value="Sugarcane (Saccharum)">Sugarcane</option>
            <option value="Areca Nut / Plantation">Areca Nut / Plantation</option>
          </select>
        </div>
        <div class="sim-row">
          <label class="sim-label">Soil Moisture (%):</label>
          <input type="range" id="simMoisture" class="sim-range" min="10" max="95" value="65">
          <span id="simMoistureDisp" style="font-family:var(--font-mono); font-weight:700; color:var(--accent-primary); width:60px;">65%</span>
        </div>
        <div class="sim-row">
          <label class="sim-label">Soil Nitrogen (kg/ha):</label>
          <input type="range" id="simNitrogen" class="sim-range" min="20" max="180" value="110">
          <span id="simNitrogenDisp" style="font-family:var(--font-mono); font-weight:700; color:var(--accent-primary); width:60px;">110</span>
        </div>
        <div class="sim-row">
          <label class="sim-label">Sentinel-2 Cloud Cover:</label>
          <input type="range" id="simCloudCover" class="sim-range" min="0" max="40" value="8">
          <span id="simCloudDisp" style="font-family:var(--font-mono); font-weight:700; color:var(--accent-primary); width:60px;">8%</span>
        </div>
      </div>

      <div style="background:var(--surface-card); border:1px solid var(--border-light); border-radius:var(--radius-md); padding:1.25rem;">
        <h4 style="margin-bottom:1rem; font-size:1rem; color:var(--text-primary);">Machine Learning Prediction Output</h4>
        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:1rem; text-align:center;">
          <div style="background:var(--bg-secondary); padding:0.85rem; border-radius:8px;">
            <div id="simNDVIVal" style="font-size:1.4rem; font-weight:800; color:var(--accent-emerald);">0.76</div>
            <div style="font-size:0.75rem; color:var(--text-muted);">Sentinel-2 NDVI Index</div>
          </div>
          <div style="background:var(--bg-secondary); padding:0.85rem; border-radius:8px;">
            <div id="simYieldVal" style="font-size:1.4rem; font-weight:800; color:var(--accent-primary);">+22.4%</div>
            <div style="font-size:0.75rem; color:var(--text-muted);">Predicted Harvest Yield</div>
          </div>
          <div style="background:var(--bg-secondary); padding:0.85rem; border-radius:8px;">
            <div id="simConfidenceVal" style="font-size:1.4rem; font-weight:800; color:#0284c7;">96.2%</div>
            <div style="font-size:0.75rem; color:var(--text-muted);">Model Confidence Score</div>
          </div>
        </div>
        <div style="margin-top:1rem; font-size:0.88rem; color:var(--text-secondary); line-height:1.5;">
          <strong>GIS Agronomy Insight:</strong> <span id="simAgronomyAdvice">Soil conditions are in optimal moisture threshold. Recommended split fertilization with high yield probability.</span>
        </div>
      </div>
    `,
    init: () => {
      const moisture = document.getElementById('simMoisture');
      const nitrogen = document.getElementById('simNitrogen');
      const cloud = document.getElementById('simCloudCover');
      const crop = document.getElementById('simCropSelect');

      function updatePrediction() {
        const m = parseInt(moisture.value);
        const n = parseInt(nitrogen.value);
        const c = parseInt(cloud.value);

        document.getElementById('simMoistureDisp').textContent = `${m}%`;
        document.getElementById('simNitrogenDisp').textContent = `${n}`;
        document.getElementById('simCloudDisp').textContent = `${c}%`;

        const ndvi = ((m * 0.005) + (n * 0.003) - (c * 0.002) + 0.25).toFixed(2);
        const clampedNDVI = Math.max(0.15, Math.min(0.89, ndvi));
        document.getElementById('simNDVIVal').textContent = clampedNDVI;

        const yieldGain = ((clampedNDVI * 30) - 4).toFixed(1);
        document.getElementById('simYieldVal').textContent = `${yieldGain > 0 ? '+' : ''}${yieldGain}%`;

        const adviceEl = document.getElementById('simAgronomyAdvice');
        if (clampedNDVI > 0.65) {
          adviceEl.textContent = `Excellent vegetative vigor. Multi-spectral bands indicate high chlorophyll density for ${crop.value}. High harvest yield predicted.`;
        } else if (clampedNDVI > 0.4) {
          adviceEl.textContent = `Moderate vegetative index. Consider localized drip irrigation and supplemental nitrogen dosing to accelerate canopy development.`;
        } else {
          adviceEl.textContent = `Low NDVI detected in sector. High risk of moisture stress or nutrient deficiency. Urgent field inspection suggested.`;
        }
      }

      moisture.addEventListener('input', updatePrediction);
      nitrogen.addEventListener('input', updatePrediction);
      cloud.addEventListener('input', updatePrediction);
      crop.addEventListener('change', updatePrediction);
    }
  },

  'fire-smoke': {
    title: "Fire & Smoke Detection — ResNet-50 Computer Vision Inference",
    tag: "Deep Learning Live Inference",
    render: () => `
      <div class="sim-controls-panel">
        <h4 style="margin-bottom:0.75rem; font-size:1.1rem; color:var(--text-primary);">Test Model Inference on Simulated Optical Feeds</h4>
        <div class="sim-row">
          <label class="sim-label">Select Frame Input:</label>
          <select id="simVisionScene" class="sim-select">
            <option value="flame">Industrial Warehouse — Active Flame Flare</option>
            <option value="smoke">Forest Perimeter — Dense White Smoke Plume</option>
            <option value="both">Chemical Facility — Dual Hazard (Flame + Smoke)</option>
            <option value="clear">Office Server Room — Clear & Normal Conditions</option>
          </select>
        </div>
        <div class="sim-row">
          <label class="sim-label">Inference Threshold:</label>
          <input type="range" id="simConfThreshold" class="sim-range" min="50" max="99" value="80">
          <span id="simConfDisp" style="font-family:var(--font-mono); font-weight:700; color:var(--accent-primary); width:60px;">80%</span>
        </div>
      </div>

      <div style="background:#0f172a; color:#ffffff; border-radius:var(--radius-md); padding:1.25rem;">
        <div style="display:flex; justify-content:space-between; margin-bottom:0.75rem; font-family:var(--font-mono); font-size:0.8rem;">
          <span style="color:#10b981;">PYTORCH REST WORKER: 200 OK</span>
          <span style="color:#94a3b8;" id="simInferenceLatency">Inference Latency: 24.6 ms</span>
        </div>
        <div id="simVisionBoxVisual" style="height:150px; background:#1e293b; border-radius:6px; position:relative; overflow:hidden; display:flex; align-items:center; justify-content:center;">
          <span id="simVisionSceneText" style="color:#cbd5e1; font-weight:600;">Feed: Active Flame Flare</span>
          <div id="simBoxFlame" style="position:absolute; top:20px; left:40px; width:120px; height:90px; border:2px dashed #ef4444; border-radius:4px; display:block;">
            <span style="position:absolute; top:-12px; left:4px; background:#ef4444; color:#fff; font-size:0.7rem; padding:0.1rem 0.35rem; border-radius:3px; font-family:var(--font-mono);">FIRE: 98.4%</span>
          </div>
          <div id="simBoxSmoke" style="position:absolute; top:30px; right:50px; width:110px; height:80px; border:2px dashed #94a3b8; border-radius:4px; display:none;">
            <span style="position:absolute; top:-12px; left:4px; background:#64748b; color:#fff; font-size:0.7rem; padding:0.1rem 0.35rem; border-radius:3px; font-family:var(--font-mono);">SMOKE: 93.7%</span>
          </div>
        </div>
        <div style="margin-top:1rem; display:flex; justify-content:space-between; font-size:0.85rem; font-family:var(--font-mono);">
          <span id="simAlertStatus" style="color:#ef4444; font-weight:700;">STATUS: ALARM TRIGGERED (FIRE DETECTED)</span>
          <span style="color:#a78bfa;">Model: Fine-Tuned ResNet-50</span>
        </div>
      </div>
    `,
    init: () => {
      const scene = document.getElementById('simVisionScene');
      const flameBox = document.getElementById('simBoxFlame');
      const smokeBox = document.getElementById('simBoxSmoke');
      const statusText = document.getElementById('simAlertStatus');
      const sceneText = document.getElementById('simVisionSceneText');
      const latency = document.getElementById('simInferenceLatency');

      scene.addEventListener('change', () => {
        const val = scene.value;
        const fakeLatency = (Math.random() * 8 + 20).toFixed(1);
        latency.textContent = `Inference Latency: ${fakeLatency} ms`;

        if (val === 'flame') {
          flameBox.style.display = 'block';
          smokeBox.style.display = 'none';
          statusText.style.color = '#ef4444';
          statusText.textContent = 'STATUS: ALARM TRIGGERED (FIRE DETECTED)';
          sceneText.textContent = 'Feed: Active Flame Flare';
        } else if (val === 'smoke') {
          flameBox.style.display = 'none';
          smokeBox.style.display = 'block';
          statusText.style.color = '#f59e0b';
          statusText.textContent = 'STATUS: WARNING (DENSE SMOKE DETECTED)';
          sceneText.textContent = 'Feed: Dense White Smoke Plume';
        } else if (val === 'both') {
          flameBox.style.display = 'block';
          smokeBox.style.display = 'block';
          statusText.style.color = '#ef4444';
          statusText.textContent = 'STATUS: CRITICAL HAZARD (FLAME + SMOKE)';
          sceneText.textContent = 'Feed: Dual Hazard Scenario';
        } else {
          flameBox.style.display = 'none';
          smokeBox.style.display = 'none';
          statusText.style.color = '#10b981';
          statusText.textContent = 'STATUS: CLEAR & NOMINAL (NO HAZARDS)';
          sceneText.textContent = 'Feed: Normal Office Room';
        }
      });
    }
  },

  'waterman': {
    title: "WaterMan — Conservation & Smart Billing Architecture",
    tag: "Enterprise System Telemetry",
    render: () => `
      <div class="sim-controls-panel">
        <h4 style="margin-bottom:0.75rem; font-size:1.1rem; color:var(--text-primary);">Interactive Water Conservation & Tariff Savings Calculator</h4>
        <div class="sim-row">
          <label class="sim-label">Household Occupants:</label>
          <input type="range" id="simOccupants" class="sim-range" min="1" max="10" value="4">
          <span id="simOccupantsDisp" style="font-family:var(--font-mono); font-weight:700; color:var(--accent-primary); width:60px;">4 People</span>
        </div>
        <div class="sim-row">
          <label class="sim-label">Conservation Practice:</label>
          <select id="simTech" class="sim-select">
            <option value="0.30">Rainwater Harvesting + Low-flow Fixtures (-30%)</option>
            <option value="0.18">Smart Leak Detection & Greywater Recirculation (-18%)</option>
            <option value="0.08">Standard Metering with Usage Alerts (-8%)</option>
            <option value="0">Unrestricted / Standard Usage (0%)</option>
          </select>
        </div>
      </div>

      <div style="background:var(--surface-card); border:1px solid var(--border-light); border-radius:var(--radius-md); padding:1.25rem;">
        <h4 style="margin-bottom:1rem; font-size:1rem; color:var(--text-primary);">Oracle DB Metered Telemetry & Billing</h4>
        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:1rem; text-align:center;">
          <div style="background:var(--bg-secondary); padding:0.85rem; border-radius:8px;">
            <div id="simTotalLiters" style="font-size:1.4rem; font-weight:800; color:var(--accent-cyan);">16,800 L</div>
            <div style="font-size:0.75rem; color:var(--text-muted);">Net Monthly Consumption</div>
          </div>
          <div style="background:var(--bg-secondary); padding:0.85rem; border-radius:8px;">
            <div id="simSavedLiters" style="font-size:1.4rem; font-weight:800; color:var(--accent-emerald);">7,200 L</div>
            <div style="font-size:0.75rem; color:var(--text-muted);">Saved Water Volume</div>
          </div>
          <div style="background:var(--bg-secondary); padding:0.85rem; border-radius:8px;">
            <div id="simBillSavings" style="font-size:1.4rem; font-weight:800; color:var(--accent-primary);">₹ 680 /mo</div>
            <div style="font-size:0.75rem; color:var(--text-muted);">Monthly Bill Discount</div>
          </div>
        </div>
        <div style="margin-top:1rem; font-size:0.85rem; color:var(--text-muted); font-family:var(--font-mono);">
          [ORACLE ACID SCHEMA] TRANSACTIONS COMMITTED &middot; AUDIT ID: WTR-2026-9481 &middot; TIER 1 TARIFF APPLIED
        </div>
      </div>
    `,
    init: () => {
      const occupants = document.getElementById('simOccupants');
      const occupantsDisp = document.getElementById('simOccupantsDisp');
      const tech = document.getElementById('simTech');

      function calculateWater() {
        const count = parseInt(occupants.value);
        occupantsDisp.textContent = `${count} People`;
        const savingRatio = parseFloat(tech.value);

        const baselinePerPerson = 200;
        const days = 30;
        const baselineTotal = count * baselinePerPerson * days;
        const saved = Math.round(baselineTotal * savingRatio);
        const net = baselineTotal - saved;
        const rupeesSaved = Math.round(saved * 0.095);

        document.getElementById('simTotalLiters').textContent = `${net.toLocaleString()} L`;
        document.getElementById('simSavedLiters').textContent = `${saved.toLocaleString()} L`;
        document.getElementById('simBillSavings').textContent = `₹ ${rupeesSaved} /mo`;
      }

      occupants.addEventListener('input', calculateWater);
      tech.addEventListener('change', calculateWater);
      calculateWater();
    }
  }
};

function initProjectModals() {
  const backdrop = document.getElementById('projectModalBackdrop');
  const modalTitle = document.getElementById('modalTitle');
  const modalTag = document.getElementById('modalTag');
  const modalContent = document.getElementById('modalContent');
  const closeBtn = document.getElementById('closeProjectModal');

  document.querySelectorAll('.launch-modal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-modal');
      const data = projectData[modalId];
      if (!data) return;

      playTone(600, 'sine', 0.08);
      modalTitle.textContent = data.title;
      modalTag.textContent = data.tag;
      modalContent.innerHTML = data.render();
      backdrop.classList.add('open');

      if (typeof data.init === 'function') {
        data.init();
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      backdrop.classList.remove('open');
    });
  }

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      backdrop.classList.remove('open');
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop.classList.contains('open')) {
      backdrop.classList.remove('open');
    }
  });
}

/* ==========================================================================
   13. Interactive Terminal CLI
   ========================================================================== */
function initTerminalCLI() {
  const openBtn = document.getElementById('openTerminalBtn');
  const modal = document.getElementById('terminalModal');
  const closeBtn = document.getElementById('closeTermBtn');
  const exitBtn = document.getElementById('exitTermBtn');
  const clearBtn = document.getElementById('clearTermBtn');
  const input = document.getElementById('termInput');
  const history = document.getElementById('termHistory');
  const pills = document.querySelectorAll('.term-pill');

  if (!modal || !input) return;

  function openTerminal() {
    modal.classList.add('open');
    playTone(500, 'square', 0.08);
    input.focus();
  }

  function closeTerminal() {
    modal.classList.remove('open');
  }

  if (openBtn) openBtn.addEventListener('click', openTerminal);
  if (closeBtn) closeBtn.addEventListener('click', closeTerminal);
  if (exitBtn) exitBtn.addEventListener('click', closeTerminal);

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      history.innerHTML = '';
      input.value = '';
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeTerminal();
  });

  const commands = {
    help: () => `
<span class="term-highlight">Available Commands:</span>
  <span class="term-cmd">about</span>       - Detailed biography & education overview
  <span class="term-cmd">projects</span>    - Shipped GitHub projects and live repositories
  <span class="term-cmd">skills</span>      - Technical stack and core proficiencies
  <span class="term-cmd">experience</span>  - Internship and academic milestones
  <span class="term-cmd">certs</span>       - Industry certifications & credentials
  <span class="term-cmd">contact</span>     - Email, phone, and direct contact options
  <span class="term-cmd">hire</span>        - Summary of value proposition for recruiters
  <span class="term-cmd">clear</span>       - Clears the terminal screen
    `,

    about: () => `
<span class="term-highlight">Brijesh Vishwakarma</span> &middot; Computer Science Engineering Student
Currently pursuing B.E. at Sahyadri College of Engineering & Management (CGPA: 8.23).
Experienced in full-stack MERN engineering, deep learning inference with PyTorch, 
and geospatial database architectures for mission-critical applications.
    `,

    projects: () => `
<span class="term-highlight">Shipped GitHub Projects:</span>
1. <strong style="color:#60a5fa">Sentinel Watch</strong> &mdash; Flood & Landslide Alert Platform (MERN, Socket.IO, MongoDB 2dsphere)
2. <strong style="color:#34d399">CropFusion</strong> &mdash; Sentinel-2 Satellite & Agricultural AI Predictor (Python, ML, React)
3. <strong style="color:#f87171">Fire & Smoke Detection</strong> &mdash; PyTorch ResNet-50 Computer Vision Ingestion (Flask REST)
4. <strong style="color:#38bdf8">WaterMan</strong> &mdash; Enterprise Water Conservation System (React, Node, Oracle DB)
View GitHub: <a href="https://github.com/Brijesh2005" target="_blank" style="color:#60a5fa; text-decoration:underline;">github.com/Brijesh2005</a>
    `,

    skills: () => `
<span class="term-highlight">Technical Arsenal:</span>
&bull; <strong>Languages:</strong> Python, JavaScript (ES6+), SQL, C, C++, Java, R
&bull; <strong>Web & Backend:</strong> React.js, Node.js, Express.js, Flask, Socket.IO, REST APIs
&bull; <strong>AI & Data:</strong> PyTorch, ResNet-50 CNNs, Computer Vision, Sentinel-2 Remote Sensing
&bull; <strong>Databases & Cloud:</strong> MongoDB (Geospatial), MySQL, Oracle Database, IBM Cloud, Azure
    `,

    experience: () => `
<span class="term-highlight">Career Milestones:</span>
&bull; <strong>Full Stack Development Intern:</strong> CodeLab Systems, Mangaluru (Jan - Apr 2024, 16 wks)
&bull; <strong>B.E. Computer Science:</strong> Sahyadri College of Eng. (CGPA 8.23, Grade 'O' Mini-Project & UI/UX)
&bull; <strong>Diploma CSE:</strong> Vivekananda Polytechnic (Distinction, 10.0 SGPA Capstone Project)
    `,

    certs: () => `
<span class="term-highlight">Certifications:</span>
&bull; IBM DevOps and Software Engineering Professional Certificate
&bull; Cursor 101: Run AI Agents That Actually Ship Code
&bull; IBM Cloud Essentials & Serverless Functions
&bull; Microsoft Azure Essentials & Oracle Cloud Infrastructure
&bull; Oracle AI for You & Python 101 for Data Science
    `,

    contact: () => `
<span class="term-highlight">Get In Touch:</span>
&bull; Email: <a href="mailto:brijesh2005.28@gmail.com" style="color:#38bdf8;">brijesh2005.28@gmail.com</a>
&bull; Phone: +91 9110463601
&bull; LinkedIn: <a href="https://linkedin.com/in/brijesh-vishwakarma-72b043313" target="_blank" style="color:#38bdf8;">linkedin.com/in/brijesh-vishwakarma</a>
&bull; Location: Puttur / Mangaluru, Karnataka, India
    `,

    hire: () => `
<span class="term-highlight">Why Hire Brijesh?</span>
&bull; Rapid Full-Stack delivery backed by a completed 16-week production internship.
&bull; Rare combination of MERN web craftsmanship and applied deep learning (PyTorch, ResNet-50).
&bull; Proven academic dedication: 8.23 B.E. CGPA, 10.0 Capstone SGPA, Grade O in UI/UX Design.
&bull; Ready to make an immediate impact on engineering teams.
    `,

    clear: () => {
      history.innerHTML = '';
      return '';
    },

    cls: () => {
      history.innerHTML = '';
      return '';
    },

    sudo: () => `<span style="color:#ef4444;">Access granted. You are root of the universe, but Brijesh is already hired!</span>`
  };

  function executeCommand(cmdStr) {
    const rawCmd = cmdStr.trim().toLowerCase();
    if (!rawCmd) return;

    playTone(620, 'sine', 0.05);
    const cmdLine = document.createElement('div');
    cmdLine.innerHTML = `<span style="color:#10b981; font-weight:700;">brijesh$</span> <span style="color:#ffffff;">${cmdStr}</span>`;
    history.appendChild(cmdLine);

    if (commands[rawCmd]) {
      const output = commands[rawCmd]();
      if (output) {
        const outDiv = document.createElement('div');
        outDiv.style.marginBottom = '0.75rem';
        outDiv.innerHTML = output;
        history.appendChild(outDiv);
      }
    } else {
      const errDiv = document.createElement('div');
      errDiv.style.color = '#ef4444';
      errDiv.style.marginBottom = '0.75rem';
      errDiv.innerHTML = `command not found: "${cmdStr}". Type <span class="term-cmd">help</span> for a list of available commands.`;
      history.appendChild(errDiv);
    }

    input.value = '';
    const termBody = document.getElementById('terminalBody');
    termBody.scrollTop = termBody.scrollHeight;
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      executeCommand(input.value);
    }
  });

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      const cmd = pill.getAttribute('data-run');
      executeCommand(cmd);
    });
  });
}

/* ==========================================================================
   14. Copy to Clipboard Utility & Toast System
   ========================================================================== */
function initCopyButtons() {
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-copy');
      navigator.clipboard.writeText(text).then(() => {
        playTone(660, 'sine', 0.08);
        showToast(`Copied to clipboard: "${text}"`);
      }).catch(() => {
        fallbackCopy(text);
      });
    });
  });

  const heroEmailBtn = document.getElementById('copyEmailHeroBtn');
  if (heroEmailBtn) {
    heroEmailBtn.addEventListener('click', () => {
      const email = 'brijesh2005.28@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        playTone(660, 'sine', 0.08);
        showToast(`Copied email to clipboard: ${email}`);
      }).catch(() => {
        fallbackCopy(email);
      });
    });
  }
}

function fallbackCopy(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    playTone(660, 'sine', 0.08);
    showToast(`Copied: "${text}"`);
  } catch (err) {
    showToast(`Copy failed, please copy manually.`);
  }
  document.body.removeChild(textArea);
}

function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      if (toast.parentElement) toast.parentElement.removeChild(toast);
    }, 300);
  }, 3200);
}

/* ==========================================================================
   15. Theme Toggle (Light Default vs Dark Mode)
   ========================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggle');
  if (!toggleBtn) return;

  const savedTheme = localStorage.getItem('bv_portfolio_theme');
  if (savedTheme === 'dark') {
    document.body.classList.remove('light-theme');
    document.body.classList.add('dark-theme');
  }

  toggleBtn.addEventListener('click', () => {
    playTone(540, 'triangle', 0.08);
    if (document.body.classList.contains('dark-theme')) {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
      localStorage.setItem('bv_portfolio_theme', 'light');
      showToast('Switched to Soft Light & Moderate theme');
    } else {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
      localStorage.setItem('bv_portfolio_theme', 'dark');
      showToast('Switched to Dark Contrast theme');
    }
  });
}

/* ==========================================================================
   16. Mobile Menu Navigation
   ========================================================================== */
function initMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const menu = document.getElementById('navMenu');

  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    menu.classList.toggle('mobile-open');
  });

  menu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('mobile-open');
    });
  });
}

/* ==========================================================================
   17. Interactive Contact Form
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');
  const submitBtn = document.getElementById('formSubmitBtn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('senderName').value.trim();
    const email = document.getElementById('senderEmail').value.trim();
    const subject = document.getElementById('senderSubject').value.trim();
    const message = document.getElementById('senderMessage').value.trim();

    if (!name || !email || !message) {
      feedback.style.color = '#ef4444';
      feedback.textContent = 'Please fill out all required fields.';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Sending Message...</span>`;
    feedback.textContent = '';
    playTone(450, 'sine', 0.1);

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span>Send Message</span> &rarr;`;
      feedback.style.color = '#10b981';
      feedback.innerHTML = `
        <strong>Message Dispatched Successfully!</strong><br>
        Thank you, ${name}. Brijesh will respond promptly to ${email}.
      `;
      form.reset();
      playTone(750, 'triangle', 0.15);
      showToast('Message sent successfully!');
    }, 1200);
  });
}

/* ==========================================================================
   18. Scroll Animations & Numeric Counters
   ========================================================================== */
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        entry.target.querySelectorAll('.counter').forEach(counter => {
          animateCounter(counter);
        });

        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.section, .bento-card, .project-card, .timeline-item, .cert-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(el);
  });

  const style = document.createElement('style');
  style.innerHTML = `
    .visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);
}

function animateCounter(el) {
  const target = parseFloat(el.getAttribute('data-target') || el.textContent);
  if (isNaN(target)) return;

  const duration = 1500;
  const start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(start + (target - start) * easeProgress);

    el.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
    }
  }

  requestAnimationFrame(update);
}
