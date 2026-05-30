document.addEventListener('DOMContentLoaded', () => {
  let activeTimers = [];
  function trackTimer(timer) {
    if (timer) activeTimers.push(timer);
    return timer;
  }
  function clearActiveTimers() {
    activeTimers.forEach(timer => clearInterval(timer));
    activeTimers = [];
  }

  /* ==========================================================================
     1. Sticky Navigation & Mobile Menu
     ========================================================================== */
  const headerNav = document.querySelector('.header-nav');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinksContainer = document.querySelector('.nav-links');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      headerNav.classList.add('scrolled');
    } else {
      headerNav.classList.remove('scrolled');
    }
  });

  // Mobile Menu Toggle
  menuToggle.addEventListener('click', () => {
    navLinksContainer.classList.toggle('active');
    // Change menu icon between bars and close X
    const icon = menuToggle.querySelector('i');
    if (navLinksContainer.classList.contains('active')) {
      icon.className = 'fa-solid fa-xmark';
    } else {
      icon.className = 'fa-solid fa-bars';
    }
  });

  // Smooth scroll for all anchor links starting with # without changing URL hash
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      // Close mobile menu if it is a nav-link
      if (this.closest('.nav-links')) {
        navLinksContainer.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      }
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });


  /* ==========================================================================
     2. ScrollSpy (Active Navigation Link on Scroll)
     ========================================================================== */
  const sections = document.querySelectorAll('section');
  
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px', // Trigger when section is in the middle of the viewport
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    observer.observe(section);
  });





  /* ==========================================================================
     4. Projects - Video Embed & Custom Simulator Switcher
     ========================================================================== */
  const videoContainers = document.querySelectorAll('.video-container');

  function getYouTubeId(url) {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

  videoContainers.forEach(container => {
    const videoUrl = container.dataset.videoUrl;
    const thumbnailWrapper = container.querySelector('.video-thumbnail-wrapper');
    const iframeWrapper = container.querySelector('.video-iframe-wrapper');

    const ytid = getYouTubeId(videoUrl);

    // If it's a real YouTube link, fetch high quality thumbnail
    if (ytid) {
      const thumbnailImg = thumbnailWrapper.querySelector('.project-video-thumbnail');
      thumbnailImg.src = `https://img.youtube.com/vi/${ytid}/maxresdefault.jpg`;
      // If maxres fails, we fallback to standard mqdefault (handles YouTube thumbnail load failures gracefully)
      thumbnailImg.onerror = () => {
        thumbnailImg.src = `https://img.youtube.com/vi/${ytid}/mqdefault.jpg`;
      };
    }

    thumbnailWrapper.addEventListener('click', () => {
      thumbnailWrapper.style.display = 'none';

      if (ytid) {
        // Embed YouTube video
        iframeWrapper.style.display = 'block';
        iframeWrapper.innerHTML = `<iframe src="https://www.youtube.com/embed/${ytid}?autoplay=1&rel=0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
      }
    });
  });


  /* ==========================================================================
     5. Custom Project Simulators Logic
     ========================================================================== */
  function initializeSimulator(projectId, wrapper) {
    if (projectId === 'blind-stick') {
      wrapper.innerHTML = `
        <div class="simulator-layout">
          <div class="sim-pane-visual">
            <svg viewBox="0 0 300 169" width="100%" height="100%">
              <!-- Obstacle (Wall) -->
              <rect x="250" y="20" width="15" height="129" fill="#e2e8f0" rx="3" />
              <!-- Ultrasonic waves radiating -->
              <path class="blindstick-wave" d="M100 85 A 30 30 0 0 1 100 85" stroke-width="3" />
              <path id="wave1" class="blindstick-wave" d="M110,65 A 30,30 0 0,1 110,105" stroke-width="2" />
              <path id="wave2" class="blindstick-wave" d="M125,50 A 50,50 0 0,1 125,120" stroke-width="3" />
              <path id="wave3" class="blindstick-wave" d="M140,35 A 70,70 0 0,1 140,135" stroke-width="4" />
              <!-- Hand stick base -->
              <g transform="translate(10, 85)">
                <!-- Cane line -->
                <line x1="0" y1="0" x2="80" y2="0" stroke="#cbd5e1" stroke-width="6" stroke-linecap="round"/>
                <!-- Ultrasonic Sensor box -->
                <rect x="65" y="-12" width="22" height="24" fill="#334155" rx="4"/>
                <circle cx="72" cy="-5" r="4" fill="#94a3b8" stroke="#1e293b" stroke-width="1.5"/>
                <circle cx="72" cy="5" r="4" fill="#94a3b8" stroke="#1e293b" stroke-width="1.5"/>
                <!-- Red Alert LED -->
                <circle id="sim-stick-led" cx="50" cy="-6" r="3.5" fill="#475569"/>
                <circle id="sim-stick-led-glow" class="blindstick-alert-glow" cx="50" cy="-6" r="10"/>
              </g>
            </svg>
          </div>
          <div class="sim-pane-control">
            <div class="sim-title-bar">
              <h5><i class="fa-solid fa-microchip"></i> Smart Blind Stick</h5>
              <button class="sim-close-btn" title="Close"><i class="fa-solid fa-circle-xmark"></i></button>
            </div>
            <div class="sim-control-box">
              <span class="sim-control-label">Adjust Distance (Ultrasonic):</span>
              <input type="range" id="blindstick-slider" class="sim-range" min="10" max="200" value="120">
            </div>
            <div class="sim-lcd-screen">
              <div class="sim-lcd-line" id="blindstick-lcd-1">Distance: 120 cm</div>
              <div class="sim-lcd-line" id="blindstick-lcd-2">Status: Safe</div>
            </div>
            <div class="sim-dashboard-readouts">
              <div class="sim-readout">
                <span class="sim-readout-label">Buzzer Alert</span>
                <span class="sim-readout-value" id="blindstick-buzzer-status">OFF</span>
              </div>
              <div class="sim-readout">
                <span class="sim-readout-label">LED Status</span>
                <span class="sim-readout-value" id="blindstick-led-status">OFF</span>
              </div>
            </div>
          </div>
        </div>
      `;

      const slider = wrapper.querySelector('#blindstick-slider');
      const lcd1 = wrapper.querySelector('#blindstick-lcd-1');
      const lcd2 = wrapper.querySelector('#blindstick-lcd-2');
      const buzzerVal = wrapper.querySelector('#blindstick-buzzer-status');
      const ledVal = wrapper.querySelector('#blindstick-led-status');
      const stickLed = wrapper.querySelector('#sim-stick-led');
      const stickLedGlow = wrapper.querySelector('#sim-stick-led-glow');
      const wave1 = wrapper.querySelector('#wave1');
      const wave2 = wrapper.querySelector('#wave2');
      const wave3 = wrapper.querySelector('#wave3');

      // Wave animation interval
      let waveCounter = 0;
      const waveInterval = trackTimer(setInterval(() => {
        waveCounter = (waveCounter + 1) % 4;
        if (waveCounter === 0) {
          wave1.style.opacity = 0; wave2.style.opacity = 0; wave3.style.opacity = 0;
        } else if (waveCounter === 1) {
          wave1.style.opacity = 0.8;
        } else if (waveCounter === 2) {
          wave2.style.opacity = 0.8;
        } else if (waveCounter === 3) {
          wave3.style.opacity = 0.8;
        }
      }, 250));

      const updateStickSim = () => {
        const val = parseInt(slider.value, 10);
        lcd1.textContent = `Distance: ${val} cm`;

        if (val < 20) {
          lcd2.textContent = "Status: DANGER!";
          lcd2.style.color = '#ef4444';
          buzzerVal.textContent = "ON (Rapid Beep)";
          buzzerVal.style.color = '#ef4444';
          ledVal.textContent = "ON (Blinking Red)";
          ledVal.style.color = '#ef4444';
          stickLed.setAttribute('fill', '#ef4444');
          stickLedGlow.classList.add('blindstick-alert-active');
        } else if (val < 60) {
          lcd2.textContent = "Status: Warning!";
          lcd2.style.color = '#f59e0b';
          buzzerVal.textContent = "ON (Slow Beep)";
          buzzerVal.style.color = '#f59e0b';
          ledVal.textContent = "ON (Yellow)";
          ledVal.style.color = '#f59e0b';
          stickLed.setAttribute('fill', '#fbbf24');
          stickLedGlow.classList.remove('blindstick-alert-active');
          stickLedGlow.style.opacity = 0.3;
        } else {
          lcd2.textContent = "Status: Safe";
          lcd2.style.color = '#00e676';
          buzzerVal.textContent = "OFF";
          buzzerVal.style.color = '#e2e8f0';
          ledVal.textContent = "OFF";
          ledVal.style.color = '#e2e8f0';
          stickLed.setAttribute('fill', '#475569');
          stickLedGlow.classList.remove('blindstick-alert-active');
          stickLedGlow.style.opacity = 0;
        }
      };

      slider.addEventListener('input', updateStickSim);
      updateStickSim();

      // Close Button Handler
      wrapper.querySelector('.sim-close-btn').addEventListener('click', () => {
        clearInterval(waveInterval);
        closeSimulator(wrapper);
      });
    }

    else if (projectId === 'parking-system') {
      wrapper.innerHTML = `
        <div class="simulator-layout">
          <div class="sim-pane-visual">
            <svg viewBox="0 0 300 169" width="100%" height="100%">
              <!-- Parking slots outlines -->
              <line x1="20" y1="20" x2="160" y2="20" stroke="#475569" stroke-width="2" />
              <line x1="20" y1="149" x2="160" y2="149" stroke="#475569" stroke-width="2" />
              <line x1="20" y1="20" x2="20" y2="149" stroke="#475569" stroke-width="2" />
              
              <!-- Slot Dividers -->
              <line x1="70" y1="20" x2="70" y2="60" stroke="#475569" stroke-width="2" stroke-dasharray="3 3" />
              <line x1="120" y1="20" x2="120" y2="60" stroke="#475569" stroke-width="2" stroke-dasharray="3 3" />
              
              <!-- Gate post & barrier -->
              <circle cx="215" cy="125" r="5" fill="#e2e8f0" />
              <!-- Servo Arm Gate -->
              <line id="sim-parking-gate" class="parking-gate" x1="215" y1="125" x2="215" y2="50" stroke="#ef4444" stroke-width="4" stroke-linecap="round" />
              
              <!-- IR Sensor Beam -->
              <line id="sim-ir-beam" x1="215" y1="135" x2="300" y2="135" stroke="#00e676" stroke-width="1" stroke-dasharray="4 2" />
              <rect x="205" y="130" width="10" height="10" fill="#334155" />
              
              <!-- Car -->
              <g id="sim-parking-car" class="parking-car" transform="translate(260, 115)">
                <!-- Car Body -->
                <rect x="0" y="5" width="30" height="16" fill="#3b82f6" rx="4" />
                <rect x="20" y="8" width="8" height="10" fill="#93c5fd" />
                <!-- Wheels -->
                <circle cx="6" cy="22" r="3.5" fill="#1e293b" />
                <circle cx="24" cy="22" r="3.5" fill="#1e293b" />
              </g>
            </svg>
          </div>
          <div class="sim-pane-control">
            <div class="sim-title-bar">
              <h5><i class="fa-solid fa-square-parking"></i> Smart Car Parking</h5>
              <button class="sim-close-btn" title="Close"><i class="fa-solid fa-circle-xmark"></i></button>
            </div>
            <div class="sim-control-box" style="display:flex; flex-direction:column; gap:8px;">
              <button class="btn btn-primary" id="btn-drive-in" style="padding:6px 12px; font-size:0.8rem;"><i class="fa-solid fa-car"></i> Drive Car In</button>
              <button class="btn btn-secondary" id="btn-drive-out" style="padding:6px 12px; font-size:0.8rem; display:none;"><i class="fa-solid fa-arrow-left"></i> Drive Car Out</button>
            </div>
            <div class="sim-lcd-screen">
              <div class="sim-lcd-line" id="parking-lcd-1">SPACES AVAIL: 05</div>
              <div class="sim-lcd-line" id="parking-lcd-2">GATE: CLOSED</div>
            </div>
            <div class="sim-dashboard-readouts">
              <div class="sim-readout">
                <span class="sim-readout-label">IR Sensor</span>
                <span class="sim-readout-value" id="parking-ir-status">CLEAR</span>
              </div>
              <div class="sim-readout">
                <span class="sim-readout-label">Servo Gate</span>
                <span class="sim-readout-value" id="parking-gate-status">0° (CLOSED)</span>
              </div>
            </div>
          </div>
        </div>
      `;

      const car = wrapper.querySelector('#sim-parking-car');
      const gate = wrapper.querySelector('#sim-parking-gate');
      const irBeam = wrapper.querySelector('#sim-ir-beam');
      const btnIn = wrapper.querySelector('#btn-drive-in');
      const btnOut = wrapper.querySelector('#btn-drive-out');
      const lcd1 = wrapper.querySelector('#parking-lcd-1');
      const lcd2 = wrapper.querySelector('#parking-lcd-2');
      const irStatus = wrapper.querySelector('#parking-ir-status');
      const gateStatus = wrapper.querySelector('#parking-gate-status');

      let spacesAvailable = 5;

      btnIn.addEventListener('click', () => {
        if (spacesAvailable <= 0) {
          lcd1.textContent = "PARKING FULL!";
          lcd1.style.color = '#ef4444';
          return;
        }
        btnIn.disabled = true;
        
        // Step 1: Car moves towards sensor
        car.style.transform = 'translate(210px, 115px)';
        
        setTimeout(() => {
          // Step 2: Car intercepts IR sensor
          irBeam.setAttribute('stroke', '#ef4444');
          irStatus.textContent = "OBJECT DETECTED";
          irStatus.style.color = '#ef4444';
          lcd2.textContent = "GATE: OPENING...";
          
          setTimeout(() => {
            // Step 3: Servo opens gate (rotates)
            gate.classList.add('open');
            gateStatus.textContent = "90° (OPEN)";
            gateStatus.style.color = '#00e676';
            
            setTimeout(() => {
              // Step 4: Car drives inside
              car.style.transform = 'translate(80px, 25px)';
              
              setTimeout(() => {
                // Step 5: IR beam clears
                irBeam.setAttribute('stroke', '#00e676');
                irStatus.textContent = "CLEAR";
                irStatus.style.color = '#e2e8f0';
                
                setTimeout(() => {
                  // Step 6: Gate Closes
                  gate.classList.remove('open');
                  gateStatus.textContent = "0° (CLOSED)";
                  gateStatus.style.color = '#e2e8f0';
                  lcd2.textContent = "GATE: CLOSED";
                  
                  // Decrement counter
                  spacesAvailable--;
                  lcd1.textContent = `SPACES AVAIL: 0${spacesAvailable}`;
                  lcd1.style.color = '#00e676';
                  
                  btnOut.style.display = 'block';
                  btnIn.disabled = false;
                  
                  if (spacesAvailable === 0) {
                    btnIn.style.display = 'none';
                  }
                }, 800);
              }, 600);
            }, 800);
          }, 600);
        }, 1200);
      });

      btnOut.addEventListener('click', () => {
        if (spacesAvailable >= 5) return;
        btnOut.disabled = true;
        
        // Gate opens to let car exit
        lcd2.textContent = "GATE: OPENING...";
        gate.classList.add('open');
        gateStatus.textContent = "90° (OPEN)";
        gateStatus.style.color = '#00e676';
        
        setTimeout(() => {
          // Car drives out
          car.style.transform = 'translate(280px, 115px)';
          
          setTimeout(() => {
            // Gate Closes
            gate.classList.remove('open');
            gateStatus.textContent = "0° (CLOSED)";
            gateStatus.style.color = '#e2e8f0';
            lcd2.textContent = "GATE: CLOSED";
            
            spacesAvailable++;
            lcd1.textContent = `SPACES AVAIL: 0${spacesAvailable}`;
            lcd1.style.color = '#00e676';
            
            btnIn.style.display = 'block';
            btnOut.disabled = false;
            
            if (spacesAvailable === 5) {
              btnOut.style.display = 'none';
            }
          }, 1200);
        }, 800);
      });

      wrapper.querySelector('.sim-close-btn').addEventListener('click', () => {
        closeSimulator(wrapper);
      });
    }

    else if (projectId === 'home-automation') {
      wrapper.innerHTML = `
        <div class="simulator-layout">
          <div class="sim-pane-visual" style="background:#0a0e1a;">
            <svg viewBox="0 0 300 169" width="100%" height="100%">
              <!-- Bluetooth signal path -->
              <line id="sim-bt-path" class="home-bt-link" x1="60" y1="85" x2="160" y2="85" stroke="#cbd5e1" stroke-width="2" />
              
              <!-- Smartphone controller -->
              <g transform="translate(15, 35)">
                <rect x="0" y="0" width="40" height="90" fill="#1e293b" rx="6" stroke="#475569" stroke-width="2" />
                <rect x="3" y="10" width="34" height="70" fill="#0f172a" rx="2" />
                <!-- Bluetooth Icon on screen -->
                <path d="M17 30 L23 36 L15 42 L15 28 L23 34 L17 40" fill="none" stroke="#64748b" stroke-width="1.5" id="sim-phone-bt-icon" />
                <!-- Button toggle -->
                <rect x="8" y="55" width="24" height="12" fill="#334155" rx="6" id="sim-phone-switch" style="cursor:pointer;"/>
                <circle cx="14" cy="61" r="5" fill="#94a3b8" id="sim-phone-knob" style="cursor:pointer; transition: transform 0.2s;"/>
              </g>
              
              <!-- Arduino Board + Bluetooth Module (HC-05) -->
              <g transform="translate(130, 60)">
                <rect x="0" y="0" width="55" height="40" fill="#006699" rx="3" />
                <rect x="8" y="5" width="12" height="10" fill="#c0c0c0" />
                <rect x="25" y="15" width="25" height="15" fill="#111111" />
                
                <!-- HC-05 Module attached -->
                <g transform="translate(-25, -20)">
                  <rect x="0" y="0" width="16" height="32" fill="#005bbb" rx="1" />
                  <circle cx="8" cy="6" r="2" fill="#ef4444" id="sim-hc05-led" />
                </g>
              </g>
              
              <!-- Relay board -->
              <g transform="translate(200, 65)">
                <rect x="0" y="0" width="22" height="30" fill="#1e293b" rx="2" />
                <!-- Blue relay Cube -->
                <rect x="2" y="5" width="18" height="20" fill="#2563eb" id="sim-relay-box" />
                <rect x="16" y="-3" width="4" height="4" fill="#fbbf24" id="sim-relay-led" style="opacity:0;"/>
              </g>
              
              <!-- Wire connection lines -->
              <path d="M185,80 L200,80" stroke="#f43f5e" stroke-width="1.5" fill="none" />
              <path d="M222,80 L250,80" stroke="#f59e0b" stroke-width="2" fill="none" />
              
              <!-- Light Bulb -->
              <g transform="translate(245, 60)">
                <!-- Base -->
                <rect x="5" y="30" width="14" height="10" fill="#94a3b8" rx="1" />
                <!-- Filament glow -->
                <circle cx="12" cy="15" r="14" class="home-bulb-glow" id="sim-light-glow" />
                <!-- Glass envelope -->
                <circle cx="12" cy="15" r="15" fill="none" stroke="#e2e8f0" stroke-width="1.5" />
                <!-- Filament wires -->
                <line x1="8" y1="24" x2="10" y2="15" stroke="#cbd5e1" />
                <line x1="16" y1="24" x2="14" y2="15" stroke="#cbd5e1" />
                <line x1="10" y1="15" x2="14" y2="15" stroke="#cbd5e1" />
              </g>
            </svg>
          </div>
          <div class="sim-pane-control">
            <div class="sim-title-bar">
              <h5><i class="fa-solid fa-house-signal"></i> Home Automation</h5>
              <button class="sim-close-btn" title="Close"><i class="fa-solid fa-circle-xmark"></i></button>
            </div>
            <div class="sim-control-box">
              <span class="sim-control-label">Virtual Smartphone Control:</span>
              <button class="btn btn-outline" id="btn-toggle-light" style="width:100%; padding:8px; font-size:0.85rem;">Light is OFF</button>
            </div>
            <div class="sim-lcd-screen" style="background:#090d16; border-color:#1e293b; min-height:65px; overflow-y:auto; padding:4px 8px;">
              <div class="sim-lcd-line" id="home-logs-1" style="font-size:0.6rem; color:#64748b;">[System] System initialized. Ready.</div>
              <div class="sim-lcd-line" id="home-logs-2" style="font-size:0.6rem; color:#64748b;">[BT] Standing by...</div>
            </div>
            <div class="sim-dashboard-readouts">
              <div class="sim-readout">
                <span class="sim-readout-label">HC-05 state</span>
                <span class="sim-readout-value" id="home-bt-status" style="color:#ef4444;">DISCONNECTED</span>
              </div>
              <div class="sim-readout">
                <span class="sim-readout-label">Relay state</span>
                <span class="sim-readout-value" id="home-relay-status">OPEN (OFF)</span>
              </div>
            </div>
          </div>
        </div>
      `;

      const btnToggle = wrapper.querySelector('#btn-toggle-light');
      const knob = wrapper.querySelector('#sim-phone-knob');
      const phoneSwitch = wrapper.querySelector('#sim-phone-switch');
      const phoneBtIcon = wrapper.querySelector('#sim-phone-bt-icon');
      const btPath = wrapper.querySelector('#sim-bt-path');
      const hc05Led = wrapper.querySelector('#sim-hc05-led');
      const relayLed = wrapper.querySelector('#sim-relay-led');
      const bulbGlow = wrapper.querySelector('#sim-light-glow');
      const btStatusVal = wrapper.querySelector('#home-bt-status');
      const relayStatusVal = wrapper.querySelector('#home-relay-status');
      const log1 = wrapper.querySelector('#home-logs-1');
      const log2 = wrapper.querySelector('#home-logs-2');

      let isLightOn = false;

      // Pulse HC05 LED (Disconnected state - fast red blinks)
      let hcLedTimer = trackTimer(setInterval(() => {
        const fill = hc05Led.getAttribute('fill');
        hc05Led.setAttribute('fill', fill === '#ef4444' ? 'transparent' : '#ef4444');
      }, 300));

      const triggerAction = () => {
        isLightOn = !isLightOn;

        if (isLightOn) {
          // Turn Light On sequence
          btnToggle.disabled = true;
          btnToggle.textContent = "SENDING ON COMMAND...";
          
          // Animate phone switch
          knob.style.transform = 'translateX(12px)';
          phoneSwitch.setAttribute('fill', '#0066cc');
          phoneBtIcon.setAttribute('stroke', '#38bdf8');

          // Active bluetooth transmission
          btPath.classList.add('active');
          clearInterval(hcLedTimer);
          hc05Led.setAttribute('fill', '#38bdf8'); // Steady blue connected state
          btStatusVal.textContent = "CONNECTED";
          btStatusVal.style.color = '#38bdf8';
          
          log1.textContent = log2.textContent;
          log2.textContent = "[BT] TX: 'LIGHT_ON'";
          log2.style.color = '#38bdf8';

          setTimeout(() => {
            // Relay clicks (led lights up, state changes)
            relayLed.style.opacity = 1;
            relayStatusVal.textContent = "CLOSED (ON)";
            relayStatusVal.style.color = '#00e676';
            
            log1.textContent = log2.textContent;
            log2.textContent = "[Relay] Coil energized -> Switch Closed";
            log2.style.color = '#00e676';

            setTimeout(() => {
              // Light bulb glows
              bulbGlow.classList.add('on');
              btnToggle.textContent = "Light is ON";
              btnToggle.className = "btn btn-primary";
              btnToggle.disabled = false;
              
              log1.textContent = log2.textContent;
              log2.textContent = "[System] Appliance activated successfully.";
              log2.style.color = '#e2e8f0';
            }, 400);

          }, 600);

        } else {
          // Turn Light Off sequence
          btnToggle.disabled = true;
          btnToggle.textContent = "SENDING OFF COMMAND...";
          
          knob.style.transform = 'translateX(0)';
          phoneSwitch.setAttribute('fill', '#334155');
          
          log1.textContent = log2.textContent;
          log2.textContent = "[BT] TX: 'LIGHT_OFF'";
          log2.style.color = '#38bdf8';

          setTimeout(() => {
            relayLed.style.opacity = 0;
            relayStatusVal.textContent = "OPEN (OFF)";
            relayStatusVal.style.color = '#e2e8f0';
            
            log1.textContent = log2.textContent;
            log2.textContent = "[Relay] Coil de-energized -> Switch Open";
            log2.style.color = '#cbd5e1';

            setTimeout(() => {
              bulbGlow.classList.remove('on');
              btnToggle.textContent = "Light is OFF";
              btnToggle.className = "btn btn-outline";
              btnToggle.disabled = false;
              
              // Return Bluetooth to standby flashing red
              btPath.classList.remove('active');
              phoneBtIcon.setAttribute('stroke', '#64748b');
              btStatusVal.textContent = "DISCONNECTED";
              btStatusVal.style.color = '#ef4444';
              
              hcLedTimer = trackTimer(setInterval(() => {
                const fill = hc05Led.getAttribute('fill');
                hc05Led.setAttribute('fill', fill === '#ef4444' ? 'transparent' : '#ef4444');
              }, 300));

              log1.textContent = log2.textContent;
              log2.textContent = "[System] Appliance powered off.";
              log2.style.color = '#e2e8f0';
            }, 400);

          }, 600);
        }
      };

      btnToggle.addEventListener('click', triggerAction);
      
      // Allow clicking on phone switch directly to toggle
      phoneSwitch.addEventListener('click', triggerAction);
      knob.addEventListener('click', triggerAction);

      wrapper.querySelector('.sim-close-btn').addEventListener('click', () => {
        clearInterval(hcLedTimer);
        closeSimulator(wrapper);
      });
    }

    else if (projectId === 'air-monitoring') {
      wrapper.innerHTML = `
        <div class="simulator-layout">
          <div class="sim-pane-visual">
            <svg viewBox="0 0 300 169" width="100%" height="100%">
              <!-- MQ-135 Gas Sensor box -->
              <g transform="translate(60, 60)">
                <!-- Module Board -->
                <rect x="0" y="0" width="36" height="42" fill="#005bbb" rx="2"/>
                <!-- Sensor grill -->
                <circle cx="18" cy="16" r="10" fill="#475569" stroke="#cbd5e1" stroke-width="2" />
                <circle cx="18" cy="16" r="8" fill="#1e293b" stroke="#64748b" stroke-width="1" stroke-dasharray="2 1" />
                <!-- LED power -->
                <circle cx="6" cy="36" r="1.5" fill="#00e676"/>
              </g>
              
              <!-- Gas Cloud Smoke Particles (Invisible initially) -->
              <g id="sim-gas-cloud" class="air-smoke">
                <circle cx="65" cy="55" r="22" fill="#94a3b8" />
                <circle cx="90" cy="50" r="16" fill="#cbd5e1" />
                <circle cx="45" cy="65" r="18" fill="#64748b" />
                <circle cx="70" cy="75" r="24" fill="#94a3b8" />
              </g>
              
              <!-- LED Board indicators -->
              <g transform="translate(150, 60)">
                <!-- Green LED -->
                <circle id="led-green" cx="0" cy="0" r="5" fill="#00e676" stroke="#004d40" stroke-width="1"/>
                <text x="-8" y="16" font-size="6" fill="#cbd5e1">NORM</text>
                <!-- Yellow LED -->
                <circle id="led-yellow" cx="24" cy="0" r="5" fill="#475569" stroke="#111" stroke-width="1"/>
                <text x="16" y="16" font-size="6" fill="#cbd5e1">WARN</text>
                <!-- Red LED -->
                <circle id="led-red" cx="48" cy="0" r="5" fill="#475569" stroke="#111" stroke-width="1"/>
                <text x="42" y="16" font-size="6" fill="#cbd5e1">ALRT</text>
              </g>
              
              <!-- Buzzer module -->
              <g transform="translate(230, 45)">
                <circle cx="18" cy="18" r="14" fill="#111" stroke="#333" stroke-width="1"/>
                <circle cx="18" cy="18" r="4" fill="#222"/>
                <!-- sound waves radiating -->
                <path id="buzzer-wave" d="M35 18 A 15 15 0 0 1 35 18" stroke="#ef4444" stroke-width="2" fill="none" style="opacity:0;"/>
              </g>
            </svg>
          </div>
          <div class="sim-pane-control">
            <div class="sim-title-bar">
              <h5><i class="fa-solid fa-wind"></i> Air Quality Monitor</h5>
              <button class="sim-close-btn" title="Close"><i class="fa-solid fa-circle-xmark"></i></button>
            </div>
            <div class="sim-control-box" style="display:flex; flex-direction:column; gap:8px;">
              <button class="btn btn-primary" id="btn-add-smoke" style="padding:6px 12px; font-size:0.8rem;"><i class="fa-solid fa-spray-can"></i> Inject Gas / Smoke</button>
              <button class="btn btn-secondary" id="btn-clear-air" style="padding:6px 12px; font-size:0.8rem; display:none;"><i class="fa-solid fa-fan"></i> Clear Air (Ventilate)</button>
            </div>
            <div class="sim-lcd-screen">
              <div class="sim-lcd-line" id="air-lcd-1">PPM: 118</div>
              <div class="sim-lcd-line" id="air-lcd-2">AQI: GOOD</div>
            </div>
            <div class="sim-dashboard-readouts">
              <div class="sim-readout">
                <span class="sim-readout-label">Buzzer Alert</span>
                <span class="sim-readout-value" id="air-buzzer-status">OFF</span>
              </div>
              <div class="sim-readout">
                <span class="sim-readout-label">Active LED</span>
                <span class="sim-readout-value" id="air-led-status" style="color:#00e676;">GREEN</span>
              </div>
            </div>
          </div>
        </div>
      `;

      const gasCloud = wrapper.querySelector('#sim-gas-cloud');
      const btnAdd = wrapper.querySelector('#btn-add-smoke');
      const btnClear = wrapper.querySelector('#btn-clear-air');
      const lcd1 = wrapper.querySelector('#air-lcd-1');
      const lcd2 = wrapper.querySelector('#air-lcd-2');
      const buzzerStatus = wrapper.querySelector('#air-buzzer-status');
      const ledStatus = wrapper.querySelector('#air-led-status');
      const buzzerWave = wrapper.querySelector('#buzzer-wave');
      
      const ledGreen = wrapper.querySelector('#led-green');
      const ledYellow = wrapper.querySelector('#led-yellow');
      const ledRed = wrapper.querySelector('#led-red');

      let ppmInterval = null;
      let buzzerInterval = null;

      const triggerSmoke = () => {
        btnAdd.style.display = 'none';
        btnClear.style.display = 'block';
        btnClear.disabled = true;
        
        gasCloud.classList.add('active');
        
        let ppm = 118;
        ppmInterval = trackTimer(setInterval(() => {
          ppm += Math.floor(Math.random() * 80) + 40;
          if (ppm >= 850) {
            ppm = 850 + Math.floor(Math.random() * 30);
            clearInterval(ppmInterval);
            btnClear.disabled = false;
          }
          
          lcd1.textContent = `PPM: ${ppm}`;
          
          if (ppm < 300) {
            lcd2.textContent = "AQI: GOOD";
            lcd2.style.color = '#00e676';
          } else if (ppm < 600) {
            lcd2.textContent = "AQI: WARNING";
            lcd2.style.color = '#f59e0b';
            
            // LED Yellow
            ledGreen.setAttribute('fill', '#475569');
            ledYellow.setAttribute('fill', '#fbbf24');
            ledYellow.setAttribute('stroke', '#f59e0b');
            
            ledStatus.textContent = "YELLOW";
            ledStatus.style.color = '#fbbf24';
          } else {
            lcd2.textContent = "AQI: DANGER!";
            lcd2.style.color = '#ef4444';
            
            // LED Red
            ledYellow.setAttribute('fill', '#475569');
            ledRed.setAttribute('fill', '#ef4444');
            ledRed.setAttribute('stroke', '#b91c1c');
            
            ledStatus.textContent = "RED (ALERT)";
            ledStatus.style.color = '#ef4444';
            
            buzzerStatus.textContent = "ALARM ON";
            buzzerStatus.style.color = '#ef4444';
            
            // Start soundwave pulse
            if (!buzzerInterval) {
              let buzzState = false;
              buzzerInterval = trackTimer(setInterval(() => {
                buzzState = !buzzState;
                buzzerWave.style.opacity = buzzState ? 0.9 : 0;
                buzzerWave.setAttribute('d', buzzState ? 'M35 18 A 12 12 0 0 1 35 30' : 'M35 18 A 6 6 0 0 1 35 24');
              }, 200));
            }
          }
        }, 150));
      };

      const clearSmoke = () => {
        btnClear.style.display = 'none';
        btnAdd.style.display = 'block';
        btnAdd.disabled = true;
        
        gasCloud.classList.remove('active');
        clearInterval(ppmInterval);
        
        // Stop buzzer pulse
        clearInterval(buzzerInterval);
        buzzerInterval = null;
        buzzerWave.style.opacity = 0;
        buzzerStatus.textContent = "OFF";
        buzzerStatus.style.color = '#e2e8f0';

        let ppm = 850;
        ppmInterval = trackTimer(setInterval(() => {
          ppm -= Math.floor(Math.random() * 100) + 50;
          if (ppm <= 118) {
            ppm = 118;
            clearInterval(ppmInterval);
            btnAdd.disabled = false;
          }
          
          lcd1.textContent = `PPM: ${ppm}`;
          
          if (ppm < 300) {
            lcd2.textContent = "AQI: GOOD";
            lcd2.style.color = '#00e676';
            
            // Green LED
            ledYellow.setAttribute('fill', '#475569');
            ledYellow.setAttribute('stroke', '#111');
            ledRed.setAttribute('fill', '#475569');
            ledRed.setAttribute('stroke', '#111');
            
            ledGreen.setAttribute('fill', '#00e676');
            ledGreen.setAttribute('stroke', '#004d40');
            
            ledStatus.textContent = "GREEN";
            ledStatus.style.color = '#00e676';
          } else if (ppm < 600) {
            lcd2.textContent = "AQI: WARNING";
            lcd2.style.color = '#f59e0b';
            
            // LED Yellow
            ledRed.setAttribute('fill', '#475569');
            ledRed.setAttribute('stroke', '#111');
            ledYellow.setAttribute('fill', '#fbbf24');
            
            ledStatus.textContent = "YELLOW";
            ledStatus.style.color = '#fbbf24';
          }
        }, 150));
      };

      btnAdd.addEventListener('click', triggerSmoke);
      btnClear.addEventListener('click', clearSmoke);

      wrapper.querySelector('.sim-close-btn').addEventListener('click', () => {
        clearInterval(ppmInterval);
        clearInterval(buzzerInterval);
        closeSimulator(wrapper);
      });
    }
  }

  function closeSimulator(wrapper) {
    const card = wrapper.closest('.project-card');
    const simWrapper = card.querySelector('.simulator-viewer-wrapper');
    const btn = card.querySelector('.btn-toggle-sim');
    
    simWrapper.classList.remove('expanded');
    btn.innerHTML = `<i class="fa-solid fa-play"></i> Start Simulator`;
    btn.classList.remove('btn-primary');
    btn.classList.add('btn-outline');
    
    setTimeout(() => {
      wrapper.innerHTML = '';
    }, 400);
  }


  /* ==========================================================================
     6. View Code Expander / Collapser
     ========================================================================== */
  const toggleCodeBtns = document.querySelectorAll('.btn-toggle-code');

  toggleCodeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.project-card');
      const codeWrapper = card.querySelector('.code-viewer-wrapper');
      const simWrapper = card.querySelector('.simulator-viewer-wrapper');
      const simBtn = card.querySelector('.btn-toggle-sim');
      const innerWrapper = card.querySelector('.simulator-viewer-wrapper .simulator-wrapper');
      
      const isExpanded = codeWrapper.classList.contains('expanded');

      // If simulator is open, close it
      if (simWrapper && simWrapper.classList.contains('expanded')) {
        simWrapper.classList.remove('expanded');
        if (simBtn) {
          simBtn.innerHTML = `<i class="fa-solid fa-play"></i> Start Simulator`;
          simBtn.classList.remove('btn-primary');
          simBtn.classList.add('btn-outline');
        }
        setTimeout(() => {
          if (innerWrapper) innerWrapper.innerHTML = '';
        }, 400);
      }

      if (isExpanded) {
        codeWrapper.classList.remove('expanded');
        btn.innerHTML = `<i class="fa-solid fa-code"></i> View Code`;
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-outline');
      } else {
        codeWrapper.classList.add('expanded');
        btn.innerHTML = `<i class="fa-solid fa-chevron-up"></i> Hide Code`;
        btn.classList.remove('btn-outline');
        btn.classList.add('btn-primary');
        
        // Scroll slightly to align card nicely
        setTimeout(() => {
          codeWrapper.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 300);
      }
    });
  });


  /* ==========================================================================
     6b. View Simulator Expander / Collapser
     ========================================================================== */
  const toggleSimBtns = document.querySelectorAll('.btn-toggle-sim');

  toggleSimBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.project-card');
      const simWrapper = card.querySelector('.simulator-viewer-wrapper');
      const innerWrapper = simWrapper.querySelector('.simulator-wrapper');
      const codeWrapper = card.querySelector('.code-viewer-wrapper');
      const codeBtn = card.querySelector('.btn-toggle-code');
      const projectId = card.querySelector('.video-container').dataset.projectId;

      const isExpanded = simWrapper.classList.contains('expanded');

      // If code viewer is open, close it
      if (codeWrapper && codeWrapper.classList.contains('expanded')) {
        codeWrapper.classList.remove('expanded');
        if (codeBtn) {
          codeBtn.innerHTML = `<i class="fa-solid fa-code"></i> View Code`;
          codeBtn.classList.remove('btn-primary');
          codeBtn.classList.add('btn-outline');
        }
      }

      if (isExpanded) {
        simWrapper.classList.remove('expanded');
        btn.innerHTML = `<i class="fa-solid fa-play"></i> Start Simulator`;
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-outline');
        setTimeout(() => {
          innerWrapper.innerHTML = '';
        }, 400);
      } else {
        simWrapper.classList.add('expanded');
        btn.innerHTML = `<i class="fa-solid fa-chevron-up"></i> Hide Simulator`;
        btn.classList.remove('btn-outline');
        btn.classList.add('btn-primary');

        // Render and initialize the simulator
        initializeSimulator(projectId, innerWrapper);

        // Scroll slightly to align card nicely
        setTimeout(() => {
          simWrapper.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 300);
      }
    });
  });


  /* ==========================================================================
     9. Art Gallery Lightbox Modal
     ========================================================================== */
  const artCards = document.querySelectorAll('.art-card');
  const lightbox = document.getElementById('art-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  if (artCards && lightbox) {
    artCards.forEach(card => {
      card.addEventListener('click', () => {
        const src = card.dataset.src;
        const title = card.querySelector('.art-title').textContent;
        
        lightboxImg.src = src;
        lightboxCaption.textContent = title;
        lightbox.style.display = 'flex';
        setTimeout(() => {
          lightbox.classList.add('active');
        }, 10);
      });
    });

    const closeBox = () => {
      lightbox.classList.remove('active');
      setTimeout(() => {
        lightbox.style.display = 'none';
        lightboxImg.src = '';
      }, 300);
    };

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeBox);
    }
    
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-img-container')) {
        closeBox();
      }
    });
    
    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.style.display === 'flex') {
        closeBox();
      }
    });
  }

});
